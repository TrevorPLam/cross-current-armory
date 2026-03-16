/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = 'cc-armory-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
]

// Install: pre-cache static shell
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  // Activate immediately without waiting for old tabs to close
  self.skipWaiting()
})

// Activate: remove stale caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  )
  // Take control of all clients immediately
  self.clients.claim()
})

// Fetch: network-first for API/navigation, cache-first for static assets
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin or CDN requests; skip cross-origin analytics etc.
  if (url.origin !== self.location.origin) return

  // Navigation requests: network-first with offline fallback to cached index
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then(
          cached => cached ?? new Response('You are offline. Please check your connection and try again.', { status: 503, headers: { 'Content-Type': 'text/plain' } })
        )
      )
    )
    return
  }

  // Static assets (JS, CSS, images, fonts): cache-first strategy
  if (/\.(js|css|woff2?|png|jpe?g|webp|avif|svg|gif|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          // Only cache successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache))
          return response
        })
      })
    )
    return
  }

  // All other requests: network-first
  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then(
        cached => cached ?? new Response('Resource unavailable offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
      )
    )
  )
})
