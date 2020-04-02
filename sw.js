var cacheName = 'SmartCharts';
var filesToCache = [
  './index.html',
  './dist/smartcharts.css',
  './dist/babel-polyfill.min.js',
  './dist/chartiq.min.js',
  './dist/react.js',
  './dist/react-dom.js',
  './dist/react-transition-group.js',
  './dist/mobx.js',
  './dist/mobx-react.js',
  './dist/smartcharts.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event){
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {return;}
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(function(response){
      return response || fetch(event.request);
    })
  );
});