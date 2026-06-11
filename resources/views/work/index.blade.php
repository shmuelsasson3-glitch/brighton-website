@extends('layouts.site')

@section('title', 'Our Work | Brighton Lawn & Landscape')

@section('content')
<section class="page-hero">
  <div class="ph-bg"></div>
  <div class="ph-ov"></div>
  <div class="ph-inner">
    <div class="wrap">
      <span class="ph-kicker">Our Work</span>
      <h1>Projects We're <em>Proud Of</em></h1>
      <p>A growing portfolio of completed residential and commercial projects across NJ &amp; PA.</p>
    </div>
  </div>
</section>

<section class="work-wrap">
  <div class="wrap">
    <div class="work-filters">
      <button class="wfilter active" data-filter="residential">Residential</button>
      <button class="wfilter" data-filter="commercial">Commercial</button>
      <button class="wfilter" data-filter="all">All</button>
    </div>

    <div class="proj-grid casc" id="workGrid">
      @foreach ($projects as $project)
        <x-project-card :project="$project" />
      @endforeach
    </div>

  </div>
</section>

<x-cta-band heading="Have a Project in <em>Mind?</em>" copy="Tell us about your property and we'll handle the rest, from design to installation." />
@endsection
