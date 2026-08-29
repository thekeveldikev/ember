/* ==========================================================================
   59-quiz.js — Wie gut kennst du mich?

   Beide legen Fragen übereinander an — die richtige Antwort und zwei
   falsche dazu. Gespielt wird auf einem Gerät: Einer antwortet auf die
   Fragen des anderen.

   Der Einsatz ist echt: Wer schlecht abschneidet, zahlt. Er mit einem
   Eintrag in der Warteschlange, sie mit einer Wunsch-Marke für ihn.
   ========================================================================== */

SEITEN.quiz = function (seite) {
  seite.append(kopfzeile('Wie gut kennst du mich?',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('quiz', (fragen) => quizZeichnen(platz, fragen));
  beimVerlassen(stopp);
};

function quizZeichnen(platz, fragen) {
  platz.innerHTML = '';

  const vonMir = fragen.filter((f) => f.von === D.rolle);
  const vomAnderen = fragen.filter((f) => f.von !== D.rolle);

  platz.append(el('div', { class: 'karte glimmt', style: { textAlign: 'center' } },
    el('p', { class: 'still klein', style: { marginBottom: '13px' } },
      vonMir.length + ' Fragen über dich · ' + vomAnderen.length + ' über ' + nameVon(andereRolle())),
    el('button', {
      class: 'knopf glut breit',
      onclick: () => {
        if (vomAnderen.length < 3) return meldung('Mindestens drei Fragen des anderen — sonst ist es kein Quiz.');
        quizRunde(vomAnderen);
      },
    }, 'Ich werde geprüft'),
    el('p', { class: 'winzig still', style: { marginTop: '11px', lineHeight: '1.5' } },
      'Unter der Hälfte richtig: ' + (istDomme() ? 'er bekommt einen Wunsch.' : 'das landet in der Warteschlange.'))
  ));

  platz.append(
    el('button', {
      class: 'knopf leer breit', style: { marginTop: '11px' },
      onclick: quizFrageAnlegen,
    }, '+ Frage über mich')
  );

  if (vonMir.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '17px 0 7px 2px' } }, 'Deine Fragen'));
    vonMir.forEach((f) => {
      const zeile = el('div', { class: 'karte', style: { padding: '11px 14px', marginTop: '8px' } },
        el('div', {}, f.frage),
        el('div', { class: 'still klein', style: { marginTop: '2px' } }, '→ ' + f.richtig)
      );
      langerDruck(zeile, async () => {
        const weg = await frage('Frage wegnehmen?', f.frage, 'Wegnehmen', true);
        if (weg) await datenEintragLoeschen('quiz', f.id);
      });
      platz.append(zeile);
    });
  }
}

function quizFrageAnlegen() {
  const frage_ = el('input', { class: 'feld', placeholder: 'Die Frage über dich' });
  const richtig = el('input', { class: 'feld', placeholder: 'Die richtige Antwort', style: { marginTop: '9px', borderColor: 'rgba(125,155,106,.4)' } });
  const falsch1 = el('input', { class: 'feld', placeholder: 'Eine falsche', style: { marginTop: '9px' } });
  const falsch2 = el('input', { class: 'feld', placeholder: 'Noch eine falsche', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Eine Frage über dich'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Der andere bekommt alle drei Antworten gemischt vorgelegt.'),
    frage_, richtig, falsch1, falsch2,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!frage_.value.trim() || !richtig.value.trim() || !falsch1.value.trim()) {
            return meldung('Frage, richtige und mindestens eine falsche Antwort.');
          }
          b.schliessen();
          await datenAnhaengen('quiz', {
            frage: frage_.value.trim(),
            richtig: richtig.value.trim(),
            falsche: [falsch1.value.trim(), falsch2.value.trim()].filter(Boolean),
          });
          meldung('Angelegt. Mal sehen, ob es gewusst wird.');
        },
      }, 'Anlegen')
    )
  );
  setTimeout(() => frage_.focus(), 260);
}

/* --- Die Runde ------------------------------------------------------------ */

function quizRunde(fragen) {
  const reihe = fragen.slice().sort(() => Math.random() - 0.5).slice(0, 10);
  let stelle = 0;
  let richtig = 0;

  naechsteFrage();

  function naechsteFrage() {
    if (stelle >= reihe.length) return auswertung();
    const f = reihe[stelle];
    const antworten = [f.richtig, ...(f.falsche || [])].sort(() => Math.random() - 0.5);

    const b = blatt(
      el('p', { class: 'winzig still mitte' }, (stelle + 1) + ' von ' + reihe.length),
      el('p', { class: 'zier mitte', style: { fontSize: '21px', lineHeight: '1.35', padding: '14px 4px 18px' } },
        f.frage),
      ...antworten.map((a) => el('button', {
        class: 'karte',
        style: { width: '100%', textAlign: 'left', marginTop: '9px' },
        onclick: () => {
          const stimmt = a === f.richtig;
          if (stimmt) richtig++;
          puls(stimmt ? 'antwortJa' : 'antwortNein');
          b.schliessen();

          const rueck = blatt(
            el('div', { class: 'mitte', style: { padding: '8px 0' } },
              el('div', { style: { fontSize: '38px' } }, stimmt ? '✓' : '✗'),
              el('p', { class: 'zier', style: { fontSize: '19px', marginTop: '8px', color: stimmt ? 'var(--gruen)' : 'var(--rot)' } },
                stimmt ? 'Gewusst.' : 'Falsch.'),
              !stimmt ? el('p', { class: 'leise klein', style: { marginTop: '6px' } }, 'Richtig wäre: ' + f.richtig) : null,
              el('button', {
                class: 'knopf glut breit', style: { marginTop: '16px' },
                onclick: () => { rueck.schliessen(); stelle++; naechsteFrage(); },
              }, 'Weiter')
            )
          );
        },
      }, a))
    );
  }

  async function auswertung() {
    const quote = richtig / reihe.length;
    const verloren = quote < 0.5;

    if (verloren) {
      if (istDomme()) {
        /* Sie hat verloren — er bekommt eine Marke. */
        const stand = await datenLies('wachsen/stand', {});
        await datenSchreib('wachsen/stand', { ...stand, marken: (stand.marken || 0) + 1 });
        pushSenden('sub', 'hinweis', 'Du hast etwas gut.');
      } else {
        await datenAnhaengen('strafen', {
          text: 'Quiz verloren: ' + richtig + ' von ' + reihe.length,
          enthuellt: false, erledigt: false,
        });
        pushSenden('domme', 'hinweis', 'Er kennt dich schlechter, als er dachte.');
      }
    }
    paarXp(10);

    blatt(
      el('div', { class: 'mitte', style: { padding: '10px 0 4px' } },
        el('div', { class: 'zier glutschrift', style: { fontSize: '48px' } },
          richtig + ' / ' + reihe.length),
        el('p', { class: 'leise', style: { marginTop: '6px' } },
          quote >= 0.8 ? 'Beeindruckend.' : quote >= 0.5 ? 'Ganz ordentlich.' : 'Das war nichts.'),
        verloren
          ? el('p', { class: 'zier', style: { fontSize: '17px', marginTop: '14px', color: 'var(--glut-hell)' } },
              istDomme() ? 'Er hat jetzt einen Wunsch gut.' : 'Das kostet. Es liegt in der Warteschlange.')
          : null
      )
    );
  }
}
