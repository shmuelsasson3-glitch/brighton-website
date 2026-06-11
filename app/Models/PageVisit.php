<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageVisit extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'visited_at' => 'date',
        ];
    }

    public static function record(string $path, ?string $referrer): void
    {
        static::create([
            'path' => $path,
            'referrer' => $referrer,
            'visited_at' => today(),
        ]);
    }
}
