@extends('layouts.site')

@section('title', $project->title.' - Brighton Lawn & Landscape')

@section('content')
<section class="proj-hero">
  <img class="proj-hero-img" src="{{ $project->coverUrl() }}" alt="{{ $project->title }}" style="object-position: {{ $project->coverImagePosition() }}">
  <div class="proj-hero-ov"></div>
  <div class="proj-hero-inner">
    <div class="wrap">
      <a href="{{ route('work.index') }}" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Our Work
      </a>
      <div class="proj-tag">{{ $project->tag }}</div>
      <h1>{{ $project->title }}</h1>
    </div>
  </div>
</section>

@if ($project->hasOverview())
<section class="proj-overview">
  <div class="wrap">
    <div class="proj-overview-grid">
      <div>
        <span class="kicker kicker--light">{{ $project->overview_kicker ?? 'About the Project' }}</span>
        <h2>{!! $project->overview_heading !!}</h2>
        <p>{{ $project->overview_body }}</p>
      </div>
      @if ($project->stats->isNotEmpty())
      <div class="proj-stats-row">
        @foreach ($project->stats as $stat)
        <div class="proj-stat-box">
          <div class="proj-stat-num">{{ $stat->value }}</div>
          <div class="proj-stat-label">{{ $stat->label }}</div>
        </div>
        @endforeach
      </div>
      @endif
    </div>
  </div>
</section>
@endif

<section class="proj-gallery">
  <div class="wrap">
    <div class="sec-head casc" style="max-width:600px; margin-bottom:44px;">
      <span class="kicker">Project Gallery</span>
      <h2>The <em>Work</em></h2>
    </div>
    <div class="gallery-cols casc">
      @foreach ($project->images as $image)
      <div class="gallery-item">
        <img src="{{ $image->url() }}" alt="{{ $image->alt ?? $project->title }}">
        <div class="gallery-item-overlay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></div>
      </div>
      @endforeach
    </div>
  </div>
</section>

<x-cta-band heading="Want a Result Like <em>This?</em>" copy="Tell us about your property and we'll build a plan around it." />

<x-lightbox />
@endsection
