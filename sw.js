// Service Worker: macht die App offline startfähig.
// Nach Änderungen an der App die Versionsnummer erhöhen (z. B. v2), damit Handys die neue Fassung laden.
const VERSION = 'v8';
const SHELL = 'plattenregal-' + VERSION;
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './html5-qrcode.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL)
    .then(c => Promise.allSettled(FILES.map(f => c.add(f))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('plattenregal-') && k !== SHELL).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Seite selbst: immer zuerst aus dem Netz (neueste Fassung), offline aus dem Speicher
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(SHELL).then(c => c.put('./index.html', copy));
      return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  // Eigene Dateien: aus dem Speicher, im Hintergrund aktualisieren
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    }));
  }
  // Alles andere (MusicBrainz, Discogs, Cover) geht direkt ins Netz.
});
