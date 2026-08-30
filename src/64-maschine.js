/* ==========================================================================
   64-maschine.js — Die Wenn-Dann-Maschine.

   Kein Inhalt, sondern Infrastruktur: Sie baut Regeln nach dem Muster
   WENN … (UND …) DANN …, und die App führt sie von selbst aus. Er weiß
   irgendwann nicht mehr, ob sie gerade entschieden hat oder ob eine
   Regel greift, die sie vor Wochen gebaut hat. Genau das ist der Punkt.

   Ohne eigenen Server heißt „von selbst": Das Domme-Gerät prüft beim
   Öffnen, bei Rückkehr aus dem Hintergrund und alle paar Minuten, ob
   Zeit-Regeln fällig sind. Ereignis-Regeln (Knopf, Ampel, Aufgabe)
   feuern auf dem Gerät, auf dem das Ereignis passiert.

   SICHERUNGEN — fest verdrahtet, nicht abschaltbar:
     · Ampel Rot oder der Notausgang halten ALLES an.
     · Nachtruhe 23–7 Uhr (je Regel aufhebbar, aber Vorgabe).
     · Höchstens 5 automatische Aktionen am Tag.
     · Jede Auslösung steht im Protokoll.
     · Er sieht, DASS Regeln laufen — nicht welche.
   ========================================================================== */

const MASCHINE_AUSLOESER = [
  { key: 'uhrzeit', name: 'Zu einer Uhrzeit', felder: ['zeit'] },
  { key: 'zufallszeit', name: 'Irgendwann am Tag', felder: ['von', 'bis'] },
  { key: 'app_oeffnen', name: 'Wenn er die App öffnet', felder: [] },
  { key: 'knopf', name: 'Wenn der Knopf gedrückt wird', felder: [] },
  { key: 'ampel', name: 'Wenn seine Ampel wechselt', felder: ['farbe'] },
  { key: 'aufgabe_erledigt', name: 'Tagesaufgabe erledigt', felder: [] },
  { key: 'serie', name: 'Serie erreicht', felder: ['tage'] },
  { key: 'datum', name: 'An einem Datum', felder: ['datum'] },
  { key: 'manuell', name: 'Nur von Hand', felder: [] },
];

const MASCHINE_BEDINGUNGEN = [
  { key: 'keine', name: 'Ohne Bedingung', felder: [] },
  { key: 'wochentag', name: 'Nur werktags', felder: [] },
  { key: 'wochenende', name: 'Nur am Wochenende', felder: [] },
  { key: 'ampel_gruen', name: 'Nur wenn beide auf Grün', felder: [] },
  { key: 'getrennt', name: 'Nur wenn wir getrennt sind', felder: [] },
  { key: 'zusammen', name: 'Nur wenn wir zusammen sind', felder: [] },
  { key: 'wuerfel', name: 'Nur mit 50 % Wahrscheinlichkeit', felder: [] },
];

const MASCHINE_AKTIONEN = [
  { key: 'nachricht', name: 'Nachricht in den Chat', felder: ['text'] },
  { key: 'befehl', name: 'Sofort-Befehl an ihn', felder: ['text'] },
  { key: 'push', name: 'Stiller Hinweis an ihn', felder: ['text'] },
  { key: 'aufgabe', name: 'Auftrag anlegen', felder: ['text'] },
  { key: 'karte', name: 'Karte aus einem Deck ziehen', felder: ['deck'] },
  { key: 'szenario', name: 'Szenario würfeln und geben', felder: [] },
  { key: 'los', name: 'Ein Los hinlegen', felder: [] },
  { key: 'strafe', name: 'Etwas Ausstehendes eintragen', felder: ['text'] },
  { key: 'strafe_weg', name: 'Eine Strafe streichen', felder: [] },
  { key: 'karma', name: 'Karma ändern', felder: ['wert'] },
  { key: 'uhr', name: 'Die Uhr stellen', felder: ['minuten'] },
];

let _maschineTakt = null;

/* --- Die Seite ------------------------------------------------------------- */

SEITEN.maschine = function (seite) {
  seite.append(kopfzeile('Wenn — Dann',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  const platz = el('div');
  seite.append(platz);

  if (!istDomme()) {
    datenListe('maschine/regeln').then((regeln) => {
      const aktive = regeln.filter((r) => r.aktiv).length;
      platz.append(el('div', { class: 'karte', style: { textAlign: 'center', padding: '26px 18px' } },
        el('div', { class: 'zier glutschrift', style: { fontSize: '38px' } }, String(aktive)),
        el('p', { class: 'leise klein', style: { marginTop: '6px', lineHeight: '1.5' } },
          aktive === 1 ? 'Eine Regel läuft. Welche, weißt du nicht.' :
          aktive ? 'Regeln laufen. Welche, weißt du nicht.' : 'Gerade läuft keine Regel. Sagt sie.')
      ));
    });
    return;
  }

  const kopf = el('div');
  const listenplatz = el('div');
  platz.append(kopf, listenplatz);

  datenLies('maschine/an', false).then((an) => {
    kopf.append(
      el('button', {
        class: 'knopf breit ' + (an ? 'glut' : 'leer'),
        onclick: async () => {
          await datenSchreib('maschine/an', !an);
          zeigeSeite('maschine');
          meldung(!an ? 'Die Maschine läuft.' : 'Alles angehalten.');
        },
      }, an ? 'Die Maschine läuft' : 'Die Maschine ist aus'),
      el('p', { class: 'still klein', style: { margin: '8px 2px 14px', lineHeight: '1.5' } },
        'Fest eingebaut: Bei Rot oder Notausgang passiert nichts. Nachts (23–7 Uhr) ist Ruhe. Höchstens fünf Aktionen am Tag. Alles steht im Protokoll.')
    );
  });

  const stopp = datenHorch('maschine/regeln', (regeln) => {
    listenplatz.innerHTML = '';

    regeln.forEach((regel) => {
      const zeile = el('div', { class: 'karte', style: { marginTop: '9px', opacity: regel.aktiv ? '1' : '.55' } },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' } },
          el('div', { style: { minWidth: '0', flex: '1' } },
            el('div', { style: { fontWeight: '500' } }, regel.name),
            el('div', { class: 'still klein', style: { marginTop: '2px' } }, maschineSatz(regel))
          ),
          el('button', {
            class: 'knopf leer', style: { minHeight: '34px', padding: '5px 12px', fontSize: '12px', flex: 'none' },
            onclick: async () => { await datenAendern('maschine/regeln', regel.id, { aktiv: !regel.aktiv }); },
          }, regel.aktiv ? 'An' : 'Aus')
        ),
        regel.ausloeser && regel.ausloeser.typ === 'manuell' && regel.aktiv
          ? el('button', {
              class: 'knopf glut breit', style: { marginTop: '10px', minHeight: '38px', fontSize: '13px' },
              onclick: () => maschineFeuern(regel, true),
            }, 'Jetzt auslösen')
          : null
      );
      langerDruck(zeile, async () => {
        const weg = await frage('Regel löschen?', regel.name, 'Löschen', true);
        if (weg) await datenEintragLoeschen('maschine/regeln', regel.id);
      });
      listenplatz.append(zeile);
    });

    listenplatz.append(
      el('div', { class: 'knopfreihe', style: { marginTop: '14px' } },
        el('button', { class: 'knopf leer', onclick: maschineBibliothek }, 'Aus der Bibliothek'),
        el('button', { class: 'knopf glut', onclick: () => maschineEditor() }, '+ Eigene Regel')
      ),
      el('button', {
        class: 'winzig still', style: { display: 'block', margin: '16px auto 0' },
        onclick: maschineProtokoll,
      }, 'Protokoll ansehen')
    );
  });
  beimVerlassen(stopp);
};

function maschineSatz(regel) {
  const a = MASCHINE_AUSLOESER.find((x) => x.key === (regel.ausloeser || {}).typ);
  const t = (regel.aktionen || []).map((x) => {
    const m = MASCHINE_AKTIONEN.find((y) => y.key === x.typ);
    return m ? m.name : x.typ;
  }).join(' + ');
  let wenn = a ? a.name : '?';
  if (regel.ausloeser) {
    if (regel.ausloeser.zeit) wenn += ' (' + regel.ausloeser.zeit + ')';
    if (regel.ausloeser.tage) wenn += ' (' + regel.ausloeser.tage + ' Tage)';
    if (regel.ausloeser.farbe) wenn += ' (auf ' + regel.ausloeser.farbe + ')';
  }
  return wenn + ' → ' + t;
}

/* --- Der Editor ------------------------------------------------------------ */

function maschineEditor(vorlage) {
  const regel = vorlage ? JSON.parse(JSON.stringify(vorlage)) : {
    name: '', aktiv: true,
    ausloeser: { typ: 'uhrzeit', zeit: '20:00' },
    bedingung: 'keine',
    aktionen: [{ typ: 'nachricht', text: '' }],
  };
  delete regel.id;

  const name = el('input', { class: 'feld', placeholder: 'Wie heißt die Regel?', value: regel.name || '' });

  const wennWahl = el('select', { class: 'feld', style: { marginTop: '9px' } },
    ...MASCHINE_AUSLOESER.map((a) => el('option', { value: a.key, selected: regel.ausloeser.typ === a.key }, a.name)));
  const wennFelder = el('div');

  const undWahl = el('select', { class: 'feld', style: { marginTop: '9px' } },
    ...MASCHINE_BEDINGUNGEN.map((b2) => el('option', { value: b2.key, selected: regel.bedingung === b2.key }, b2.name)));

  const dannWahl = el('select', { class: 'feld', style: { marginTop: '9px' } },
    ...MASCHINE_AKTIONEN.map((a) => el('option', { value: a.key, selected: (regel.aktionen[0] || {}).typ === a.key }, a.name)));
  const dannFelder = el('div');

  const zeichneWenn = () => {
    wennFelder.innerHTML = '';
    const art = wennWahl.value;
    if (art === 'uhrzeit') {
      wennFelder.append(el('input', { class: 'feld', type: 'time', value: regel.ausloeser.zeit || '20:00', style: { marginTop: '7px' }, onchange: (e) => { regel.ausloeser.zeit = e.target.value; } }));
    } else if (art === 'zufallszeit') {
      wennFelder.append(
        el('input', { class: 'feld', type: 'time', value: regel.ausloeser.von || '09:00', style: { marginTop: '7px' }, onchange: (e) => { regel.ausloeser.von = e.target.value; } }),
        el('input', { class: 'feld', type: 'time', value: regel.ausloeser.bis || '18:00', style: { marginTop: '7px' }, onchange: (e) => { regel.ausloeser.bis = e.target.value; } })
      );
    } else if (art === 'ampel') {
      wennFelder.append(el('select', { class: 'feld', style: { marginTop: '7px' }, onchange: (e) => { regel.ausloeser.farbe = e.target.value; } },
        ...['gruen', 'gelb', 'rot'].map((f) => el('option', { value: f, selected: regel.ausloeser.farbe === f }, f))));
    } else if (art === 'serie') {
      wennFelder.append(el('input', { class: 'feld', type: 'number', min: '2', placeholder: 'Tage (z. B. 7)', value: regel.ausloeser.tage || '', style: { marginTop: '7px' }, onchange: (e) => { regel.ausloeser.tage = parseInt(e.target.value, 10) || 7; } }));
    } else if (art === 'datum') {
      wennFelder.append(el('input', { class: 'feld', type: 'date', value: regel.ausloeser.datum || '', style: { marginTop: '7px' }, onchange: (e) => { regel.ausloeser.datum = e.target.value; } }));
    }
  };
  wennWahl.addEventListener('change', () => { regel.ausloeser = { typ: wennWahl.value }; zeichneWenn(); });
  zeichneWenn();

  const zeichneDann = () => {
    dannFelder.innerHTML = '';
    const art = dannWahl.value;
    const felder = (MASCHINE_AKTIONEN.find((a) => a.key === art) || {}).felder || [];
    if (felder.includes('text')) {
      dannFelder.append(el('input', { class: 'feld', placeholder: 'Der Text dazu', value: regel.aktionen[0].text || '', style: { marginTop: '7px' }, onchange: (e) => { regel.aktionen[0].text = e.target.value; } }));
    }
    if (felder.includes('deck')) {
      dannFelder.append(el('select', { class: 'feld', style: { marginTop: '7px' }, onchange: (e) => { regel.aktionen[0].deck = e.target.value; } },
        ...VORRAT.deckMeta.map((d) => el('option', { value: d.key, selected: regel.aktionen[0].deck === d.key }, d.name))));
    }
    if (felder.includes('wert')) {
      dannFelder.append(el('input', { class: 'feld', type: 'number', placeholder: 'z. B. -2 oder +3', value: regel.aktionen[0].wert || '', style: { marginTop: '7px' }, onchange: (e) => { regel.aktionen[0].wert = parseInt(e.target.value, 10) || 0; } }));
    }
    if (felder.includes('minuten')) {
      dannFelder.append(el('input', { class: 'feld', type: 'number', placeholder: 'Minuten', value: regel.aktionen[0].minuten || '', style: { marginTop: '7px' }, onchange: (e) => { regel.aktionen[0].minuten = parseInt(e.target.value, 10) || 60; } }));
    }
  };
  dannWahl.addEventListener('change', () => { regel.aktionen = [{ typ: dannWahl.value }]; zeichneDann(); });
  zeichneDann();

  const b = blatt(
    el('h2', {}, vorlage ? 'Regel übernehmen' : 'Eine Regel'),
    name,
    el('p', { class: 'feldmarke', style: { marginTop: '13px' } }, 'Wenn'),
    wennWahl, wennFelder,
    el('p', { class: 'feldmarke', style: { marginTop: '13px' } }, 'Und'),
    undWahl,
    el('p', { class: 'feldmarke', style: { marginTop: '13px' } }, 'Dann'),
    dannWahl, dannFelder,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!name.value.trim()) return meldung('Ein Name fehlt.');
          regel.name = name.value.trim();
          regel.ausloeser.typ = wennWahl.value;
          regel.bedingung = undWahl.value;
          regel.aktionen[0].typ = dannWahl.value;
          b.schliessen();
          await datenAnhaengen('maschine/regeln', regel);
          meldung('Die Regel steht.');
        },
      }, 'Scharf stellen')
    )
  );
  setTimeout(() => name.focus(), 260);
}

/* --- Die Bibliothek -------------------------------------------------------- */

/* Die 30 fertigen Regeln aus dem Vorrat, übersetzt auf das, was diese
   App wirklich ausführen kann. Was (noch) nicht geht — Geofencing,
   Level-Schwellen —, wird ehrlich weggelassen statt still zu scheitern. */
function _bibliothekUebersetzen(roh) {
  const ausloeserKarte = {
    uhrzeit: (a) => ({ typ: 'uhrzeit', zeit: a.zeit }),
    zufallszeit: (a) => ({ typ: 'zufallszeit', von: a.zeitfenster_von, bis: a.zeitfenster_bis }),
    app_oeffnen: () => ({ typ: 'app_oeffnen' }),
    button_gedrueckt: () => ({ typ: 'knopf' }),
    ampel_wechsel: (a) => ({ typ: 'ampel', farbe: a.auf_farbe || 'gelb' }),
    task_erledigt: () => ({ typ: 'aufgabe_erledigt' }),
    streak_erreicht: (a) => ({ typ: 'serie', tage: a.tage || 7 }),
    datum: (a) => ({ typ: 'datum', datum: a.datum }),
    manuell: () => ({ typ: 'manuell' }),
  };
  const aktionKarte = {
    nachricht: (x) => ({ typ: 'nachricht', text: x.text }),
    befehl: (x) => ({ typ: 'befehl', text: x.text }),
    benachrichtigung: (x) => ({ typ: 'push', text: x.text }),
    task_erstellen: (x) => ({ typ: 'aufgabe', text: x.text }),
    karte_ziehen: (x) => ({ typ: 'karte', deck: x.deck || 'soft' }),
    szenario_generieren: () => ({ typ: 'szenario' }),
    los_vergeben: () => ({ typ: 'los' }),
    karma_aendern: (x) => ({ typ: 'karma', wert: x.wert }),
    strafe_hinzufuegen: (x) => ({ typ: 'strafe', text: x.text }),
    strafe_streichen: () => ({ typ: 'strafe_weg' }),
    timer_starten: (x) => ({ typ: 'uhr', minuten: Math.round((x.dauer || 60)) }),
    domme_alarm: (x) => ({ typ: 'push_domme', text: x.text }),
    vibration: () => null,   // läuft als Beiwerk der Nachricht mit
  };

  const wandler = ausloeserKarte[(roh.ausloeser || {}).typ];
  if (!wandler) return null;
  const aktionen = (roh.aktionen || []).map((x) => {
    const w = aktionKarte[x.typ];
    return w ? w(x) : undefined;   // undefined = unbekannt -> Regel fällt raus
  });
  if (aktionen.some((x) => x === undefined)) return null;

  return {
    name: roh.name, aktiv: false,
    ausloeser: wandler(roh.ausloeser),
    bedingung: 'keine',
    aktionen: aktionen.filter(Boolean),
  };
}

function maschineBibliothek() {
  const brauchbar = (VORRAT.regeln || [])
    .map((r) => ({ roh: r, fertig: _bibliothekUebersetzen(r) }))
    .filter((x) => x.fertig && x.fertig.aktionen.length);

  const b = blatt(
    el('h2', {}, 'Die Bibliothek'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 10px' } },
      brauchbar.length + ' fertige Regeln. Übernehmen heißt: Sie gehört dir und lässt sich ändern. Scharf ist sie erst, wenn du sie anschaltest.'),
    el('div', { style: { maxHeight: '46vh', overflowY: 'auto' } },
      ...brauchbar.map(({ fertig }) => el('button', {
        class: 'karte', style: { width: '100%', textAlign: 'left', marginTop: '8px' },
        onclick: () => { b.schliessen(); maschineEditor(fertig); },
      },
        el('div', { style: { fontWeight: '500' } }, fertig.name),
        el('div', { class: 'still klein', style: { marginTop: '2px' } }, maschineSatz(fertig))
      ))
    )
  );
}

/* --- Das Protokoll --------------------------------------------------------- */

async function maschineProtokoll() {
  const liste = await datenListe('maschine/protokoll').catch(() => []);
  blatt(
    el('h2', {}, 'Was gefeuert hat'),
    liste.length
      ? el('div', { style: { maxHeight: '50vh', overflowY: 'auto' } },
          ...liste.slice(-30).reverse().map((p) => el('div', { class: 'karte', style: { padding: '10px 13px', marginTop: '8px' } },
            el('p', { class: 'winzig still', style: { marginBottom: '3px' } }, new Date(p.wann2 || p.wann).toLocaleString('de-DE')),
            el('div', { class: 'klein' }, p.text)
          )))
      : el('p', { class: 'leise klein', style: { marginTop: '10px' } }, 'Noch nichts. Die Maschine wartet.')
  );
}

/* --- Der Motor ------------------------------------------------------------- */

async function _maschineDarf() {
  if (D.ruhe) return false;
  if ([D.ampel.domme, D.ampel.sub].includes('rot')) return false;
  const an = await datenLies('maschine/an', false).catch(() => false);
  if (!an) return false;
  const std = new Date().getHours();
  if (std >= 23 || std < 7) return false;
  const heute = await datenLies('maschine/heute', {}).catch(() => ({}));
  if (heute.tag === tagstempel() && (heute.anzahl || 0) >= 5) return false;
  return true;
}

function _bedingungOk(regel) {
  const b = regel.bedingung || 'keine';
  const tag = new Date().getDay();
  if (b === 'wochentag') return tag >= 1 && tag <= 5;
  if (b === 'wochenende') return tag === 0 || tag === 6;
  if (b === 'ampel_gruen') return D.ampel.domme === 'gruen' && D.ampel.sub === 'gruen';
  if (b === 'getrennt') return vorratGetrennt();
  if (b === 'zusammen') return !vorratGetrennt();
  if (b === 'wuerfel') return Math.random() < 0.5;
  return true;
}

async function maschineFeuern(regel, vonHand = false) {
  if (!vonHand && !(await _maschineDarf())) return;
  if (!vonHand && !_bedingungOk(regel)) return;

  for (const aktion of regel.aktionen || []) {
    try { await _aktionAusfuehren(aktion); } catch { /* eine kaputte Aktion reißt nicht alles */ }
  }

  const heute = await datenLies('maschine/heute', {}).catch(() => ({}));
  const zahl = heute.tag === tagstempel() ? (heute.anzahl || 0) + 1 : 1;
  datenSchreib('maschine/heute', { tag: tagstempel(), anzahl: zahl }).catch(() => {});
  datenAnhaengen('maschine/protokoll', { text: regel.name + ' — ' + maschineSatz(regel), wann2: jetzt() }).catch(() => {});
  if (regel.id) datenAendern('maschine/regeln', regel.id, { zuletztTag: tagstempel() }).catch(() => {});
  if (vonHand) meldung('Ausgelöst.');
}

async function _aktionAusfuehren(aktion) {
  const t = aktion.typ;
  if (t === 'nachricht') {
    await datenAnhaengen('plausch', { text: aktion.text || '…', art: 'text' });
    pushSenden('sub', 'plausch');
  } else if (t === 'befehl') {
    await datenSchreib('knopf/aktuell', { art: 'befehl', text: aktion.text || '', bis: null, wann: jetzt(), quittiert: false });
    pushSenden('sub', 'befehl');
  } else if (t === 'push') {
    pushSenden('sub', 'hinweis', aktion.text || undefined);
  } else if (t === 'push_domme') {
    pushSenden('domme', 'hinweis', aktion.text || undefined);
  } else if (t === 'aufgabe') {
    await datenAnhaengen('auftraege', { titel: aktion.text || 'Von der Maschine', text: '', fach: 'Maschine', art: 'auftrag', erledigt: false, bestaetigt: false });
    pushSenden('sub', 'auftrag');
  } else if (t === 'karte') {
    const karten = vorratDares(aktion.deck || 'soft');
    if (karten.length) {
      const k = zufall(karten);
      await datenAnhaengen('auftraege', { titel: k.text, text: '', fach: 'Maschine', art: 'dare', erledigt: false, bestaetigt: false });
      pushSenden('sub', 'auftrag');
    }
  } else if (t === 'szenario') {
    const s = vorratSzenario();
    if (s) {
      await datenAnhaengen('auftraege', { titel: s.text, text: '', fach: 'Maschine', art: 'szenario', erledigt: false, bestaetigt: false });
      pushSenden('sub', 'auftrag');
    }
  } else if (t === 'los') {
    const los = vorratLosZiehen(1, 'belohnung');
    if (los) {
      await datenAnhaengen('lose', { titel: 'Von der Maschine', text: los.text, typ: los.typ, seltenheit: los.seltenheit, aufgedeckt: false });
      pushSenden('sub', 'hinweis', 'Ein Los liegt bereit.');
    }
  } else if (t === 'strafe') {
    await datenAnhaengen('strafen', { text: aktion.text || 'Von der Maschine', enthuellt: false, erledigt: false });
  } else if (t === 'strafe_weg') {
    const alle = await datenListe('strafen');
    const offen = alle.find((s) => !s.erledigt);
    if (offen) await datenAendern('strafen', offen.id, { erledigt: true });
  } else if (t === 'karma') {
    const stand = await datenLies('wachsen/stand', {});
    await datenSchreib('wachsen/stand', { ...stand, karma: (stand.karma || 0) + (aktion.wert || 0) });
  } else if (t === 'uhr') {
    await datenSchreib('uhr', { bis: jetzt() + (aktion.minuten || 60) * 60000, titel: '', enthuellung: '' });
    pushSenden('sub', 'hinweis', 'Eine Uhr läuft.');
  }
}

/* Zeit-Regeln prüft nur ihr Gerät — sonst feuerte alles doppelt. */
async function maschinePruefen() {
  if (!istDomme() || !D.offen) return;
  if (!(await _maschineDarf())) return;

  const regeln = await datenListe('maschine/regeln').catch(() => []);
  const heute = tagstempel();
  const nun = new Date();
  const minutenJetzt = nun.getHours() * 60 + nun.getMinutes();

  for (const regel of regeln) {
    if (!regel.aktiv || regel.zuletztTag === heute) continue;
    const a = regel.ausloeser || {};

    if (a.typ === 'uhrzeit' && a.zeit) {
      const [h, m] = a.zeit.split(':').map(Number);
      if (minutenJetzt >= h * 60 + m) await maschineFeuern(regel);
    } else if (a.typ === 'zufallszeit' && a.von && a.bis) {
      /* Einmal am Tag würfeln, wann — dann wie eine Uhrzeit behandeln. */
      const plaene = Gerät.lies('maschinePlan', {});
      const schluessel = regel.id + ':' + heute;
      if (plaene.tag !== heute) { Object.keys(plaene).forEach((k) => k !== 'tag' && delete plaene[k]); plaene.tag = heute; }
      if (!plaene[schluessel]) {
        const [vh, vm] = a.von.split(':').map(Number);
        const [bh, bm] = a.bis.split(':').map(Number);
        const von = vh * 60 + vm, bis = Math.max(von + 1, bh * 60 + bm);
        plaene[schluessel] = von + Math.floor(Math.random() * (bis - von));
        Gerät.schreib('maschinePlan', plaene);
      }
      if (minutenJetzt >= plaene[schluessel]) await maschineFeuern(regel);
    } else if (a.typ === 'datum' && a.datum) {
      if (heute === a.datum) await maschineFeuern(regel);
    }
  }
}

/* Ereignisse aus dem Rest der App. Jede Stelle ruft hier vorsichtshalber
   über typeof an — die Maschine ist Beiwerk, kein Fundament. */
async function maschineEreignis(art, info = {}) {
  try {
    if (!(await _maschineDarf())) return;
    const regeln = await datenListe('maschine/regeln').catch(() => []);
    for (const regel of regeln) {
      if (!regel.aktiv) continue;
      const a = regel.ausloeser || {};
      const heute = tagstempel();
      if (regel.zuletztTag === heute) continue;

      if (art === 'knopf' && a.typ === 'knopf') await maschineFeuern(regel);
      else if (art === 'ampel' && a.typ === 'ampel' && info.rolle === 'sub' && (!a.farbe || a.farbe === info.farbe)) await maschineFeuern(regel);
      else if (art === 'aufgabe' && a.typ === 'aufgabe_erledigt') await maschineFeuern(regel);
      else if (art === 'serie' && a.typ === 'serie' && info.zahl >= (a.tage || 7)) await maschineFeuern(regel);
      else if (art === 'oeffnen' && a.typ === 'app_oeffnen' && !istDomme()) await maschineFeuern(regel);
    }
  } catch { /* still */ }
}

function maschineStarten() {
  maschinePruefen();
  clearInterval(_maschineTakt);
  _maschineTakt = setInterval(() => maschinePruefen(), 5 * 60000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') maschinePruefen();
  });
  if (!istDomme()) maschineEreignis('oeffnen');
}
