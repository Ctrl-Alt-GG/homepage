import params from '@params'

const SELECTOR = '[data-cag-venue-map]'

// MapLibre needs a WebGL2 context and throws a long way into its own startup
// when there is none. Firefox hands one out far less readily than Chromium
// does (a blocklisted driver, software rendering, webgl.disabled or
// resistFingerprinting are all enough), so check before pulling in ~600 kB of
// map code we would only throw away.
function hasWebGL2() {
  if (!('WebGL2RenderingContext' in window)) return false

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

async function createMap(element) {
  if (!hasWebGL2()) throw new Error('WebGL2 is not available in this browser')

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
// text arrives, at an unpredictable point relative to the map's own events,
// so undo it on that first expansion and then leave the control to the user.
function collapseAttribution(attribution) {
  if (!attribution) return

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
        // WebGL2 unavailable, blocked tiles, etc. The `failed` state reveals
        // the message inside the frame; the address and the map deep links
        // below it remain usable either way.
        element.dataset.cagVenueMap = 'failed'
        console.warn('cag-venue-map: showing the fallback instead of the map', error)
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
