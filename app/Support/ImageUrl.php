<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUrl
{
    public static function resolve(string $path): string
    {
        if (Str::startsWith($path, ['projects/', 'assets/'])) {
            return asset($path);
        }

        return Storage::url($path);
    }
}
