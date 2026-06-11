@extends('layouts.site')

@section('title', 'Residential | Brighton Lawn & Landscape')

@section('content')
<section class="page-hero">
  <div class="ph-bg"></div>
  <video class="ph-video" autoplay muted loop playsinline>
    <source src="{{ asset('assets/videos/residential-hero.mp4') }}" type="video/mp4">
  </video>
  <div class="ph-ov"></div>
  <div class="ph-inner">
    <div class="wrap">
      <span class="ph-kicker">Residential</span>
      <h1>From Vision to <em>Finished Backyard</em></h1>
      <p>Complete residential landscape construction, designed, built, and maintained entirely in-house by the Brighton team.</p>
    </div>
  </div>
</section>

<section class="proc-page">
  <div class="wrap">
    <div class="sec-head center casc sec-head--tight">
      <span class="kicker">Our Residential Process</span>
      <h2>Design. Build. <em>Maintain.</em></h2>
      <p>One team, one standard: guiding your project from the first walkthrough to long-term care.</p>
    </div>

    <div id="design" class="prow casc">
      <div class="pimg">
        <img src="{{ asset('assets/images/res-design.jpg') }}" alt="Design">
      </div>
      <div class="ptext">
        <span class="pstep">Step 01: Design</span>
        <h2>We Start at Your Property</h2>
        <p>It begins with a visit. We come out to your property, walk the space with you, and learn how you want to live in it. From there our team develops a custom design: layout, materials, plantings, and lighting, tailored to your home, your goals, and your budget. Every detail is planned before a shovel hits the ground.</p>
      </div>
    </div>

    <div id="build" class="prow rev casc">
      <div class="pimg">
        <img src="{{ asset('assets/images/res-build.jpg') }}" alt="Build">
      </div>
      <div class="ptext">
        <span class="pstep">Step 02 - Build</span>
        <h2>Built In-House by Our Experts</h2>
        <p>Our in-house crews bring the design to life. No subcontractors, no handoffs - the same team that plans your project builds it. From excavation and hardscaping to planting, turf, and lighting, every element is installed with precision and built to last using proven techniques and high-quality materials.</p>
      </div>
    </div>

    <div id="maintain" class="prow casc">
      <div class="pimg">
        <img src="{{ asset('assets/images/res-maintain.jpg') }}" alt="Maintain">
      </div>
      <div class="ptext">
        <span class="pstep">Step 03 - Maintain</span>
        <h2>We Maintain What We Install</h2>
        <p>We don't disappear after the build. We maintain what we install in your landscape - protecting your investment with ongoing, attentive care that keeps everything looking its best, season after season. One team that knows your property inside and out.</p>
      </div>
    </div>
  </div>
</section>

<div class="cta-band">
  <div class="wrap">
    <h2>See What We <em>Build</em></h2>
    <p>Browse a portfolio of completed residential transformations across NJ &amp; PA.</p>
    <a href="{{ route('work.index') }}" class="btn btn-primary">View Our Work</a>
  </div>
</div>
@endsection
