/* ==========================================================================
   58-boss.js — Der Boss.

   Eine Prüfung, die größer ist als der Alltag. Sie legt fest, was zu
   bestehen ist und was der Sieg wert ist — die Belohnung bleibt verhüllt,
   bis er sie verdient hat. Er kann antreten oder es lassen; bestanden hat
   er erst, wenn sie es sagt.

   Es gibt immer nur einen zur Zeit. Ein Boss, der neben drei anderen
   steht, ist keiner.
   ========================================================================== */

function bossAnlegen() {
  const titel = el('input', { class: 'feld', placeholder: 'Wie heißt die Prüfung?' });
  const text = el('textarea', { class: 'feld', rows: 3, placeholder: 'Was ist zu bestehen?', style: { marginTop: '9px' } });
  const belohnung = el('input', { class: 'feld', placeholder: 'Was der Sieg wert ist — sieht er erst danach.', style: { marginTop: '9px' } });
  const strafeMit = el('input', { type: 'checkbox', id: 'bossstrafe' });

  const b = blatt(
    el('h2', {}, 'Ein Boss'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Größer als ein Auftrag. Die Belohnung bleibt verhüllt, bis er besteht.'),
    titel, text, belohnung,
    el('label', {
      style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', fontSize: '14px' },
      for: 'bossstrafe',
    }, strafeMit, 'Scheitern hat Folgen'),
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!titel.value.trim()) return meldung('Ein Name fehlt.');
          const alle = await datenListe('bosse');
          if (alle.some((x) => !x.ausgang)) return meldung('Es läuft schon einer. Erst entscheiden.');
          b.schliessen();
          await datenAnhaengen('bosse', {
            titel: titel.value.trim(),
            text: text.value.trim(),
            belohnung: belohnung.value.trim(),
            mitStrafe: strafeMit.checked,
            kaempft: false,
          });
          pushSenden('sub', 'befehl', 'Etwas Großes wartet.');
          puls('befehl');
          meldung('Er wartet auf ihn.');
        },
      }, 'Aufstellen')
    )
  );
  setTimeout(() => titel.focus(), 260);
}

/* --- Auf der Spiel-Seite -------------------------------------------------- */

function bossZeichnen(platz, bosse) {
  platz.innerHTML = '';

  const aktiv = bosse.find((x) => !x.ausgang);
  const besiegte = bosse.filter((x) => x.ausgang === 'sieg');

  if (aktiv) {
    const karte = el('div', {
      class: 'karte',
      style: {
        textAlign: 'center', padding: '22px 18px',
        background: 'radial-gradient(circle at 50% 0%, rgba(150,30,24,.25), transparent 70%), var(--flaeche)',
        borderColor: 'rgba(178,69,60,.4)',
      },
    },
      el('p', { class: 'winzig', style: { color: 'var(--rot)', letterSpacing: '.3em' } }, 'Boss'),
      el('div', { class: 'zier', style: { fontSize: '24px', margin: '7px 0 4px' } }, aktiv.titel),
      aktiv.text ? el('p', { class: 'leise klein', style: { whiteSpace: 'pre-wrap' } }, aktiv.text) : null,
      el('p', { class: 'still klein', style: { marginTop: '10px' } },
        aktiv.belohnung
          ? (istDomme() ? 'Belohnung: ' + aktiv.belohnung : 'Der Sieg ist etwas wert. Was, erfährst du danach.')
          : 'Um der Ehre willen.')
    );

    if (!istDomme() && !aktiv.kaempft) {
      anfuegen(karte, el('button', {
        class: 'knopf glut breit', style: { marginTop: '15px' },
        onclick: async () => {
          await datenAendern('bosse', aktiv.id, { kaempft: true, angetretenWann: jetzt() });
          pushSenden('domme', 'hinweis', 'Er tritt an.');
          puls('befehl');
          meldung('Angetreten.');
        },
      }, 'Antreten'));
    } else if (aktiv.kaempft) {
      anfuegen(karte, el('p', { class: 'winzig', style: { marginTop: '13px', color: 'var(--glut-hell)' } },
        !istDomme() ? 'Du bist angetreten. Beweise es.' : nameVon('sub') + ' ist angetreten.'));
    }

    if (istDomme()) {
      anfuegen(karte, el('div', { class: 'knopfreihe', style: { marginTop: '14px' } },
        el('button', {
          class: 'knopf leer warnend', style: { minHeight: '40px', fontSize: '13px' },
          onclick: () => bossEntscheiden(aktiv, false),
        }, 'Gescheitert'),
        el('button', {
          class: 'knopf glut', style: { minHeight: '40px', fontSize: '13px' },
          onclick: () => bossEntscheiden(aktiv, true),
        }, 'Bestanden')
      ));
      langerDruck(karte, async () => {
        const weg = await frage('Boss zurückziehen?', aktiv.titel, 'Zurückziehen', true);
        if (weg) await datenEintragLoeschen('bosse', aktiv.id);
      });
    }

    platz.append(karte);
  } else if (istDomme()) {
    platz.append(el('button', {
      class: 'knopf leer breit',
      onclick: bossAnlegen,
    }, 'Einen Boss aufstellen'));
  }

  if (besiegte.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '15px 0 7px 2px' } }, 'Besiegt'));
    platz.append(el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '7px' } },
      ...besiegte.slice(-8).reverse().map((x) => el('span', {
        class: 'winzig',
        style: {
          padding: '7px 12px', borderRadius: '9px', color: 'var(--glut-hell)',
          background: 'var(--flaeche)', border: '1px solid color-mix(in srgb, var(--glut) 30%, transparent)',
        },
      }, el('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, sinnbild('funke', 12), x.titel)))
    ));
  }
}

async function bossEntscheiden(boss, bestanden) {
  if (bestanden) {
    await datenAendern('bosse', boss.id, { ausgang: 'sieg', entschiedenWann: jetzt() });

    /* Ein Sieg zahlt überall ein: Erfahrung, das Buch, das gemeinsame Level. */
    const stand = await datenLies('wachsen/stand', {});
    await datenSchreib('wachsen/stand', { ...stand, xp: (stand.xp || 0) + 100 });
    await datenAnhaengen('log', {
      tag: tagstempel(), flammen: 4, stimmung: 'Sieg',
      satz: 'Boss besiegt: ' + boss.titel + (boss.belohnung ? ' — ' + boss.belohnung : ''),
    });
    paarXp(50);
    if (typeof kontoBuchen === 'function' && ladenAn()) {
      kontoBuchen(2, 'siegel', 'Boss besiegt: ' + boss.titel).catch(() => {});
    }
    pushSenden('sub', 'hinweis', 'Bestanden.');
    puls('antwortJa');

    blatt(
      el('div', { class: 'mitte', style: { padding: '12px 0 6px' } },
        el('div', { style: { color: 'var(--glut-hell)', display: 'grid', placeItems: 'center' } }, sinnbild('funke', 44)),
        el('div', { class: 'zier glutschrift', style: { fontSize: '27px', margin: '10px 0 4px' } }, 'Bestanden'),
        el('p', { class: 'leise' }, boss.titel),
        boss.belohnung
          ? el('p', { class: 'zier', style: { fontSize: '19px', marginTop: '16px', color: 'var(--glut-hell)' } },
              boss.belohnung)
          : null
      )
    );
  } else {
    await datenAendern('bosse', boss.id, { ausgang: 'niederlage', entschiedenWann: jetzt() });
    if (boss.mitStrafe) {
      await datenAnhaengen('strafen', { text: 'Am Boss gescheitert: ' + boss.titel, enthuellt: false, erledigt: false });
    }
    pushSenden('sub', 'hinweis', 'Gescheitert.');
    puls('antwortNein');
    meldung('Gescheitert.' + (boss.mitStrafe ? ' Das hat Folgen.' : ''));
  }
}
