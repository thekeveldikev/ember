/* ==========================================================================
   56-rituale.js — Was wiederkehrt.

     Rituale    Feste Punkte im Tag. Nicht abhaken — einhalten.
     Countdowns Vorfreude, sichtbar gemacht.
     Damals     Was an diesem Tag in früheren Jahren war.

   Der Unterschied zwischen einem Ritual und einer Aufgabe: Eine Aufgabe
   ist irgendwann erledigt. Ein Ritual ist nie fertig — es hat nur eine
   Serie, die läuft oder reißt.
   ========================================================================== */

SEITEN.rituale = function (seite) {
  seite.append(kopfzeile('Rituale',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  const ritualplatz = el('div', { class: 'abschnitt' });
  const countplatz = el('div', { class: 'abschnitt' });
  const damalsplatz = el('div', { class: 'abschnitt' });
  seite.append(ritualplatz, countplatz, damalsplatz);

  const s1 = datenHorch('rituale', (liste) => ritualeZeichnen(ritualplatz, liste));
  const s2 = datenHorch('countdowns', (liste) => countdownsZeichnen(countplatz, liste));
  const s3 = datenHorch('log', (liste) => damalsZeichnen(damalsplatz, liste));

  beimVerlassen(s1); beimVerlassen(s2); beimVerlassen(s3);
};

/* --- Rituale -------------------------------------------------------------- */

/* Die Serie zählt, wie viele Tage in Folge eingehalten wurde. Sie reißt,
   wenn ein Tag ausgelassen wird — aber nur einer: Wer gestern und heute
   dabei war, hat eine Zwei, auch wenn vorgestern nichts war. */

function serieAus(tage) {
  const menge = new Set(tage || []);
  let serie = 0;
  const lauf = new Date();
  lauf.setHours(12, 0, 0, 0);

  /* Heute darf noch offen sein, ohne die Serie zu brechen. */
  if (!menge.has(tagstempel(lauf.getTime()))) lauf.setDate(lauf.getDate() - 1);

  while (menge.has(tagstempel(lauf.getTime()))) {
    serie++;
    lauf.setDate(lauf.getDate() - 1);
  }
  return serie;
}

function ritualeZeichnen(platz, liste) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Rituale',
    istDomme() ? el('button', { class: 'winzig still', onclick: ritualAnlegen }, '+ Neu') : null
  ));

  if (!liste.length) {
    platz.append(leerlauf('Noch keine',
      istDomme() ? 'Ein Morgengruß. Ein Abend-Blick. Etwas, das jeden Tag gleich abläuft.'
        : 'Noch nichts festgelegt.'));
    return;
  }

  const heute = tagstempel();

  liste.forEach((r) => {
    const tage = r.tage || [];
    const heuteSchon = tage.includes(heute);
    const serie = serieAus(tage);

    const karte = el('div', { class: 'karte' + (heuteSchon ? ' glimmt' : ''), style: { marginTop: '9px' } },
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' } },
        el('div', { style: { flex: '1' } },
          el('div', { class: 'zier', style: { fontSize: '17px' } }, r.titel),
          r.zeit ? el('p', { class: 'winzig still', style: { marginTop: '3px' } }, r.zeit + ' Uhr') : null,
          r.text ? el('p', { class: 'leise klein', style: { marginTop: '5px' } }, r.text) : null
        ),
        serie > 0
          ? el('div', { style: { textAlign: 'center', flex: 'none' } },
              el('div', { class: 'zier glutschrift', style: { fontSize: '25px', lineHeight: '1' } }, String(serie)),
              el('div', { class: 'winzig still' }, serie === 1 ? 'Tag' : 'Tage')
            )
          : null
      ),

      /* Die letzten vierzehn Tage als Punktreihe — man sieht sofort,
         wo es gerissen ist. */
      el('div', { style: { display: 'flex', gap: '4px', marginTop: '13px' } },
        ...Array.from({ length: 14 }, (_, i) => {
          const tag = new Date();
          tag.setHours(12, 0, 0, 0);
          tag.setDate(tag.getDate() - (13 - i));
          const stempel = tagstempel(tag.getTime());
          const dabei = tage.includes(stempel);
          return el('div', {
            title: stempel,
            style: {
              flex: '1', height: '6px', borderRadius: '2px',
              background: dabei ? 'var(--verlauf)' : 'var(--grund2)',
              boxShadow: dabei ? 'none' : 'inset 0 0 0 1px var(--kante)',
            },
          });
        })
      ),

      !heuteSchon
        ? el('button', {
            class: 'knopf leer breit', style: { marginTop: '13px', minHeight: '38px', fontSize: '13px' },
            onclick: async () => {
              const neue = [...tage, heute].slice(-400);
              await datenAendern('rituale', r.id, { tage: neue });
              paarXp(2);
              puls('antwortJa');
              const neueSerie = serieAus(neue);
              meldung(neueSerie > 1 ? neueSerie + ' Tage in Folge.' : 'Eingehalten.');
            },
          }, 'Eingehalten')
        : el('p', { class: 'winzig', style: { marginTop: '11px', color: 'var(--glut-hell)' } }, 'Heute erledigt.')
    );

    if (istDomme()) langerDruck(karte, async () => {
      const weg = await frage('Ritual wegnehmen?', r.titel, 'Wegnehmen', true);
      if (weg) await datenEintragLoeschen('rituale', r.id);
    });

    platz.append(karte);
  });
}

function ritualAnlegen() {
  const titel = el('input', { class: 'feld', placeholder: 'Was wiederholt sich?' });
  const zeit = el('input', { class: 'feld', type: 'time', style: { marginTop: '9px' } });
  const text = el('textarea', { class: 'feld', rows: 2, placeholder: 'Wie läuft es ab?', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Ein Ritual'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Nichts zum Abhaken. Etwas, das jeden Tag stattfindet.'),
    titel,
    el('label', { class: 'feldmarke', style: { marginTop: '15px' } }, 'Um wie viel Uhr (freiwillig)'),
    zeit, text,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!titel.value.trim()) return meldung('Ein Titel fehlt.');
          b.schliessen();
          await datenAnhaengen('rituale', {
            titel: titel.value.trim(),
            zeit: zeit.value || '',
            text: text.value.trim(),
            tage: [],
          });
          pushSenden('sub', 'regel');
          meldung('Steht.');
        },
      }, 'Festlegen')
    )
  );
  setTimeout(() => titel.focus(), 260);
}

/* --- Countdowns ----------------------------------------------------------- */

function countdownsZeichnen(platz, liste) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Bis dahin',
    el('button', { class: 'winzig still', onclick: countdownAnlegen }, '+ Neu')
  ));

  const kommend = liste.filter((c) => (c.wann_ziel || 0) > jetzt())
    .sort((a, b) => a.wann_ziel - b.wann_ziel);

  if (!kommend.length) {
    platz.append(leerlauf('Nichts in Sicht', 'Ein Wochenende, ein Jahrestag, eine Heimkehr.'));
    return;
  }

  kommend.forEach((c) => {
    const uebrig = c.wann_ziel - jetzt();
    const tage = Math.floor(uebrig / 86400000);
    const stunden = Math.floor((uebrig % 86400000) / 3600000);

    const karte = el('div', { class: 'karte' + (tage < 2 ? ' glimmt' : ''), style: { marginTop: '9px', textAlign: 'center' } },
      el('p', { class: 'winzig still' }, c.titel),
      el('div', { class: 'zier glutschrift', style: { fontSize: '40px', lineHeight: '1.15', margin: '5px 0' } },
        tage > 0 ? String(tage) : dauerText(uebrig)),
      el('p', { class: 'leise klein' },
        tage > 0
          ? (tage === 1 ? 'Tag' : 'Tage') + (stunden ? ' und ' + stunden + ' Std' : '')
          : 'heute'),
      el('p', { class: 'winzig still', style: { marginTop: '7px' } },
        new Date(c.wann_ziel).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }))
    );

    langerDruck(karte, async () => {
      const weg = await frage('Wegnehmen?', c.titel, 'Wegnehmen', true);
      if (weg) await datenEintragLoeschen('countdowns', c.id);
    });

    platz.append(karte);
  });
}

function countdownAnlegen() {
  const titel = el('input', { class: 'feld', placeholder: 'Worauf freut ihr euch?' });
  const wann = el('input', { class: 'feld', type: 'datetime-local', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Bis dahin'),
    el('div', { style: { height: '12px' } }),
    titel, wann,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!titel.value.trim() || !wann.value) return meldung('Titel und Zeitpunkt fehlen.');
          b.schliessen();
          /* Das Zielfeld heißt bewusst nicht `wann` — das gehört der
             Hülle jedes Eintrags und würde überschrieben. */
          await datenAnhaengen('countdowns', {
            titel: titel.value.trim(),
            wann_ziel: new Date(wann.value).getTime(),
          });
          meldung('Läuft.');
        },
      }, 'Anlegen')
    )
  );
  setTimeout(() => titel.focus(), 260);
}

/* --- Damals --------------------------------------------------------------- */

/* Was an diesem Kalendertag in früheren Jahren im Buch stand. Braucht
   Geduld: Im ersten Jahr steht hier nichts. Danach jedes Jahr mehr. */

function damalsZeichnen(platz, log) {
  const heute = new Date();
  const tag = heute.getDate();
  const monat = heute.getMonth();
  const jahr = heute.getFullYear();

  const damals = log.filter((e) => {
    const d = new Date(e.wann);
    return d.getDate() === tag && d.getMonth() === monat && d.getFullYear() < jahr;
  });

  platz.innerHTML = '';
  if (!damals.length) return;

  platz.append(kopfzeile('An diesem Tag'));

  damals.reverse().forEach((e) => {
    const jahreHer = jahr - new Date(e.wann).getFullYear();
    platz.append(el('div', { class: 'karte', style: { marginTop: '9px' } },
      el('p', { class: 'winzig still', style: { marginBottom: '7px' } },
        'vor ' + jahreHer + (jahreHer === 1 ? ' Jahr' : ' Jahren')),
      el('div', { style: { display: 'flex', gap: '12px', alignItems: 'flex-start' } },
        el('div', { style: { fontSize: '20px' } }, e.stimmung || '·'),
        el('div', { style: { flex: '1' } },
          el('div', { style: { color: 'var(--glut-hell)', fontSize: '12px', letterSpacing: '.1em' } },
            '🔥'.repeat(Math.max(1, Math.min(5, e.flammen || 1)))),
          e.satz ? el('p', { style: { marginTop: '5px' } }, e.satz) : null
        )
      )
    ));
  });
}
