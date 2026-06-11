<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="{{ asset('assets/images/brighton-icon.png') }}">
  <link rel="apple-touch-icon" href="{{ asset('assets/images/brighton-icon.png') }}">
  <title>@yield('title', 'Brighton Lawn & Landscape | Landscape Construction & Commercial Maintenance in NJ & PA')</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" referrerpolicy="no-referrer">
  @stack('head')
  @vite(['resources/css/main.css', 'resources/js/app.js'])
</head>
<body @class(['snow-theme' => request()->routeIs('snow')])>

<x-nav :snow="request()->routeIs('snow')" />

@yield('content')

<x-footer :email="request()->routeIs('snow') ? 'snow@BrightonLawn.com' : 'info@BrightonLawn.com'" />

@stack('scripts')
</body>
</html>
