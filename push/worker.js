/* ==========================================================================
   EMBER — Der Bote (Cloudflare Worker)

   Er tut genau eine Sache: einen Web-Push unterschreiben und zustellen.
   Er kennt euren Schlüssel nicht, sieht keine Inhalte, speichert nichts.
   Was durch ihn geht, ist die nichtssagende Hülle aus 23-push.js.

   Warum überhaupt ein Bote? Weil Web Push zwingend eine Unterschrift mit
   einem privaten Schlüssel verlangt (VAPID). Der darf nicht in eine App,
   die jeder herunterladen kann — also liegt er hier.

   Einrichten:  siehe push/EINRICHTEN.md
   Geheimnisse: VAPID_PRIVAT (JWK), VAPID_OEFFENTLICH, GEHEIMNIS, ABSENDER
   ========================================================================== */

export default {
  async fetch(anfrage, umgebung) {
    const url = new URL(anfrage.url);

    if (anfrage.method === 'OPTIONS') return neueAntwort(null, 204, umgebung);
    if (url.pathname === '/' || url.pathname === '/gesund') {
      return neueAntwort({ da: true }, 200, umgebung);
    }
    if (url.pathname !== '/senden' || anfrage.method !== 'POST') {
      return neueAntwort({ fehler: 'unbekannt' }, 404, umgebung);
    }

    /* Ohne das gemeinsame Geheimnis darf hier niemand etwas losschicken.
       Sonst könnte jeder, der die Adresse kennt, euch zuklingeln. */
    const ausweis = (anfrage.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!umgebung.GEHEIMNIS || !zeitgleich(ausweis, umgebung.GEHEIMNIS)) {
      return neueAntwort({ fehler: 'abgelehnt' }, 401, umgebung);
    }

    let auftrag;
    try { auftrag = await anfrage.json(); }
    catch { return neueAntwort({ fehler: 'unlesbar' }, 400, umgebung); }

    const ziel = auftrag && auftrag.an;
    if (!ziel || !ziel.endpoint || !ziel.keys || !ziel.keys.p256dh || !ziel.keys.auth) {
      return neueAntwort({ fehler: 'kein Ziel' }, 400, umgebung);
    }

    try {
      const antwort = await zustellen(ziel, auftrag.last || {}, umgebung, !!auftrag.dringend);
      /* 404 und 410 heißen: diese Adresse gibt es nicht mehr. Die App
         räumt sie dann selbst weg. Schlägt die Zustellung fehl, reist
         die Begründung des Zustelldienstes mit — ohne sie ist ein 403
         ein Ratespiel. */
      const grund = antwort.ok ? undefined : (await antwort.text().catch(() => '')).slice(0, 200);
      return neueAntwort(
        { ok: antwort.ok, stand: antwort.status, grund },
        antwort.ok ? 200 : antwort.status,
        umgebung
      );
    } catch (f) {
      return neueAntwort({ fehler: String(f && f.message || f).slice(0, 200) }, 500, umgebung);
    }
  },
};

/* --- Zustellen ------------------------------------------------------------ */

async function zustellen(ziel, last, umgebung, dringend) {
  const rohLast = new TextEncoder().encode(JSON.stringify(last));
  const koerper = await lastVerschluesseln(rohLast, ziel.keys.p256dh, ziel.keys.auth);
  const unterschrift = await vapidKopf(ziel.endpoint, umgebung);

  return fetch(ziel.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': unterschrift,
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      'TTL': dringend ? '600' : '86400',
      'Urgency': dringend ? 'high' : 'normal',
    },
    body: koerper,
  });
}

/* --- VAPID: die Unterschrift ---------------------------------------------- */

/* Ein kurzlebiger Ausweis, der dem Zustelldienst sagt: dieser Absender
   gehört zu dem Schlüssel, für den sich das Gerät angemeldet hat. */

async function vapidKopf(endpunkt, umgebung) {
  const ziel = new URL(endpunkt).origin;
  const kopf = { typ: 'JWT', alg: 'ES256' };
  /* Ein verunglückter Absender (Tippfehler, doppeltes @) soll die
     Zustellung nicht reißen — dann lieber der neutrale Platzhalter. */
  const roherAbsender = String(umgebung.ABSENDER || '').trim();
  const absenderGueltig = /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(roherAbsender);

  const last = {
    aud: ziel,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: absenderGueltig ? roherAbsender : 'mailto:ember@example.invalid',
  };

  const teil = (o) => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const ungezeichnet = teil(kopf) + '.' + teil(last);

  const schluessel = await crypto.subtle.importKey(
    'jwk',
    JSON.parse(umgebung.VAPID_PRIVAT),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const zeichen = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    schluessel,
    new TextEncoder().encode(ungezeichnet)
  );

  return 'vapid t=' + ungezeichnet + '.' + b64url(new Uint8Array(zeichen)) +
    ', k=' + umgebung.VAPID_OEFFENTLICH;
}

/* --- Die Last verschlüsseln (RFC 8291, aes128gcm) ------------------------- */

/* Auch der Zustelldienst — Google, Apple, Mozilla — soll den Inhalt nicht
   lesen können. Deshalb wird er für genau dieses eine Gerät verschlüsselt.
   Der Schlüssel dafür entsteht aus einem frischen Paar und dem öffentlichen
   Schlüssel des Empfängers; niemand sonst kann ihn nachrechnen. */

/* prueflinge setzt Salz und flüchtiges Schlüsselpaar von aussen — nur der
   Test in test/push.mjs benutzt das, um gegen die Vektoren aus RFC 8291
   zu rechnen. Im Betrieb bleibt beides Zufall, wie es sein muss. */
export async function lastVerschluesseln(roheLast, p256dhB64, authB64, prueflinge) {
  const empfaengerRoh = vonB64url(p256dhB64);
  const geheimnis = vonB64url(authB64);

  const empfaenger = await crypto.subtle.importKey(
    'raw', empfaengerRoh, { name: 'ECDH', namedCurve: 'P-256' }, false, []
  );

  const flüchtig = (prueflinge && prueflinge.paar) || await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']
  );
  const meinsRoh = new Uint8Array(await crypto.subtle.exportKey('raw', flüchtig.publicKey));

  const gemeinsam = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'ECDH', public: empfaenger }, flüchtig.privateKey, 256
  ));

  /* Erste Ableitung: bindet das Geheimnis des Geräts an beide Schlüssel. */
  const infoSchluessel = verbinde(
    new TextEncoder().encode('WebPush: info\0'), empfaengerRoh, meinsRoh
  );
  const ikm = await hkdf(geheimnis, gemeinsam, infoSchluessel, 32);

  /* Zweite Ableitung: daraus der eigentliche Schlüssel und der Vorsatz. */
  const salz = (prueflinge && prueflinge.salz) || crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salz, ikm, new TextEncoder().encode('Content-Encoding: aes128gcm\0'), 16);
  const vorsatz = await hkdf(salz, ikm, new TextEncoder().encode('Content-Encoding: nonce\0'), 12);

  const aes = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt']);

  /* Das 0x02 schließt den Klartext ab; danach dürfte Füllung folgen. */
  const klar = verbinde(roheLast, new Uint8Array([2]));
  const geheim = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: vorsatz, tagLength: 128 }, aes, klar
  ));

  /* Der Kopf reist unverschlüsselt mit: Salz, Satzgröße, mein Schlüssel. */
  const satzgroesse = new Uint8Array(4);
  new DataView(satzgroesse.buffer).setUint32(0, 4096, false);

  return verbinde(salz, satzgroesse, new Uint8Array([meinsRoh.length]), meinsRoh, geheim);
}

/* --- Handwerkszeug -------------------------------------------------------- */

async function hkdf(salz, ikm, info, laenge) {
  const grund = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const raus = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: salz, info }, grund, laenge * 8
  );
  return new Uint8Array(raus);
}

function verbinde(...stuecke) {
  const gesamt = stuecke.reduce((s, t) => s + t.length, 0);
  const raus = new Uint8Array(gesamt);
  let wo = 0;
  for (const t of stuecke) { raus.set(t, wo); wo += t.length; }
  return raus;
}

export function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function vonB64url(s) {
  const g = String(s).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(g + '='.repeat((4 - g.length % 4) % 4)), (c) => c.charCodeAt(0));
}

/* Gleich lange Prüfung, damit die Antwortzeit nichts über das Geheimnis
   verrät. */
function zeitgleich(a, b) {
  const x = String(a), y = String(b);
  if (x.length !== y.length) return false;
  let unterschied = 0;
  for (let i = 0; i < x.length; i++) unterschied |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return unterschied === 0;
}

function neueAntwort(koerper, stand, umgebung) {
  return new Response(koerper == null ? null : JSON.stringify(koerper), {
    status: stand,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': umgebung.HERKUNFT || '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Cache-Control': 'no-store',
    },
  });
}
