<?php

namespace App\Models;

use App\Http\Controllers\PhotoController;
use hisorange\BrowserDetect\Exceptions\Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Constraint;
use Intervention\Image\Facades\Image;
use Intervention\Image\ImageManager;
use JetBrains\PhpStorm\NoReturn;
use stdClass;

/**
 * @property int $id
 * @property string $filename
 * @property int $is_primary
 * @property int $is_cover
 * @property string $item_type
 * @property bool $published
 */
class Photo extends Base
{

    use HasFactory;

    /**
     * @var string
     */
    public static string $controller = PhotoController::class;

    /**
     *
     */
    const LISTING_ITEM_STORAGE_DISK = 'listings';

    /**
     *
     */
    public const TYPES = [
        null               => 'orphans',
        Shop::class        => 'shops',
        ListingItem::class => 'l',
    ];

    /**
     *
     */
    public const STORAGE_FILESYSTEM = [
        null               => 'orphans',
        Shop::class        => 'shops',
        ListingItem::class => 'listings',
        UserPhoto::class   => 'users',
    ];

    /**
     * [filename] => [width, height]
     */
    const SIZES = [
        'wide_hi'   => [1500, 850, 100],
        'wide_md'   => [500, 300, 90],
        'tall_sm'   => [122, 200, 100],
        'square_sm' => [127, null, 60],
        'square_md' => [250, null, 80],
    ];

    /**
     * @var string[]
     */
    protected $fillable = ['filename', 'item_type', 'item_id', 'order', 'is_primary', 'is_cover'];

    /**
     * @var string[]
     */
    protected $appends = ['path'];

    /*
     * # todo remove when dummy data is unneeded
     * # todo clean
     */
    /**
     * @param  array  $IDS
     *
     * @return void
     */
    #[NoReturn] public function StoreImageFromRemote(array $IDS = []): void
    {
        $photoID = array_rand($IDS, 1);

        $name = $photoID.'.png';

        if (Storage::drive('listings')->copy('picsum/'.$name, $name)) {
            // dump('Stored image: ' . $name);
            $this->filename = $name;
            $this->save();
        } else {
            $this->delete();
        }
    }

    /**
     * @return bool|void
     */
    public function setPrimary()
    {
        if (!$this->id) {
            return;
        }

        Photo::where([
            'item_id'   => $this->item_id,
            'item_type' => $this->item_type,
        ])
            ->update(['is_primary' => null]);

        $this->is_primary = true;

        return $this->save();
    }

    /**
     * @return bool|void
     */
    public function publish()
    {
        if (!$this->id) {
            return;
        }

        $this->published = true;

        return $this->save();
    }

    /**
     * @return bool|void
     */
    public function unpublish()
    {
        if (!$this->id) {
            return;
        }

        $this->published = false;

        return $this->save();
    }

    /**
     * @return MorphTo
     */
    public function item(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return stdClass
     */
    public function getPathAttribute(): stdClass
    {
        return $this->getOrGenerateThumbs();
    }

    /**
     * @return \Intervention\Image\Image
     */
    private function intervention(): \Intervention\Image\Image
    {
        return ImageManager::gd()->read(
            Storage::drive('photos')
                ->get(self::TYPES[$this->item_type].DIRECTORY_SEPARATOR.$this->filename)
        );
    }

    /**
     * @return \stdClass
     * @throws \hisorange\BrowserDetect\Exceptions\Exception
     */
    public function getOrGenerateThumbs(): stdClass
    {
        $thumbsObject = new stdClass();

        // Check if path by type exists
        if (!array_key_exists($this->item_type, self::TYPES)) {
            throw new Exception('Type not found Exception');
        }

        $pathByType = self::TYPES[$this->item_type];
        $photosStorage = Storage::disk('photos')
            ->path($pathByType.DIRECTORY_SEPARATOR);

        // Full image path
        $thumbsObject->full = secure_asset('assets/photos/'.$pathByType.'/'.$this->filename);
        $pathInfo = pathinfo($photosStorage.DIRECTORY_SEPARATOR.$this->filename);
        if (!file_exists($photosStorage.DIRECTORY_SEPARATOR.$this->filename)) {
            return $thumbsObject;
        }
        $filename = $pathInfo['filename'];
        $extension = 'webp';//$pathInfo['extension'];
        $dirname = $pathInfo['dirname'];

        foreach (self::SIZES as $_key => $_size) {
            [$width, $height, $quality] = $_size;

            $sizeFilename = $filename.'_'.$_key.'.'.$extension;
            $sizeFullPathFilename = $dirname.DIRECTORY_SEPARATOR.$sizeFilename;

            // Check if resized photo already exists
            if (!file_exists($sizeFullPathFilename)) {
                // 1G For memory limit is too much
                try {
                    ini_set('memory_limit', '1G');
                    $this->intervention()
                        ->cover($width, $height ?? $width)
                        ->toWebp($quality)
                        ->save($sizeFullPathFilename);
                } catch (\Exception $notReadableException) {
                    Log::warning('Photo file not readable #'.__LINE__);
                }
            }

            $thumbsObject->$_key = secure_asset('assets/photos/'.$pathByType.'/'.$sizeFilename);
        }

        return $thumbsObject;
    }

}
