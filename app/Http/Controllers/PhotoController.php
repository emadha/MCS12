<?php

namespace App\Http\Controllers;

use App\Http\Resources\PhotoResource;
use App\Models\Photo;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Exceptions\DecoderException;
use Intervention\Image\Facades\Image;
use Intervention\Image\ImageManager;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Symfony\Component\HttpFoundation\Response as ResponseSymphony;

/**
 *
 */
class PhotoController extends Controller
{

    /**
     * @param Request $request
     *
     * @return Application|ResponseFactory|\Illuminate\Foundation\Application|Response
     */
    public function upload(Request $request): \Illuminate\Foundation\Application|Response|Application|ResponseFactory
    {
        $validator = Validator::make($request->all(), [
            'p' => 'required|file|max:102400|min:1|mimes:jpeg,jpg,bmp,png,webp',
        ], [
            'p.max' => 'File is too large, max is 100MB',
        ]);

        if ($validator->fails()) {
            return response($validator->getMessageBag(), ResponseSymphony::HTTP_BAD_REQUEST);
        }

        $filename = $request->file('p')->getClientOriginalName();
        $extension = 'webp';//$request->file('p')->guessClientExtension()

        $filename = md5($filename . rand()) . '.' . $extension;

        try {
            $interventionImage = ImageManager::gd()->read($request->file('p'));
            $encoded = $interventionImage->toWebp(90);
            $encoded->save(Storage::disk('orphans')->path($filename));
            /** @var Photo $fileStored */
            $fileStored = Photo::create(['filename' => $filename]);
            $photoObject = $fileStored->getOrGenerateThumbs();

            if ($fileStored) {
                return response([
                    'status' => 1,
                    'message' => 'Photo has been uploaded',
                    'photo' => encrypt($fileStored->id),
                    'photo_object' => $photoObject,
                ], ResponseSymphony::HTTP_OK);
            } else {
                return response([
                    'status' => -1,
                    'message' => 'Error uploading photo',
                ], ResponseSymphony::HTTP_BAD_REQUEST);
            }
        } catch (Exception|DecoderException $exception) {
            return response([
                'status' => -1,
                'message' => 'Error #' . __LINE__,
                'error' => $exception->getMessage()
            ], ResponseSymphony::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @param Request $request
     * @param Photo $photo
     *
     * @return Application|ResponseFactory|\Illuminate\Foundation\Application|Response
     */
    public function action_delete(
        Request $request,
        Photo   $photo
    ): \Illuminate\Foundation\Application|Response|Application|ResponseFactory
    {
        if ($photo->item_type === 'App\Models\ListingItem' && $photo->item->photos()->count() <= 3) {
            return response([
                'status' => -1,
                'message' => 'You cannot delete this photo, an item must have at least 3 photos.',
            ], ResponseAlias::HTTP_BAD_REQUEST);
        }

        if (!$request->user()->can('delete', $photo)) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($photo->delete()) {
            return response([
                'status' => 1,
                'message' => __('frontend.Item Deleted'),
            ]);
        } else {
            return response([
                'status' => 0,
                'message' => __('frontend.Failed'),
            ]);
        }
    }

    /**
     * @param Request $request
     * @param Photo $photo
     *
     * @return Application|ResponseFactory|\Illuminate\Foundation\Application|Response
     */
    public function action_make_primary(Request $request, Photo $photo)
    {
        if (!$request->user()->can('makePrimary', $photo)) {
            return \response(['status' => -1, 'message' => 'Not authorized'],
                ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($photo->setPrimary()) {
            return response([
                'status' => 1,
                'message' => __('frontend.This is the primary photo now'),
            ]);
        }

        return response([
            'status' => 0,
            'message' => __('frontend.Failed'),
        ]);
    }

    /**
     * @param Request $request
     * @param Photo $photo
     *
     * @return Application|ResponseFactory|\Illuminate\Foundation\Application|Response
     */
    public function action_publish(Request $request, Photo $photo): \Illuminate\Foundation\Application|Response|Application|ResponseFactory
    {
        if (!$request->user()->can('publish', $photo)) {
            return \response(['status' => -1, 'message' => 'Not authorized'],
                ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($photo->published) {
            return response([
                'status' => -1,
                'message' => __('frontend.Item already published'),
                'updatedItem' => new PhotoResource($photo),
            ], ResponseAlias::HTTP_OK);
        }

        if ($photo->publish()) {
            return response([
                'status' => 1,
                'message' => __('frontend.Item published'),
                'updatedItem' => new PhotoResource($photo),
            ]);
        }

        return response([
            'status' => 0,
            'message' => __('frontend.Failed'),
        ]);
    }

    /**
     * @param Request $request
     * @param Photo $photo
     *
     * @return Application|ResponseFactory|\Illuminate\Foundation\Application|Response
     */
    public function action_unpublish(Request $request, Photo $photo): \Illuminate\Foundation\Application|Response|Application|ResponseFactory
    {
        if (!$request->user()->can('publish', $photo)) {
            return \response(['status' => -1, 'message' => 'Not authorized'],
                ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if (!$photo->published) {
            return response([
                'status' => -1,
                'message' => __('frontend.Item already Unpublished'),
                'updatedItem' => new PhotoResource($photo),
            ], ResponseAlias::HTTP_OK);
        }

        if ($photo->unpublish()) {
            return response([
                'status' => 1,
                'message' => __('frontend.Item Unpublished'),
                'updatedItem' => new PhotoResource($photo),
            ]);
        }

        return response([
            'status' => 0,
            'message' => __('frontend.Failed'),
        ]);
    }

    /**
     * @param Request $request
     * @param Photo $photo
     *
     * @return Collection
     */
    public function contextMenu(Request $request, Photo $photo)
    {
        $data = collect([]);

        if ($request->user()?->can('makePrimary', $photo) && !$photo->is_primary) {
            $data->add(['title' => __('frontend.Make Primary'), 'action_id' => 'make_primary']);
        }

        if ($request->user()?->can('publish') && !$photo->published) {
            $data->add(['title' => __('frontend.Publish'), 'action_id' => 'publish']);
        } elseif ($request->user()?->can('publish') && $photo->published) {
            $data->add(['title' => __('frontend.Unpublish'), 'action_id' => 'unpublish']);
        }

        if ($request->user()?->can('delete', $photo)) {
            $data->add(['title' => __('frontend.Delete'), 'action_id' => 'delete']);
        }

        $data->add(['title' => 'Report', 'action_id' => 'report']);

        return $data;
    }

}
