<?php

namespace App\Filament\Widgets;

use App\Models\PageVisit;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class VisitsChart extends ChartWidget
{
    protected static ?string $heading = 'Site visits';

    protected static ?int $sort = 2;

    protected static ?string $pollingInterval = '60s';

    protected static ?string $maxHeight = '320px';

    protected int|string|array $columnSpan = 'full';

    public ?string $filter = '30';

    protected function getFilters(): ?array
    {
        return [
            '7' => 'Last 7 days',
            '30' => 'Last 30 days',
            '90' => 'Last 90 days',
        ];
    }

    protected function getData(): array
    {
        $period = (int) ($this->filter ?? 30);

        $days = collect(range($period - 1, 0))
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
                    'borderColor' => '#52A03C',
                    'backgroundColor' => 'rgba(82, 160, 60, 0.12)',
                    'pointBackgroundColor' => '#52A03C',
                    'pointBorderColor' => '#fff',
                    'pointRadius' => 0,
                    'pointHoverRadius' => 5,
                    'borderWidth' => 2.5,
                    'tension' => 0.4,
                ],
            ],
            'labels' => $days->map(fn (Carbon $day): string => $day->format('M j'))->all(),
        ];
    }

    protected function getOptions(): array
    {
        return [
            'animation' => [
                'duration' => 800,
                'easing' => 'easeOutQuart',
            ],
            'interaction' => [
                'mode' => 'index',
                'intersect' => false,
            ],
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
                'tooltip' => [
                    'backgroundColor' => 'rgba(17, 24, 39, 0.9)',
                    'padding' => 12,
                    'cornerRadius' => 8,
                    'displayColors' => false,
                ],
            ],
            'scales' => [
                'x' => [
                    'grid' => [
                        'display' => false,
                    ],
                    'ticks' => [
                        'maxTicksLimit' => 8,
                        'maxRotation' => 0,
                    ],
                ],
                'y' => [
                    'beginAtZero' => true,
                    'grid' => [
                        'color' => 'rgba(128, 128, 128, 0.08)',
                    ],
                    'ticks' => [
                        'precision' => 0,
                        'maxTicksLimit' => 6,
                    ],
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
