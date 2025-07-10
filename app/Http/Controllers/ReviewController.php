<?php

namespace App\Http\Controllers;

use App\Exceptions\ItemHashException;
use App\Helpers\Functions;
use App\Http\Resources\Reviews\SimpleReviewsResource;
use App\Models\Review;
use App\Rules\ItemHashValidation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{

    /**
     * @throws ValidationException
     * @throws ItemHashException
     */
    public function index(Request $request)
    {
        $this->validate($request, [
            'h' => new ItemHashValidation(),
        ]);
        $Item = Functions::decryptItemHash($request->get('h'));

        return [
            'reviews' => SimpleReviewsResource::collection($Item->reviews),
            'average_rating' => $Item->average_rating,
        ];
    }

    /**
     * Store a newly created review in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     * @throws ItemHashException
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'h' => [new ItemHashValidation()],
            'rating' => 'required|numeric|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string|max:1000',
        ]);


        $item = Functions::decryptItemHash($request->get('h'));

        // Check if the user has already reviewed this item
        $existingReview = Review::where([
            'user_id' => Auth::id(),
            'reviewable_type' => get_class($item),
            'reviewable_id' => $item->id,
        ])->first();

        if ($existingReview) {
            return back()->withErrors(['error' => 'You have already reviewed this item']);
        }

        // Create the review
        $review = new Review([
            'user_id' => Auth::id(),
            'reviewable_type' => get_class($item),
            'reviewable_id' => $item->id,
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? null,
            'content' => $validated['content'] ?? null,
            'is_public' => true,
        ]);

        $item->reviews()->save($review);

        return back()->with('success', 'Your review has been submitted successfully.');
    }

    /**
     * Update the specified review in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Review $review
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Review $review)
    {
        // Check if the authenticated user owns this review
        if ($review->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string|max:1000',
        ]);

        $review->update([
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? $review->title,
            'content' => $validated['content'] ?? $review->content,
        ]);

        return back()->with('success', 'Your review has been updated successfully.');
    }

    /**
     * Remove the specified review from storage.
     *
     * @param \App\Models\Review $review
     * @return \Illuminate\Http\Response
     */
    public function destroy(Review $review)
    {
        // Check if the authenticated user owns this review or is an admin
        if ($review->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized action.');
        }

        $review->delete();

        return back()->with('success', 'Review has been deleted successfully.');
    }
}
