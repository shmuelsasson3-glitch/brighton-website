<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class HeicConverter
{
    public static function isAvailable(): bool
    {
        return static::hasHeifConvert() || static::hasImagickWithHeic();
    }

    public static function convertToJpeg(string $sourcePath, string $destPath): bool
    {
        if (static::hasHeifConvert()) {
            return static::convertWithHeifConvert($sourcePath, $destPath);
        }

        if (static::hasImagickWithHeic()) {
            return static::convertWithImagick($sourcePath, $destPath);
        }

        return false;
    }

    public static function storeConvertedFile(string $sourcePath, string $disk, string $directory, string $basename): string|false
    {
        $dest = tempnam(sys_get_temp_dir(), 'heic_') . '.jpg';

        if (! static::convertToJpeg($sourcePath, $dest)) {
            @unlink($dest);
            return false;
        }

        $path = $directory . '/' . $basename . '.jpg';
        Storage::disk($disk)->put($path, file_get_contents($dest));
        @unlink($dest);

        return $path;
    }

    private static function hasHeifConvert(): bool
    {
        return ! empty(static::heifConvertBinary());
    }

    private static function heifConvertBinary(): string
    {
        return trim((string) shell_exec('which heif-convert 2>/dev/null'));
    }

    private static function hasImagickWithHeic(): bool
    {
        if (! extension_loaded('imagick')) {
            return false;
        }

        try {
            return ! empty(\Imagick::queryFormats('HEIC'));
        } catch (\Exception) {
            return false;
        }
    }

    private static function convertWithHeifConvert(string $sourcePath, string $destPath): bool
    {
        $cmd = escapeshellarg(static::heifConvertBinary())
            . ' ' . escapeshellarg($sourcePath)
            . ' ' . escapeshellarg($destPath);

        exec($cmd, $output, $code);

        return $code === 0 && file_exists($destPath);
    }

    private static function convertWithImagick(string $sourcePath, string $destPath): bool
    {
        try {
            $imagick = new \Imagick($sourcePath);
            $imagick->setImageFormat('jpeg');
            $imagick->setImageCompressionQuality(85);
            file_put_contents($destPath, $imagick->getImageBlob());
            $imagick->clear();

            return true;
        } catch (\Exception) {
            return false;
        }
    }
}
