/**
 * Service Worker — Smart Campus PWA
 *
 * Strategy:
 *  - App shell (HTML/JS/CSS/fonts): Cache-First — fast paint, even offline
 *  - API calls: Network-First with cache fallback — fresh data when online,
 *    graceful fallback when Vercel is cold-starting or network is down
 */

const CACHE_VERSION = 'sc-v1'
const SHELL_CACHE   = `${CACHE_VERSION}-shell`
const API_CACHE     = `${CACHE_VERSION}-api`

// Core app shell assets cached on install
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

// ── Install: pre-cache the app shell ─────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()) // activate immediately
  )
})

// ── Activate: delete old versioned caches ────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('sc-') && k !== SHELL_CACHE && k !== API_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ── Fetch: route requests to the right strategy ──────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests; let POSTs (auth) go straight to network
  if (request.method !== 'GET') return

  // API calls → Network-First (with cache fallback for offline / cold-start)
  if (url.hostname.includes('vercel.app') || url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithCache(request, API_CACHE))
    return
  }

  // Same-origin navigation & assets → Cache-First (app shell)
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstWithNetwork(request))
  }
})

/**
 * Network-First: try network, store response in cache, fall back to cache.
 * Ideal for API data — always fresh when online, works offline after first load.
 */
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone()) // update cache in background
    }
    return networkResponse
  } catch {
    // Network failed (or Vercel still cold) — return stale cache if available
    const cached = await cache.match(request)
    return cached || new Response('{"error":"offline"}', {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

/**
 * Cache-First: serve from cache, fall back to network and store result.
 * Ideal for app shell — instant paint, network only for new assets.
 */
async function cacheFirstWithNetwork(request) {
  const cache = await caches.open(SHELL_CACHE)
  const cached = await cache.match(request)
  if (cached) return cached

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) cache.put(request, networkResponse.clone())
    return networkResponse
  } catch {
    // SPA fallback: serve index.html for any unmatched navigation
    const fallback = await cache.match('/index.html')
    return fallback || new Response('Offline', { status: 503 })
  }
}
