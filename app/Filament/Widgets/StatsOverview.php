<?php

namespace App\Filament\Widgets;

use App\Models\ContactSubmission;
use App\Models\PageVisit;
use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected static ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        $visitsToday = PageVisit::whereDate('visited_at', today())->count();
        $visitsYesterday = PageVisit::whereDate('visited_at', today()->subDay())->count();

        $visitsThisMonth = PageVisit::whereBetween('visited_at', [now()->startOfMonth(), now()])->count();
        $visitsLastMonth = PageVisit::whereBetween('visited_at', [
            now()->subMonthNoOverflow()->startOfMonth(),
            now()->subMonthNoOverflow(),
        ])->count();

        $newSubmissions = ContactSubmission::where('status', 'new')->count();
        $submissionsThisWeek = ContactSubmission::where('created_at', '>=', now()->subDays(7))->count();

        return [
            Stat::make('Published projects', Project::published()->count())
                ->description(Project::count().' total in portfolio')
                ->descriptionIcon('heroicon-m-rectangle-stack')
                ->icon('heroicon-o-rectangle-stack')
                ->color('success'),

            Stat::make('New submissions', $newSubmissions)
                ->description($submissionsThisWeek.' received this week')
                ->descriptionIcon('heroicon-m-inbox-arrow-down')
                ->icon('heroicon-o-envelope')
                ->color($newSubmissions > 0 ? 'warning' : 'gray')
                ->chart($this->dailySparkline(
                    fn (Carbon $day): int => ContactSubmission::whereDate('created_at', $day)->count()
                )),

            Stat::make('Visits today', $visitsToday)
                ->description($this->trendLabel($visitsToday, $visitsYesterday, 'vs yesterday'))
                ->descriptionIcon($this->trendIcon($visitsToday, $visitsYesterday))
                ->icon('heroicon-o-chart-bar')
                ->color($this->trendColor($visitsToday, $visitsYesterday))
                ->chart($this->dailySparkline(
                    fn (Carbon $day): int => PageVisit::whereDate('visited_at', $day)->count()
                )),

            Stat::make('Visits this month', $visitsThisMonth)
                ->description($this->trendLabel($visitsThisMonth, $visitsLastMonth, 'vs this time last month'))
                ->descriptionIcon($this->trendIcon($visitsThisMonth, $visitsLastMonth))
                ->icon('heroicon-o-calendar')
                ->color($this->trendColor($visitsThisMonth, $visitsLastMonth)),
        ];
    }

    /** @return array<int> */
    protected function dailySparkline(callable $countForDay): array
    {
        return collect(range(6, 0))
            ->map(fn (int $daysAgo): int => $countForDay(today()->subDays($daysAgo)))
            ->all();
    }

    protected function trendLabel(int $current, int $previous, string $suffix): string
    {
        if ($previous === 0) {
            return $current > 0 ? "Up from 0 {$suffix}" : "No change {$suffix}";
        }

        $percent = round(($current - $previous) / $previous * 100);

        if ($percent === 0.0) {
            return "Steady {$suffix}";
        }

        return ($percent > 0 ? '+' : '').$percent."% {$suffix}";
    }

    protected function trendIcon(int $current, int $previous): string
    {
        return match (true) {
            $current > $previous => 'heroicon-m-arrow-trending-up',
            $current < $previous => 'heroicon-m-arrow-trending-down',
            default => 'heroicon-m-minus',
        };
    }

    protected function trendColor(int $current, int $previous): string
    {
        return match (true) {
            $current > $previous => 'success',
            $current < $previous => 'danger',
            default => 'gray',
        };
    }
}
