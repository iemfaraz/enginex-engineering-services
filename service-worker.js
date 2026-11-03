// Offline fallback only. Customer pages, forms, API responses and photos are never cached here.
const CACHE='enginex-public-offline-v1';
const BASE=new URL('./',self.location.href);
const OFFLINE=new URL('offline.html',BASE).href;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([OFFLINE,new URL('assets/app-icon-192.png',BASE).href,new URL('assets/app-icon-512.png',BASE).href])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('enginex-public-offline-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname)||request.mode!=='navigate')return;if(url.pathname.endsWith('.apk'))return;event.respondWith(fetch(request).catch(()=>caches.match(OFFLINE).then(response=>response||Response.error())))});
