/* ==========================================================================
   50-ampel.js — Wie es gerade steht.

   Drei Farben, ein Tippen, keine Erklärung nötig. Der andere sieht es
   sofort — das erspart die Frage, die manchmal schwer zu stellen ist.
   ========================================================================== */

const AMPEL_WORTE = {
  gruen: 'Grün · ja',
  gelb: 'Gelb · vielleicht',
  rot: 'Rot · nicht jetzt',
};

const AMPEL_FARBEN = { gruen: 'var(--gruen)', gelb: 'var(--gelb)', rot: 'var(--rot)' };

const ampelWort = (farbe) => AMPEL_WORTE[farbe] || AMPEL_WORTE.gruen;

function ampelBlatt() {
  const meins = D.ampel[D.rolle] || 'gruen';
  const seins = D.ampel[andereRolle()] || 'gruen';

  const knopfFuer = (farbe, titel, unter) => el('button', {
    class: 'karte',
    style: {
      width: '100%', textAlign: 'left', display: 'flex', gap: '14px', alignItems: 'center',
      borderColor: meins === farbe ? AMPEL_FARBEN[farbe] : 'var(--kante)',
      background: meins === farbe ? 'var(--flaeche-hoch)' : 'var(--flaeche)',
      marginTop: '9px',
    },
    onclick: () => { b.schliessen(); ampelSetzen(farbe); },
  },
    el('span', {
      style: {
        width: '13px', height: '13px', borderRadius: '50%', flex: 'none',
        background: AMPEL_FARBEN[farbe],
        boxShadow: meins === farbe ? '0 0 12px ' + AMPEL_FARBEN[farbe] : 'none',
      },
    }),
    el('div', {},
      el('div', { style: { fontWeight: '500' } }, titel),
      el('div', { class: 'still klein' }, unter)
    )
  );

  const b = blatt(
    el('h2', {}, 'Wie geht\'s dir?'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 4px' } }, 'Ohne Worte. Er sieht es sofort.'),
    knopfFuer('gruen', 'Grün', 'Los.'),
    knopfFuer('gelb', 'Gelb', 'Vielleicht. Frag mich.'),
    knopfFuer('rot', 'Rot', 'Nicht jetzt. Alles hält an.'),
    el('div', { class: 'trenner' }),
    el('div', { style: { display: 'flex', alignItems: 'center', gap: '11px' } },
      el('span', {
        style: { width: '11px', height: '11px', borderRadius: '50%', background: AMPEL_FARBEN[seins] },
      }),
      el('span', { class: 'leise klein' }, nameVon(andereRolle()) + ': ' + ampelWort(seins))
    )
  );
}

async function ampelSetzen(farbe) {
  D.ampel[D.rolle] = farbe;
  leisteAuffrischen();
  await datenSchreib('ampel/' + D.rolle, { farbe, wann: jetzt() });
  if (typeof maschineEreignis === 'function') maschineEreignis('ampel', { rolle: D.rolle, farbe });

  if (farbe === 'rot') {
    ruheAn(true);
    pushSenden(andereRolle(), 'hinweis', 'Rot.');
  } else {
    if (D.ruhe && D.ampel[andereRolle()] !== 'rot') ruheAus();
    pushSenden(andereRolle(), 'hinweis');
  }
  meldung(ampelWort(farbe));
}

/* --- Der Ruhemodus -------------------------------------------------------- */

/* Rot heißt nicht „bitte langsamer", sondern: es hört jetzt auf. Ein
   offener Befehl verschwindet, Uhren halten an, die App wird warm und
   leise. Das ist der Grund, warum der Rest überhaupt geht. */

function ruheAn(vonMir) {
  D.ruhe = true;
  stimmungSetzen();
  befehlSchliessen();

  const schirm = el('div', {
    id: 'ruheschirm',
    style: {
      position: 'fixed', inset: '0', zIndex: '780', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '20px', padding: '40px 32px', textAlign: 'center',
      background: 'linear-gradient(170deg, #241c16, #14100e 70%)',
      animation: 'deckelAn .4s ease',
    },
  },
    el('div', { class: 'zier', style: { fontSize: '27px', color: '#e8dcc8' } },
      vonMir ? 'Alles hält an.' : nameVon(andereRolle()) + ' hat Rot gesetzt.'),
    el('p', { class: 'leise', style: { maxWidth: '26ch', lineHeight: '1.5' } },
      vonMir ? 'Nichts läuft weiter. Nimm dir die Zeit, die du brauchst.'
        : 'Nichts läuft weiter. Sie sagt Bescheid, wenn es wieder geht.'),
    el('button', {
      class: 'knopf leer', style: { marginTop: '14px', minWidth: '180px' },
      onclick: () => { const s = $('#ruheschirm'); if (s) s.remove(); },
    }, 'Weiter zur App')
  );

  const alter = $('#ruheschirm');
  if (alter) alter.remove();
  document.body.append(schirm);
  puls('hinweis');
}

function ruheAus() {
  D.ruhe = false;
  const s = $('#ruheschirm');
  if (s) s.remove();
  stimmungSetzen();
}

/* --- Zuhören -------------------------------------------------------------- */

let _ampelHorcherLaeuft = false;

function ampelHorcherStarten() {
  if (_ampelHorcherLaeuft) return;
  _ampelHorcherLaeuft = true;
  /* Eine Leitung für beide Farben: Jede offene Verbindung kostet auf dem
     Handy Strom, und hier reicht wirklich eine. */
  ablageHorch('ampel', async () => {
    for (const rolle of ['domme', 'sub']) {
      const stand = await datenLies('ampel/' + rolle);
      if (!stand) continue;
      const vorher = D.ampel[rolle];
      D.ampel[rolle] = stand.farbe;

      if (rolle === andereRolle() && stand.farbe !== vorher) {
        if (stand.farbe === 'rot') ruheAn(false);
        else if (D.ruhe && D.ampel[D.rolle] !== 'rot') ruheAus();
        else meldung(nameVon(rolle) + ': ' + ampelWort(stand.farbe));
      }
    }
    leisteAuffrischen();
  }).catch(() => {});
}

async function ampelLaden() {
  for (const rolle of ['domme', 'sub']) {
    const stand = await datenLies('ampel/' + rolle);
    if (stand) D.ampel[rolle] = stand.farbe;
  }
  if (D.ampel.domme === 'rot' || D.ampel.sub === 'rot') {
    D.ruhe = true;
    stimmungSetzen();
  }
}
