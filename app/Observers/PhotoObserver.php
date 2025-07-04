<?php

namespace App\Observers;

use App\Models\Photo;
use Illuminate\Support\Facades\Storage;

/**
 *
 */
class PhotoObserver
{

    /**
     * @param  \App\Models\Photo  $photo
     *
     * @return true
     */
    public function deleting(Photo $photo): true
    {
        // Delete photo if in temp
        Storage::drive('temp')->delete('orphans/'.$photo->filename);

        // Delete photo if in listings
        if (array_key_exists($photo->item_type, Photo::STORAGE_FILESYSTEM)) {
            Storage::drive(Photo::STORAGE_FILESYSTEM[$photo->item_type])->delete($photo->filename);
        }

        return true;
    }

}
