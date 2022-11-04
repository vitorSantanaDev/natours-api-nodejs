const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken =
  'pk.eyJ1Ijoidml0b3JzYW50YW5hZGV2IiwiYSI6ImNsYTFzazlsZDA1bGkzbnJwbGoxZWVyeGsifQ.OPaofUm0-EFlIiEuv9l_yQ'

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/vitorsantanadev/cla1swp27000c14rth2q94euz',
  scrollZoom: false,
})

const bounds = new mapboxgl.LngLatBounds()

locations.forEach((location) => {
  const element = document.createElement('div')
  element.className = 'marker'

  new mapboxgl.Marker({
    element,
    anchor: 'bottom',
  })
    .setLngLat(location.coordinates)
    .addTo(map)

  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map)

  bounds.extend(location.coordinates)
})

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    right: 100,
    left: 100,
  },
})
