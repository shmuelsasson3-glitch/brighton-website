<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\View\View;

class PageController extends Controller
{
    public function commercial(): View
    {
        return view('pages.commercial', [
            'commercialProjects' => Project::published()
                ->where('category', 'commercial')
                ->orderBy('sort_order')
                ->get(),
        ]);
    }
}
