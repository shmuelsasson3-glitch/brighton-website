@extends('layouts.site')

@section('title', 'Commercial - Brighton Lawn & Landscape')

@section('content')
<section class="page-hero">
  <div class="ph-bg"></div>
  <video class="ph-video" autoplay muted loop playsinline>
    <source src="{{ asset('assets/videos/commercial-hero.mp4') }}" type="video/mp4">
  </video>
  <div class="ph-ov"></div>
  <div class="ph-inner">
    <div class="wrap">
      <span class="ph-kicker">Commercial Services</span>
      <h1>Grounds You Can <em>Count On</em></h1>
      <p>Brighton keeps commercial properties looking sharp year-round - reliable crews, consistent results, and one team that shows up every time.</p>
    </div>
  </div>
</section>

<div class="intro-strip casc">
  <div class="wrap">
    <h2>Your Property Reflects <em>Your Business</em></h2>
    <p>First impressions matter. Whether it's a shopping center, office complex, HOA, or residential community - we show up on schedule, do the work right, and make sure your property always looks the part. Long-term contracts, dedicated crews, one point of contact.</p>
  </div>
</div>

<section class="services-page">
  <div class="wrap">

    <div class="sec-head center casc sec-head--tight">
      <span class="kicker">What We Do</span>
      <h2>Commercial <em>Services</em></h2>
      <p>From full landscape installations to weekly maintenance and winter snow operations - one team covering your property in every season.</p>
    </div>

    <div id="lawn-maintenance" class="prow casc">
      <div class="pimg">
        <img src="{{ asset('assets/images/commercial-maintenance.jpg') }}" alt="Commercial Lawn Maintenance" class="img-natural">
        <i class="fa-solid fa-house"></i>
      </div>
      <div class="ptext">
        <span class="pstep">01 - Lawn Maintenance</span>
        <h2>Commercial Lawn Maintenance</h2>
        <p>We manage the grounds so you don't have to think about it. Brighton provides weekly commercial lawn maintenance for properties across New Jersey - mowing, edging, blowing, and keeping everything looking clean and professional every single visit.</p>
        <p>Our crews are punctual, consistent, and trained to hold the same standard week after week. No missed visits, no excuses. Just a well-maintained property your tenants and customers can be proud of.</p>
        <ul class="ul-spaced">
          <li>Weekly mowing &amp; edging</li>
          <li>Trimming &amp; blowing</li>
          <li>Fertilization &amp; weed control</li>
          <li>Spring &amp; fall cleanups</li>
          <li>Seasonal color &amp; mulching</li>
        </ul>
        <a href="{{ route('home') }}#contact" class="btn btn-primary mt-2">Get a Maintenance Quote</a>
      </div>
    </div>

    <div class="snow-card casc">
      <div class="snow-inner">
        <div class="ptext">
          <span class="pstep">02 - Commercial Installs</span>
          <h2>New Construction &amp; Full Landscape Installs</h2>
          <p>Brighton builds commercial landscapes from the ground up. Sodding, trees, shrubs, landscape beds, hardscape, irrigation - we handle the full install package for new developments and property overhauls. One crew, no subcontractors, built to last.</p>
          <ul class="ul-spaced">
            <li>Sodding &amp; turf establishment</li>
            <li>Tree &amp; shrub installation</li>
            <li>Landscape bed creation</li>
            <li>Hardscape - pavers, walls &amp; curbing</li>
            <li>Irrigation system installation</li>
          </ul>
          <div class="btn-group">
            <a href="{{ route('work.index', ['filter' => 'commercial']) }}" class="btn btn-primary">View Our Work</a>
          </div>
        </div>
        <div class="pimg">
          <img src="{{ asset('assets/images/install-header.jpg') }}" alt="Commercial Installs" class="img-natural">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 22V12M12 12C12 7 7 3 3 3s9 4 9 9zM12 12c0-5 5-9 9-9s-9 4-9 9z"/></svg>
        </div>
      </div>
    </div>

    <div class="snow-card casc">
      <div class="snow-inner">
        <div class="snow-visual">
          <img src="{{ asset('assets/images/snow-section.jpg') }}" alt="Snow & Ice Management" class="img-natural">
        </div>
        <div class="snow-text">
          <span class="snow-badge">03 - Snow &amp; Ice Management</span>
          <h2>We Run One of NJ's Most Active Snow Divisions</h2>
          <p>When a storm hits, we're already moving. Brighton operates a full snow and ice management division with dedicated routes, 24/7 crews, and contracts across Ocean County and beyond. The numbers speak for themselves.</p>
          <div class="snow-stats">
            <div class="snow-stat">
              <div class="snow-stat-num">200+</div>
              <div class="snow-stat-label">Lane Miles Plowed</div>
            </div>
            <div class="snow-stat">
              <div class="snow-stat-num">50+</div>
              <div class="snow-stat-label">Miles of Sidewalk</div>
            </div>
            <div class="snow-stat">
              <div class="snow-stat-num">1M+</div>
              <div class="snow-stat-label">Sq Ft Serviced</div>
            </div>
            <div class="snow-stat">
              <div class="snow-stat-num">5,000+</div>
              <div class="snow-stat-label">Stakes Installed</div>
            </div>
          </div>
          <a href="{{ route('snow') }}" class="btn-snow">See the Full Snow Division &rarr;</a>
        </div>
      </div>
    </div>

  </div>
</section>

<div class="stats-bar casc">
  <div class="wrap">
    <div class="stats-grid">
      <div>
        <div class="stat-num cm-num" data-count="10" data-suffix="+">0</div>
        <div class="stat-label">Years Experience</div>
      </div>
      <div>
        <div class="stat-num cm-num" data-text="24/7">24/7</div>
        <div class="stat-label">Snow Response</div>
      </div>
      <div>
        <div class="stat-num cm-num" data-text="NJ">NJ</div>
        <div class="stat-label">Licensed &amp; Insured</div>
      </div>
    </div>
  </div>
</div>

<section class="comm-work casc">
  <div class="wrap">
    <div class="sec-head center comm-work">
      <span class="kicker">Our Commercial Builds</span>
      <h2>Work We're <em>Proud Of</em></h2>
      <p>From HOA grounds to shopping center renovations - a look at what Brighton builds on the commercial side.</p>
    </div>
    <div class="proj-grid" id="commGrid">
      @foreach ($commercialProjects as $project)
        <x-project-card :project="$project" />
      @endforeach
    </div>
    <div class="text-center-mt">
      <a href="{{ route('work.index', ['filter' => 'commercial']) }}" class="btn btn-primary">View All Commercial Work</a>
    </div>
  </div>
</section>

<div class="cta-band">
  <div class="wrap">
    <h2>Ready to <em>Get Started?</em></h2>
    <p>Tell us about your property and we'll put together a plan that fits your schedule and budget.</p>
    <div class="btn-group btn-group--center">
      <a href="{{ route('home') }}#contact" class="btn btn-primary">Request a Quote</a>
      <a href="{{ route('snow') }}" class="btn btn-outline">Snow &amp; Ice Division</a>
    </div>
  </div>
</div>
@endsection
