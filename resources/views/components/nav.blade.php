@props(['snow' => false])

@php
    $logo = $snow ? 'assets/images/snow-logo-crop.png' : 'assets/images/logo.png';
    $logoAlt = $snow ? 'Brighton Snow Division' : 'Brighton Lawn & Landscape';
    $ctaText = $snow ? 'Get a Snow Contract' : 'Get a Quote';
    $links = [
        ['route' => 'residential', 'label' => 'Residential'],
        ['route' => 'commercial', 'label' => 'Commercial'],
        ['route' => 'sitework', 'label' => 'Site Work'],
        ['route' => 'snow', 'label' => 'Snow & Ice'],
    ];
@endphp

<header id="header" @class(['solid' => ! request()->routeIs('home')])>
  <div class="header-inner">
    <a href="{{ route('home') }}" class="brand"><img src="{{ asset($logo) }}" alt="{{ $logoAlt }}"></a>
    <nav class="nav">
      @foreach ($links as $link)
        <a href="{{ route($link['route']) }}" @class(['active' => request()->routeIs($link['route'])])>{{ $link['label'] }}</a>
      @endforeach
      <a href="{{ route('home') }}#about">About</a>
      <a href="{{ route('home') }}#contact" class="nav-btn">{{ $ctaText }}</a>
    </nav>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
  @foreach ($links as $link)
    <a href="{{ route($link['route']) }}" @class(['active' => request()->routeIs($link['route'])])>{{ $link['label'] }}</a>
  @endforeach
  <a href="{{ route('home') }}#about">About</a>
  <a href="{{ route('home') }}#contact" class="nav-btn">{{ $ctaText }}</a>
</div>
