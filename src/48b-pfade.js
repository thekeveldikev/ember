/* ==========================================================================
   48b-pfade.js — Die Pfade.

   Ein Fähigkeitsbaum, wie ihn Spiele haben: Stufen, die aufeinander liegen.
   Der Unterschied zum Auftragsbrett ist das Verborgene — er sieht die
   erreichten Stufen, die nächste, und danach nur noch Fragezeichen.

   Genau das erzeugt den Zug nach vorn: Man will wissen, was danach kommt.
   ========================================================================== */

SEITEN.pfade = function (seite) {
  seite.append(kopfzeile('Pfade',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '14px' } },
    istDomme()
      ? 'Ein Pfad ist ein Stufenplan, den du baust. Er sieht immer nur die nächste Stufe — nie das Ziel.'
      : 'Stufenpläne, die sie für dich baut. Du siehst immer nur die nächste Stufe — das Ziel kennt nur sie.'));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('pfade', (pfade) => pfadeZeichnen(platz, pfade));
  beimVerlassen(stopp);
};

function pfadeZeichnen(platz, pfade) {
  platz.innerHTML = '';

  if (!pfade.length) {
    platz.append(leerlauf('Noch keine Pfade',
      istDomme() ? 'Ein Pfad ist eine Folge von Stufen. Er sieht immer nur die nächste.'
        : 'Sie hat noch keinen angelegt.'));
  }

  pfade.forEach((pfad) => platz.append(pfadKarte(pfad)));

  if (istDomme()) {
    platz.append(el('button', {
      class: 'knopf leer breit', style: { marginTop: '13px' },
      onclick: () => pfadAnlegen(),
    }, '+ Neuer Pfad'));
  }
}

function pfadKarte(pfad) {
  const stufen = pfad.stufen || [];
  const erreicht = pfad.erreicht || 0;
  const fertig = erreicht >= stufen.length;

  const karte = el('div', { class: 'karte' + (fertig ? ' glimmt' : ''), style: { marginTop: '11px' } },
    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' } },
      el('div', { class: 'zier', style: { fontSize: '19px' } }, pfad.name),
      el('span', { class: 'winzig still' }, erreicht + ' / ' + stufen.length)
    )
  );

  stufen.forEach((stufe, i) => {
    const geschafft = i < erreicht;
    const dran = i === erreicht;
    /* Sie sieht alles. Er sieht das Erreichte, das Aktuelle — und dahinter
       nichts. Das ist der ganze Reiz des Baums. */
    const sichtbar = istDomme() || geschafft || dran;

    const punkt = el('div', {
      style: {
        width: '13px', height: '13px', borderRadius: '50%', flex: 'none', marginTop: '4px',
        background: geschafft ? 'var(--verlauf)' : dran ? 'var(--flaeche-hoch)' : 'transparent',
        border: '1px solid ' + (geschafft ? 'transparent' : dran ? 'var(--glut)' : 'var(--kante-stark)'),
        boxShadow: dran ? '0 0 10px var(--schein)' : 'none',
      },
    });

    const zeile = el('div', {
      style: {
        display: 'flex', gap: '13px', alignItems: 'flex-start',
        padding: '9px 0',
        opacity: sichtbar ? '1' : '.4',
      },
    },
      /* Die Linie zwischen den Punkten macht aus der Liste einen Pfad. */
      el('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' } },
        punkt,
        i < stufen.length - 1 ? el('div', {
          style: {
            width: '1px', flex: '1', minHeight: '16px', marginTop: '3px',
            background: geschafft ? 'var(--glut)' : 'var(--kante)',
          },
        }) : null
      ),
      el('div', { style: { flex: '1', minWidth: '0' } },
        el('div', {
          class: sichtbar ? 'zier' : '',
          style: {
            fontSize: sichtbar ? '16px' : '15px',
            color: dran ? 'var(--glut-hell)' : geschafft ? 'var(--schrift)' : 'var(--schrift-still)',
            letterSpacing: sichtbar ? '0' : '.2em',
          },
        }, sichtbar ? stufe.titel : '? ? ?'),
        sichtbar && stufe.text
          ? el('p', { class: 'leise klein', style: { marginTop: '3px', whiteSpace: 'pre-wrap' } }, stufe.text)
          : null,
        dran && istDomme()
          ? el('button', {
              class: 'knopf glut', style: { marginTop: '10px', minHeight: '36px', fontSize: '13px', padding: '8px 16px' },
              onclick: () => stufeAbschliessen(pfad),
            }, 'Geschafft')
          : null
      )
    );

    karte.append(zeile);
  });

  if (fertig) {
    karte.append(el('p', { class: 'winzig', style: { marginTop: '9px', color: 'var(--glut-hell)' } },
      'Pfad vollendet.'));
  }

  if (istDomme()) langerDruck(karte, () => pfadBearbeiten(pfad));
  return karte;
}

async function stufeAbschliessen(pfad) {
  const stufen = pfad.stufen || [];
  const neu = Math.min(stufen.length, (pfad.erreicht || 0) + 1);
  const geschaffte = stufen[neu - 1];

  await datenAendern('pfade', pfad.id, { erreicht: neu });

  /* Eine geschaffte Stufe ist ein Ereignis, kein Häkchen. */
  puls('antwortJa');
  await datenAnhaengen('log', {
    tag: tagstempel(), flammen: 3, stimmung: '✦',
    satz: pfad.name + ': ' + (geschaffte ? geschaffte.titel : 'eine Stufe weiter'),
  });

  pushSenden('sub', 'hinweis', 'Ein Pfad ist weitergegangen.');

  if (neu >= stufen.length) meldung(pfad.name + ' ist vollendet.');
  else meldung('Weiter. Die nächste Stufe ist jetzt sichtbar.');
}

/* --- Pflegen -------------------------------------------------------------- */

function pfadAnlegen(vorhandener) {
  const name = el('input', {
    class: 'feld', placeholder: 'Wie heißt dieser Pfad?',
    value: vorhandener ? vorhandener.name : '',
  });

  /* Eine Stufe je Zeile; ein Doppelpunkt trennt Titel und Erklärung.
     Das ist schneller einzugeben als sechs einzelne Formulare. */
  const stufen = el('textarea', {
    class: 'feld', rows: 9, style: { marginTop: '9px' },
    placeholder: 'Eine Stufe je Zeile.\nMit Doppelpunkt: Titel: was dazugehört',
    value: vorhandener
      ? (vorhandener.stufen || []).map((s) => s.titel + (s.text ? ': ' + s.text : '')).join('\n')
      : '',
  });

  const b = blatt(
    el('h2', {}, vorhandener ? 'Pfad ändern' : 'Neuer Pfad'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Er sieht immer nur bis zur nächsten Stufe. Was danach kommt, bleibt verborgen.'),
    name, stufen,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!name.value.trim()) return meldung('Ein Name fehlt.');
          const liste = stufen.value.split('\n').map((z) => z.trim()).filter(Boolean).map((z) => {
            const trenner = z.indexOf(':');
            return trenner > 0
              ? { titel: z.slice(0, trenner).trim(), text: z.slice(trenner + 1).trim() }
              : { titel: z, text: '' };
          });
          if (!liste.length) return meldung('Mindestens eine Stufe.');
          b.schliessen();

          const wert = { name: name.value.trim(), stufen: liste };
          if (vorhandener) {
            /* Was schon geschafft ist, bleibt geschafft — auch wenn der
               Pfad kürzer wird. */
            wert.erreicht = Math.min(vorhandener.erreicht || 0, liste.length);
            await datenAendern('pfade', vorhandener.id, wert);
          } else {
            wert.erreicht = 0;
            await datenAnhaengen('pfade', wert);
          }
          meldung('Steht.');
        },
      }, 'Sichern')
    )
  );
  setTimeout(() => name.focus(), 260);
}

function pfadBearbeiten(pfad) {
  const b = blatt(
    el('h2', {}, pfad.name),
    el('p', { class: 'leise klein', style: { margin: '7px 0 16px' } },
      (pfad.erreicht || 0) + ' von ' + (pfad.stufen || []).length + ' Stufen'),
    el('div', { class: 'knopfreihe' },
      el('button', {
        class: 'knopf leer warnend',
        onclick: async () => {
          b.schliessen();
          const weg = await frage('Pfad wegnehmen?', pfad.name, 'Wegnehmen', true);
          if (weg) await datenEintragLoeschen('pfade', pfad.id);
        },
      }, 'Wegnehmen'),
      el('button', {
        class: 'knopf glut',
        onclick: () => { b.schliessen(); pfadAnlegen(pfad); },
      }, 'Ändern')
    ),
    (pfad.erreicht || 0) > 0
      ? el('button', {
          class: 'winzig still', style: { display: 'block', margin: '15px auto 0' },
          onclick: async () => {
            b.schliessen();
            await datenAendern('pfade', pfad.id, { erreicht: (pfad.erreicht || 0) - 1 });
            meldung('Eine Stufe zurück.');
          },
        }, 'Eine Stufe zurücknehmen')
      : null
  );
}
