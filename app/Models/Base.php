<?php

namespace App\Models;

use App\Helpers\Functions;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use stdClass;

/**
 * @property int $id
 * @property stdClass display
 * @property \Carbon\Carbon|string|null $created_at
 * @property \Carbon\Carbon|string|null $updated_at
 * @method static where(Closure|string|array|Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static updateOrCreate(array $attributes, array $values = [])
 * @method static Builder|QueriesRelationships whereHasMorph(string $relation, string|array $types, Closure $callback = null, string $operator = '>=', int $count = 1)
 * @method static limit(int $value)
 * @method static create(array $attributes = [])
 * @method \Illuminate\Database\Eloquent\Relations\MorphMany stats()
 * @method Model|Collection|Builder[]|Builder|null find(mixed $id, array|string $columns = ['*'])  find(array|bool|string|null $id)
 * @method static Model|Collection|Builder[]|Builder|null find(mixed $id, array|string $columns = ['*'])  find(array|bool|string|null $id)
 */
class Base extends Model
{

    /**
     * @var string
     */
    public static string $controller = Controller::class;

    /**
     * @return \stdClass
     */
    public function getDisplayAttribute(): stdClass
    {
        return new stdClass();
    }

    /**
     * @return mixed
     */
    public static function controller(): mixed
    {
        return new static::$controller();
    }

    /**
     * @return string
     */
    public function getItemHashAttribute(): string
    {
        return Functions::encryptItemToHash($this);
    }

    /**
     * @return \stdClass
     */
    public function getLinksAttribute(): stdClass
    {
        $links = new stdClass();
        $links->item = null;
        $links->relative = null;

        return $links;
    }

}
