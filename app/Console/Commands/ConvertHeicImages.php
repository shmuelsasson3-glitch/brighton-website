<?php

namespace App\Console\Commands;

use App\Models\Project;
use App\Models\ProjectImage;
use App\Support\HeicConverter;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ConvertHeicImages extends Command
{
    protected $signature = 'images:convert-heic {--dry-run : Preview changes without writing}';

    protected $description = 'Convert existing HEIC/HEIF project images to JPEG and update database paths';

    public function handle(): int
    {
        if (! HeicConverter::isAvailable()) {
            $this->error('No HEIC conversion tool found. Install libheif-tools: sudo dnf install -y libheif-tools');
            return self::FAILURE;
        }

        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->line('<fg=yellow>Dry run — no files will be written or records updated.</>');
        }

        $converted = 0;
        $skipped   = 0;
        $failed    = 0;

        $this->line('Scanning cover images...');
        foreach (Project::all() as $project) {
            $result = $this->convertPath($project->cover_image, $dryRun);

            if ($result === null) { $skipped++; continue; }
            if ($result === false) { $failed++; $this->warn("  FAIL  {$project->cover_image}"); continue; }

            if (! $dryRun) {
                $project->update(['cover_image' => $result]);
            }

            $this->line("  OK    {$project->cover_image} → {$result}");
            $converted++;
        }

        $this->line('Scanning gallery images...');
        foreach (ProjectImage::all() as $image) {
            $result = $this->convertPath($image->path, $dryRun);

            if ($result === null) { $skipped++; continue; }
            if ($result === false) { $failed++; $this->warn("  FAIL  {$image->path}"); continue; }

            if (! $dryRun) {
                $image->update(['path' => $result]);
            }

            $this->line("  OK    {$image->path} → {$result}");
            $converted++;
        }

        $this->newLine();
        $this->table(
            ['Converted', 'Skipped', 'Failed'],
            [[$converted, $skipped, $failed]],
        );

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function convertPath(string $path, bool $dryRun): string|false|null
    {
        if (! in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), ['heic', 'heif'])) {
            return null;
        }

        if (! Storage::disk('site')->exists($path)) {
            $this->warn("  MISSING  {$path}");
            return false;
        }

        $newPath = pathinfo($path, PATHINFO_DIRNAME) . '/' . pathinfo($path, PATHINFO_FILENAME) . '.jpg';

        if (! $dryRun) {
            $result = HeicConverter::storeConvertedFile(
                public_path($path),
                'site',
                pathinfo($path, PATHINFO_DIRNAME),
                pathinfo($path, PATHINFO_FILENAME),
            );

            if ($result === false) {
                $this->error("  ERROR  {$path}: conversion failed");
                return false;
            }

            Storage::disk('site')->delete($path);
        }

        return $newPath;
    }
}
