/* ==========================================================================
   45-auftraege.js — Aufträge, Regeln, was noch aussteht.

   Drei Dinge auf einer Seite, weil sie zusammengehören:
     Aufträge  haben ein Ende. Er meldet, sie hakt ab.
     Regeln    haben keins. Sie stehen einfach.
     Ausstehendes  ist eine Zahl, kein Inhalt — bis sie es öffnet.
   ========================================================================== */

SEITEN.auftrag = function (seite) {
  const auftragplatz = el('div', { class: 'abschnitt' });
  const strafplatz = el('div', { class: 'abschnitt' });
  const regelplatz = el('div', { class: 'abschnitt' });

  seite.append(auftragplatz, strafplatz, regelplatz);

  const s1 = datenHorch('auftraege', (liste) => auftraegeZeichnen(auftragplatz, liste));
  const s2 = datenHorch('regeln', (liste) => regelnZeichnen(regelplatz, liste));
  const s3 = datenHorch('strafen', (liste) => strafenZeichnen(strafplatz, liste));

  beimVerlassen(s1); beimVerlassen(s2); beimVerlassen(s3);
};

/* --- Aufträge ------------------------------------------------------------- */

function auftraegeZeichnen(platz, liste) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Aufträge',
    istDomme() ? el('button', { class: 'winzig still', onclick: () => auftragAnlegen() }, '+ Neu') : null
  ));

  /* Wiederkehrende, die gerade ruhen, stehen als schmale Zeile unten. */
  const ruhende = liste.filter((a) => a.ruhtBis && a.ruhtBis > jetzt());
  const offen = liste.filter((a) => !a.bestaetigt && !(a.ruhtBis && a.ruhtBis > jetzt()));

  if (!offen.length && !ruhende.length) {
    platz.append(leerlauf('Nichts offen', istDomme() ? 'Gib ihm etwas.' : 'Gerade ist nichts zu tun.'));
    return;
  }

  /* Was die Frist überschritten hat, steht oben und sieht anders aus. */
  offen.sort((a, b) => {
    const af = a.frist || Infinity, bf = b.frist || Infinity;
    return af - bf;
  });

  offen.forEach((a) => {
    const ueber = a.frist && a.frist < jetzt() && !a.erledigt;

    const karte = el('div', {
      class: 'karte' + (a.erledigt ? ' glimmt' : ''),
      style: ueber ? { borderColor: 'rgba(178,69,60,.45)' } : {},
    },
      el('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' } },
        el('div', { style: { flex: '1', minWidth: '0' } },
          el('div', { class: 'zier', style: { fontSize: '17px' } }, a.titel),
          a.text ? el('p', { class: 'leise klein', style: { marginTop: '5px', whiteSpace: 'pre-wrap' } }, a.text) : null,
          el('p', {
            class: 'winzig',
            style: { marginTop: '9px', color: ueber ? 'var(--rot)' : 'var(--schrift-still)' },
          },
            [a.fach, a.frist ? (ueber ? 'überfällig seit ' + vorZeit(a.frist) : 'bis ' + fristText(a.frist)) : null,
              a.erledigt ? 'gemeldet' : null].filter(Boolean).join(' · ')
          )
        )
      )
    );

    if (istDomme()) {
      karte.append(el('div', { class: 'knopfreihe', style: { marginTop: '13px' } },
        el('button', {
          class: 'knopf leer', style: { minHeight: '38px', fontSize: '13px' },
          onclick: () => auftragVerwerfen(a),
        }, a.erledigt ? 'Doch nicht' : 'Zurückziehen'),
        el('button', {
          class: 'knopf glut', style: { minHeight: '38px', fontSize: '13px' },
          onclick: async () => {
            if (a.rhythmus) {
              /* Wiederkehrend: nicht abschließen, sondern schlafen legen —
                 morgen (oder nächste Woche) steht er von selbst wieder da. */
              const pause = a.rhythmus === 'woechentlich' ? 7 * 86400000 : 0;
              const wieder = new Date();
              wieder.setHours(5, 0, 0, 0);
              await datenAendern('auftraege', a.id, {
                erledigt: false, bestaetigt: false,
                ruhtBis: wieder.getTime() + 86400000 + pause,
                zuletztErledigt: jetzt(),
              });
              meldung('Abgehakt — kommt ' + (a.rhythmus === 'woechentlich' ? 'nächste Woche' : 'morgen') + ' wieder.');
            } else {
              await datenAendern('auftraege', a.id, { bestaetigt: true, bestaetigtWann: jetzt() });
              meldung('Abgehakt.');
            }
            paarXp(5);
            if (typeof kontoVerdienst === 'function') {
              kontoVerdienst('auftrag', 1, 'karma', 3, 'Auftrag: ' + a.titel.slice(0, 40)).catch(() => {});
            }
            puls('antwortJa');
          },
        }, 'Abhaken')
      ));
    } else if (!a.erledigt) {
      karte.append(el('button', {
        class: 'knopf leer breit', style: { marginTop: '13px', minHeight: '40px', fontSize: '14px' },
        onclick: async () => {
          await datenAendern('auftraege', a.id, { erledigt: true, erledigtWann: jetzt() });
          pushSenden('domme', 'auftrag', 'Etwas ist erledigt.');
          meldung('Gemeldet. Sie muss es noch abhaken.');
        },
      }, 'Erledigt melden'));
    } else {
      karte.append(el('p', { class: 'winzig still', style: { marginTop: '11px' } }, 'Wartet auf sie.'));
    }

    platz.append(karte);
  });

  if (ruhende.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '14px 0 6px 2px' } }, 'Kommt wieder'));
    ruhende.forEach((a) => {
      const zeile = el('div', { class: 'aufgabenzeile', style: { opacity: '.6' } },
        el('span', { class: 'lichtpunkt gruen' }),
        el('span', { class: 'klein', style: { flex: '1', textAlign: 'left' } }, a.titel),
        el('span', { class: 'winzig still', style: { flex: 'none' } },
          'ab ' + new Date(a.ruhtBis).toLocaleDateString('de-DE', { weekday: 'short' }))
      );
      if (istDomme()) langerDruck(zeile, () => auftragVerwerfen(a));
      platz.append(zeile);
    });
  }
}

function fristText(zeit) {
  const d = new Date(zeit);
  const heute = tagstempel() === tagstempel(zeit);
  return heute ? uhrzeit(zeit) : d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }) + ' ' + uhrzeit(zeit);
}

async function auftragVerwerfen(a) {
  const weg = await frage('Zurückziehen?', a.titel, 'Zurückziehen', true);
  if (weg) await datenEintragLoeschen('auftraege', a.id);
}

const AUFTRAG_RHYTHMEN = [
  { key: null, name: 'Einmalig', wort: '' },
  { key: 'taeglich', name: 'Täglich', wort: 'täglich' },
  { key: 'woechentlich', name: 'Wöchentlich', wort: 'wöchentlich' },
];

function auftragAnlegen() {
  let rhythmus = null;

  const titel = el('input', { class: 'feld', placeholder: 'Was soll geschehen?' });
  const text = el('textarea', { class: 'feld', rows: 3, placeholder: 'Genauer, wenn nötig.', style: { marginTop: '9px' } });
  const frist = el('input', { class: 'feld', type: 'datetime-local', style: { marginTop: '9px' } });

  /* Zum Antippen statt zum Hineinschreiben: Wie oft kommt er wieder? */
  const reihe = el('div', { style: { display: 'flex', gap: '7px', marginTop: '4px' } });
  const zeichne = () => {
    reihe.innerHTML = '';
    AUFTRAG_RHYTHMEN.forEach((r) => {
      reihe.append(el('button', {
        class: 'knopf' + (rhythmus === r.key ? ' glut' : ' leer'),
        style: { flex: '1', minHeight: '40px', fontSize: '13px' },
        onclick: () => { rhythmus = r.key; zeichne(); },
      }, r.name));
    });
  };
  zeichne();

  const b = blatt(
    el('h2', {}, 'Neuer Auftrag'),
    el('div', { style: { height: '12px' } }),
    titel, text,
    el('p', { class: 'winzig still', style: { margin: '15px 0 0' } }, 'Wie oft'),
    reihe,
    el('p', { class: 'still klein', style: { margin: '6px 2px 0' } },
      'Wiederkehrende Aufträge tauchen nach dem Abhaken von selbst wieder auf.'),
    el('label', { class: 'feldmarke', style: { marginTop: '15px' } }, 'Bis wann (freiwillig)'),
    frist,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!titel.value.trim()) return meldung('Ein Titel fehlt.');
          b.schliessen();
          await datenAnhaengen('auftraege', {
            titel: titel.value.trim(),
            text: text.value.trim(),
            fach: (AUFTRAG_RHYTHMEN.find((r) => r.key === rhythmus) || {}).wort || '',
            rhythmus,
            frist: frist.value ? new Date(frist.value).getTime() : null,
            art: 'auftrag', erledigt: false, bestaetigt: false,
          });
          pushSenden('sub', 'auftrag');
          meldung('Liegt bei ihm.');
        },
      }, 'Geben')
    )
  );
  setTimeout(() => titel.focus(), 260);
}

/* --- Was aussteht --------------------------------------------------------- */

/* Er sieht die Anzahl, nicht den Inhalt. Sie öffnet einzeln, wann sie will. */

function strafenZeichnen(platz, liste) {
  const offen = liste.filter((s) => !s.erledigt);
  platz.innerHTML = '';

  if (!offen.length && !istDomme()) return;

  platz.append(kopfzeile('Ausstehend',
    istDomme() ? el('button', { class: 'winzig still', onclick: () => strafeAnlegen() }, '+ Neu') : null
  ));

  if (!offen.length) {
    platz.append(leerlauf('Nichts offen', 'Alles beglichen.'));
    return;
  }

  if (!istDomme()) {
    const verborgen = offen.filter((s) => !s.enthuellt);
    const sichtbar = offen.filter((s) => s.enthuellt);

    if (verborgen.length) {
      platz.append(el('div', { class: 'karte', style: { textAlign: 'center', borderColor: 'rgba(178,69,60,.3)' } },
        el('div', { class: 'zier', style: { fontSize: '42px', color: 'var(--rot)' } }, String(verborgen.length)),
        el('p', { class: 'leise klein', style: { marginTop: '4px' } },
          verborgen.length === 1 ? 'wartet' : 'warten'),
        el('p', { class: 'still klein', style: { marginTop: '9px' } }, 'Was, entscheidet sie.')
      ));
    }

    sichtbar.forEach((s) => platz.append(strafKarte(s, false)));
    return;
  }

  offen.forEach((s) => platz.append(strafKarte(s, true)));
}

function strafKarte(s, fuerSie) {
  const karte = el('div', { class: 'karte', style: { borderColor: 'rgba(178,69,60,.3)' } },
    el('div', { class: 'zier', style: { fontSize: '17px' } }, s.text),
    el('p', { class: 'winzig still', style: { marginTop: '7px' } },
      s.enthuellt ? 'offen · seit ' + vorZeit(s.wann) : 'verborgen · seit ' + vorZeit(s.wann))
  );

  if (fuerSie) {
    karte.append(el('div', { class: 'knopfreihe', style: { marginTop: '13px' } },
      !s.enthuellt ? el('button', {
        class: 'knopf leer', style: { minHeight: '38px', fontSize: '13px' },
        onclick: async () => {
          await datenAendern('strafen', s.id, { enthuellt: true });
          pushSenden(andereRolle(), 'auftrag', nameVon(D.rolle) + ' hat etwas geöffnet.');
        },
      }, 'Öffnen') : null,
      el('button', {
        class: 'knopf glut', style: { minHeight: '38px', fontSize: '13px' },
        onclick: async () => { await datenAendern('strafen', s.id, { erledigt: true }); meldung('Beglichen.'); },
      }, 'Beglichen')
    ));
  }
  return karte;
}

function strafeAnlegen() {
  eingabeBlatt({
    titel: 'Etwas Ausstehendes',
    hinweis: nameVon(andereRolle()) + ' sieht nur, dass etwas wartet. Nicht was.',
    platzhalter: '…',
    mehrzeilig: true,
    jaText: 'Eintragen',
  }, async (text) => {
    await datenAnhaengen('strafen', { text, enthuellt: false, erledigt: false });
    pushSenden('sub', 'hinweis', 'Etwas wartet.');
    meldung('Eingetragen.');
  });
}

/* --- Regeln --------------------------------------------------------------- */

/* Ändert sich etwas, bekommt er nur: „Etwas hat sich geändert." Welche Regel
   es war, steht nicht dabei. Er muss selbst nachsehen. */

function regelnZeichnen(platz, liste) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Regeln',
    istDomme() ? el('button', { class: 'winzig still', onclick: () => regelAnlegen() }, '+ Neu') : null
  ));

  if (!liste.length) {
    platz.append(leerlauf('Keine Regeln', istDomme() ? 'Noch nichts festgelegt.' : 'Noch nichts festgelegt.'));
    return;
  }

  liste.forEach((r, i) => {
    const karte = el('div', { class: 'karte', style: { display: 'flex', gap: '13px', alignItems: 'flex-start' } },
      el('div', { class: 'zier glutschrift', style: { fontSize: '17px', minWidth: '22px' } }, String(i + 1)),
      el('div', { style: { flex: '1', whiteSpace: 'pre-wrap' } }, r.text)
    );
    if (istDomme()) langerDruck(karte, () => regelVerwalten(r));
    platz.append(karte);
  });

  if (!istDomme()) {
    Gerät.schreib('regelnGesehen', liste.length + ':' + liste.map((r) => r.id).join(','));
  }
}

function regelAnlegen() {
  eingabeBlatt({
    titel: 'Eine Regel',
    hinweis: 'Sie steht, bis du sie wieder wegnimmst. Er wird benachrichtigt — aber nicht, worum es geht.',
    platzhalter: '…',
    mehrzeilig: true,
    jaText: 'Festlegen',
  }, async (text) => {
    await datenAnhaengen('regeln', { text });
    await regelnGeaendertMelden();
    meldung('Steht.');
  });
}

function regelVerwalten(r) {
  const b = blatt(
    el('p', { class: 'winzig still', style: { marginBottom: '10px' } }, 'Regel'),
    el('p', { style: { whiteSpace: 'pre-wrap', marginBottom: '18px' } }, r.text),
    el('div', { class: 'knopfreihe' },
      el('button', {
        class: 'knopf leer warnend',
        onclick: async () => {
          b.schliessen();
          await datenEintragLoeschen('regeln', r.id);
          await regelnGeaendertMelden();
        },
      }, 'Wegnehmen'),
      el('button', {
        class: 'knopf glut',
        onclick: () => {
          b.schliessen();
          eingabeBlatt({ titel: 'Ändern', mehrzeilig: true, wert: r.text, jaText: 'Ändern' }, async (text) => {
            await datenAendern('regeln', r.id, { text });
            await regelnGeaendertMelden();
          });
        },
      }, 'Ändern')
    )
  );
}

async function regelnGeaendertMelden() {
  await datenSchreib('regelStand', { wann: jetzt() });
  pushSenden('sub', 'regel');
}
