/* ==========================================================================
   44b-rad.js — Das Rad.

   Ein Rad ist eine Liste von Feldern, die ihr selbst beschriftet. Mehrere
   Räder hintereinander ergeben eine Kombination, auf die keiner von euch
   allein gekommen wäre: Ort × Haltung × Zusatzregel.

   Gedreht wird mit einem Schwung, der ausläuft — nicht mit einer Zufallszahl
   und einem Sprung. Das Warten auf den Stillstand ist der halbe Reiz.
   ========================================================================== */

SEITEN.rad = function (seite) {
  seite.append(kopfzeile('Räder',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '14px' } },
    istDomme()
      ? 'Antippen dreht — das Feld unterm Zeiger gilt. Eigene Räder baust du unter Verwaltung → Anlegen.'
      : 'Antippen dreht — das Feld unterm Zeiger gilt. Was auf den Feldern steht, bestimmt sie.'));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('raeder', (raeder) => raederZeichnen(platz, raeder));
  beimVerlassen(stopp);
};

/* Ein Vorrat-Rad hat oft zwanzig und mehr Segmente — auf der Scheibe wäre
   das Gekrissel. Für jede Drehung wird eine lesbare Handvoll gezogen; der
   Treffer bleibt gleich zufällig, nur eben aus einer frischen Auswahl. */
function _vorratRadFuerDrehung(rad) {
  return { name: rad.name, felder: mischen(rad.segmente).slice(0, 12).map((s) => s.text) };
}

function raederZeichnen(platz, raeder) {
  platz.innerHTML = '';

  const vorrat = vorratRaeder();
  const kombis = vorratRadKombis();

  if (!raeder.length && !vorrat.length) {
    platz.append(leerlauf('Noch kein Rad',
      istDomme() ? 'Ein Rad ist eine Handvoll Felder. Beschrifte sie, wie du magst.'
        : 'Sie hat noch keins gebaut.'));
  }

  /* Die Kombinationen zuerst — sie sind der schnellste Weg zu etwas Gutem. */
  if (kombis.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 8px 2px' } }, 'Kombinationen'));
    const reihe = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' } });
    kombis.forEach((k) => {
      const beteiligte = k.raeder
        .map((key) => vorrat.find((r) => r.key === key))
        .filter(Boolean);
      if (!beteiligte.length) return;
      reihe.append(el('button', {
        class: 'karte',
        style: { textAlign: 'left', padding: '12px 13px' },
        onclick: () => radDrehen(beteiligte.map(_vorratRadFuerDrehung)),
      },
        el('div', { class: 'zier', style: { fontSize: '15.5px' } }, k.name),
        el('div', { class: 'still klein', style: { marginTop: '1px' } },
          k.beschreibung + ' · ' + beteiligte.length + (beteiligte.length === 1 ? ' Rad' : ' Räder'))
      ));
    });
    platz.append(reihe);
  }

  if (vorrat.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 8px 2px' } }, 'Einzelne Räder'));
    const gitter = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '16px' } });
    vorrat.forEach((rad) => {
      gitter.append(el('button', {
        class: 'knopf leer',
        style: { minHeight: '40px', padding: '8px 13px', fontSize: '13.5px' },
        onclick: () => radDrehen([_vorratRadFuerDrehung(rad)]),
      }, rad.name));
    });
    platz.append(gitter);
  }

  if (raeder.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 8px 2px' } }, 'Eure eigenen'));
  }

  raeder.forEach((rad) => {
    const karte = el('div', { class: 'karte glimmt', style: { textAlign: 'center' } },
      el('div', { class: 'zier', style: { fontSize: '19px', marginBottom: '3px' } }, rad.name),
      el('div', { class: 'still klein', style: { marginBottom: '13px' } },
        (rad.felder || []).length + ' Felder'),
      el('button', {
        class: 'knopf glut breit',
        onclick: () => radDrehen([rad]),
      }, 'Drehen')
    );
    if (istDomme()) langerDruck(karte, () => radBearbeiten(rad));
    platz.append(karte);
  });

  if (raeder.length > 1) {
    platz.append(
      el('div', { class: 'trenner' }),
      el('button', {
        class: 'knopf breit',
        onclick: () => radAuswahl(raeder),
      }, 'Mehrere hintereinander')
    );
  }

  if (istDomme()) {
    platz.append(el('button', {
      class: 'knopf leer breit', style: { marginTop: '11px' },
      onclick: () => radAnlegen(),
    }, '+ Neues Rad'));
  }
}

/* --- Drehen --------------------------------------------------------------- */

/* Mehrere Räder laufen nacheinander, und das Ergebnis wächst mit jedem
   Stillstand um eine Zeile. Am Ende steht die ganze Kombination da. */

function radDrehen(raeder) {
  const ergebnisse = [];
  const anzeige = el('div', { style: { minHeight: '52px' } });
  const scheibe = el('div', { style: { position: 'relative', margin: '4px auto 16px', width: '250px', height: '250px' } });

  const uebernehmen = el('button', {
    class: 'knopf glut breit', style: { display: 'none', marginTop: '4px' },
    onclick: async () => {
      b.schliessen();
      await datenAnhaengen('auftraege', {
        titel: ergebnisse.join(' · '),
        text: '',
        fach: 'Vom Rad',
        art: 'rad', erledigt: false, bestaetigt: false,
      });
      pushSenden(istDomme() ? 'sub' : 'domme', 'auftrag');
      meldung('Liegt bei den Aufträgen.');
    },
  }, istDomme() ? 'Ihm geben' : 'Annehmen');

  const nochmal = el('button', {
    class: 'knopf leer breit', style: { display: 'none', marginTop: '9px' },
    onclick: () => { b.schliessen(); radDrehen(raeder); },
  }, 'Noch einmal');

  const b = blatt(scheibe, anzeige, uebernehmen, nochmal);

  let nummer = 0;
  const naechstes = () => {
    if (nummer >= raeder.length) {
      uebernehmen.style.display = '';
      nochmal.style.display = '';
      puls('antwortJa');
      /* Drei und mehr Räder verdienen das Glitzern, eins den warmen Klang. */
      tonSpielen(raeder.length >= 3 ? 'schimmer' : 'weich');
      if (raeder.length >= 4 && typeof konfetti === 'function') konfetti();
      return;
    }
    const rad = raeder[nummer++];
    einRadDrehen(scheibe, rad, (treffer) => {
      ergebnisse.push(treffer);
      anzeige.append(el('p', {
        class: 'zier mitte',
        style: { fontSize: '20px', lineHeight: '1.3', animation: 'einblenden .3s ease' },
      }, treffer));
      setTimeout(naechstes, 620);
    });
  };
  naechstes();
}

/* Ein einzelnes Rad als Scheibe, die ausläuft. Der Zeiger steht oben.

   Gedreht wird von Hand, Bild für Bild: Nur so weiß die App in jedem
   Moment, wo die Scheibe steht — und kann den Zeiger bei jeder
   Feldgrenze hörbar über den Stift schnappen lassen. Eine CSS-Kurve
   könnte hübsch auslaufen, aber sie könnte nicht ratschen. */
function einRadDrehen(platz, rad, fertig) {
  const felder = (rad.felder || []).filter(Boolean);
  if (!felder.length) return fertig('—');

  const treffer = Math.floor(Math.random() * felder.length);
  const proFeld = 360 / felder.length;

  /* Der Zeiger steht oben; das Feld muss also unter ihn gedreht werden.
     Fünf volle Umdrehungen plus ein Zufallshauch, damit keine zwei
     Drehungen gleich aussehen. */
  const ziel = 360 * 5 - (treffer * proFeld + proFeld / 2);

  platz.innerHTML = '';
  const scheibe = el('div', {
    style: {
      position: 'absolute', inset: '0', borderRadius: '50%',
      transform: 'rotate(0deg)',
      boxShadow: '0 10px 40px -12px var(--schein)',
      overflow: 'hidden',
      willChange: 'transform',
    },
  });

  /* Die Felder als Tortenstücke, getrennt von haarfeinen Goldlinien. */
  const stuecke = [];
  felder.forEach((_, i) => {
    const von = i * proFeld;
    const bis = (i + 1) * proFeld;
    const farbe = i % 2 ? farbeVon('--glut') : farbeVon('--glut-tief');
    stuecke.push(`${farbe} ${von}deg ${Math.max(von, bis - 0.9)}deg`);
    stuecke.push(`rgba(240,214,170,.55) ${Math.max(von, bis - 0.9)}deg ${bis}deg`);
  });
  scheibe.style.background = `conic-gradient(${stuecke.join(', ')})`;

  /* Die Beschriftung läuft vom Mittelpunkt nach außen. In der unteren
     Hälfte stünde sie dabei auf dem Kopf — dort wird sie gewendet und
     zeigt nach innen. So ist jedes Wort lesbar, ohne das Gerät zu drehen. */
  felder.forEach((wort, i) => {
    const winkel = i * proFeld + proFeld / 2;

    /* Ob ein Wort auf dem Kopf steht, entscheidet sich nicht an seinem
       Platz auf der Scheibe, sondern daran, wo es zum Stillstand kommt —
       die Scheibe dreht sich ja mehrere Umdrehungen weit. Also wird mit
       der Endlage gerechnet. Während des Drehens sieht ohnehin niemand
       hin; zählen tut der Moment danach. */
    const endlage = (winkel + ziel) % 360;
    const gewendet = endlage > 90 && endlage < 270;

    /* Lange Wörter in schmalen Stücken brauchen kleinere Schrift. */
    const laenge = String(wort).length;
    const groesse = laenge > 14 ? 9 : laenge > 10 ? 10.5 : felder.length > 8 ? 10.5 : 12;

    const speiche = el('div', {
      style: {
        position: 'absolute', left: '0', top: '0', right: '0', bottom: '0',
        transform: `rotate(${winkel}deg)`,
        pointerEvents: 'none',
      },
    }, el('div', {
      style: {
        position: 'absolute', left: '50%', top: '50%',
        width: '88px', marginLeft: '-44px',
        /* Immer gleich weit nach außen — das Wenden dreht nur um die
           eigene Mitte und verschiebt nichts. */
        transform: `translateY(-86px) rotate(${gewendet ? 180 : 0}deg)`,
        textAlign: 'center',
        fontSize: groesse + 'px',
        fontWeight: '600',
        color: '#20120c',
        lineHeight: '1.15',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    }, wort));

    scheibe.append(speiche);
  });

  /* Der Goldrand und ein stehendes Licht von oben links — beides dreht
     sich nicht mit, dadurch wirkt die Scheibe wie unter einer Lampe. */
  const rand = el('div', {
    style: {
      position: 'absolute', inset: '-5px', borderRadius: '50%', zIndex: '1',
      pointerEvents: 'none',
      background: 'conic-gradient(from 210deg, #8f5a2b, #e8b071, #9c6533, #f0d0a0, #8f5a2b)',
      /* closest-side, sonst misst der Verlauf zur Ecke und der Ring
         gerät fingerdick statt haarfein. */
      WebkitMask: 'radial-gradient(circle closest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
      mask: 'radial-gradient(circle closest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
    },
  });
  const licht = el('div', {
    style: {
      position: 'absolute', inset: '0', borderRadius: '50%', zIndex: '1',
      pointerEvents: 'none',
      background: 'radial-gradient(circle at 32% 24%, rgba(255,236,210,.28), transparent 55%)',
    },
  });

  const zeiger = el('div', {
    style: {
      position: 'absolute', left: '50%', top: '-9px', marginLeft: '-10px',
      width: '0', height: '0', zIndex: '3',
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderTop: '19px solid var(--glut-hell)',
      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,.6))',
      transformOrigin: '50% 0',
      transition: 'transform .06s ease-out',
    },
  });

  const nabe = el('div', {
    style: {
      position: 'absolute', left: '50%', top: '50%', width: '36px', height: '36px',
      margin: '-18px 0 0 -18px', borderRadius: '50%', zIndex: '3',
      background: 'radial-gradient(circle at 36% 32%, #3a2a20, #17100c 70%)',
      border: '1px solid color-mix(in srgb, var(--glut-hell) 40%, transparent)',
      boxShadow: 'inset 0 1px 6px color-mix(in srgb, var(--glut-hell) 25%, transparent), 0 2px 8px rgba(0,0,0,.5)',
      display: 'grid', placeItems: 'center',
    },
  }, el('div', {
    style: {
      width: '9px', height: '9px', borderRadius: '50%',
      background: 'var(--verlauf)', boxShadow: '0 0 8px var(--schein)',
    },
  }));

  platz.append(scheibe, rand, licht, zeiger, nabe);

  /* Der Schwung: von Hand ausgerollt (easeOutCubic), damit jede
     überfahrene Feldgrenze ein Schnappen bekommt — Ton, Zeiger-Zucken,
     alle paar Stifte ein Puls. Gegen Ende wird das Ratschen langsamer
     und schwerer: Man HÖRT die Entscheidung näher kommen. */
  const dauer = 3600 + Math.random() * 500;
  const start = performance.now();
  let letzteGrenze = 0;
  let letzterTon = 0;

  puls('hinweis');

  const rollen = (nun) => {
    const anteil = Math.min(1, (nun - start) / dauer);
    const eased = 1 - Math.pow(1 - anteil, 3);
    const winkel = ziel * eased;
    scheibe.style.transform = `rotate(${winkel}deg)`;

    const grenze = Math.floor(winkel / proFeld);
    if (grenze !== letzteGrenze) {
      letzteGrenze = grenze;
      if (nun - letzterTon > 42) {
        letzterTon = nun;
        tonSpielen('ratsche');
        zeiger.style.transform = 'rotate(-11deg)';
        setTimeout(() => { zeiger.style.transform = ''; }, 55);
        if (grenze % 6 === 0) puls('hinweis');
      }
    }

    if (anteil < 1) { requestAnimationFrame(rollen); return; }

    /* Stillstand: Das Siegerfeld — es liegt jetzt oben unterm Zeiger —
       leuchtet dreimal auf, die Scheibe federt kurz. */
    const sieger = el('div', {
      style: {
        position: 'absolute', inset: '0', borderRadius: '50%', zIndex: '2',
        pointerEvents: 'none',
        background: `conic-gradient(from ${-proFeld / 2}deg, rgba(255,220,170,.5) 0deg ${proFeld}deg, transparent ${proFeld}deg)`,
        animation: 'siegerGluehen 1.1s ease-out',
      },
    });
    platz.append(sieger);
    setTimeout(() => sieger.remove(), 1150);

    scheibe.style.transition = 'transform .35s cubic-bezier(.3,1.6,.5,1)';
    scheibe.style.transform = `rotate(${ziel}deg) scale(1.015)`;
    setTimeout(() => { scheibe.style.transform = `rotate(${ziel}deg) scale(1)`; }, 200);

    tonSpielen('tick');
    puls('antwortJa');
    fertig(felder[treffer]);
  };
  requestAnimationFrame(rollen);
}

/* Erst wählen, welche Räder mitlaufen sollen. */
function radAuswahl(raeder) {
  const gewaehlt = new Set();

  const zeile = (rad) => {
    const knopf = el('button', {
      class: 'karte',
      style: { width: '100%', textAlign: 'left', marginTop: '9px' },
      onclick: () => {
        if (gewaehlt.has(rad.id)) gewaehlt.delete(rad.id);
        else gewaehlt.add(rad.id);
        knopf.style.borderColor = gewaehlt.has(rad.id) ? 'var(--glut)' : 'var(--kante)';
        knopf.style.background = gewaehlt.has(rad.id) ? 'var(--flaeche-hoch)' : 'var(--flaeche)';
      },
    }, el('div', { style: { fontWeight: '500' } }, rad.name),
       el('div', { class: 'still klein' }, (rad.felder || []).length + ' Felder'));
    return knopf;
  };

  const b = blatt(
    el('h2', {}, 'Welche Räder?'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 4px' } },
      'Sie laufen in dieser Reihenfolge nacheinander.'),
    ...raeder.map(zeile),
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '16px' },
      onclick: () => {
        const reihe = raeder.filter((r) => gewaehlt.has(r.id));
        if (!reihe.length) return meldung('Noch keins gewählt.');
        b.schliessen();
        radDrehen(reihe);
      },
    }, 'Drehen')
  );
}

/* --- Räder pflegen -------------------------------------------------------- */

function radAnlegen(vorhandenes) {
  const name = el('input', { class: 'feld', placeholder: 'Wofür ist dieses Rad?', value: vorhandenes ? vorhandenes.name : '' });
  const felder = el('textarea', {
    class: 'feld', rows: 8, style: { marginTop: '9px' },
    placeholder: 'Ein Feld je Zeile.',
    value: vorhandenes ? (vorhandenes.felder || []).join('\n') : '',
  });

  const b = blatt(
    el('h2', {}, vorhandenes ? 'Rad ändern' : 'Neues Rad'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Zwei bis zwölf Felder lesen sich am besten.'),
    name, felder,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          const liste = felder.value.split('\n').map((z) => z.trim()).filter(Boolean);
          if (!name.value.trim()) return meldung('Ein Name fehlt.');
          if (liste.length < 2) return meldung('Mindestens zwei Felder.');
          b.schliessen();
          const wert = { name: name.value.trim(), felder: liste };
          if (vorhandenes) await datenAendern('raeder', vorhandenes.id, wert);
          else await datenAnhaengen('raeder', wert);
          meldung('Steht.');
        },
      }, 'Sichern')
    )
  );
  setTimeout(() => name.focus(), 260);
}

function radBearbeiten(rad) {
  const b = blatt(
    el('h2', {}, rad.name),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px', whiteSpace: 'pre-wrap' } },
      (rad.felder || []).join(' · ')),
    el('div', { class: 'knopfreihe' },
      el('button', {
        class: 'knopf leer warnend',
        onclick: async () => { b.schliessen(); await datenEintragLoeschen('raeder', rad.id); },
      }, 'Wegnehmen'),
      el('button', {
        class: 'knopf glut',
        onclick: () => { b.schliessen(); radAnlegen(rad); },
      }, 'Ändern')
    )
  );
}
