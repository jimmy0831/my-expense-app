
const CACHE_NAME = 'my-expense-app-v1';

// List of all local files that make up the application shell.
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/supabaseClient.ts',
  '/components/Auth.tsx',
  '/components/AccountManager.tsx',
  '/components/Header.tsx',
  '/components/CalendarView.tsx',
  '/components/AddExpenseForm.tsx',
  '/components/Charts.tsx',
  '/components/CategoryManager.tsx',
  '/components/ExpenseList.tsx',
  '/components/icons.tsx',
  '/components/Tabs.tsx',
  '/components/Modal.tsx',
  '/components/EditExpenseModal.tsx'
];

// Install event: open a cache and add the app shell files to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve assets from cache if available, otherwise fetch from network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time-use stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
