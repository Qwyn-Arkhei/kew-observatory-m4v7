/* The Observatory: offline cache. Change VERSION whenever you upload a new index.html. */
var VERSION='observatory-v3';
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-1024.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==VERSION}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);if(u.origin!==location.origin)return;
  e.respondWith(caches.open(VERSION).then(function(c){
    return c.match(e.request,{ignoreSearch:true}).then(function(hit){
      var net=fetch(e.request).then(function(r){if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(function(){return hit});
      return hit||net;
    });
  }));
});
