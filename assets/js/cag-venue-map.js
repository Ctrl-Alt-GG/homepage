import params from '@params'

const SELECTOR = '[data-cag-venue-map]'

async function createMap(element) {
  const maplibregl = await import(params.moduleUrl)

  const lng = Number.parseFloat(element.dataset.lng)
  const lat = Number.parseFloat(element.dataset.lat)
  const zoom = Number.parseFloat(element.dataset.zoom)

  const map = new maplibregl.Map({
    container: element,
    style: params.style,
    center: [lng, lat],
    zoom,
    locale: params.locale,
    attributionControl: { compact: true },
    // The card sits inside scrollable prose; wheel-zoom would hijack the page.
    cooperativeGestures: true,
    pitchWithRotate: false,
    dragRotate: false,
  })

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
  new maplibregl.Marker({ color: params.markerColor }).setLngLat([lng, lat]).addTo(map)

  collapseAttribution(element.querySelector('.maplibregl-ctrl-attrib'))

  return map
}

// MapLibre expands the compact attribution the moment the style's attribution
// text arrives — at an unpredictable point relative to the map's own events —
// so undo it on that first expansion and then leave the control to the user.
function collapseAttribution(attribution) {
  const observer = new MutationObserver(() => {
    if (!attribution.classList.contains('maplibregl-compact-show')) return
    observer.disconnect()
    attribution.classList.remove('maplibregl-compact-show')
  })

  observer.observe(attribution, { attributeFilter: ['class'] })
}

function observe(element) {
  const start = () => {
    element.dataset.cagVenueMap = 'loading'
    createMap(element)
      .then(() => {
        element.dataset.cagVenueMap = 'ready'
      })
      .catch((error) => {
        // WebGL2 unavailable, blocked tiles, etc. The address and the map
        // deep links below the frame remain usable, so just stop here.
        element.dataset.cagVenueMap = 'failed'
        console.warn('cag-venue-map: falling back to the static placeholder', error)
      })
  }

  if (!('IntersectionObserver' in window)) {
    start()
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      start()
    },
    { rootMargin: '200px' },
  )
  observer.observe(element)
}

document.querySelectorAll(SELECTOR).forEach((element) => {
  if (element.dataset.cagVenueMap) return
  observe(element)
})
