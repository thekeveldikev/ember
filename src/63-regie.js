/* ==========================================================================
   63-regie.js — Die Session-Regie.

   Alles andere in der App gibt euch etwas VORHER — eine Karte, ein
   Ergebnis. Die Regie läuft WÄHRENDDESSEN: ein Skript aus zeitgesteuerten
   Schritten, das Handy liegt daneben, der Bildschirm zeigt nur den
   aktuellen Schritt, und beim Wechsel meldet sich ein Puls oder ein Ton.

   Keiner entscheidet mehr. Beide folgen. Sie hat das Skript ausgesucht —
   das ist ihre Kontrolle, ohne dass sie dirigieren muss.

   Der Lauf liegt in der Ablage, beide Geräte rechnen aus derselben
   Startzeit — so bleiben sie im Takt, ohne dass einer dem anderen
   etwas schicken muss. Im Modus »nur sie« sieht sein Gerät nur Glut.
   ========================================================================== */

let _regieRunner = null;     // das offene Vollbild
let _regieTakt = null;
let _regieHorcherLaeuft = false;
let _regieWachlicht = null;  // Wake Lock

SEITEN.regie = function (seite) {
  seite.append(kopfzeile('Die Regie',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '14px' } },
    istDomme()
      ? 'Ein Skript führt euch Schritt für Schritt durch eine Szene. Du siehst alle Schritte — er bekommt immer nur den nächsten.'
      : 'Sie startet ein Skript — du bekommst immer nur den nächsten Schritt, nie den ganzen Plan.'));

  const laufplatz = el('div');
  const listenplatz = el('div');
  seite.append(laufplatz, listenplatz);

  datenLies('regieLauf').then((lauf) => {
    if (lauf && lauf.skript) {
      laufplatz.append(el('div', { class: 'karte glimmt', style: { textAlign: 'center', marginBottom: '14px' } },
        el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, 'Läuft gerade'),
        el('div', { class: 'zier', style: { fontSize: '19px', marginBottom: '12px' } }, lauf.skript.name),
        el('button', { class: 'knopf glut breit', onclick: () => regieRunnerOeffnen() }, 'Zurück hinein')
      ));
    }
  }).catch(() => {});

  const eigene = [];
  const zeichnen = () => {
    listenplatz.innerHTML = '';

    const vorratRegien = vorratAn()
      ? VORRAT.regien.filter((r) => (r.intensitaet || 1) <= vorratWirksameStufe())
      : [];

    if (!vorratRegien.length && !eigene.length) {
      listenplatz.append(leerlauf('Keine Skripte',
        'Der Vorrat ist aus — oder die Ampel lässt gerade nichts zu.'));
    }

    [...eigene.map((e) => ({ ...e, eigen: true })), ...vorratRegien].forEach((skript) => {
      const karte = el('button', {
        class: 'karte',
        style: { width: '100%', textAlign: 'left', marginTop: '9px' },
        onclick: () => regieVorschau(skript),
      },
        el('div', { class: 'zier', style: { fontSize: '17px' } }, skript.name),
        el('div', { class: 'winzig still', style: { marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
          (skript.gesamtdauer_min || Math.round(skript.schritte.reduce((s, x) => s + x.dauer_sek, 0) / 60)) + ' Min · ' + skript.schritte.length + ' Schritte',
          skript.intensitaet ? glutPunkte(skript.intensitaet) : null),
        skript.beschreibung ? el('div', { class: 'still klein', style: { marginTop: '3px' } }, skript.beschreibung) : null,
        skript.anzeige === 'nur_domme' ? el('div', { class: 'winzig', style: { marginTop: '5px', color: 'var(--glut-hell)' } }, 'Nur ' + nameVon('domme') + ' sieht die Anweisungen und sagt sie an.') : null
      );
      if (skript.eigen && istDomme()) {
        langerDruck(karte, async () => {
          const weg = await frage('Skript löschen?', skript.name, 'Löschen', true);
          if (weg) await datenEintragLoeschen('regien', skript.id);
        });
      }
      listenplatz.append(karte);
    });

    if (istDomme()) {
      listenplatz.append(el('button', {
        class: 'knopf leer breit', style: { marginTop: '12px' },
        onclick: regieBauen,
      }, '+ Eigenes Skript aus Bausteinen'));
    }
  };
  zeichnen();

  const stopp = datenHorch('regien', (liste) => { eigene.length = 0; eigene.push(...liste); zeichnen(); });
  beimVerlassen(stopp);
};

/* --- Vorschau und Start ---------------------------------------------------- */

function regieVorschau(skript) {
  const dauer = skript.gesamtdauer_min || Math.round(skript.schritte.reduce((s, x) => s + x.dauer_sek, 0) / 60);
  const b = blatt(
    el('h2', {}, skript.name),
    el('p', { class: 'leise klein', style: { margin: '7px 0 4px' } },
      dauer + ' Minuten · ' + skript.schritte.length + ' Schritte' +
      (skript.anzeige === 'nur_domme' ? ' · nur ' + nameVon('domme') + ' sieht die Anweisungen' : '')),
    skript.beschreibung ? el('p', { class: 'still klein', style: { marginBottom: '10px' } }, skript.beschreibung) : null,
    istDomme()
      ? el('div', { style: { maxHeight: '30vh', overflowY: 'auto', margin: '8px 0' } },
          ...skript.schritte.map((s, i) => el('p', { class: 'klein', style: { padding: '5px 0', borderTop: i ? '1px solid var(--kante)' : 'none' } },
            el('span', { class: 'still' }, Math.round(s.dauer_sek / 60 * 10) / 10 + ' Min · '), s.text_domme || s.text || '')))
      : el('p', { class: 'still klein', style: { margin: '10px 0' } }, 'Die Schritte siehst du erst, wenn sie dran sind — das ist der Sinn der Sache.'),
    istDomme() ? el('button', {
      class: 'knopf glut breit', style: { marginTop: '10px' },
      onclick: async () => {
        b.schliessen();
        await datenSchreib('regieLauf', { skript, start: jetzt(), versatz: 0, pausiertAb: null });
        pushSenden('sub', 'befehl', 'Es beginnt. Leg das Handy neben dich.');
        puls('befehl');
        regieRunnerOeffnen();
      },
    }, 'Beginnen') : el('p', { class: 'still klein mitte', style: { marginTop: '10px' } }, 'Ob und wann, entscheidet sie.')
  );
}

/* --- Der Läufer ------------------------------------------------------------ */

function _regieStand(lauf) {
  const nun = lauf.pausiertAb || jetzt();
  let rest = Math.max(0, nun - lauf.start - (lauf.versatz || 0)) / 1000;
  const schritte = lauf.skript.schritte;
  for (let i = 0; i < schritte.length; i++) {
    if (rest < schritte[i].dauer_sek) return { i, uebrig: schritte[i].dauer_sek - rest, fertig: false };
    rest -= schritte[i].dauer_sek;
  }
  return { i: schritte.length - 1, uebrig: 0, fertig: true };
}

async function regieRunnerOeffnen() {
  if (_regieRunner) return;
  const lauf = await datenLies('regieLauf').catch(() => null);
  if (!lauf || !lauf.skript) return meldung('Gerade läuft keine Regie.');

  const skript = lauf.skript;
  const anzeige = skript.anzeige || 'beide';
  const blind = (anzeige === 'nur_domme' && !istDomme()) || (anzeige === 'nur_sub' && istDomme());

  try { _regieWachlicht = await navigator.wakeLock.request('screen'); } catch { /* dann eben nicht */ }

  const schrittText = el('div', {
    class: 'zier',
    style: { fontSize: 'clamp(24px, 6.4vw, 36px)', lineHeight: '1.3', maxWidth: '17ch', margin: '0 auto' },
  });
  const uhr = el('div', { class: 'uhr' });
  const zaehler = el('p', { class: 'winzig', style: { color: 'rgba(232,168,124,.55)', letterSpacing: '.3em' } });

  const steuerung = el('div', { style: { display: 'flex', gap: '9px', justifyContent: 'center', flexWrap: 'wrap' } });

  const schirm = el('div', { class: 'befehl', style: { zIndex: '750', gap: '20px' } },
    zaehler,
    blind ? el('div', { class: 'funke', style: { width: '16px', height: '16px', margin: '10px auto' } }) : null,
    schrittText, blind ? null : uhr, steuerung,
    el('button', {
      class: 'winzig still', style: { marginTop: '4px' },
      onclick: () => regieRunnerSchliessen(),
    }, 'Nur Ansicht verlassen — die Regie läuft weiter')
  );

  document.body.append(schirm);
  _regieRunner = schirm;

  let letzterSchritt = -1;
  let aktuellerLauf = lauf;

  const zeichneSteuerung = () => {
    steuerung.innerHTML = '';
    if (!istDomme()) return;
    const pausiert = !!aktuellerLauf.pausiertAb;
    steuerung.append(
      el('button', {
        class: 'knopf leer', style: { minHeight: '40px', fontSize: '13px' },
        onclick: async () => {
          if (pausiert) {
            const stand = { ...aktuellerLauf, versatz: (aktuellerLauf.versatz || 0) + (jetzt() - aktuellerLauf.pausiertAb), pausiertAb: null };
            await datenSchreib('regieLauf', stand);
          } else {
            await datenSchreib('regieLauf', { ...aktuellerLauf, pausiertAb: jetzt() });
          }
        },
      }, pausiert ? 'Weiter' : 'Anhalten'),
      el('button', {
        class: 'knopf leer', style: { minHeight: '40px', fontSize: '13px' },
        onclick: async () => {
          await datenSchreib('regieLauf', { ...aktuellerLauf, versatz: (aktuellerLauf.versatz || 0) + 30000 });
        },
      }, '+30 s'),
      el('button', {
        class: 'knopf leer', style: { minHeight: '40px', fontSize: '13px' },
        onclick: async () => {
          const stand = _regieStand(aktuellerLauf);
          await datenSchreib('regieLauf', { ...aktuellerLauf, versatz: (aktuellerLauf.versatz || 0) - Math.ceil(stand.uebrig) * 1000 });
        },
      }, 'Überspringen'),
      el('button', {
        class: 'knopf leer warnend', style: { minHeight: '40px', fontSize: '13px' },
        onclick: () => regieBeenden(aktuellerLauf),
      }, 'Beenden')
    );
  };
  zeichneSteuerung();

  const ticken = () => {
    const stand = _regieStand(aktuellerLauf);
    const schritt = skript.schritte[stand.i];

    if (stand.fertig) {
      schrittText.textContent = blind ? 'Es ist vorbei.' : 'Das war die Regie.';
      uhr.textContent = '';
      zaehler.textContent = 'ENDE';
      if (istDomme() && letzterSchritt !== -2) { letzterSchritt = -2; }
      return;
    }

    if (stand.i !== letzterSchritt) {
      const erster = letzterSchritt === -1;
      letzterSchritt = stand.i;
      zaehler.textContent = 'SCHRITT ' + (stand.i + 1) + ' / ' + skript.schritte.length;
      schrittText.textContent = blind
        ? (istDomme() ? nameVon('sub') + ' übernimmt. Du musst nichts tun.' : nameVon('domme') + ' sagt dir, was zu tun ist.')
        : (istDomme() ? (schritt.text_domme || schritt.text || '') : (schritt.text_sub || schritt.text || ''));
      schrittText.style.animation = 'none';
      requestAnimationFrame(() => { schrittText.style.animation = 'einblenden .45s ease'; });
      if (!erster) {
        if (schritt.signal === 'ton') tonSpielen('gong');
        else if (schritt.signal !== 'still') { puls('bitte'); tonSpielen('tick'); }
      }
    }

    uhr.textContent = dauerText(stand.uebrig * 1000) + (aktuellerLauf.pausiertAb ? ' · angehalten' : '');
  };
  ticken();
  _regieTakt = setInterval(ticken, 500);

  /* Änderungen des anderen Geräts (Pause, +30 s, Ende) sofort übernehmen. */
  const horch = ablageHorch('regieLauf', async () => {
    const frisch = await datenLies('regieLauf').catch(() => null);
    if (!frisch || !frisch.skript) { regieRunnerSchliessen(); return; }
    aktuellerLauf = frisch;
    zeichneSteuerung();
  });
  schirm._horchWeg = () => horch.then((f) => f && f()).catch(() => {});
}

function regieRunnerSchliessen() {
  if (!_regieRunner) return;
  clearInterval(_regieTakt);
  if (_regieRunner._horchWeg) _regieRunner._horchWeg();
  if (_regieWachlicht) { _regieWachlicht.release().catch(() => {}); _regieWachlicht = null; }
  _regieRunner.style.animation = 'befehlAn .26s ease reverse';
  const weg = _regieRunner;
  setTimeout(() => weg.remove(), 240);
  _regieRunner = null;
}

async function regieBeenden(lauf) {
  await datenLoesch('regieLauf').catch(() => {});
  pushSenden(andereRolle(), 'hinweis', 'Die Regie ist zu Ende.');
  regieRunnerSchliessen();

  /* Der Abschluss gehört dazu: ein Eintrag ins Buch, eine Zahl. */
  if (!istDomme()) return;
  let flammen = 3;
  const reihe = el('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center', margin: '12px 0 4px' } });
  const zeichne = () => {
    reihe.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      reihe.append(el('button', {
        style: { fontSize: '26px', opacity: i <= flammen ? '1' : '.25', padding: '4px' },
        onclick: () => { flammen = i; zeichne(); },
      }, el('span', { style: { color: 'var(--glut-hell)' } }, sinnbild('flamme', 26))));
    }
  };
  zeichne();
  const b = blatt(
    el('h2', { class: 'mitte' }, 'Wie war es?'),
    reihe,
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '14px' },
      onclick: async () => {
        b.schliessen();
        await datenAnhaengen('log', {
          tag: tagstempel(), flammen, stimmung: 'Regie',
          satz: 'Regie: ' + (lauf.skript.name || '') + ' — zu Ende geführt.',
        }).catch(() => {});
        if (typeof paarXp === 'function') paarXp(15);
        meldung('Steht im Buch.');
      },
    }, 'Festhalten')
  );
}

/* --- Beim Start horchen: die Regie holt beide ab --------------------------- */

function regieHorcherStarten() {
  if (_regieHorcherLaeuft) return;
  _regieHorcherLaeuft = true;
  ablageHorch('regieLauf', async () => {
    const lauf = await datenLies('regieLauf').catch(() => null);
    if (!lauf || !lauf.skript || _regieRunner) return;
    if (jetzt() - lauf.start > 120000) return;   // alte Läufe nicht aufdrängen
    puls('befehl');
    meldungMitTat('Die Regie beginnt.', 'Hinein', () => regieRunnerOeffnen(), 12000);
  }).catch(() => {});
}

/* --- Eigene Skripte aus Bausteinen ----------------------------------------- */

function regieBauen() {
  const gewaehlt = [];
  const name = el('input', { class: 'feld', placeholder: 'Wie soll es heißen?' });
  const liste = el('div', { style: { maxHeight: '34vh', overflowY: 'auto', margin: '10px 0' } });
  const gewaehltAnzeige = el('p', { class: 'still klein', style: { minHeight: '18px' } });

  const zeichneWahl = () => {
    gewaehltAnzeige.textContent = gewaehlt.length
      ? gewaehlt.map((g, i) => (i + 1) + '. ' + g.text).join(' · ')
      : 'Tippe Bausteine in der Reihenfolge an, in der sie laufen sollen.';
  };
  zeichneWahl();

  (VORRAT.regieBausteine || []).forEach((baustein) => {
    liste.append(el('button', {
      class: 'karte',
      style: { width: '100%', textAlign: 'left', marginTop: '7px', padding: '10px 13px' },
      onclick: () => { gewaehlt.push(baustein); zeichneWahl(); tonSpielen('tick'); },
    },
      el('div', { style: { fontWeight: '500', fontSize: '14px' } }, baustein.text),
      el('div', { class: 'still klein' }, Math.round(baustein.dauer_sek / 60 * 10) / 10 + ' Min · ' + baustein.typ)
    ));
  });

  const b = blatt(
    el('h2', {}, 'Eigenes Skript'),
    name,
    liste,
    gewaehltAnzeige,
    el('div', { class: 'knopfreihe', style: { marginTop: '14px' } },
      el('button', { class: 'knopf leer', onclick: () => { gewaehlt.length = 0; zeichneWahl(); } }, 'Leeren'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!name.value.trim()) return meldung('Ein Name fehlt.');
          if (gewaehlt.length < 2) return meldung('Mindestens zwei Bausteine.');
          b.schliessen();
          await datenAnhaengen('regien', {
            name: name.value.trim(),
            anzeige: 'beide',
            intensitaet: 3,
            schritte: gewaehlt.map((g, i) => ({
              nr: i + 1, dauer_sek: g.dauer_sek, text: g.text,
              signal: 'vibration', typ: g.typ,
            })),
          });
          meldung('Gespeichert.');
        },
      }, 'Sichern')
    )
  );
}
