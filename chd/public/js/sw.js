var CACHE_NAME = 'cherrydoor-cache-v1';
var urlsToCache = [
	'offline.html',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
  	'assets/user/home/views/home.html',
  	'/images/slider-1.jpg',
  	'/css/site.min.css',
  	'/js/user/site.min.js',
  	'/js/user/app.min.js'
];
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});
self.addEventListener('fetch', function(event) {
	if (event.request.method !== 'GET') {
    /* If we don't block the event as shown below, then the request will go to
       the network as usual.
    */
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }
  event.respondWith(fromNetwork(event.request, 400).catch(function(){
  	return fromCache(event.request);
  }));
});

function fromNetwork(request, timeout) {
	return new Promise(function (fulfill, reject) {
		var timeoutId = setTimeout(reject, timeout);
		fetch(request).then(function (response) {
		    clearTimeout(timeoutId);
		    fulfill(response);
		}, reject);    
	});
}

function fromCache(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || caches.match(OFFLINE_URL) || Promise.reject('no-match');
    });
  });
}

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['cherrydoor-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});