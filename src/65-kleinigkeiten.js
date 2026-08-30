/* ==========================================================================
   65-kleinigkeiten.js — Die Kleinigkeiten mit großer Wirkung.

   Timer-Bibliothek und Zufalls-Timer · das eigene Glossar · die
   Körperkarte · der Reparatur-Modus · das Toy-Regal · die Frage des
   Tages. Jedes für sich klein — zusammen machen sie die App erwachsen.
   ========================================================================== */

/* Die Haptik-Sprache wird reicher: Er lernt am Muster, was passiert ist,
   ohne aufs Display zu sehen. */
PULS.belohnung = [100, 50, 100, 50, 300];
PULS.strafe = [400];
PULS.timerEnde = [300, 150, 300];

/* --- Timer ----------------------------------------------------------------- */

SEITEN.timer = function (seite) {
  seite.append(kopfzeile('Timer',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { margin: '0 0 14px', lineHeight: '1.5' } },
    'Ein Tipp, und die Zeit läuft — groß, aus zwei Metern lesbar. ' +
    'Der Zufalls-Timer verrät nicht, wie lange: Er endet, wenn er endet.'));

  const gitter = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' } });
  [5, 10, 15, 20, 30, 45].forEach((min) => {
    gitter.append(el('button', {
      class: 'karte', style: { textAlign: 'center', padding: '18px 8px' },
      onclick: () => timerLaufen(min * 60000, min + ' Minuten'),
    },
      el('div', { class: 'zier glutschrift', style: { fontSize: '24px' } }, String(min)),
      el('div', { class: 'winzig still' }, 'Minuten')
    ));
  });
  seite.append(gitter);

  seite.append(
    el('div', { class: 'trenner' }),
    el('button', {
      class: 'knopf glut breit',
      onclick: () => {
        /* Zwischen 3 und 20 Minuten — niemand weiß es, auch wir nicht. */
        const ms = (3 + Math.random() * 17) * 60000;
        timerLaufen(ms, null);
      },
    }, 'Zufalls-Timer — Dauer unbekannt'),
    el('p', { class: 'still klein mitte', style: { marginTop: '8px' } },
      'Zwischen 3 und 20 Minuten. Ihr seht nur, DASS er läuft.')
  );
};

function timerLaufen(ms, marke) {
  const blind = marke === null;
  const ende = jetzt() + ms;

  const ziffern = el('div', { class: 'uhr', style: { fontSize: '64px' } });
  const schirm = el('div', { class: 'befehl', style: { zIndex: '740', gap: '18px' } },
    el('p', { class: 'winzig', style: { color: 'rgba(232,168,124,.55)', letterSpacing: '.3em' } },
      blind ? 'ES LÄUFT' : marke.toUpperCase()),
    blind ? el('div', { class: 'funke', style: { width: '18px', height: '18px', margin: '14px auto' } }) : ziffern,
    el('button', {
      class: 'knopf leer', style: { minWidth: '170px' },
      onclick: () => { clearInterval(takt); zu(); },
    }, 'Abbrechen')
  );
  document.body.append(schirm);
  tonSpielen('tick');

  const zu = () => {
    schirm.style.animation = 'befehlAn .26s ease reverse';
    setTimeout(() => schirm.remove(), 240);
  };

  const takt = setInterval(() => {
    const uebrig = ende - jetzt();
    if (uebrig <= 0) {
      clearInterval(takt);
      if (blind) {
        schirm.innerHTML = '';
        schirm.append(
          el('div', { class: 'zier glutschrift', style: { fontSize: '40px' } }, 'Zeit.'),
          el('button', { class: 'knopf glut', style: { minWidth: '170px', marginTop: '20px' }, onclick: zu }, 'Gut')
        );
      } else {
        ziffern.textContent = '00:00';
        ziffern.style.color = 'var(--rot)';
        setTimeout(zu, 2500);
      }
      puls('timerEnde');
      tonSpielen('gong');
      return;
    }
    if (!blind) ziffern.textContent = dauerText(uebrig);
  }, 500);
}

/* --- Das Glossar ----------------------------------------------------------- */

SEITEN.glossar = function (seite) {
  seite.append(kopfzeile('Unsere Wörter',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));
  seite.append(el('p', { class: 'leise klein', style: { margin: '0 0 14px', lineHeight: '1.5' } },
    'Jedes Paar erfindet eigene Wörter, Zeichen und Abkürzungen. Hier stehen unsere — damit nie jemand raten muss, was gemeint war.'));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('glossar', (liste) => {
    platz.innerHTML = '';
    if (!liste.length) {
      platz.append(leerlauf('Noch leer', 'Legt euer erstes Wort an — mit dem, was es nur zwischen euch bedeutet.'));
    }
    liste.forEach((w) => {
      const zeile = el('div', { class: 'karte', style: { marginTop: '9px', padding: '12px 15px' } },
        el('div', { class: 'zier', style: { fontSize: '17px' } }, w.begriff),
        el('div', { class: 'leise klein', style: { marginTop: '3px' } }, w.bedeutung),
        el('div', { class: 'winzig still', style: { marginTop: '5px' } }, (w.kategorie || 'Insider') + ' · von ' + nameVon(w.von))
      );
      langerDruck(zeile, async () => {
        const weg = await frage('Wort streichen?', w.begriff, 'Streichen', true);
        if (weg) await datenEintragLoeschen('glossar', w.id);
      });
      platz.append(zeile);
    });
    platz.append(el('button', { class: 'knopf leer breit', style: { marginTop: '12px' }, onclick: glossarAnlegen }, '+ Ein Wort'));
  });
  beimVerlassen(stopp);
};

function glossarAnlegen() {
  const begriff = el('input', { class: 'feld', placeholder: 'Das Wort' });
  const bedeutung = el('textarea', { class: 'feld', rows: 2, placeholder: 'Was es bei uns heißt', style: { marginTop: '9px' } });
  const kategorie = el('select', { class: 'feld', style: { marginTop: '9px' } },
    ...['Anrede', 'Signal', 'Handlung', 'Zustand', 'Regel', 'Insider'].map((k) => el('option', { value: k }, k)));

  const b = blatt(
    el('h2', {}, 'Ein Wort von uns'),
    el('div', { style: { height: '10px' } }),
    begriff, bedeutung, kategorie,
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '16px' },
      onclick: async () => {
        if (!begriff.value.trim() || !bedeutung.value.trim()) return meldung('Wort und Bedeutung — beides.');
        b.schliessen();
        await datenAnhaengen('glossar', {
          begriff: begriff.value.trim(), bedeutung: bedeutung.value.trim(), kategorie: kategorie.value,
        });
        meldung('Gehört jetzt uns.');
      },
    }, 'Aufnehmen')
  );
  setTimeout(() => begriff.focus(), 260);
}

/* --- Die Frage des Tages --------------------------------------------------- */

/* Absichtlich nichts Heißes: eine Frage am Tag, die die Beziehung neben
   der Dynamik am Laufen hält. Antworten werden erst sichtbar, wenn beide
   geantwortet haben. */

const CHECKIN_FRAGEN = [
  'Was hat dich heute gestresst?',
  'Was hat dich heute gefreut?',
  'Was brauchst du gerade von mir?',
  'Worauf freust du dich diese Woche?',
  'Was hätte deinen Tag heute besser gemacht?',
  'Wann hast du dich mir heute nah gefühlt?',
  'Was beschäftigt dich, worüber wir noch nicht geredet haben?',
  'Was hast du heute gut gemacht?',
  'Wovon hättest du gern mehr in unserem Alltag?',
  'Was war heute dein kleinster schöner Moment?',
  'Gibt es etwas, das du mir schon länger sagen willst?',
  'Wie voll ist dein Akku gerade, ehrlich?',
  'Was würdest du heute Abend am liebsten machen — egal wie unrealistisch?',
  'Wofür bist du mir gerade dankbar?',
  'Was wünschst du dir für morgen?',
  'Welche Sorge darf ich dir kurz abnehmen?',
  'Was hat dich heute zum Lachen gebracht?',
  'Womit habe ich dich zuletzt überrascht?',
  'Was sollten wir öfter tun?',
  'Was sollten wir seltener tun?',
  'Wie geht es dir mit uns — in einem Satz?',
];

async function checkinZeile(platz) {
  const aktuell = rennwache(platz);
  if (!(await datenLies('einst/frage', true).catch(() => true))) return;
  const heute = tagstempel();
  let summe = 0;
  for (const z of heute) summe = (summe * 31 + z.charCodeAt(0)) >>> 0;
  const frage = CHECKIN_FRAGEN[summe % CHECKIN_FRAGEN.length];

  const stand = await datenLies('tag/' + heute + '/frage', {}).catch(() => ({}));
  const meine = stand[D.rolle];
  const seine = stand[andereRolle()];

  const zeile = el('button', {
    class: 'aufgabenzeile',
    onclick: () => checkinBlatt(frage, stand, platz),
  },
    el('span', { class: 'lichtpunkt' + (meine ? ' gruen' : '') }),
    el('span', { class: 'klein', style: { flex: '1', textAlign: 'left' } },
      meine && seine ? 'Frage des Tages — beide haben geantwortet'
        : meine ? 'Frage des Tages — ' + nameVon(andereRolle()) + ' fehlt noch'
          : 'Frage des Tages'),
    el('span', { class: 'still', style: { flex: 'none', fontSize: '15px' } }, '›')
  );
  if (!aktuell()) return;
  platz.innerHTML = '';
  platz.append(zeile);
}

function checkinBlatt(frage, stand, platz) {
  const meine = stand[D.rolle];
  const seine = stand[andereRolle()];

  const feld = el('textarea', { class: 'feld', rows: 3, placeholder: 'Ehrlich reicht völlig.' });

  const b = blatt(
    el('p', { class: 'winzig still mitte' }, 'Frage des Tages'),
    el('p', { class: 'zier mitte', style: { fontSize: '20px', lineHeight: '1.35', padding: '12px 4px 16px' } }, frage),
    meine
      ? el('div', {},
          el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, 'Du'),
          el('p', { class: 'leise', style: { marginBottom: '12px' } }, meine),
          seine
            ? el('div', {},
                el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, nameVon(andereRolle())),
                el('p', { class: 'leise' }, seine))
            : el('p', { class: 'still klein' }, nameVon(andereRolle()) + 's Antwort erscheint hier, sobald sie da ist.'))
      : el('div', {}, feld,
          el('button', {
            class: 'knopf glut breit', style: { marginTop: '12px' },
            onclick: async () => {
              if (!feld.value.trim()) return meldung('Da steht noch nichts.');
              b.schliessen();
              const frisch = await datenLies('tag/' + tagstempel() + '/frage', {}).catch(() => ({}));
              await datenSchreib('tag/' + tagstempel() + '/frage', { ...frisch, [D.rolle]: feld.value.trim() });
              pushSenden(andereRolle(), 'hinweis', 'Eine Antwort auf die Frage des Tages.');
              meldung(seine ? 'Beide da — lest euch.' : 'Gespeichert. Sichtbar, wenn beide geantwortet haben.');
              if (platz) { platz.innerHTML = ''; checkinZeile(platz); }
            },
          }, 'Antworten'))
  );
  if (!meine) setTimeout(() => feld.focus(), 300);
}

/* --- Die Körperkarte ------------------------------------------------------- */

const KOERPER_ZONEN = [
  { key: 'haare', name: 'Haare' }, { key: 'gesicht', name: 'Gesicht' },
  { key: 'hals', name: 'Hals & Nacken' }, { key: 'schultern', name: 'Schultern' },
  { key: 'brust', name: 'Brust' }, { key: 'bauch', name: 'Bauch' },
  { key: 'ruecken', name: 'Rücken' }, { key: 'arme', name: 'Arme' },
  { key: 'haende', name: 'Hände' }, { key: 'po', name: 'Po' },
  { key: 'intim', name: 'Zwischen den Beinen' }, { key: 'oberschenkel', name: 'Oberschenkel (innen)' },
  { key: 'beine', name: 'Beine' }, { key: 'fuesse', name: 'Füße' },
  { key: 'ohren', name: 'Ohren' }, { key: 'mund', name: 'Mund & Lippen' },
];

const KOERPER_STUFEN = [
  { key: 'liebe', name: 'Liebe ich', farbe: 'var(--glut-hell)' },
  { key: 'mag', name: 'Mag ich', farbe: 'var(--gruen)' },
  { key: 'neutral', name: 'Neutral', farbe: 'var(--schrift-still)' },
  { key: 'nicht', name: 'Bitte nicht', farbe: 'var(--rot)' },
];

SEITEN.koerper = function (seite) {
  seite.append(kopfzeile('Körperkarte',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));
  seite.append(el('p', { class: 'leise klein', style: { margin: '0 0 12px', lineHeight: '1.5' } },
    'Tipp eine Zone an, bis die Farbe stimmt: Liebe ich → Mag ich → Neutral → Bitte nicht. ' +
    'Langer Druck für eine Notiz („nur wenn ich schon warm bin"). Der andere sieht deine Karte — reden ersetzt sie nicht, aber sie macht den Anfang.'));

  let eigene = true;
  const wahl = el('div', { class: 'knopfreihe', style: { marginBottom: '12px' } });
  const platz = el('div');
  seite.append(wahl, platz);

  const zeichneWahl = () => {
    wahl.innerHTML = '';
    wahl.append(
      el('button', { class: 'knopf' + (eigene ? ' glut' : ' leer'), onclick: () => { eigene = true; zeichneWahl(); laden(); } }, 'Meine'),
      el('button', { class: 'knopf' + (!eigene ? ' glut' : ' leer'), onclick: () => { eigene = false; zeichneWahl(); laden(); } }, nameVon(andereRolle()) + 's')
    );
  };

  async function laden() {
    platz.innerHTML = '';
    const rolle = eigene ? D.rolle : andereRolle();
    const karte = await datenLies('koerper/' + rolle, {}).catch(() => ({}));

    KOERPER_ZONEN.forEach((zone) => {
      const stand = karte[zone.key] || {};
      const stufe = KOERPER_STUFEN.find((s) => s.key === stand.stufe) || KOERPER_STUFEN[2];

      const zeile = el('button', {
        class: 'aufgabenzeile', style: { marginBottom: '5px' },
        onclick: eigene ? async () => {
          const idx = KOERPER_STUFEN.findIndex((s) => s.key === (stand.stufe || 'neutral'));
          const neu = KOERPER_STUFEN[(idx + 1) % 4].key;
          const frisch = await datenLies('koerper/' + rolle, {}).catch(() => ({}));
          await datenSchreib('koerper/' + rolle, { ...frisch, [zone.key]: { ...stand, stufe: neu } });
          tonSpielen('tick');
          laden();
        } : null,
      },
        el('span', { class: 'lichtpunkt', style: { background: stufe.farbe, boxShadow: '0 0 8px ' + stufe.farbe } }),
        el('span', { class: 'klein', style: { flex: '1', textAlign: 'left' } },
          zone.name + (stand.notiz ? ' · „' + stand.notiz + '"' : '')),
        el('span', { class: 'winzig', style: { color: stufe.farbe, flex: 'none' } }, stufe.name)
      );

      if (eigene) {
        langerDruck(zeile, () => {
          eingabeBlatt({
            titel: zone.name, hinweis: 'Eine Notiz dazu — darf auch leer bleiben.',
            wert: stand.notiz || '', leerErlaubt: true, jaText: 'Merken',
          }, async (text) => {
            const frisch = await datenLies('koerper/' + rolle, {}).catch(() => ({}));
            await datenSchreib('koerper/' + rolle, { ...frisch, [zone.key]: { ...stand, notiz: text } });
            laden();
          });
        });
      }
      platz.append(zeile);
    });
  }

  zeichneWahl();
  laden();
};

/* --- Der Reparatur-Modus --------------------------------------------------- */

/* Für nach einem Streit. Bewusst die ruhigste Seite der App: keine
   Punkte, keine Spiele, nur eine Struktur gegen das Im-Kreis-Drehen.
   Jeder Schritt öffnet sich erst, wenn beide geschrieben haben. */

const REPARATUR_SCHRITTE = [
  { key: 'sicht', frage: 'Was ist passiert — aus deiner Sicht?', hinweis: 'Nur beschreiben. Keine Vorwürfe, keine Verteidigung.' },
  { key: 'gebraucht', frage: 'Was hättest du in dem Moment gebraucht?', hinweis: 'Von dir selbst, vom anderen, von der Situation.' },
  { key: 'anders', frage: 'Was machen wir beim nächsten Mal anders?', hinweis: 'Ein konkreter, kleiner Vorschlag reicht.' },
];

SEITEN.reparatur = function (seite) {
  seite.append(kopfzeile('Reparatur',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));
  seite.append(el('p', { class: 'leise klein', style: { margin: '0 0 16px', lineHeight: '1.55' } },
    'Für danach. Drei Schritte, jeder schreibt für sich — gelesen wird erst, wenn beide fertig sind. Nichts hier wird bewertet oder gezählt.'));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('reparatur', () => laden());
  beimVerlassen(stopp);

  async function laden() {
    platz.innerHTML = '';
    const stand = await datenLies('reparatur/aktuell').catch(() => null);

    if (!stand) {
      platz.append(el('div', { class: 'karte', style: { textAlign: 'center', padding: '24px 18px' } },
        el('p', { class: 'leise', style: { marginBottom: '14px' } }, 'Gerade ist nichts offen. Gut so.'),
        el('button', { class: 'knopf leer breit', onclick: async () => {
          await datenSchreib('reparatur/aktuell', { begonnen: jetzt(), texte: {} });
          pushSenden(andereRolle(), 'hinweis', 'Lass uns etwas reparieren.');
          laden();
        } }, 'Etwas ist vorgefallen')
      ));
      return;
    }

    const texte = stand.texte || {};
    REPARATUR_SCHRITTE.forEach((schritt, i) => {
      const beitrag = texte[schritt.key] || {};
      const meine = beitrag[D.rolle];
      const seine = beitrag[andereRolle()];
      const vorherFertig = i === 0 || (() => {
        const v = texte[REPARATUR_SCHRITTE[i - 1].key] || {};
        return v.domme && v.sub;
      })();

      const karte = el('div', { class: 'karte', style: { marginTop: '10px', opacity: vorherFertig ? '1' : '.45' } },
        el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, 'Schritt ' + (i + 1)),
        el('div', { class: 'zier', style: { fontSize: '17px', marginBottom: '4px' } }, schritt.frage),
        el('p', { class: 'still klein', style: { marginBottom: '10px' } }, schritt.hinweis)
      );

      if (!vorherFertig) {
        anfuegen(karte, el('p', { class: 'still klein' }, 'Öffnet sich, wenn der Schritt davor von beiden beantwortet ist.'));
      } else if (meine && seine) {
        anfuegen(karte,
          el('p', { class: 'winzig still' }, 'Du'), el('p', { class: 'leise klein', style: { margin: '2px 0 8px', whiteSpace: 'pre-wrap' } }, meine),
          el('p', { class: 'winzig still' }, nameVon(andereRolle())), el('p', { class: 'leise klein', style: { margin: '2px 0 0', whiteSpace: 'pre-wrap' } }, seine));
      } else if (meine) {
        anfuegen(karte, el('p', { class: 'still klein' }, 'Geschrieben. Sichtbar wird es, wenn ' + nameVon(andereRolle()) + ' auch fertig ist.'));
      } else {
        anfuegen(karte, el('button', {
          class: 'knopf leer breit', style: { minHeight: '40px', fontSize: '13.5px' },
          onclick: () => {
            eingabeBlatt({ titel: schritt.frage, hinweis: schritt.hinweis, mehrzeilig: true, jaText: 'So war es für mich' }, async (text) => {
              const frisch = await datenLies('reparatur/aktuell').catch(() => null);
              if (!frisch) return;
              const t = frisch.texte || {};
              t[schritt.key] = { ...(t[schritt.key] || {}), [D.rolle]: text };
              await datenSchreib('reparatur/aktuell', { ...frisch, texte: t });
              pushSenden(andereRolle(), 'hinweis', 'Ein Schritt ist geschrieben.');
            });
          },
        }, 'Schreiben'));
      }
      platz.append(karte);
    });

    const fertig = REPARATUR_SCHRITTE.every((s) => { const t = texte[s.key] || {}; return t.domme && t.sub; });
    if (fertig) {
      platz.append(el('button', {
        class: 'knopf glut breit', style: { marginTop: '14px' },
        onclick: async () => {
          await datenAnhaengen('log', { tag: tagstempel(), flammen: 2, stimmung: 'Ruhe', satz: 'Etwas repariert.' }).catch(() => {});
          await datenLoesch('reparatur/aktuell');
          if (typeof paarXp === 'function') paarXp(20);
          meldung('Abgeschlossen. Das zählt mehr als jedes Spiel.');
        },
      }, 'Abschließen und weitergehen'));
    }
  }
  laden();
};

/* --- Das Toy-Regal --------------------------------------------------------- */

SEITEN.toys = function (seite) {
  seite.append(kopfzeile('Das Regal',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));
  seite.append(el('p', { class: 'leise klein', style: { margin: '0 0 14px', lineHeight: '1.5' } },
    'Was da ist, mit Material und Notizen. Die App weiß dann Bescheid: Das Toys-Deck taucht nur auf, wenn hier etwas steht.'));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('toys', (liste) => {
    platz.innerHTML = '';
    D.toysVorhanden = liste.some((t) => t.aktiv !== false);

    if (!liste.length) platz.append(leerlauf('Noch leer', 'Was zuerst ins Regal wandert, entscheidet ihr.'));

    liste.forEach((toy) => {
      const warnung = (VORRAT.toysMeta && VORRAT.toysMeta.material_warnungen || {})[(toy.material || '').toLowerCase()];
      const zeile = el('div', { class: 'karte', style: { marginTop: '9px', padding: '12px 15px', opacity: toy.aktiv === false ? '.5' : '1' } },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '10px' } },
          el('div', { style: { fontWeight: '500' } }, toy.name),
          el('span', { class: 'winzig still' }, toy.kategorie || '')
        ),
        toy.material ? el('div', { class: 'still klein', style: { marginTop: '2px' } }, toy.material + (toy.notizen ? ' · ' + toy.notizen : '')) : null,
        warnung ? el('div', { class: 'winzig', style: { marginTop: '5px', color: 'var(--gelb)' } }, '⚠ ' + warnung) : null
      );
      langerDruck(zeile, async () => {
        const weg = await frage('Aus dem Regal nehmen?', toy.name, 'Wegnehmen', true);
        if (weg) await datenEintragLoeschen('toys', toy.id);
      });
      platz.append(zeile);
    });

    platz.append(el('button', { class: 'knopf leer breit', style: { marginTop: '12px' }, onclick: toyAnlegen }, '+ Ins Regal'));
  });
  beimVerlassen(stopp);
};

function toyAnlegen() {
  const kategorien = (VORRAT.toysMeta && VORRAT.toysMeta.kategorien) || ['Sonstiges'];
  const name = el('input', { class: 'feld', placeholder: 'Was ist es?' });
  const kategorie = el('select', { class: 'feld', style: { marginTop: '9px' } },
    ...kategorien.map((k) => el('option', { value: k }, k)));
  const material = el('input', { class: 'feld', placeholder: 'Material (Silikon, Glas, Leder …)', style: { marginTop: '9px' } });
  const notizen = el('input', { class: 'feld', placeholder: 'Notiz (freiwillig)', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Ins Regal'),
    el('div', { style: { height: '10px' } }),
    name, kategorie, material, notizen,
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '16px' },
      onclick: async () => {
        if (!name.value.trim()) return meldung('Ein Name fehlt.');
        b.schliessen();
        await datenAnhaengen('toys', {
          name: name.value.trim(), kategorie: kategorie.value,
          material: material.value.trim(), notizen: notizen.value.trim(), aktiv: true,
        });
        meldung('Steht im Regal.');
      },
    }, 'Aufnehmen')
  );
  setTimeout(() => name.focus(), 260);
}
