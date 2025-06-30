// InsightFlow AI Trading Service Worker
const CACHE_NAME = 'insightflow-cache-v1';

// Assets to cache on install - critical resources
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.js', 
  '/assets/index.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching App Shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch(error => {
        console.error('[Service Worker] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Helper function for network-first strategy
const networkFirst = async (request) => {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, clone and cache
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response was not ok');
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache and network failed, return the offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // Otherwise just rethrow the error
    throw error;
  }
};

// Helper function for cache-first strategy (for assets)
const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache first strategy failed:', error);
    throw error;
  }
};

// Fetch event - implement different strategies based on request type
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Don't cache Supabase API calls, OpenAI API calls, or other API calls
  if (
    url.pathname.includes('/rest/v1') || 
    url.pathname.includes('/auth/v1') || 
    url.hostname.includes('api.openai.com') ||
    request.url.includes('/api/')
  ) {
    return;
  }
  
  // For navigation requests (HTML), use network-first strategy
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('Accept')?.includes('text/html'))) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // For assets, use cache-first strategy
  if (
    request.method === 'GET' && 
    (
      url.pathname.startsWith('/assets/') || 
      url.pathname.startsWith('/icons/') || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.png') || 
      url.pathname.endsWith('.jpg') || 
      url.pathname.endsWith('.svg')
    )
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Default to network-first for everything else
  event.respondWith(networkFirst(request));
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received:', event);
  
  if (!event.data) {
    console.log('[Service Worker] Push received but no data');
    return;
  }
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification from InsightFlow',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: data.data || {},
      actions: data.actions || [],
      vibrate: [100, 50, 100]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'InsightFlow AI Trading', options)
    );
  } catch (error) {
    console.error('[Service Worker] Error processing push notification:', error);
    
    // Fallback if JSON parsing fails
    const message = event.data.text();
    
    event.waitUntil(
      self.registration.showNotification('InsightFlow AI Trading', {
        body: message,
        icon: '/icons/icon-192x192.png'
      })
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);
  
  event.notification.close();
  
  // Try to handle action clicks
  if (event.action) {
    handleActionClick(event.action, event.notification.data);
    return;
  }
  
  // Handle general notification click
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if a window is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // If we have notification data with a target URL, navigate to it
          if (event.notification.data && event.notification.data.url) {
            return client.navigate(event.notification.data.url).then(client => client.focus());
          }
          // Otherwise just focus the existing window
          return client.focus();
        }
      }
      
      // If no window is open, open a new one, potentially navigating to a specific URL
      if (clients.openWindow) {
        const url = (event.notification.data && event.notification.data.url) ? 
          event.notification.data.url : 
          '/';
        return clients.openWindow(url);
      }
    })
  );
});

// Handle action clicks in notifications
function handleActionClick(action, data = {}) {
  console.log('[Service Worker] Action click:', action, data);
  
  // Define what happens for each action type
  switch (action) {
    case 'view-trade':
      // Open the trade details page
      if (data.tradeId) {
        clients.openWindow(`/journal/trade/${data.tradeId}`);
      }
      break;
    
    case 'view-strategy':
      // Open the strategy details
      if (data.strategyId) {
        clients.openWindow(`/strategy/${data.strategyId}`);
      }
      break;
      
    // Add more action handlers as needed
      
    default:
      // Default handling
      if (data.url) {
        clients.openWindow(data.url);
      } else {
        clients.openWindow('/');
      }
  }
} 