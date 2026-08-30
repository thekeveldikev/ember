/* ==========================================================================
   61-keks.js — Der Glückskeks.

   Einer je Tag und je Person. Er liegt ganz unten auf dem Heim — erst als
   ganzer Keks, der geknackt werden will; dann schaut der Zettel heraus;
   erst das zweite Tippen faltet ihn auf. Drei kleine Handgriffe für zwei
   Sätze — genau darum geht es.

   Der Spruch kommt aus dem Vorrat (gefiltert nach Rolle, Tageszeit,
   Ampel) oder aus den eigenen Sprüchen der beiden, die doppelt zählen.
   Eigene anlegen: langer Druck auf den Keks oder den gelesenen Zettel.
   ========================================================================== */

function _keksZiehen(eigene) {
  const topf = vorratKekse(D.rolle, eigene);
  if (!topf.length) return null;

  const gesehen = Gerät.lies('keksGesehen', []);
  const letzteKat = Gerät.lies('keksKategorie', '');

  let wahl = topf.filter((k) => !gesehen.includes(k.id));
  if (!wahl.length) wahl = topf;
  const andereKat = wahl.filter((k) => k.kategorie !== letzteKat);
  if (andereKat.length) wahl = andereKat;

  const keks = zufall(wahl);
  Gerät.schreib('keksGesehen', [...gesehen, keks.id].slice(-60));
  Gerät.schreib('keksKategorie', keks.kategorie);
  return keks;
}

async function gluecksKeksLaden(platz) {
  platz.innerHTML = '';
  const heute = tagstempel();

  const eigene = await datenListe('keks').catch(() => []);
  let stand = Gerät.lies('keksHeute', null);

  if (!stand || stand.tag !== heute) {
    const keks = _keksZiehen(eigene);
    if (!keks) {
      /* Ohne Vorrat und ohne eigene Sprüche: der leise Weg zum Anlegen. */
      platz.append(el('button', {
        class: 'winzig still', style: { display: 'block', margin: '0 auto', padding: '10px' },
        onclick: () => keksSchreiben(platz),
      }, 'Sprüche ins Glas legen'));
      return;
    }
    stand = { tag: heute, text: keks.text, kategorie: keks.kategorie, von: keks.von || null, stand: 'ganz' };
    Gerät.schreib('keksHeute', stand);
  }

  if (stand.stand === 'gelesen') keksGelesenZeigen(platz, stand);
  else if (stand.stand === 'geknackt') keksGeknacktZeigen(platz, stand);
  else keksGanzZeigen(platz, stand);
}

/* --- Der ganze Keks -------------------------------------------------------- */

function _keksSvg() {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 140 96');
  s.setAttribute('class', 'keksbild');
  s.innerHTML =
    '<defs>' +
    '<radialGradient id="keksgold" cx="42%" cy="30%" r="80%">' +
    '<stop offset="0%" stop-color="#e8b071"/><stop offset="55%" stop-color="#c98d4e"/><stop offset="100%" stop-color="#8f5a2b"/>' +
    '</radialGradient>' +
    '<linearGradient id="keksfalz" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="rgba(60,32,10,.0)"/><stop offset="100%" stop-color="rgba(60,32,10,.55)"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<g class="keks-links">' +
    '<path d="M70,14 C42,10 16,30 12,60 C11,70 16,76 24,74 C38,70 52,74 62,66 C68,61 70,40 70,14 Z" fill="url(#keksgold)"/>' +
    '<path d="M70,14 C50,26 40,44 42,66 L62,66 C68,61 70,40 70,14 Z" fill="url(#keksfalz)" opacity=".5"/>' +
    '</g>' +
    '<g class="keks-rechts">' +
    '<path d="M70,14 C98,10 124,30 128,60 C129,70 124,76 116,74 C102,70 88,74 78,66 C72,61 70,40 70,14 Z" fill="url(#keksgold)"/>' +
    '<path d="M70,14 C90,26 100,44 98,66 L78,66 C72,61 70,40 70,14 Z" fill="url(#keksfalz)" opacity=".5"/>' +
    '</g>' +
    '<path class="keks-riss" d="M70,12 L67,28 L73,44 L68,58 L71,70" stroke="rgba(40,20,6,.7)" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0"/>';
  return s;
}

function keksGanzZeigen(platz, stand) {
  const svg = _keksSvg();
  const halter = el('button', { class: 'keks' },
    svg,
    el('p', { class: 'winzig still', style: { marginTop: '4px' } }, 'Ein Glückskeks für dich')
  );

  let geknackt = false;
  halter.addEventListener('click', () => {
    if (geknackt) return;
    geknackt = true;

    tonSpielen('knack');
    puls('hinweis');
    svg.querySelector('.keks-riss').style.opacity = '1';
    svg.querySelector('.keks-links').classList.add('bricht-links');
    svg.querySelector('.keks-rechts').classList.add('bricht-rechts');

    /* Krümel stieben aus der Bruchstelle. */
    const kiste = halter.getBoundingClientRect();
    for (let i = 0; i < 9; i++) {
      const kruemel = el('div', { class: 'kruemel' });
      kruemel.style.left = (kiste.left + kiste.width / 2 + (Math.random() * 16 - 8)) + 'px';
      kruemel.style.top = (kiste.top + kiste.height / 2 - 10) + 'px';
      kruemel.style.setProperty('--kx', (Math.random() * 90 - 45) + 'px');
      kruemel.style.setProperty('--ky', (30 + Math.random() * 50) + 'px');
      kruemel.style.animationDelay = (Math.random() * 0.08) + 's';
      document.body.append(kruemel);
      setTimeout(() => kruemel.remove(), 900);
    }

    setTimeout(() => {
      stand.stand = 'geknackt';
      Gerät.schreib('keksHeute', stand);
      keksGeknacktZeigen(platz, stand, true);
    }, 620);
  });

  langerDruck(halter, () => keksSchreiben(platz));
  platz.append(halter);
}

/* --- Geknackt: der Zettel schaut heraus ------------------------------------ */

function keksGeknacktZeigen(platz, stand, frisch = false) {
  platz.innerHTML = '';

  const zettel = el('div', { class: 'kekszettel' + (frisch ? ' taucht-auf' : '') }, '· · ·');

  const svg = _keksSvg();
  svg.querySelector('.keks-links').setAttribute('transform', 'rotate(-14 40 60) translate(-14 4)');
  svg.querySelector('.keks-rechts').setAttribute('transform', 'rotate(14 100 60) translate(14 4)');

  const halter = el('button', { class: 'keks' },
    el('div', { style: { position: 'relative', display: 'grid', placeItems: 'center' } }, svg, zettel),
    el('p', { class: 'winzig still', style: { marginTop: '4px' } }, 'Zieh den Zettel')
  );

  halter.addEventListener('click', () => {
    tonSpielen('papier');
    stand.stand = 'gelesen';
    Gerät.schreib('keksHeute', stand);
    keksGelesenZeigen(platz, stand, true);
  });

  platz.append(halter);
}

/* --- Gelesen: der aufgefaltete Zettel -------------------------------------- */

function keksGelesenZeigen(platz, stand, frisch = false) {
  platz.innerHTML = '';

  const KATEGORIE_WORT = {
    romantisch: 'Romantisch', dreckig: 'Dreckig', dominant: 'Von oben',
    submissiv: 'Zur Erinnerung', teasing: 'Teasing', warm: 'Warm',
    frech: 'Frech', nachdenklich: 'Nachdenklich', motivation: 'Fürs Training',
    wildcard: 'Wildcard', eigen: null,
  };

  const marke = stand.kategorie === 'eigen' && stand.von
    ? 'Von ' + nameVon(stand.von)
    : (KATEGORIE_WORT[stand.kategorie] || 'Glückskeks');

  const karte = el('div', { class: 'keksoffen' + (frisch ? ' faltet-auf' : '') },
    el('p', { class: 'winzig', style: { color: 'rgba(90,60,25,.6)', marginBottom: '7px' } }, marke),
    el('p', { class: 'zier', style: { fontSize: '16.5px', fontStyle: 'italic', lineHeight: '1.5', color: '#3a2a16' } },
      stand.text),
    el('p', { class: 'winzig', style: { marginTop: '8px', color: 'rgba(90,60,25,.4)' } }, 'Tippen für den nächsten')
  );

  /* Gelesen und getippt: der Zettel verweht, ein neuer Keks liegt da. */
  karte.addEventListener('click', async () => {
    karte.style.transition = 'opacity .28s ease, transform .28s ease';
    karte.style.opacity = '0';
    karte.style.transform = 'rotate(-.6deg) translateY(8px)';
    tonSpielen('tick');
    const eigene = await datenListe('keks').catch(() => []);
    const keks = _keksZiehen(eigene);
    setTimeout(() => {
      platz.innerHTML = '';
      if (!keks) return;
      const neu = { tag: tagstempel(), text: keks.text, kategorie: keks.kategorie, von: keks.von || null, stand: 'ganz' };
      Gerät.schreib('keksHeute', neu);
      keksGanzZeigen(platz, neu);
    }, 290);
  });

  langerDruck(karte, () => keksSchreiben(platz));
  platz.append(karte);
}

/* --- Eigene Sprüche -------------------------------------------------------- */

function keksSchreiben(platz) {
  eingabeBlatt({
    titel: 'Ein eigener Spruch',
    hinweis: 'Landet im Glas und taucht doppelt so oft auf wie die aus dem Vorrat. ' +
      'Wer ihn zieht, sieht, dass er von dir kommt.',
    platzhalter: '…',
    mehrzeilig: true,
    jaText: 'Ins Glas',
  }, async (text) => {
    for (const zeile of text.split('\n').map((z) => z.trim()).filter(Boolean)) {
      await datenAnhaengen('keks', { text: zeile });
    }
    meldung('Liegt im Glas.');
  });
}
