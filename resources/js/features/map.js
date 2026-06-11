export function initMap() {
  const target = document.getElementById('serviceMap');
  if (!target || typeof L === 'undefined') return;

  const styles = getComputedStyle(document.documentElement);
  const green = styles.getPropertyValue('--green').trim();
  const greenLight = styles.getPropertyValue('--green-light').trim();

  const map = L.map(target, {
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: true,
    attributionControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  const style = {
    color: greenLight,
    weight: 2,
    opacity: 1,
    fillColor: green,
    fillOpacity: 0.26
  };

  const primary = L.polygon([
    [41.45, -75.78],
    [41.30, -74.10],
    [40.95, -73.90],
    [40.10, -73.95],
    [39.35, -74.40],
    [38.92, -74.92],
    [39.45, -75.55],
    [39.55, -76.05],
    [40.05, -76.15],
    [40.65, -75.55],
    [41.10, -75.95]
  ], style).addTo(map);

  function label(latlng, text) {
    L.marker(latlng, {
      icon: L.divIcon({
        className: '',
        html: `<div class="area-label"><span class="area-label-dot"></span>${text}</div>`,
        iconSize: null,
        iconAnchor: null
      })
    }).addTo(map);
  }

  label([40.15, -74.75], 'NJ - Philly - DE - MD');
  label([41.30, -75.70], 'NE Pennsylvania');

  map.fitBounds(primary.getBounds().pad(0.12));
  setTimeout(() => map.invalidateSize(), 250);
}
