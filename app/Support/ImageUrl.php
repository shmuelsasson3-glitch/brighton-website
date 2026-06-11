<?php

namespace App\Support;

class ImageUrl
{
    public static function resolve(string $path): string
    {
        return asset($path);
    }
}
