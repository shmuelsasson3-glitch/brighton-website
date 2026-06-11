<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\View\View;

class ProjectController extends Controller
{
    public function index(): View
    {
        return view('work.index', [
            'projects' => Project::published()->orderBy('sort_order')->get(),
        ]);
    }

    public function show(Project $project): View
    {
        abort_unless($project->is_published, 404);

        return view('work.show', [
            'project' => $project->load(['images', 'stats']),
        ]);
    }
}
