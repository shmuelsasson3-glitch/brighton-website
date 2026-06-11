<?php

namespace App\Filament\Widgets;

use App\Models\ContactSubmission;
use App\Models\PageVisit;
use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Published projects', Project::published()->count())
                ->icon('heroicon-o-rectangle-stack'),
            Stat::make('New submissions', ContactSubmission::where('status', 'new')->count())
                ->icon('heroicon-o-envelope')
                ->color('warning'),
            Stat::make('Visits today', PageVisit::whereDate('visited_at', today())->count())
                ->icon('heroicon-o-chart-bar'),
            Stat::make('Visits this month', PageVisit::whereBetween('visited_at', [now()->startOfMonth(), now()])->count())
                ->icon('heroicon-o-calendar'),
        ];
    }
}
