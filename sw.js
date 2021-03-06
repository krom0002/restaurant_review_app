const versionName = 'v1';

const cacheFiles = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg'
];

self.addEventListener('install', (e) =>{
  console.log('service worker: installed');
  e.waitUntil(
    caches
    .open(versionName)
    .then(cache => {
      console.log('service worker: caching');
      cache.addAll(cacheFiles);      
    })
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  console.log('service worker: activated');
});

self.addEventListener('fetch', e => {
  console.log('service worker: fetching');
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request)));
})


  
  