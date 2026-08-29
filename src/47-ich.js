/* ==========================================================================
   47-ich.js — Ich, und was die App tun soll.
   ========================================================================== */

SEITEN.ich = function (seite) {
  const namen = Gerät.lies('namen', {});

  seite.append(
    el('div', { style: { textAlign: 'center', padding: '10px 0 26px' } },
      el('div', {
        class: 'zier',
        style: {
          width: '78px', height: '78px', margin: '0 auto 13px', borderRadius: '50%',
          display: 'grid', placeItems: 'center', fontSize: '30px',
          background: 'var(--verlauf)', color: '#1b0f09',
        },
      }, (namen[D.rolle] || '·').slice(0, 1).toUpperCase()),
      el('div', { class: 'zier', style: { fontSize: '23px' } }, namen[D.rolle] || ''),
      el('p', { class: 'still klein', style: { marginTop: '3px' } },
        istDomme() ? 'Du führst.' : 'Du folgst.')
    )
  );

  /* --- Wege --- */
  seite.append(
    el('div', { class: 'abschnitt' },
      zeile('Wachsen', 'Stufe, Werte, Karma, Auszeichnungen', () => zeigeSeite('wachsen')),
      zeile('Pfade', 'Was als Nächstes kommt', () => zeigeSeite('pfade')),
      zeile('Spannung', 'Uhr, Verborgenes, Krümel, Impulse', () => zeigeSeite('spannung')),
      zeile('Signale', 'Zeichen, die nur ihr versteht', () => zeigeSeite('signale')),
      zeile('Wünsche', 'Blind eintragen, gemeinsam finden', () => zeigeSeite('wuensche')),
      zeile('Grenzen', 'Was geht, was nicht, was vielleicht', () => zeigeSeite('grenzen')),
      zeile('Tresor', 'Bilder, die sie freigibt', () => zeigeSeite('tresor')),
      zeile('Rituale', 'Was wiederkehrt, und was bevorsteht', () => zeigeSeite('rituale')),
      zeile('Der Vertrag', 'Was zwischen euch gilt', () => zeigeSeite('vertrag')),
      zeile('Danach', 'Getrennt schreiben, zusammen lesen', () => zeigeSeite('nachher')),
      zeile('Nur für dich', 'Bleibt auf diesem Gerät', () => zeigeSeite('eigenes')),
      zeile('Das Buch', 'Einträge und Wärmekarte', () => zeigeSeite('buch')),
      zeile('Wie geht\'s dir?', ampelWort(D.ampel[D.rolle]), () => ampelBlatt()),
      istDomme() ? zeile('Verwaltung', 'Alles, was nur dich angeht', () => zeigeSeite('verwaltung')) : null
    )
  );

  /* --- Hinweise --- */
  const pushplatz = el('div', { class: 'abschnitt' });
  seite.append(pushplatz);
  pushAbschnittBauen(pushplatz);

  /* --- Sicherheit --- */
  seite.append(
    el('div', { class: 'abschnitt' },
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Sicherheit'),
      zeile('Jemand schaut mit', 'Wird zur Notizliste', () => tarnungAn()),
      Gerät.lies('schrank') ? zeile('Jetzt abschließen', 'PIN wird wieder verlangt', () => abschliessen())
        : zeile('Eine PIN setzen', 'Ohne PIN liegt der Schlüssel offen', () => pinNachtraeglich()),
      zeile('Schließt sich nach', schliessNachText(), () => schliessNachSetzen())
    )
  );

  /* --- Die App --- */
  seite.append(
    el('div', { class: 'abschnitt' },
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Die App'),
      zeile('Nach einer neuen Fassung sehen', 'Du hast ' + APP_VERSION, () => sucheAppUpdate(true)),
      zeile('Sichtwechsel', 'Dieses Gerät als ' + nameVon(andereRolle()) + ' sehen', () => sichtWechseln()),
      zeile('Nachts leiser ab', Gerät.lies('spaetAb', 22) + ':00 Uhr', () => spaetSetzen()),
      istDomme() ? zeile('Kopplungscode zeigen', 'Für ein weiteres Gerät', () => kopplungscodeNochmal()) : null,
      zeile('Dieses Gerät leeren', 'Alles Gemeinsame bleibt in der Ablage', () => geraetLeeren(), true)
    )
  );

  seite.append(el('p', { class: 'still klein mitte', style: { padding: '10px 0 20px' } },
    'EMBER ' + APP_VERSION + ' · nur ihr beide'));
};

/* --- Bausteine ------------------------------------------------------------ */

function zeile(titel, unter, tat, warnend) {
  return el('button', {
    class: 'karte',
    style: {
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '12px', marginTop: '9px',
      padding: '13px 15px',
    },
    onclick: tat,
  },
    el('div', { style: { minWidth: '0' } },
      el('div', { style: { fontWeight: '500', color: warnend ? 'var(--rot)' : 'inherit' } }, titel),
      unter ? el('div', { class: 'still klein', style: { marginTop: '1px' } }, unter) : null
    ),
    el('span', { class: 'still', style: { fontSize: '17px', flex: 'none' } }, '›')
  );
}

function schliessNachText() {
  const m = Gerät.lies('schliesstNach', 15);
  return m === 0 ? 'nie von selbst' : 'nach ' + m + ' Minuten Pause';
}

/* --- Hinweise ------------------------------------------------------------- */

function pushAbschnittBauen(platz) {
  platz.innerHTML = '';
  platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Hinweise'));

  if (!Push.bote || !Push.bote.oeffentlich) {
    platz.append(el('div', { class: 'karte' },
      el('p', { class: 'leise klein', style: { lineHeight: '1.5' } },
        'Der Bote ist auf diesem Gerät nicht hinterlegt. Ohne ihn läuft alles — nur kommt nichts an, solange die App zu ist.'),
      el('button', {
        class: 'knopf leer breit', style: { marginTop: '12px' },
        onclick: boteEintragen,
      }, 'Boten eintragen')
    ));
    return;
  }

  if (istApple() && !istInstalliert()) {
    platz.append(el('div', { class: 'karte glimmt' },
      el('p', { class: 'leise klein', style: { lineHeight: '1.5' } },
        'Auf dem iPhone stellt nur die installierte App zu. Teilen-Knopf → „Zum Home-Bildschirm" — danach hier weiter.')
    ));
    return;
  }

  const an = Notification.permission === 'granted' && Push.erlaubt;

  platz.append(
    zeile(an ? 'Hinweise sind an' : 'Hinweise einschalten',
      an ? 'Der Knopf erreicht dich auch, wenn die App zu ist' : 'Sonst nur, solange die App offen ist',
      async () => {
        if (an) { await pushAbmelden(); } else { await pushAnmelden(); }
        pushAbschnittBauen(platz);
      }),
    an ? zeile('Zustellung ausprobieren', 'Schickt dir selbst einen Impuls', () => pushProbe()) : null
  );
}

function boteEintragen() {
  const url = el('input', { class: 'feld', placeholder: 'https://….workers.dev', autocapitalize: 'off' });
  const schluessel = el('input', { class: 'feld', placeholder: 'Öffentlicher Schlüssel', style: { marginTop: '9px' }, autocapitalize: 'off' });
  const geheim = el('input', { class: 'feld', placeholder: 'Geheimnis', style: { marginTop: '9px' }, autocapitalize: 'off' });

  const b = blatt(
    el('h2', {}, 'Der Bote'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Die drei Angaben stehen in der Ausgabe von werkzeug/vapid.mjs.'),
    url, schluessel, geheim,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!url.value.trim() || !schluessel.value.trim()) return meldung('Adresse und Schlüssel fehlen.');
          Push.bote = {
            url: url.value.trim().replace(/\/+$/, ''),
            oeffentlich: schluessel.value.trim(),
            geheim: geheim.value.trim(),
          };
          Gerät.schreib('bote', Push.bote);
          b.schliessen();
          await pushAnmelden();
          zeigeSeite('ich');
        },
      }, 'Eintragen')
    )
  );
}

/* --- Kleine Einstellungen ------------------------------------------------- */

function spaetSetzen() {
  const feld = el('input', {
    class: 'feld', type: 'number', min: '18', max: '23',
    value: String(Gerät.lies('spaetAb', 22)),
  });
  const b = blatt(
    el('h2', {}, 'Nachts leiser'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Ab dieser Stunde wird die App wärmer und ruhiger.'),
    feld,
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '16px' },
      onclick: () => {
        Gerät.schreib('spaetAb', Math.min(23, Math.max(18, parseInt(feld.value, 10) || 22)));
        b.schliessen();
        stimmungSetzen();
        zeigeSeite('ich');
      },
    }, 'Übernehmen')
  );
}

function schliessNachSetzen() {
  const wahl = [0, 5, 15, 60];
  const b = blatt(
    el('h2', {}, 'Von selbst abschließen'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 4px' } },
      'Wenn die App so lange im Hintergrund war, verlangt sie die PIN wieder.'),
    ...wahl.map((m) => el('button', {
      class: 'karte', style: { width: '100%', textAlign: 'left', marginTop: '9px' },
      onclick: () => {
        Gerät.schreib('schliesstNach', m);
        b.schliessen();
        zeigeSeite('ich');
      },
    }, m === 0 ? 'Nie von selbst' : 'Nach ' + m + ' Minuten'))
  );
}

function pinNachtraeglich() {
  if (!schluesselDa()) return meldung('Erst öffnen.');
  const roh = _schluesselRoh;
  pinFragen(roh, () => { meldung('Steht.'); zeigeSeite('ich'); });
}

async function kopplungscodeNochmal() {
  if (!schluesselDa()) return;
  const code = await kopplungscodeBauen(_schluesselRoh, Gerät.lies('zugang'), Gerät.lies('namen', {}));
  zeigeKopplungscode(code, _schluesselRoh);
}

async function geraetLeeren() {
  const sicher = await frage(
    'Dieses Gerät leeren',
    'Schlüssel, PIN und Zwischenspeicher verschwinden von diesem Gerät. Alles Gemeinsame bleibt in der Ablage und kommt mit dem Kopplungscode zurück.',
    'Leeren', true
  );
  if (!sicher) return;
  await pushAbmelden().catch(() => {});
  Gerät.alleLoeschen();
  spiegelLeeren();
  location.reload();
}

/* --- Die Verwaltung (nur sie) --------------------------------------------- */

/* Der Sichtwechsel tauscht die Rolle dieses Geräts — fürs Ausprobieren
   mit zwei eigenen Geräten, bevor die zweite Person dazukommt. Er ist
   absichtlich kein versteckter Schalter: Beide Rollen gehören ohnehin
   demselben Schlüssel, hier wird nichts umgangen. */
async function sichtWechseln() {
  const neu = andereRolle();
  const sicher = await frage(
    'Sichtwechsel',
    'Dieses Gerät zeigt danach die Sicht von ' + nameVon(neu) + ' — mit allem, was dazugehört. Zum Zurückwechseln denselben Weg.',
    'Wechseln'
  );
  if (!sicher) return;

  Gerät.schreib('rolle', neu);
  D.rolle = neu;

  /* Der Push-Briefkasten hängt an der Rolle: neu anmelden, sonst
     klingelte dieses Gerät weiter für die alte. */
  if (Push.bote && Notification.permission === 'granted') pushAnmelden(true);

  baueFussleiste();
  zeigeSeite('heim');
  meldung('Du bist jetzt ' + nameVon(neu) + '.');
}

/* Räumt die ganze gemeinsame Ablage — für den Moment, in dem aus dem
   Probelauf der Ernstfall wird: Die Testdaten verschwinden, Einrichtung,
   Schlüssel und Geräte bleiben. */
async function allesAufAnfang() {
  const erste = await frage(
    'Alles auf Anfang',
    'Löscht ALLES Gemeinsame: Plausch, Aufträge, Regeln, Decks, das Buch, den Tresor — den ganzen Probelauf. Die Einrichtung, der Schlüssel und die gekoppelten Geräte bleiben.',
    'Weiter', true
  );
  if (!erste) return;
  const zweite = await frage(
    'Wirklich alles?',
    'Das lässt sich nicht rückgängig machen.',
    'Alles löschen', true
  );
  if (!zweite) return;

  meldung('Räume …');
  try {
    await ablageLoesch('');
    /* Sich selbst wieder eintragen, sonst sperrt die Regel den Bereich. */
    await ablageSchreib('mitglieder/' + Ablage.ich, jetzt());
    await datenSchreib('paar', { namen: Gerät.lies('namen', {}), begonnen: jetzt() });
  } catch (f) {
    return meldung('Das Räumen ist hängengeblieben: ' + String(f.message || f).slice(0, 80), 6000);
  }

  spiegelLeeren();
  /* Das andere Gerät trägt sich beim nächsten Öffnen von selbst wieder
     ein — der Bereich steht Neulingen offen, solange Platz ist. */
  if (Push.bote && Notification.permission === 'granted') pushAnmelden(true);
  meldung('Leer. Wie am ersten Tag.');
  setTimeout(() => location.reload(), 1200);
}

SEITEN.verwaltung = function (seite) {
  if (!istDomme()) return zeigeSeite('heim');

  seite.append(kopfzeile('Verwaltung',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')));

  const zoegernplatz = el('div', { class: 'abschnitt' });
  seite.append(zoegernplatz);

  datenLies('einst/zoegern', false).then((an) => {
    zoegernplatz.innerHTML = '';
    zoegernplatz.append(
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Sein Warten'),
      zeile(an ? 'Zögern ist an' : 'Zögern ist aus',
        an ? 'Er sieht nicht, ob du seine Bitte gelesen hast.' : 'Er sieht, seit wann er wartet.',
        async () => {
          await datenSchreib('einst/zoegern', !an);
          zeigeSeite('verwaltung');
        })
    );
  });

  seite.append(
    el('div', { class: 'abschnitt' },
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Anlegen'),
      zeile('Karte fürs Deck', 'Für das Spiel', () => dareAnlegen()),
      zeile('Auftrag', 'Mit Frist, wenn du willst', () => auftragAnlegen()),
      zeile('Regel', 'Steht, bis du sie wegnimmst', () => regelAnlegen()),
      zeile('Etwas Ausstehendes', 'Er sieht nur die Zahl', () => strafeAnlegen()),
      zeile('Spruch fürs Glas', 'Einer je Tag', () => keksSchreiben(el('div'))),
      zeile('Rad', 'Felder beschriften', () => radAnlegen()),
      zeile('Los zum Rubbeln', 'Er deckt es selbst auf', () => losAnlegen()),
      zeile('Auszeichnung', 'Anlegen, später verleihen', () => ehreAnlegen()),
      zeile('Pfad', 'Stufen, die aufeinander liegen', () => pfadAnlegen()),
      zeile('Verborgenes', 'Mit Enthüllungsdatum', () => verborgenAnlegen()),
      zeile('Krümel streuen', 'Über den Tag verteilt', () => kruemelAnlegen()),
      zeile('Foto-Auftrag', 'Mit laufender Uhr', () => fotoAuftragGeben()),
      zeile('Sperre', 'Nichts ohne deine Erlaubnis', () => sperreSetzen()),
      zeile('Boss', 'Eine Prüfung mit Belohnung', () => bossAnlegen()),
      zeile('Impuls', 'Kommt, wann er kommt', () => impulsAnlegen())
    )
  );

  seite.append(
    el('div', { class: 'abschnitt' },
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Namen'),
      zeile('Namen ändern', Object.values(Gerät.lies('namen', {})).join(' · '), () => namenAendern())
    )
  );

  seite.append(
    el('div', { class: 'abschnitt' },
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Der Probelauf'),
      zeile('Alles auf Anfang', 'Gemeinsames löschen, Einrichtung behalten', () => allesAufAnfang(), true)
    )
  );
};

function namenAendern() {
  const namen = Gerät.lies('namen', {});
  const a = el('input', { class: 'feld', value: namen.domme || '', placeholder: 'Sie' });
  const c = el('input', { class: 'feld', value: namen.sub || '', placeholder: 'Er', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Namen'),
    el('div', { style: { height: '12px' } }),
    a, c,
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '16px' },
      onclick: async () => {
        const neu = { domme: a.value.trim() || 'Sie', sub: c.value.trim() || 'Er' };
        Gerät.schreib('namen', neu);
        D.paar = { ...(D.paar || {}), namen: neu };
        await datenSchreib('paar', { ...(D.paar || {}), namen: neu });
        b.schliessen();
        zeigeSeite('verwaltung');
      },
    }, 'Übernehmen')
  );
}
