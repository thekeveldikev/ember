/* Prüft die Web-Push-Verschlüsselung des Boten gegen die amtlichen Zahlen
   aus RFC 8291, Anhang A. Wenn diese Prüfung durchgeht, versteht jeder
   Zustelldienst der Welt, was EMBER ihm schickt.

   node --test test/push.mjs                                            */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lastVerschluesseln, b64url, vonB64url } from '../push/worker.js';

/* --- Die Zahlen aus dem RFC ----------------------------------------------- */

const KLARTEXT = 'When I grow up, I want to be a watermelon';
const EMPFAENGER_OEFFENTLICH = 'BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4';
const GEHEIMNIS = 'BTBZMqHH6r4Tts7J_aSIgg';
const ABSENDER_OEFFENTLICH = 'BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8';
const ABSENDER_PRIVAT = 'yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw';
const SALZ = 'DGv6ra1nlYgDCS1FRnbzlw';

const ERWARTET =
  'DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27ml' +
  'mlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPT' +
  'pK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN';

/* Der rohe öffentliche Punkt zerfällt in seine beiden Hälften. */
function jwkAus(oeffentlichB64, privatB64) {
  const roh = vonB64url(oeffentlichB64);
  return {
    kty: 'EC',
    crv: 'P-256',
    x: b64url(roh.slice(1, 33)),
    y: b64url(roh.slice(33, 65)),
    d: privatB64,
    ext: true,
  };
}

test('die Last wird genau so verschlüsselt, wie RFC 8291 es vorschreibt', async () => {
  const privat = await crypto.subtle.importKey(
    'jwk', jwkAus(ABSENDER_OEFFENTLICH, ABSENDER_PRIVAT),
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']
  );
  const oeffentlich = await crypto.subtle.importKey(
    'raw', vonB64url(ABSENDER_OEFFENTLICH),
    { name: 'ECDH', namedCurve: 'P-256' }, true, []
  );

  const raus = await lastVerschluesseln(
    new TextEncoder().encode(KLARTEXT),
    EMPFAENGER_OEFFENTLICH,
    GEHEIMNIS,
    { salz: vonB64url(SALZ), paar: { privateKey: privat, publicKey: oeffentlich } }
  );

  assert.equal(b64url(raus), ERWARTET);
});

test('der Kopf trägt Salz, Satzgröße und den öffentlichen Schlüssel', async () => {
  const raus = await lastVerschluesseln(
    new TextEncoder().encode('hallo'), EMPFAENGER_OEFFENTLICH, GEHEIMNIS
  );

  assert.equal(raus.length, 16 + 4 + 1 + 65 + (5 + 1 + 16), 'Kopf plus Inhalt plus Siegel');
  assert.equal(new DataView(raus.buffer, raus.byteOffset).getUint32(16, false), 4096);
  assert.equal(raus[20], 65, 'ein unkomprimierter P-256-Punkt ist 65 Bytes lang');
  assert.equal(raus[21], 4, 'und beginnt mit 0x04');
});

test('zwei Sendungen teilen sich niemals dasselbe Salz', async () => {
  const a = await lastVerschluesseln(new TextEncoder().encode('x'), EMPFAENGER_OEFFENTLICH, GEHEIMNIS);
  const b = await lastVerschluesseln(new TextEncoder().encode('x'), EMPFAENGER_OEFFENTLICH, GEHEIMNIS);
  assert.notEqual(b64url(a.slice(0, 16)), b64url(b.slice(0, 16)));
  assert.notEqual(b64url(a), b64url(b));
});
