<?php

namespace App\Console\Commands\Photos;

use App\Models\Photo;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class ClearOrphans extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:photos:clear-orphans {--with-files}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove orphan photos from database/storage.';

    /**
     * Execute the console command.
     */
    public function handle() {
        // Remove orphans models if they're create date is before x time
        $orphanPhotos = Photo::whereNull(['item_id', 'item_type'])
            ->where('created_at', '<', Carbon::now()->subHours(5));

        $orphanPhotosCount = $orphanPhotos->count();
        if ($orphanPhotosCount) {
            $this->info("Found $orphanPhotosCount orphan photo model(s).");

            $orphanPhotos->delete();
        }
        else {
            $this->info('No orphan photos models found.');
        }

    }

}
