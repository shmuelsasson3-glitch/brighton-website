@props(['heading', 'copy'])

<div class="cta-band">
  <div class="wrap">
    <h2>{!! $heading !!}</h2>
    <p>{{ $copy }}</p>
    <a href="{{ route('home') }}#contact" class="btn btn-primary">Request a Quote</a>
  </div>
</div>
