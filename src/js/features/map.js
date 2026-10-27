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
    [41.36, -74.69],
    [41.00, -73.90],
    [40.50, -74.25],
    [40.45, -74.00],
    [39.75, -74.10],
    [39.40, -74.40],
    [38.93, -74.90],
    [39.35, -75.55],
    [39.65, -75.55],
    [39.85, -75.40],
    [40.10, -74.75],
    [40.60, -75.15],
    [40.85, -75.10]
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

  label([40.15, -74.55], 'New Jersey');

  map.fitBounds(primary.getBounds().pad(0.12));
  setTimeout(() => map.invalidateSize(), 250);
}
