<?php

namespace App\Models;

use App\Traits\HasPermalink;
use App\Traits\HasRoutes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;
use stdClass;


/**
 * @property int $interior_color
 * @property int $exterior_color
 * @property int $interior_material
 * @property HasOne $car
 * @property stdClass $display
 * @property MorphOne $listingItem
 */
class ListingItemsCar extends Base
{

    use HasFactory,
        HasRoutes,
        HasPermalink;

    /**
     * @var string[]
     */
    protected $fillable
        = [
            'car_id',
            'year',
            'interior_color',
            'interior_material',
            'exterior_color',
            'odometer',
            'make',
            'model',
            'trim',
            'vin',
        ];

    /**
     * @var string[]
     */
    protected $hidden = ['updated_at', 'created_at'];

    /**
     *
     */
    const EXTERIOR_COLORS
        = [
            0  => 'Unspecified',
            1  => 'White',
            2  => 'Black',
            3  => 'Gray',
            4  => 'Silver',
            5  => 'Blue',
            6  => 'Red',
            7  => 'Brown',
            8  => 'Green',
            9  => 'Beige',
            10 => 'Purple',
            11 => 'Gold',
            12 => 'Yellow',
            13 => 'Pink',
        ];

    /**
     *
     */
    const INTERIOR_COLORS
        = [
            0  => 'Unspecified',
            1  => 'White',
            2  => 'Black',
            3  => 'Gray',
            4  => 'Silver',
            5  => 'Blue',
            6  => 'Red',
            7  => 'Brown',
            8  => 'Green',
            9  => 'Beige',
            10 => 'Purple',
            11 => 'Gold',
            12 => 'Yellow',
            13 => 'Pink',
        ];

    /**
     *
     */
    const INTERIOR_MATERIAL
        = [
            0 => 'Unspecified',
            1 => 'Ultrasuede/Alcantra',
            2 => 'Leather',
            3 => 'Leatherette/Vinyl',
            4 => 'Polyester/Microsuede',
            5 => 'Nylon',
        ];

    /**
     * @param  string  $label
     * @param $value
     *
     * @return array
     */
    private function buildDisplayAttribute(string $label, $value): array
    {
        return ["label" => $label, "value" => $value];
    }

    /**
     * @return \stdClass
     */
    public function getLinksAttribute(): stdClass
    {
        $links = parent::getLinksAttribute();

        if ($this->listingItem) {
            $links->relative = $this->listingItem->id.'-'.Str::slug($this->display->title);
            $links->item = route('listing.cars.single', [
                Str::slug(ListingItem::CONDITIONS[$this->listingItem->condition]),
                $links->relative,
            ]);
        }

        return $links;
    }

    /**
     * @return stdClass
     */
    public function getDisplayAttribute(): stdClass
    {
        $display = new stdClass();

        $display->title = implode(' ', [
            $this->year,
            $this->car?->make,
            $this->car?->model,
            $this->car?->series,
            $this->car?->trim,
        ]);
        return $display;
    }

    /**
     * @return \stdClass
     */
    public function getSpecificationsAttribute(): stdClass
    {
        $display = new stdClass();
        $display->odometer = $this->buildDisplayAttribute(
            'Odometer', number_format($this->odometer ?? 0)
        );

        $display->exterior_color = $this->buildDisplayAttribute(
            "Exterior Color", self::EXTERIOR_COLORS[$this->exterior_color ?? 0]
        );

        $display->interior_color = $this->buildDisplayAttribute(
            "Interior Color",
            self::INTERIOR_COLORS[$this->interior_color ?? 0],
        );

        $display->interior_material = $this->buildDisplayAttribute(
            "Interior Material",
            self::INTERIOR_MATERIAL[$this->interior_material ?? 0]
        );

        $display->year = $this->buildDisplayAttribute('Year', $this->year);

        $display->vin = $this->buildDisplayAttribute('VIN', Str::upper($this->vin));
        return $display;
    }

    /**
     * @return HasOne
     */
    public function car(): HasOne
    {
        return $this->hasOne(Car::class, 'id_trim', 'car_id');
    }

    /**
     * @return BelongsTo
     */
    public function listingItem()
    {
        return $this->morphOne(ListingItem::class, 'item')->withTrashed();
    }

}
