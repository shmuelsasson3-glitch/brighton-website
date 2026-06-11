<?php

namespace App\Filament\Widgets;

use App\Models\PageVisit;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class VisitsChart extends ChartWidget
{
    protected static ?string $heading = 'Visits — last 30 days';

    protected int|string|array $columnSpan = 'full';

    protected function getData(): array
    {
        $days = collect(range(29, 0))
            ->map(fn (int $daysAgo): Carbon => today()->subDays($daysAgo));

        $counts = PageVisit::whereDate('visited_at', '>=', $days->first())
            ->selectRaw('DATE(visited_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        return [
            'datasets' => [
                [
                    'label' => 'Page views',
                    'data' => $days->map(fn (Carbon $day): int => (int) $counts->get($day->toDateString(), 0))->all(),
                    'fill' => 'start',
                ],
            ],
            'labels' => $days->map(fn (Carbon $day): string => $day->format('M j'))->all(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
