const CACHE='sr6-v1';
const PRE=['/','/index.html','/manifest.json','/icon.svg'];
const CDN=['cdn.jsdelivr.net','unpkg.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.includes('binaryws.com')||u.hostname.includes('anthropic.com'))return;
  if(CDN.some(d=>u.hostname.includes(d))){e.respondWith(caches.match(e.request).then(c=>{if(c)return c;return fetch(e.request).then(r=>{caches.open(CACHE).then(c2=>c2.put(e.request,r.clone()));return r;});}));return;}
  e.respondWith(fetch(e.request).then(r=>{caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>caches.match(e.request).then(c=>c||caches.match('/index.html'))));
});
