/* EMBER Dienst — Seiten frisch aus dem Netz, offline aus dem sicheren Lager.
   Gleiche Bauart wie bei VANI: Das Lager trägt die Fassung im Namen, deshalb
   räumt eine neue Fassung den alten Bestand beim Aktivieren selbst weg.

   Diese Datei wird gebaut, nicht von Hand geändert:
   src/sw-vorlage.js -> sw.js (npm run build). Der Platzhalter unten wird
   beim Bau durch die Fassung aus package.json ersetzt. */

const VERSION = '0.4.3';
const LAGER = 'ember-v1-' + VERSION;
const KERN = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  /* Ein fehlendes Sinnbild darf die Einrichtung nicht scheitern lassen. */
  e.waitUntil(
    caches.open(LAGER)
      .then((c) => Promise.all(KERN.map((p) => c.add(p).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen.filter((n) => n !== LAGER).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const anfrage = e.request;
  if (anfrage.method !== 'GET') return;

  const url = new URL(anfrage.url);
  /* Firebase und der Push-Bote gehen immer direkt ins Netz. */
  if (url.origin !== location.origin) return;

  if (anfrage.mode === 'navigate') {
    /* Zuerst das Netz: so kommt eine neue Fassung sofort an.
       Fällt das Netz aus, tritt die letzte gute Seite ein. */
    e.respondWith(
      fetch(anfrage).then((antwort) => {
        if (!antwort || !antwort.ok) return antwort;
        const kopie = antwort.clone();
        return caches.open(LAGER)
          .then((c) => c.put('./index.html', kopie))
          .catch(() => {})
          .then(() => antwort);
      }).catch(() => caches.match('./index.html').then((treffer) => treffer || new Response(
        'EMBER ist offline noch nicht vollständig eingerichtet.',
        { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      )))
    );
    return;
  }

  /* Beiwerk zuerst aus dem Lager: Der Lagername trägt bereits die Fassung,
     ein Treffer ist deshalb für diese Fassung immer der richtige. */
  e.respondWith(
    caches.match(anfrage).then((treffer) => treffer || fetch(anfrage).then((antwort) => {
      if (antwort && antwort.ok && antwort.type === 'basic') {
        const kopie = antwort.clone();
        caches.open(LAGER).then((c) => c.put(anfrage, kopie)).catch(() => {});
      }
      return antwort;
    }))
  );
});

/* Der Aktualisieren-Knopf in der App schickt dies, wenn eine neue Fassung
   wartet. Ohne die Nachricht bliebe sie bis zum nächsten Kaltstart liegen. */
self.addEventListener('message', (e) => {
  if (e.data && e.data.typ === 'AKTIVIEREN') self.skipWaiting();
});

/* ---- Push ---------------------------------------------------------------

   Der Bote schickt nur eine Hülle: Art, ein knapper Text und eine Kennung.
   Nie ein Inhalt. Was wirklich gemeint ist, holt sich die App selbst aus
   der verschlüsselten Ablage, sobald sie geöffnet wird. So steht auf dem
   Sperrbildschirm nichts, was jemand mitlesen könnte. */

self.addEventListener('push', (e) => {
  let last = {};
  try { last = e.data ? e.data.json() : {}; } catch { last = {}; }

  const titel = last.titel || 'EMBER';
  const optionen = {
    body: last.text || 'Etwas wartet auf dich.',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: last.tag || 'ember',
    renotify: true,
    /* Muster statt Worte: die Art des Impulses ist am Rhythmus erkennbar. */
    vibrate: last.puls || [80, 60, 80],
    data: { ziel: last.ziel || './', art: last.art || 'hinweis' },
    requireInteraction: last.art === 'befehl',
  };

  e.waitUntil(self.registration.showNotification(titel, optionen));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const ziel = (e.notification.data && e.notification.data.ziel) || './';

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((fenster) => {
      for (const f of fenster) {
        if (f.url.includes(self.registration.scope)) {
          f.postMessage({ typ: 'PUSH_GEOEFFNET', ziel });
          return f.focus();
        }
      }
      return self.clients.openWindow(ziel);
    })
  );
});

/* Läuft die Erlaubnis ab, meldet sich die App beim nächsten Start neu an. */
self.addEventListener('pushsubscriptionchange', (e) => {
  e.waitUntil(
    self.clients.matchAll({ includeUncontrolled: true })
      .then((fenster) => fenster.forEach((f) => f.postMessage({ typ: 'PUSH_ERNEUERN' })))
  );
});
