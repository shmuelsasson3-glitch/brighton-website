@props(['project'])

<a class="proj-card" data-cat="{{ $project->category }}" href="{{ route('work.show', $project) }}" style="text-decoration:none;display:block;">
  <div class="proj-img">
    <img src="{{ $project->coverUrl() }}" alt="{{ $project->title }}" class="img-natural">
  </div>
  <div class="proj-body"><h4>{{ $project->title }}</h4><span>{{ $project->tag }}</span></div>
</a>
