<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Review\ReviewSimpleResource;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Get reviews for a reviewable model.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $request->validate([
            'reviewable_type' => 'required|string',
            'reviewable_id' => 'required|integer',
        ]);

        $reviewableType = $request->reviewable_type;
        $reviewableId = $request->reviewable_id;

        // Ensure the model class exists and is a valid reviewable model
        if (!class_exists($reviewableType) || !method_exists($reviewableType, 'reviews')) {
            return response()->json(['error' => 'Invalid reviewable type'], 400);
        }

        // Get the reviewable model
        $reviewable = $reviewableType::findOrFail($reviewableId);

        // Get public reviews, or also include the authenticated user's reviews if they're not public
        $reviews = $reviewable->reviews()
            ->with('user:id,name')
            ->where(function ($query) {
                $query->where('is_public', true);

                if (Auth::check()) {
                    $query->orWhere('user_id', Auth::id());
                }
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate average rating


        return response()->json(new ReviewSimpleResource($reviews));
    }
}
