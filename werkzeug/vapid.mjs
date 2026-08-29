/* Erzeugt das Schlüsselpaar für den Boten.  node werkzeug/vapid.mjs

   Der private Teil geht als Geheimnis in den Cloudflare-Worker und darf
   nirgendwo sonst auftauchen — nicht im Repository, nicht in der App.
   Der öffentliche Teil steckt im Kopplungscode und ist harmlos. */

const b64url = (bytes) => Buffer.from(bytes).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const paar = await crypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']
);

const privatJwk = await crypto.subtle.exportKey('jwk', paar.privateKey);
const oeffentlichRoh = new Uint8Array(await crypto.subtle.exportKey('raw', paar.publicKey));

/* Der Worker unterschreibt mit ECDSA; die Verwendung wird beim Import
   ohnehin neu gesetzt, aber ein sauberes JWK schadet nie. */
delete privatJwk.key_ops;
delete privatJwk.alg;

const geheimnis = b64url(crypto.getRandomValues(new Uint8Array(24)));

console.log(`
EMBER — Schlüssel für den Boten
================================================================

1) In Cloudflare als Geheimnisse hinterlegen (Worker → Settings →
   Variables and Secrets → jeweils "Secret", nicht "Text"):

VAPID_PRIVAT
${JSON.stringify(privatJwk)}

VAPID_OEFFENTLICH
${b64url(oeffentlichRoh)}

GEHEIMNIS
${geheimnis}

ABSENDER
mailto:du@deine-adresse.de          <- eigene Adresse eintragen

2) In EMBER beim Einrichten eintragen (Bote):

   Öffentlicher Schlüssel : ${b64url(oeffentlichRoh)}
   Geheimnis              : ${geheimnis}
   Adresse                : https://ember-bote.DEINNAME.workers.dev

================================================================
Den privaten Schlüssel nirgends sonst speichern. Geht er verloren,
erzeugst du einfach ein neues Paar — dann müssen sich beide Geräte
allerdings neu für Hinweise anmelden.
`);
