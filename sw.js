const CACHE_NAME = 'gardens-havens-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logo-192.png',
  '/assets/logo2.webp',
  '/assets/github.svg',
  '/assets/wikidata.svg',
  '/assets/wikipedia.svg',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing')
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .catch((error) => {
        console.error('Error during install:', error)
      }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip external API requests (let them go to network)
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        console.log('Serving from cache:', event.request.url)
        return response
      }

      // Otherwise fetch from network
      console.log('Fetching from network:', event.request.url)
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response since it can only be consumed once
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch((error) => {
          console.error('Fetch failed:', error)

          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }

          throw error
        })
    }),
  )
})

// Background sync for offline actions (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered')
    // Handle offline data synchronization here
  }
})

// Push notifications (optional)
self.addEventListener('push', (event) => {
  console.log('Push notification received')

  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/assets/logo-192.png',
    badge: '/assets/logo-96.png',
    vibrate: [200, 100, 200],
    tag: 'gardens-havens-notification',
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/assets/logo-96.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/logo-96.png',
      },
    ],
  }

  event.waitUntil(self.registration.showNotification('Gardens Havens', options))
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked')
  event.notification.close()

  if (event.action === 'open' || !event.action) {
    event.waitUntil(self.clients.openWindow('/'))
  }
})
