/* ==========================================================================
   44e-rubbeln.js — Rubbellose.

   Sie legt etwas darunter, er rubbelt es frei. Das Haptische ist der Punkt:
   Ein Knopf, der dasselbe enthüllt, fühlt sich nicht annähernd gleich an.

   Technisch: eine Leinwand über dem Inhalt, aus der der Finger Löcher
   radiert. Wenn genug weg ist, verschwindet der Rest von selbst — niemand
   soll das letzte Eckchen suchen müssen.
   ========================================================================== */

SEITEN.rubbeln = function (seite) {
  seite.append(kopfzeile('Lose',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('lose', (lose) => loseZeichnen(platz, lose));
  beimVerlassen(stopp);
};

function loseZeichnen(platz, lose) {
  platz.innerHTML = '';

  const offen = lose.filter((l) => !l.aufgedeckt);
  const alte = lose.filter((l) => l.aufgedeckt);

  if (!offen.length) {
    platz.append(leerlauf('Keine Lose',
      istDomme() ? 'Leg eins an — er sieht nur, dass es da ist.' : 'Gerade liegt keins bereit.'));
  }

  offen.forEach((los) => {
    const karte = el('button', {
      class: 'karte glimmt',
      style: {
        width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
        textAlign: 'left', marginTop: '9px',
      },
      onclick: () => losOeffnen(los),
    },
      el('div', {
        style: {
          width: '46px', height: '46px', flex: 'none', borderRadius: '11px',
          background: 'var(--verlauf)', display: 'grid', placeItems: 'center',
          fontSize: '20px',
        },
      }, '✦'),
      el('div', { style: { flex: '1' } },
        el('div', { class: 'zier', style: { fontSize: '17px' } }, los.titel || 'Ein Los'),
        el('div', { class: 'still klein' }, 'noch zugedeckt')
      )
    );
    if (istDomme()) langerDruck(karte, async () => {
      const weg = await frage('Los wegnehmen?', los.titel || '', 'Wegnehmen', true);
      if (weg) await datenEintragLoeschen('lose', los.id);
    });
    platz.append(karte);
  });

  if (istDomme()) {
    platz.append(el('button', {
      class: 'knopf leer breit', style: { marginTop: '12px' },
      onclick: losAnlegen,
    }, '+ Neues Los'));
  }

  if (alte.length) {
    platz.append(el('div', { class: 'trenner' }),
      el('p', { class: 'winzig still', style: { marginBottom: '9px' } }, 'Schon aufgedeckt'));
    alte.slice(-6).reverse().forEach((los) => {
      platz.append(el('div', { class: 'karte', style: { padding: '11px 13px' } },
        el('div', {}, los.text),
        el('p', { class: 'winzig still', style: { marginTop: '5px' } }, vorZeit(los.wann))
      ));
    });
  }
}

/* --- Das Rubbeln ---------------------------------------------------------- */

function losOeffnen(los) {
  const breite = 320;
  const hoehe = 190;

  const darunter = el('div', {
    style: {
      position: 'absolute', inset: '0', display: 'grid', placeItems: 'center',
      padding: '22px', textAlign: 'center', borderRadius: '16px',
      background: 'var(--flaeche-hoch)',
    },
  }, los.bild
      ? el('img', { src: los.bild, style: { maxWidth: '100%', maxHeight: '150px', borderRadius: '10px' } })
      : el('div', { class: 'zier', style: { fontSize: '21px', lineHeight: '1.3' } }, los.text));

  const tafel = el('canvas', {
    width: String(breite * 2), height: String(hoehe * 2),
    style: {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      borderRadius: '16px', touchAction: 'none', cursor: 'grab',
    },
  });

  const rahmen = el('div', {
    style: {
      position: 'relative', width: '100%', maxWidth: breite + 'px',
      height: hoehe + 'px', margin: '6px auto 0',
      borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 8px 30px -10px var(--schein)',
    },
  }, darunter, tafel);

  const hinweis = el('p', { class: 'still klein mitte', style: { marginTop: '14px' } }, 'Rubbel es frei.');

  const b = blatt(
    el('p', { class: 'winzig still mitte', style: { marginBottom: '4px' } }, los.titel || 'Ein Los'),
    rahmen, hinweis
  );

  /* Die Deckschicht: warmes Metall mit ein wenig Unruhe, damit es nicht
     nach einem grauen Rechteck aussieht. */
  const stift = tafel.getContext('2d');
  const verlauf = stift.createLinearGradient(0, 0, tafel.width, tafel.height);
  verlauf.addColorStop(0, '#8f5539');
  verlauf.addColorStop(0.5, '#c4785a');
  verlauf.addColorStop(1, '#7a4630');
  stift.fillStyle = verlauf;
  stift.fillRect(0, 0, tafel.width, tafel.height);

  stift.globalAlpha = 0.12;
  for (let i = 0; i < 900; i++) {
    stift.fillStyle = i % 2 ? '#000' : '#fff';
    stift.fillRect(Math.random() * tafel.width, Math.random() * tafel.height, 3, 3);
  }
  stift.globalAlpha = 1;

  stift.fillStyle = 'rgba(27,15,9,.55)';
  stift.font = '600 30px Inter, system-ui, sans-serif';
  stift.textAlign = 'center';
  stift.fillText('rubbeln', tafel.width / 2, tafel.height / 2 + 10);

  stift.globalCompositeOperation = 'destination-out';

  let rubbelt = false;
  let fertig = false;
  let letzte = null;

  const stelle = (e) => {
    const kasten = tafel.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return {
      x: (p.clientX - kasten.left) / kasten.width * tafel.width,
      y: (p.clientY - kasten.top) / kasten.height * tafel.height,
    };
  };

  const kratzen = (e) => {
    if (!rubbelt || fertig) return;
    e.preventDefault();
    const p = stelle(e);

    stift.lineWidth = 54;
    stift.lineCap = 'round';
    stift.lineJoin = 'round';
    stift.beginPath();
    if (letzte) { stift.moveTo(letzte.x, letzte.y); stift.lineTo(p.x, p.y); }
    else { stift.moveTo(p.x, p.y); stift.lineTo(p.x + 0.1, p.y); }
    stift.stroke();
    letzte = p;

    if (Math.random() < 0.13) puls('hinweis');
    if (Math.random() < 0.09) pruefen();
  };

  /* Wie viel ist schon weg? Eine Stichprobe reicht — jeden Punkt zu
     zählen wäre bei jedem Strich zu teuer. */
  function pruefen() {
    const daten = stift.getImageData(0, 0, tafel.width, tafel.height).data;
    let leer = 0, gezaehlt = 0;
    for (let i = 3; i < daten.length; i += 4 * 220) {
      gezaehlt++;
      if (daten[i] < 40) leer++;
    }
    if (gezaehlt && leer / gezaehlt > 0.52) enthuellen();
  }

  function enthuellen() {
    if (fertig) return;
    fertig = true;
    tafel.style.transition = 'opacity .5s ease';
    tafel.style.opacity = '0';
    hinweis.textContent = '';
    puls('antwortJa');
    setTimeout(() => tafel.remove(), 520);
    datenAendern('lose', los.id, { aufgedeckt: true, aufgedecktWann: jetzt() });
    if (!istDomme()) pushSenden('domme', 'hinweis', 'Er hat gerubbelt.');
  }

  tafel.addEventListener('pointerdown', (e) => { rubbelt = true; letzte = null; kratzen(e); });
  tafel.addEventListener('pointermove', kratzen);
  tafel.addEventListener('pointerup', () => { rubbelt = false; letzte = null; pruefen(); });
  tafel.addEventListener('pointerleave', () => { rubbelt = false; letzte = null; });
  tafel.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

/* --- Anlegen -------------------------------------------------------------- */

function losAnlegen() {
  let bild = null;
  const titel = el('input', { class: 'feld', placeholder: 'Was steht außen drauf?' });
  const text = el('textarea', { class: 'feld', rows: 3, placeholder: 'Was liegt darunter?', style: { marginTop: '9px' } });
  const vorschau = el('div');

  const dateiwahl = el('input', {
    type: 'file', accept: 'image/*', hidden: true,
    onchange: async (e) => {
      const datei = e.target.files[0];
      if (!datei) return;
      meldung('Verkleinere …');
      try {
        bild = await bildVerkleinern(datei, 900, 0.75);
        vorschau.innerHTML = '';
        vorschau.append(el('img', { src: bild, style: { width: '100%', borderRadius: '11px', marginTop: '10px' } }));
      } catch { meldung('Das Bild ließ sich nicht lesen.'); }
    },
  });

  const b = blatt(
    el('h2', {}, 'Neues Los'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Er sieht nur den Titel — bis er rubbelt.'),
    titel, text, vorschau, dateiwahl,
    el('button', { class: 'knopf leer breit', style: { marginTop: '11px' }, onclick: () => dateiwahl.click() },
      'Ein Bild darunter'),
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!text.value.trim() && !bild) return meldung('Darunter ist noch nichts.');
          b.schliessen();
          await datenAnhaengen('lose', {
            titel: titel.value.trim() || 'Ein Los',
            text: text.value.trim(),
            bild,
            aufgedeckt: false,
          });
          pushSenden('sub', 'hinweis', 'Ein Los liegt bereit.');
          meldung('Liegt bereit.');
        },
      }, 'Hinlegen')
    )
  );
  setTimeout(() => titel.focus(), 260);
}
