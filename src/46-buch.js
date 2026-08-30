/* ==========================================================================
   46-buch.js — Das Buch.

   Kein Fitness-Tracker. Ein paar Zeichen je Abend, und nach einem Jahr
   steht da etwas, das sich zu lesen lohnt.
   ========================================================================== */

const STIMMUNGEN = ['Glut', 'Frech', 'Weich', 'Atemlos', 'Dunkel', 'Still', 'Zart', 'Wild'];

SEITEN.buch = function (seite) {
  seite.append(kopfzeile('Buch',
    el('button', { class: 'winzig still', onclick: () => logAnlegen() }, '+ Eintrag')
  ));

  const warmplatz = el('div', { class: 'abschnitt' });
  const listeplatz = el('div', { class: 'abschnitt' });
  seite.append(warmplatz, listeplatz);

  const stopp = datenHorch('log', (liste) => {
    waermeZeichnen(warmplatz, liste);
    logListeZeichnen(listeplatz, liste);
  });
  beimVerlassen(stopp);
};

/* --- Die Wärmekarte ------------------------------------------------------- */

/* Wie der Beitragskalender bei GitHub, aber statt grün/grau in Stufen von
   Glut. Auf einen Blick: wann war Feuer, wann war Ruhe. */

function waermeZeichnen(platz, liste) {
  platz.innerHTML = '';

  const proTag = {};
  liste.forEach((e) => {
    const t = e.tag || tagstempel(e.wann);
    proTag[t] = Math.max(proTag[t] || 0, e.flammen || 1);
  });

  const WOCHEN = 20;
  const heute = new Date();
  heute.setHours(12, 0, 0, 0);
  /* Der Raster beginnt an einem Montag, damit die Spalten Wochen sind. */
  const versatz = (heute.getDay() + 6) % 7;
  const start = new Date(heute.getTime() - (versatz + (WOCHEN - 1) * 7) * 86400000);

  const raster = el('div', {
    style: {
      display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column',
      gridAutoColumns: '1fr', gap: '3px', width: '100%',
    },
  });

  const farben = [
    'var(--flaeche)',
    'rgba(143, 79, 54, .45)',
    'rgba(176, 106, 76, .7)',
    'rgba(196, 120, 90, .88)',
    'rgba(219, 148, 108, 1)',
    'rgba(232, 168, 124, 1)',
  ];

  for (let i = 0; i < WOCHEN * 7; i++) {
    const tag = new Date(start.getTime() + i * 86400000);
    const stempel = tagstempel(tag.getTime());
    const stufe = proTag[stempel] || 0;
    const kuenftig = tag > heute;

    raster.append(el('div', {
      title: stempel,
      style: {
        aspectRatio: '1', borderRadius: '3px',
        background: kuenftig ? 'transparent' : farben[Math.min(stufe, 5)],
        border: stufe > 3 ? '1px solid rgba(232,168,124,.4)' : 'none',
        opacity: kuenftig ? '.18' : '1',
        boxShadow: stufe >= 4 ? '0 0 8px -2px var(--schein)' : 'none',
      },
    }));
  }

  platz.append(
    el('div', { class: 'karte' },
      raster,
      el('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '11px' } },
        el('span', { class: 'winzig still' }, WOCHEN + ' Wochen'),
        el('span', { class: 'winzig still' }, Object.keys(proTag).length + ' Einträge')
      )
    )
  );
}

/* --- Die Einträge --------------------------------------------------------- */

function logListeZeichnen(platz, liste) {
  platz.innerHTML = '';

  if (!liste.length) {
    platz.append(leerlauf('Noch leer', 'Nach dem nächsten Mal ein paar Zeichen — mehr braucht es nicht.'));
    return;
  }

  const neuste = liste.slice().reverse();
  let letzterMonat = '';

  neuste.forEach((e) => {
    const wann = e.wann;
    const monat = new Date(wann).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    if (monat !== letzterMonat) {
      letzterMonat = monat;
      platz.append(el('p', { class: 'winzig still', style: { margin: '20px 0 9px 2px' } }, monat));
    }

    const karte = el('div', { class: 'karte', style: { display: 'flex', gap: '13px', alignItems: 'flex-start' } },
      el('div', { class: 'zier', style: { fontSize: '14px', lineHeight: '1.3', color: 'var(--glut-hell)', minWidth: '46px' } }, e.stimmung || '·'),
      el('div', { style: { flex: '1', minWidth: '0' } },
        el('div', {}, glutPunkte(Math.max(1, Math.min(5, e.flammen || 1)))),
        e.satz ? el('p', { style: { marginTop: '6px', whiteSpace: 'pre-wrap' } }, e.satz) : null,
        el('p', { class: 'winzig still', style: { marginTop: '7px' } },
          new Date(wann).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'short' }) +
          ' · ' + nameVon(e.von))
      )
    );

    langerDruck(karte, async () => {
      const weg = await frage('Eintrag löschen?', '', 'Löschen', true);
      if (weg) await datenEintragLoeschen('log', e.id);
    });

    platz.append(karte);
  });
}

/* --- Einen Eintrag anlegen ------------------------------------------------ */

function logAnlegen() {
  let flammen = 3;
  let stimmung = '';

  const flammreihe = el('div', { style: { display: 'flex', gap: '7px', justifyContent: 'center', margin: '4px 0 6px' } });
  const zeichneFlammen = () => {
    flammreihe.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      flammreihe.append(el('button', {
        style: {
          fontSize: '27px', padding: '5px', opacity: i <= flammen ? '1' : '.22',
          transition: 'opacity .16s ease, transform .16s ease',
          transform: i <= flammen ? 'none' : 'scale(.86)',
        },
        onclick: () => { flammen = i; zeichneFlammen(); puls('hinweis'); },
      }, el('span', { style: { color: 'var(--glut-hell)' } }, sinnbild('flamme', 26))));
    }
  };
  zeichneFlammen();

  const stimmreihe = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '7px', justifyContent: 'center' } });
  const zeichneStimmung = () => {
    stimmreihe.innerHTML = '';
    STIMMUNGEN.forEach((s) => {
      stimmreihe.append(el('button', {
        style: {
          fontSize: '13.5px', padding: '9px 12px', borderRadius: '11px',
          border: '1px solid ' + (stimmung === s ? 'rgba(196,120,90,.5)' : 'transparent'),
          background: stimmung === s ? 'var(--flaeche-hoch)' : 'transparent',
          opacity: stimmung === s ? '1' : '.5',
        },
        onclick: () => { stimmung = stimmung === s ? '' : s; zeichneStimmung(); },
      }, s));
    });
  };
  zeichneStimmung();

  const satz = el('textarea', { class: 'feld', rows: 2, placeholder: 'Ein Satz, der bleibt.', style: { marginTop: '15px' } });

  const b = blatt(
    el('h2', { class: 'mitte' }, 'Wie war es?'),
    el('div', { style: { height: '14px' } }),
    flammreihe,
    el('p', { class: 'winzig still mitte', style: { margin: '10px 0 9px' } }, 'Und wie fühlst du dich?'),
    stimmreihe,
    satz,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          b.schliessen();
          await datenAnhaengen('log', {
            tag: tagstempel(), flammen, stimmung, satz: satz.value.trim(),
          });
          paarXp(10);
          meldung('Steht im Buch.');
        },
      }, 'Eintragen')
    )
  );
}
