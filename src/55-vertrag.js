/* ==========================================================================
   55-vertrag.js — Der Vertrag, das Nachher, das Eigene.

   Drei Dinge, die alle mit Ernst zu tun haben:

     Der Vertrag   Was gilt, mit beiden Unterschriften. Versioniert.
     Das Nachher   Getrennt aufschreiben, dann zusammen ansehen.
     Das Eigene    Ein Bereich, den die App dem anderen nie zeigt.
   ========================================================================== */

SEITEN.vertrag = function (seite) {
  seite.append(kopfzeile('Der Vertrag',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('vertrag', (fassungen) => vertragZeichnen(platz, fassungen));
  beimVerlassen(stopp);
};

function vertragZeichnen(platz, fassungen) {
  platz.innerHTML = '';

  if (!fassungen.length) {
    platz.append(
      leerlauf('Noch kein Vertrag',
        'Was gilt zwischen euch? Schreibt es auf, unterschreibt es — und ändert es, wenn es sich ändert.'),
      el('button', {
        class: 'knopf glut breit', style: { marginTop: '13px' },
        onclick: () => vertragSchreiben(),
      }, 'Aufsetzen')
    );
    return;
  }

  const gueltig = fassungen[fassungen.length - 1];
  const frueher = fassungen.slice(0, -1);

  platz.append(vertragBlatt(gueltig));

  platz.append(el('div', { class: 'knopfreihe', style: { marginTop: '14px' } },
    el('button', {
      class: 'knopf leer',
      onclick: () => vertragSchreiben(gueltig),
    }, 'Neu fassen'),
    el('button', {
      class: 'knopf glut',
      onclick: () => unterschreiben(gueltig),
    }, (gueltig.unterschriften || {})[D.rolle] ? 'Neu unterschreiben' : 'Unterschreiben')
  ));

  if (frueher.length) {
    platz.append(el('button', {
      class: 'winzig still', style: { display: 'block', margin: '20px auto 0' },
      onclick: () => vertragVerlauf(frueher),
    }, frueher.length + (frueher.length === 1 ? ' frühere Fassung' : ' frühere Fassungen')));
  }
}

/* Die Darstellung ist bewusst feierlicher als der Rest der App — mehr
   Rand, mehr Serifen, gedeckterer Grund. Es soll sich nach etwas anfühlen. */
function vertragBlatt(fassung) {
  const unter = fassung.unterschriften || {};

  return el('div', {
    style: {
      padding: '28px 24px 24px',
      borderRadius: 'var(--rund)',
      background: 'linear-gradient(168deg, #1f1813, #171310)',
      border: '1px solid rgba(232,168,124,.22)',
      boxShadow: '0 4px 30px -12px var(--schein)',
    },
  },
    el('div', { class: 'mitte', style: { marginBottom: '22px' } },
      el('div', { class: 'winzig', style: { color: 'var(--glut)', letterSpacing: '.34em' } }, 'Zwischen uns'),
      el('div', {
        style: {
          width: '46px', height: '1px', margin: '13px auto 0',
          background: 'linear-gradient(to right, transparent, var(--glut), transparent)',
        },
      })
    ),

    el('div', {
      class: 'zier',
      style: { fontSize: '16.5px', lineHeight: '1.7', whiteSpace: 'pre-wrap' },
    }, fassung.text),

    el('div', {
      style: {
        display: 'flex', gap: '18px', marginTop: '28px', paddingTop: '18px',
        borderTop: '1px solid rgba(232,168,124,.16)',
      },
    },
      ...['domme', 'sub'].map((rolle) => el('div', { style: { flex: '1', textAlign: 'center' } },
        unter[rolle]
          ? el('img', {
              src: unter[rolle].zug,
              style: { width: '100%', height: '52px', objectFit: 'contain' },
            })
          : el('div', { style: { height: '52px', display: 'grid', placeItems: 'center' } },
              el('span', { class: 'still klein' }, 'noch nicht')),
        el('div', {
          style: { height: '1px', background: 'rgba(232,168,124,.28)', margin: '2px 0 7px' },
        }),
        el('div', { class: 'winzig still' }, nameVon(rolle)),
        unter[rolle]
          ? el('div', { class: 'winzig still', style: { marginTop: '2px', opacity: '.7' } },
              new Date(unter[rolle].wann).toLocaleDateString('de-DE'))
          : null
      ))
    )
  );
}

function vertragSchreiben(vorlage) {
  const feld = el('textarea', {
    class: 'feld', rows: 13,
    style: { lineHeight: '1.6' },
    placeholder: 'Rollen. Regeln. Grenzen. Wörter, die alles anhalten.\n\nSchreibt, was gilt.',
    value: vorlage ? vorlage.text : '',
  });

  const b = blatt(
    el('h2', {}, vorlage ? 'Neu fassen' : 'Aufsetzen'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      vorlage
        ? 'Die bisherige Fassung bleibt als Fassung erhalten. Unterschrieben werden muss neu.'
        : 'Ihr könnt das jederzeit ändern — nichts hiervon ist in Stein.'),
    feld,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!feld.value.trim()) return meldung('Da steht noch nichts.');
          b.schliessen();
          await datenAnhaengen('vertrag', { text: feld.value.trim(), unterschriften: {} });
          pushSenden(andereRolle(), 'hinweis', 'Etwas Grundsätzliches hat sich geändert.');
          meldung('Aufgesetzt. Jetzt fehlen die Unterschriften.');
        },
      }, 'Festhalten')
    )
  );
  setTimeout(() => feld.focus(), 260);
}

/* --- Unterschreiben ------------------------------------------------------- */

/* Mit dem Finger auf den Bildschirm. Es ist kein rechtliches Dokument —
   es ist ein Ritual, und dafür ist die eigene Handschrift das Richtige. */

function unterschreiben(fassung) {
  const breite = 300, hoehe = 130;

  const tafel = el('canvas', {
    width: String(breite * 2), height: String(hoehe * 2),
    style: {
      width: '100%', height: hoehe + 'px', display: 'block',
      borderRadius: '12px', background: 'var(--grund2)',
      border: '1px solid var(--kante)', touchAction: 'none',
    },
  });

  const stift = tafel.getContext('2d');
  stift.strokeStyle = '#e8a87c';
  stift.lineWidth = 4.5;
  stift.lineCap = 'round';
  stift.lineJoin = 'round';

  let zeichnet = false;
  let letzte = null;
  let etwasDa = false;

  const stelle = (e) => {
    const k = tafel.getBoundingClientRect();
    return {
      x: (e.clientX - k.left) / k.width * tafel.width,
      y: (e.clientY - k.top) / k.height * tafel.height,
    };
  };

  tafel.addEventListener('pointerdown', (e) => {
    zeichnet = true;
    etwasDa = true;
    letzte = stelle(e);
    tafel.setPointerCapture(e.pointerId);
  });
  tafel.addEventListener('pointermove', (e) => {
    if (!zeichnet) return;
    e.preventDefault();
    const p = stelle(e);
    stift.beginPath();
    stift.moveTo(letzte.x, letzte.y);
    stift.lineTo(p.x, p.y);
    stift.stroke();
    letzte = p;
  });
  const auf = () => { zeichnet = false; letzte = null; };
  tafel.addEventListener('pointerup', auf);
  tafel.addEventListener('pointerleave', auf);

  const b = blatt(
    el('h2', { class: 'mitte' }, 'Unterschreiben'),
    el('p', { class: 'leise klein mitte', style: { margin: '7px 0 14px' } },
      'Mit dem Finger. Krakelig ist richtig.'),
    tafel,
    el('button', {
      class: 'winzig still', style: { display: 'block', margin: '11px auto 0' },
      onclick: () => { stift.clearRect(0, 0, tafel.width, tafel.height); etwasDa = false; },
    }, 'Noch einmal'),
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!etwasDa) return meldung('Da ist noch nichts.');
          b.schliessen();

          /* FRISCH lesen, nicht den Stand vom Zeichnen der Seite nehmen:
             Hat der andere inzwischen unterschrieben, würde die alte
             Kopie seine Unterschrift sonst stillschweigend überschreiben. */
          const alle = await datenListe('vertrag').catch(() => []);
          const frisch = alle.find((x) => x.id === fassung.id) || fassung;
          const unter = { ...(frisch.unterschriften || {}) };
          unter[D.rolle] = { zug: tafel.toDataURL('image/png'), wann: jetzt() };
          await datenAendern('vertrag', fassung.id, { unterschriften: unter });

          const beide = unter.domme && unter.sub;
          pushSenden(andereRolle(), 'hinweis', beide ? 'Es steht.' : 'Eine Unterschrift fehlt noch.');
          puls('antwortJa');
          if (beide) {
            tonSpielen('schimmer');
            if (typeof konfetti === 'function') konfetti();
          } else {
            tonSpielen('weich');
          }
          meldung(beide ? 'Es steht.' : 'Unterschrieben. Eine fehlt noch.');
        },
      }, 'Unterschreiben')
    )
  );
}

function vertragVerlauf(frueher) {
  blatt(
    el('h2', {}, 'Frühere Fassungen'),
    el('div', { style: { height: '12px' } }),
    ...frueher.slice().reverse().map((f) => {
      const karte = el('div', { class: 'karte', style: { marginTop: '9px' } },
        el('p', { class: 'winzig still', style: { marginBottom: '7px' } },
          new Date(f.wann).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })),
        el('p', {
          class: 'leise klein',
          style: { whiteSpace: 'pre-wrap', maxHeight: '96px', overflow: 'hidden' },
        }, f.text)
      );
      karte.addEventListener('click', () => blatt(vertragBlatt(f)));
      return karte;
    })
  );
};

/* ==========================================================================
   Das Nachher
   ========================================================================== */

/* Beide schreiben getrennt, und erst wenn beide fertig sind, wird beides
   sichtbar. So schreibt niemand seine Antwort auf die des anderen hin. */

SEITEN.nachher = function (seite) {
  seite.append(kopfzeile('Danach',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '18px', lineHeight: '1.5' } },
    'Getrennt aufschreiben. Sichtbar wird beides erst, wenn beide geschrieben haben.'));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('nachher', (liste) => nachherZeichnen(platz, liste));
  beimVerlassen(stopp);
};

function nachherZeichnen(platz, liste) {
  platz.innerHTML = '';

  /* Zusammengehörig ist, was am selben Tag geschrieben wurde. */
  const nachTag = {};
  liste.forEach((e) => {
    const t = e.tag || tagstempel(e.wann);
    nachTag[t] = nachTag[t] || {};
    nachTag[t][e.von] = e;
  });

  const heute = tagstempel();
  const heutige = nachTag[heute] || {};

  if (!heutige[D.rolle]) {
    platz.append(el('button', {
      class: 'knopf glut breit',
      onclick: nachherSchreiben,
    }, 'Für heute aufschreiben'));
  } else if (!heutige[andereRolle()]) {
    platz.append(el('div', { class: 'karte', style: { textAlign: 'center' } },
      el('p', { class: 'leise' }, 'Du hast geschrieben.'),
      el('p', { class: 'still klein', style: { marginTop: '6px' } },
        'Sichtbar wird es, sobald ' + nameVon(andereRolle()) + ' auch geschrieben hat.')
    ));
  }

  const tage = Object.keys(nachTag).sort().reverse();
  tage.forEach((tag) => {
    const paar = nachTag[tag];
    if (!paar.domme || !paar.sub) return;   /* erst wenn beide da sind */

    platz.append(el('p', { class: 'winzig still', style: { margin: '20px 0 8px 2px' } },
      tag === heute ? 'Heute' : new Date(paar.domme.wann).toLocaleDateString('de-DE',
        { weekday: 'long', day: 'numeric', month: 'long' })));

    ['domme', 'sub'].forEach((rolle) => {
      const e = paar[rolle];
      platz.append(el('div', { class: 'karte', style: { marginTop: '8px' } },
        el('p', { class: 'winzig still', style: { marginBottom: '9px' } }, nameVon(rolle)),
        e.gut ? feldZeile('Gut war', e.gut) : null,
        e.weniger ? feldZeile('Weniger', e.weniger) : null,
        e.gefuehl ? feldZeile('Ich fühle mich', e.gefuehl) : null
      ));
    });
  });
}

function feldZeile(marke, text) {
  return el('div', { style: { marginTop: '9px' } },
    el('div', { class: 'winzig', style: { color: 'var(--glut)', marginBottom: '3px' } }, marke),
    el('div', { style: { whiteSpace: 'pre-wrap' } }, text)
  );
}

function nachherSchreiben() {
  const gut = el('textarea', { class: 'feld', rows: 2, placeholder: 'Was gut war.' });
  const weniger = el('textarea', { class: 'feld', rows: 2, placeholder: 'Was weniger war.', style: { marginTop: '9px' } });
  const gefuehl = el('textarea', { class: 'feld', rows: 2, placeholder: 'Wie du dich fühlst.', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Danach'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Ehrlich, nicht höflich. Es liest nur einer.'),
    gut, weniger, gefuehl,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Später'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!gut.value.trim() && !weniger.value.trim() && !gefuehl.value.trim()) {
            return meldung('Da steht noch nichts.');
          }
          b.schliessen();
          await datenAnhaengen('nachher', {
            tag: tagstempel(),
            gut: gut.value.trim(),
            weniger: weniger.value.trim(),
            gefuehl: gefuehl.value.trim(),
          });
          /* Haben jetzt beide geschrieben, zählt der Tag fürs Paar. */
          const heutige = (await datenListe('nachher')).filter((x) => (x.tag || '') === tagstempel());
          if (heutige.some((x) => x.von === 'domme') && heutige.some((x) => x.von === 'sub')) paarXp(15);
          pushSenden(andereRolle(), 'hinweis', 'Etwas wartet auf deine Antwort.');
          meldung('Geschrieben.');
        },
      }, 'Ablegen')
    )
  );
  setTimeout(() => gut.focus(), 260);
}

/* ==========================================================================
   Das Eigene
   ========================================================================== */

/* Ein Bereich, den die App dem anderen nicht zeigt. Für Gedanken, die noch
   nicht so weit sind.

   Ehrlich gesagt: Ihr teilt einen Schlüssel. Wer wollte, könnte in der
   Ablage nachsehen. Die App tut es nicht — das ist eine Abmachung, kein
   Schloss. Deshalb liegt das Eigene auch nicht in der Ablage, sondern nur
   auf diesem Gerät. Es reist nicht mit, und es geht mit dem Gerät verloren.
   Das ist der Preis dafür, dass es wirklich privat ist. */

SEITEN.eigenes = function (seite) {
  seite.append(kopfzeile('Nur für dich',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '18px', lineHeight: '1.5' } },
    'Bleibt auf diesem Gerät. Es geht nicht in die Ablage und reist nicht mit — deshalb kann auch niemand sonst hineinsehen.'));

  const platz = el('div');
  seite.append(platz);
  eigenesZeichnen(platz);
};

function eigenesZeichnen(platz) {
  const eintraege = Gerät.lies('eigenes', []);
  platz.innerHTML = '';

  platz.append(el('button', {
    class: 'knopf glut breit',
    onclick: () => eigenesSchreiben(platz),
  }, 'Etwas aufschreiben'));

  if (!eintraege.length) {
    platz.append(leerlauf('Noch leer', 'Für Gedanken, die noch nicht ausgesprochen sind — Entwürfe, Fragen, Halbfertiges. Nur du siehst sie.'));
    return;
  }

  eintraege.slice().reverse().forEach((e) => {
    const karte = el('div', { class: 'karte', style: { marginTop: '9px' } },
      el('p', { class: 'winzig still', style: { marginBottom: '7px' } },
        new Date(e.wann).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })),
      el('div', { style: { whiteSpace: 'pre-wrap' } }, e.text)
    );
    langerDruck(karte, async () => {
      const weg = await frage('Löschen?', '', 'Löschen', true);
      if (!weg) return;
      Gerät.schreib('eigenes', Gerät.lies('eigenes', []).filter((x) => x.wann !== e.wann));
      eigenesZeichnen(platz);
    });
    platz.append(karte);
  });
}

function eigenesSchreiben(platz) {
  eingabeBlatt({
    titel: 'Nur für dich',
    hinweis: 'Niemand sonst liest das.',
    platzhalter: '…',
    mehrzeilig: true,
    jaText: 'Ablegen',
  }, (text) => {
    const eintraege = Gerät.lies('eigenes', []);
    eintraege.push({ text, wann: jetzt() });
    Gerät.schreib('eigenes', eintraege.slice(-300));
    eigenesZeichnen(platz);
    meldung('Abgelegt.');
  });
}
