/* ==========================================================================
   53-spannung.js — Was über den Tag hinweg wirkt.

   Vier Werkzeuge, die alle dasselbe tun: Sie erzeugen einen Abstand
   zwischen dem Wissen, dass etwas kommt, und dem Wissen, was es ist.

     Uhr        Er sieht nur den Countdown. Nicht, was danach geschieht.
     Verborgen  Ein Auftrag mit Enthüllungsdatum.
     Krümel     Kleine Hinweise, die über den Tag verteilt auftauchen.
     Impulse    Ein Topf, aus dem zu zufälligen Zeiten etwas kommt.

   Ihnen allen ist gemeinsam: Die Zeit macht die Arbeit, nicht die App.
   ========================================================================== */

SEITEN.spannung = function (seite) {
  seite.append(kopfzeile('Spannung',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '14px' } },
    istDomme()
      ? 'Alles, was Vorfreude baut: eine tickende Uhr, Verborgenes mit Datum, Krümel über den Tag, Impulse aus dem Topf.'
      : 'Was sie für dich vorbereitet hat: Uhren, Verborgenes, Krümel — du siehst, DASS etwas kommt, nie was.'));

  const uhrplatz = el('div', { class: 'abschnitt' });
  const verborgenplatz = el('div', { class: 'abschnitt' });
  const kruemelplatz = el('div', { class: 'abschnitt' });
  const impulsplatz = el('div', { class: 'abschnitt' });
  seite.append(uhrplatz, verborgenplatz, kruemelplatz, impulsplatz);

  const zeichneUhr = async () => uhrZeichnen(uhrplatz, await datenLies('uhr', null));
  zeichneUhr();
  const s0 = ablageHorch('uhr', zeichneUhr);

  const s1 = datenHorch('verborgen', (liste) => verborgenZeichnen(verborgenplatz, liste));
  const s2 = datenHorch('kruemel', (liste) => kruemelZeichnen(kruemelplatz, liste));
  const s3 = datenHorch('impulse', (liste) => impulseZeichnen(impulsplatz, liste));

  beimVerlassen(() => { s0.then((f) => f && f()).catch(() => {}); });
  beimVerlassen(s1); beimVerlassen(s2); beimVerlassen(s3);
};

/* --- Die Uhr -------------------------------------------------------------- */

/* Sie stellt einen Countdown. Er sieht die Ziffern und sonst nichts. Was
   beim Ablauf geschieht, hat sie hinterlegt — oder auch nicht. Beides ist
   erlaubt, und er kann es nicht unterscheiden. */

let _uhrTakt = null;

function uhrZeichnen(platz, uhr) {
  clearInterval(_uhrTakt);
  platz.innerHTML = '';
  platz.append(kopfzeile('Die Uhr'));

  if (!uhr || !uhr.bis) {
    platz.append(leerlauf('Keine Uhr läuft',
      istDomme() ? 'Stell eine. Er sieht nur, wie sie abläuft.' : 'Gerade läuft nichts.'));
    if (istDomme()) {
      platz.append(el('button', {
        class: 'knopf leer breit', style: { marginTop: '11px' }, onclick: uhrStellen,
      }, 'Uhr stellen'));
    }
    return;
  }

  const abgelaufen = uhr.bis <= jetzt();
  const ziffern = el('div', {
    class: 'zier',
    style: {
      fontSize: '46px', textAlign: 'center', fontVariantNumeric: 'tabular-nums',
      color: 'var(--glut-hell)', letterSpacing: '.03em',
    },
  });

  const karte = el('div', { class: 'karte glimmt', style: { textAlign: 'center' } },
    el('p', { class: 'winzig still' }, uhr.titel || 'Bis dahin'),
    ziffern
  );

  const ticken = () => {
    const uebrig = uhr.bis - jetzt();
    if (uebrig <= 0) {
      clearInterval(_uhrTakt);
      ziffern.textContent = '00:00';
      ziffern.style.color = 'var(--rot)';
      return;
    }
    ziffern.textContent = dauerText(uebrig);
  };
  ticken();
  if (!abgelaufen) _uhrTakt = setInterval(ticken, 1000);

  if (abgelaufen) {
    if (uhr.enthuellung) {
      karte.append(el('p', {
        class: 'zier', style: { fontSize: '20px', marginTop: '14px', lineHeight: '1.3' },
      }, uhr.enthuellung));
    } else {
      karte.append(el('p', { class: 'leise klein', style: { marginTop: '12px' } },
        'Und dann? Nichts. Diesmal.'));
    }
    karte.append(el('button', {
      class: 'knopf leer breit', style: { marginTop: '14px' },
      onclick: async () => { await datenLoesch('uhr'); zeigeSeite('spannung'); },
    }, 'Wegräumen'));
  } else if (istDomme()) {
    karte.append(
      el('p', { class: 'winzig still', style: { marginTop: '13px' } },
        uhr.enthuellung ? 'Hinterlegt: ' + uhr.enthuellung : 'Nichts hinterlegt — auch das ist eine Antwort.'),
      el('div', { class: 'knopfreihe', style: { marginTop: '13px' } },
        el('button', {
          class: 'knopf leer', style: { minHeight: '38px', fontSize: '13px' },
          onclick: async () => { await datenLoesch('uhr'); zeigeSeite('spannung'); },
        }, 'Abbrechen'),
        el('button', {
          class: 'knopf glut', style: { minHeight: '38px', fontSize: '13px' },
          onclick: uhrStellen,
        }, 'Ändern')
      )
    );
  }

  platz.append(karte);
  beimVerlassen(() => clearInterval(_uhrTakt));
}

function uhrStellen() {
  let minuten = 60;
  const titel = el('input', { class: 'feld', placeholder: 'Was steht darüber? (freiwillig)' });
  const enthuellung = el('textarea', {
    class: 'feld', rows: 2, style: { marginTop: '9px' },
    placeholder: 'Was er beim Ablauf lesen soll. Leer lassen ist erlaubt.',
  });

  const reihe = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '4px' } });
  const zeichne = () => {
    reihe.innerHTML = '';
    [15, 30, 60, 120, 240, 480].forEach((m) => {
      reihe.append(el('button', {
        class: 'knopf' + (minuten === m ? ' glut' : ' leer'),
        style: { minHeight: '38px', padding: '7px 14px', fontSize: '13px' },
        onclick: () => { minuten = m; zeichne(); },
      }, m < 60 ? m + ' Min' : (m / 60) + ' Std'));
    });
  };
  zeichne();

  const b = blatt(
    el('h2', {}, 'Die Uhr stellen'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 0' } },
      'Er sieht die Ziffern ablaufen — mehr nicht.'),
    el('p', { class: 'winzig still', style: { margin: '15px 0 0' } }, 'Wie lange'),
    reihe,
    el('p', { class: 'winzig still', style: { margin: '15px 0 0' } }, 'Beschriftung'),
    titel, enthuellung,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          b.schliessen();
          await datenSchreib('uhr', {
            bis: jetzt() + minuten * 60000,
            titel: titel.value.trim(),
            enthuellung: enthuellung.value.trim(),
          });
          pushSenden('sub', 'hinweis', 'Eine Uhr läuft.');
          meldung('Sie läuft.');
          zeigeSeite('spannung');
        },
      }, 'Starten')
    )
  );
}

/* --- Verborgene Aufträge -------------------------------------------------- */

/* Er sieht: „Etwas wartet" und einen Countdown. Erst danach den Inhalt.
   Die Enthüllung passiert beim Ansehen, nicht durch einen Hintergrunddienst —
   das genügt völlig und braucht keinen Server. */

function verborgenZeichnen(platz, liste) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Verborgen',
    istDomme() ? el('button', { class: 'winzig still', onclick: verborgenAnlegen }, '+ Neu') : null
  ));

  const offen = liste.filter((v) => !v.erledigt);
  if (!offen.length) {
    platz.append(leerlauf('Nichts verborgen',
      istDomme() ? 'Plan etwas voraus — er sieht nur, dass es kommt.' : 'Gerade wartet nichts.'));
    return;
  }

  offen.forEach((v) => {
    const soweit = (v.ab || 0) <= jetzt();
    const karte = el('div', { class: 'karte' + (soweit ? ' glimmt' : '') },
      soweit
        ? el('div', {},
            el('p', { class: 'winzig still', style: { marginBottom: '7px' } }, 'Jetzt sichtbar'),
            el('div', { class: 'zier', style: { fontSize: '18px' } }, v.titel),
            v.text ? el('p', { class: 'leise klein', style: { marginTop: '5px', whiteSpace: 'pre-wrap' } }, v.text) : null
          )
        : el('div', { style: { textAlign: 'center' } },
            el('p', { class: 'winzig still', style: { marginBottom: '8px' } }, 'Etwas wartet'),
            el('div', {
              class: 'zier',
              style: { fontSize: '27px', color: 'var(--glut-hell)', fontVariantNumeric: 'tabular-nums' },
            }, bisText(v.ab)),
            istDomme()
              ? el('p', { class: 'winzig still', style: { marginTop: '9px' } }, 'Hinterlegt: ' + v.titel)
              : null
          )
    );

    if (soweit) {
      karte.append(el('div', { class: 'knopfreihe', style: { marginTop: '13px' } },
        el('button', {
          class: 'knopf leer', style: { minHeight: '38px', fontSize: '13px' },
          onclick: async () => { await datenAendern('verborgen', v.id, { erledigt: true }); },
        }, 'Wegräumen'),
        el('button', {
          class: 'knopf glut', style: { minHeight: '38px', fontSize: '13px' },
          onclick: async () => {
            await datenAendern('verborgen', v.id, { erledigt: true });
            await datenAnhaengen('auftraege', {
              titel: v.titel, text: v.text, fach: 'War verborgen',
              art: 'verborgen', erledigt: false, bestaetigt: false,
            });
            meldung('Steht jetzt bei den Aufträgen.');
          },
        }, 'Übernehmen')
      ));
    } else if (istDomme()) {
      langerDruck(karte, async () => {
        const weg = await frage('Wegnehmen?', v.titel, 'Wegnehmen', true);
        if (weg) await datenEintragLoeschen('verborgen', v.id);
      });
    }

    platz.append(karte);
  });
}

/* Wie lange noch — in Tagen, Stunden oder Minuten, je nachdem, was zählt. */
function bisText(zeit) {
  const uebrig = (zeit || 0) - jetzt();
  if (uebrig <= 0) return 'jetzt';
  const tage = Math.floor(uebrig / 86400000);
  if (tage >= 1) return tage + (tage === 1 ? ' Tag' : ' Tage');
  return dauerText(uebrig);
}

function verborgenAnlegen() {
  const titel = el('input', { class: 'feld', placeholder: 'Was soll es sein?' });
  const text = el('textarea', { class: 'feld', rows: 3, placeholder: 'Genauer, wenn nötig.', style: { marginTop: '9px' } });
  const wann = el('input', { class: 'feld', type: 'datetime-local', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Etwas verbergen'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Bis zum Zeitpunkt sieht er nur einen Countdown.'),
    titel, text,
    el('label', { class: 'feldmarke', style: { marginTop: '15px' } }, 'Sichtbar ab'),
    wann,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!titel.value.trim()) return meldung('Ein Titel fehlt.');
          if (!wann.value) return meldung('Wann soll es sichtbar werden?');
          b.schliessen();
          await datenAnhaengen('verborgen', {
            titel: titel.value.trim(),
            text: text.value.trim(),
            ab: new Date(wann.value).getTime(),
            erledigt: false,
          });
          pushSenden('sub', 'hinweis', 'Etwas wartet.');
          meldung('Liegt bereit.');
        },
      }, 'Verbergen')
    )
  );
  setTimeout(() => titel.focus(), 260);
}

/* --- Krümel --------------------------------------------------------------- */

/* Kleine Hinweise, die über den Tag verteilt auftauchen. Zusammen ergeben
   sie ein Bild — oder auch nicht, wenn sie den Plan noch ändert. */

function kruemelZeichnen(platz, liste) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Krümel',
    istDomme() ? el('button', { class: 'winzig still', onclick: kruemelAnlegen }, '+ Neu') : null
  ));

  const heute = tagstempel();
  const heutige = liste.filter((k) => (k.tag || tagstempel(k.wann)) === heute);
  const sichtbare = heutige.filter((k) => (k.ab || 0) <= jetzt());
  const kommende = heutige.filter((k) => (k.ab || 0) > jetzt());

  if (!heutige.length) {
    platz.append(leerlauf('Keine Krümel heute',
      istDomme() ? 'Streu ein paar aus — sie tauchen zu ihren Zeiten auf.' : 'Heute nichts.'));
    return;
  }

  sichtbare.forEach((k, i) => {
    platz.append(el('div', {
      class: 'karte',
      style: {
        marginTop: '9px', borderLeft: '2px solid var(--glut)',
        animation: 'einblenden .3s ease ' + (i * 0.05) + 's both',
      },
    },
      el('p', { class: 'winzig still', style: { marginBottom: '5px' } }, uhrzeit(k.ab)),
      el('div', { class: 'zier', style: { fontSize: '17px' } }, k.text)
    ));
  });

  if (kommende.length) {
    platz.append(el('div', {
      class: 'karte',
      style: { marginTop: '9px', textAlign: 'center', borderStyle: 'dashed', background: 'transparent' },
    },
      el('p', { class: 'leise klein' },
        kommende.length === 1 ? 'Noch einer kommt heute.' : 'Noch ' + kommende.length + ' kommen heute.'),
      istDomme()
        ? el('p', { class: 'winzig still', style: { marginTop: '7px' } },
            kommende.map((k) => uhrzeit(k.ab)).join(' · '))
        : null
    ));
  }
}

function kruemelAnlegen() {
  const text = el('textarea', { class: 'feld', rows: 5, placeholder: 'Ein Krümel je Zeile.' });
  const von = el('input', { class: 'feld', type: 'time', value: '09:00', style: { marginTop: '9px' } });
  const bis = el('input', { class: 'feld', type: 'time', value: '20:00', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Krümel streuen'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Sie werden über den Zeitraum verteilt — er weiß nicht, wann der nächste kommt.'),
    text,
    el('label', { class: 'feldmarke', style: { marginTop: '15px' } }, 'Von'), von,
    el('label', { class: 'feldmarke', style: { marginTop: '11px' } }, 'Bis'), bis,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          const zeilen = text.value.split('\n').map((z) => z.trim()).filter(Boolean);
          if (!zeilen.length) return meldung('Da steht noch nichts.');
          b.schliessen();

          const heute = new Date();
          const [vs, vm] = von.value.split(':').map(Number);
          const [bs, bm] = bis.value.split(':').map(Number);
          const anfang = new Date(heute).setHours(vs, vm, 0, 0);
          const ende = new Date(heute).setHours(bs, bm, 0, 0);
          const spanne = Math.max(60000, ende - anfang);

          /* Gleichmäßig verteilt, aber jeder Zeitpunkt bekommt einen
             Stups ins Ungefähre — sonst käme jeder Krümel auf die
             volle Viertelstunde, und das Muster wäre schnell durchschaut. */
          const zeiten = zeilen.map((_, i) => {
            const grund = anfang + (spanne / zeilen.length) * (i + 0.5);
            const stups = (Math.random() - 0.5) * (spanne / zeilen.length) * 0.7;
            return Math.round(grund + stups);
          }).sort((a, b2) => a - b2);

          for (let i = 0; i < zeilen.length; i++) {
            await datenAnhaengen('kruemel', {
              text: zeilen[i], ab: zeiten[i], tag: tagstempel(),
            });
          }
          meldung(zeilen.length + ' gestreut.');
        },
      }, 'Streuen')
    )
  );
  setTimeout(() => text.focus(), 260);
}

/* --- Zufalls-Impulse ------------------------------------------------------ */

/* Ein Topf, aus dem die App zu einer zufälligen Zeit am Tag etwas zieht.
   Ohne Server geht das so: Beim ersten Öffnen des Tages würfelt die App
   einen Zeitpunkt aus. Ist er erreicht, kommt der Impuls — beim nächsten
   Blick in die App, oder als Hinweis, wenn sie offen ist. */

function impulseZeichnen(platz, liste) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Impulse',
    istDomme() ? el('button', { class: 'winzig still', onclick: impulsAnlegen }, '+ Neu') : null
  ));

  if (!liste.length) {
    platz.append(leerlauf('Der Topf ist leer',
      istDomme() ? 'Füll ihn — die App greift zu zufälligen Zeiten hinein.' : 'Nichts drin.'));
    return;
  }

  if (!istDomme()) {
    platz.append(el('div', { class: 'karte', style: { textAlign: 'center' } },
      el('div', { class: 'zier glutschrift', style: { fontSize: '34px' } }, String(liste.length)),
      el('p', { class: 'leise klein', style: { marginTop: '4px' } },
        'im Topf. Wann etwas kommt, weißt du nicht.')
    ));
    return;
  }

  liste.forEach((i) => {
    const zeile = el('div', { class: 'karte', style: { padding: '11px 14px', marginTop: '8px' } }, i.text);
    langerDruck(zeile, async () => {
      const weg = await frage('Herausnehmen?', i.text, 'Herausnehmen', true);
      if (weg) await datenEintragLoeschen('impulse', i.id);
    });
    platz.append(zeile);
  });
}

function impulsAnlegen() {
  eingabeBlatt({
    titel: 'Ein Impuls',
    hinweis: 'Ein Wort, ein Satz, eine kleine Aufgabe. Kommt, wann es kommt.',
    platzhalter: '…',
    mehrzeilig: true,
    jaText: 'Hineinlegen',
  }, async (text) => {
    for (const zeile of text.split('\n').map((z) => z.trim()).filter(Boolean)) {
      await datenAnhaengen('impulse', { text: zeile });
    }
    meldung('Im Topf.');
  });
}

/* --- Was beim Öffnen fällig ist ------------------------------------------- */

/* Wird beim Start und bei jeder Rückkehr aufgerufen. Sie prüft, ob ein
   Krümel oder ein Impuls fällig geworden ist, während niemand hinsah. */

async function spannungPruefen() {
  if (istDomme() || !D.offen) return;

  /* Krümel von heute, die seit dem letzten Blick aufgetaucht sind. */
  try {
    const kruemel = await datenListe('kruemel');
    const heute = tagstempel();
    const gesehen = Gerät.lies('kruemelGesehen', {});
    const faellig = kruemel.filter((k) =>
      (k.tag || tagstempel(k.wann)) === heute && (k.ab || 0) <= jetzt() && !gesehen[k.id]);

    if (faellig.length) {
      faellig.forEach((k) => { gesehen[k.id] = true; });
      Gerät.schreib('kruemelGesehen', gesehen);
      const neuster = faellig[faellig.length - 1];
      puls('hinweis');
      meldungMitTat(neuster.text, 'Mehr', () => zeigeSeite('spannung'), 9000);
    }
  } catch { /* ohne Netz eben später */ }

  /* Der Impuls des Tages. */
  await impulsPruefen();
}

async function impulsPruefen() {
  const heute = tagstempel();
  let plan = Gerät.lies('impulsPlan', null);

  /* Für jeden Tag einmal würfeln: wann heute etwas kommt. */
  if (!plan || plan.tag !== heute) {
    const stunde = 9 + Math.floor(Math.random() * 12);
    const minute = Math.floor(Math.random() * 60);
    const wann = new Date();
    wann.setHours(stunde, minute, 0, 0);
    plan = { tag: heute, wann: wann.getTime(), gezeigt: false };
    Gerät.schreib('impulsPlan', plan);
  }

  if (plan.gezeigt || plan.wann > jetzt()) return;

  try {
    const topf = await datenListe('impulse');
    if (!topf.length) return;
    plan.gezeigt = true;
    Gerät.schreib('impulsPlan', plan);

    const gezogen = zufall(topf);
    puls('befehl');
    const knopf = el('button', { class: 'knopf glut breit' }, 'Gelesen');
    const bRef = blatt(
      el('p', { class: 'winzig still mitte', style: { marginBottom: '16px' } }, 'Gerade eben'),
      el('p', {
        class: 'zier mitte',
        style: { fontSize: '25px', lineHeight: '1.32', padding: '0 8px 22px' },
      }, gezogen.text),
      knopf
    );
    /* Nur das eigene Blatt schließen — nicht alles, was offen ist. */
    knopf.addEventListener('click', () => bRef.schliessen());
  } catch { /* dann eben morgen */ }
}
