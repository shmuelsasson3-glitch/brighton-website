@props(['email' => 'info@BrightonLawn.com'])

<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="{{ asset('assets/images/logo.png') }}" alt="Brighton Lawn & Landscape">
        <p>Full-service landscape construction and commercial maintenance across New Jersey &amp; Pennsylvania.</p>
      </div>
      <div class="foot-col">
        <h5>Services</h5>
        <a href="{{ route('residential') }}">Residential Construction</a>
        <a href="{{ route('commercial') }}">Commercial Maintenance</a>
        <a href="{{ route('sitework') }}">Site Work</a>
        <a href="{{ route('snow') }}">Snow &amp; Ice</a>
        <a href="{{ route('home') }}#about">About</a>
      </div>
      <div class="foot-col">
        <h5>Service Area</h5>
        <p>New Jersey</p>
        <p>Philadelphia &amp; Main Line, PA</p>
        <p>Northern DE &amp; NE Maryland</p>
      </div>
      <div class="foot-col">
        <h5>Contact</h5>
        <a href="tel:8482260090">(848) 226-0090</a>
        <a href="mailto:{{ $email }}">{{ $email }}</a>
      </div>
    </div>
    <div class="foot-bottom">
      <p class="copyright"><span class="copyright-icon" aria-hidden="true">&copy;</span><span class="yr">{{ now()->year }}</span><span class="copyright-text">Brighton Lawn &amp; Landscape. All rights reserved.</span></p>
      <span class="site-credit"><span class="credit-pill"><span class="credit-label">Website by</span><img class="blue-collar-logo" src="{{ asset('assets/images/bluecollarmedia.png') }}" alt="Blue Collar Media"><span class="credit-divider" aria-hidden="true"></span><a href="https://adamate.ai" target="_blank" rel="noopener" aria-label="Adamate.ai"><img class="adamate-logo" src="https://adamate.ai/Logo-B2.png" alt="Adamate.ai"></a></span></span>
      <div class="foot-social">
        <a href="https://www.instagram.com/brighton_lawn_landscape" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
        </a>
      </div>
    </div>
  </div>
</footer>
