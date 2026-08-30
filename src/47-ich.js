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

  /* --- Der Schnellzugriff: das Wichtigste ohne Scrollen ------------------- */
  seite.append(
    el('div', {
      style: {
        display: 'flex', justifyContent: 'center', gap: '6px',
        flexWrap: 'wrap', marginBottom: '18px',
      },
    },
      schnellKnopf('funke', 'Aktualisieren', () => sucheAppUpdate(true)),
      schnellKnopf('auge', 'Tarnen', () => tarnungAn()),
      Gerät.lies('schrank')
        ? schnellKnopf('schloss', 'Abschließen', () => abschliessen())
        : schnellKnopf('schloss', 'PIN setzen', () => pinNachtraeglich()),
      schnellKnopf('kerze', 'Farbwelt', () => farbweltBlatt())
    )
  );

  /* --- Wege, in vier Klappen ---------------------------------------------
     Achtzehn gleiche Zeilen untereinander erschlagen jeden. In Gruppen
     mit Gedächtnis (auf/zu bleibt gemerkt) findet man stattdessen. */
  const sie = istDomme();
  seite.append(
    el('div', { class: 'abschnitt' },
      zeile('Wie geht\'s dir?', 'Deine Ampel steht auf ' + ampelWort(D.ampel[D.rolle]) + ' — antippen zum Ändern', () => ampelBlatt()),
      istDomme() ? zeile('Verwaltung', 'Dein Werkzeugkasten: anlegen, steuern, aufräumen', () => zeigeSeite('verwaltung')) : null,

      klappGruppe('spiel', 'pfeilauf', 'Wachsen & Spannung', 'Stufen, Pläne, Überraschungen, Regeln',
        zeile('Wachsen', sie ? 'Seine Stufe, seine Punkte — du vergibst Auszeichnungen' : 'Deine Stufe und Punkte. Erledigtes zahlt hier ein', () => zeigeSeite('wachsen')),
        zeile('Pfade', sie ? 'Baue ihm Stufenpläne — er sieht nur die nächste' : 'Deine Stufenpläne. Die nächste Stufe siehst du, mehr nicht', () => zeigeSeite('pfade')),
        zeile('Spannung', sie ? 'Countdown stellen, Hinweise streuen, Überraschungen legen' : 'Was heute noch kommt — wenn sie etwas gelegt hat', () => zeigeSeite('spannung')),
        zeile('Wenn — Dann', sie ? 'Regeln bauen, die von selbst feuern' : 'Ob gerade Regeln über dich laufen', () => zeigeSeite('maschine'))
      ),

      klappGruppe('naehe', 'herz', 'Wissen & Nähe', 'Wünsche, Grenzen, Körper, unsere Sprache',
        zeile('Wünsche', 'Jeder trägt blind ein — die App zeigt nur, was beide wollen', () => zeigeSeite('wuensche')),
        zeile('Grenzen', 'Festhalten, was geht, was nicht und was vielleicht', () => zeigeSeite('grenzen')),
        zeile('Körperkarte', 'Zone für Zone: Liebe ich, mag ich, bitte nicht', () => zeigeSeite('koerper')),
        zeile('Signale', 'Eigene Codewörter mit fester Bedeutung anlegen', () => zeigeSeite('signale')),
        zeile('Unsere Wörter', 'Das Wörterbuch für alles, was nur wir zwei verstehen', () => zeigeSeite('glossar'))
      ),

      klappGruppe('uns', 'feder', 'Für uns', 'Vertrag, Buch, Rituale, Danach, Reparatur',
        zeile('Der Vertrag', 'Unsere Abmachung, schwarz auf weiß, von beiden unterschrieben', () => zeigeSeite('vertrag')),
        zeile('Das Buch', 'Unser Tagebuch: Einträge, Flammen, Wärmekarte', () => zeigeSeite('buch')),
        zeile('Rituale', 'Was regelmäßig wiederkehrt — mit Serie fürs Dranbleiben', () => zeigeSeite('rituale')),
        zeile('Danach', 'Nach einer Session: getrennt schreiben, dann zusammen lesen', () => zeigeSeite('nachher')),
        zeile('Reparatur', 'Nach einem Streit: drei ruhige Schritte, keine Punkte', () => zeigeSeite('reparatur'))
      ),

      klappGruppe('sammlung', 'auge', 'Sammlung & Privates', 'Tresor, Regal, eigene Notizen',
        zeile('Tresor', sie ? 'Bilder hochladen und einzeln für ihn freigeben' : 'Bilder, die sie für dich freigegeben hat', () => zeigeSeite('tresor')),
        zeile('Das Regal', 'Was an Spielzeug da ist — die Decks richten sich danach', () => zeigeSeite('toys')),
        zeile('Nur für dich', 'Private Notizen. Verlassen dieses Gerät nie', () => zeigeSeite('eigenes'))
      )
    )
  );

  /* --- Hinweise --- */
  const pushplatz = el('div', { class: 'abschnitt' });
  seite.append(pushplatz);
  pushAbschnittBauen(pushplatz);

  /* --- Einstellungen: drei Klappen statt drei langer Listen --------------- */
  seite.append(
    el('div', { class: 'abschnitt' },
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Einstellungen'),

      klappGruppe('raeume', 'mond', 'Räume', 'Dieser Raum: ' + (raumName() || '—'),
        zeile('Raum wechseln', 'Ein Raum ist eine eigene Welt — zum Proben oder für uns', () => raumWechslerBlatt()),
        zeile('Raum umbenennen', 'Nur der Name ändert sich, sonst nichts', () => {
          eingabeBlatt({ titel: 'Raum umbenennen', wert: raumName(), jaText: 'Umbenennen' }, (name) => {
            raumUmbenennen(aktiverRaumId(), name);
            zeigeSeite('ich');
          });
        })
      ),

      klappGruppe('sicherheit', 'schloss', 'Sicherheit', 'Tarnung, PIN, Schließzeit',
        zeile('Jemand schaut mit', 'Ein Tipp, und die App sieht aus wie eine Notizliste. Dreimal aufs Wort EMBER tippen holt sie zurück', () => tarnungAn()),
        Gerät.lies('schrank') ? zeile('Jetzt abschließen', 'Sofort zu — beim nächsten Öffnen fragt die App nach der PIN', () => abschliessen())
          : zeile('Eine PIN setzen', 'Damit niemand die App einfach öffnen kann, der das Handy hat', () => pinNachtraeglich()),
        zeile('Schließt sich nach', schliessNachText() + ' im Hintergrund — dann braucht es die PIN', () => schliessNachSetzen())
      ),

      klappGruppe('app', 'funke', 'Die App', 'Fassung ' + APP_VERSION + ', Aussehen, Töne, Symbol',
        zeile('Nach einer neuen Fassung sehen', 'Du hast ' + APP_VERSION + ' — hier holst du dir Neues sofort', () => sucheAppUpdate(true)),
        zeile('Die Farbwelt', 'Zurzeit: ' + farbweltName() + ' — in welcher Farbe die App glüht', () => farbweltBlatt()),
        zeile('Das App-Symbol', 'Zurzeit: ' + appSymbolName() + ' — auch harmlose Tarn-Symbole', () => appSymbolBlatt()),
        schalterZeile('Der Hilfe-Knopf', 'Das kleine ? unten rechts erklärt jede Seite', hilfeAn(), (neu) => {
          Gerät.schreib('hilfeKnopf', neu);
          zeigeSeite('ich');
        }),
        zeile('Sichtwechsel', 'Dieses Gerät zeigt dann die Sicht von ' + nameVon(andereRolle()) + ' — zum Ausprobieren', () => sichtWechseln()),
        zeile('Nachts leiser ab', 'Ab ' + Gerät.lies('spaetAb', 22) + ':00 Uhr wird die App wärmer und dunkler', () => spaetSetzen()),
        zeile('Töne',
          tonPegel() >= 1 ? 'An — nachts automatisch gedämpft. Antippen: leise'
            : tonPegel() > 0 ? 'Leise. Antippen: aus'
              : 'Aus. Antippen: an', () => {
            const neu = tonPegel() >= 1 ? 0.45 : tonPegel() > 0 ? 0 : 1;
            Gerät.schreib('tonPegel', neu);
            Gerät.loesch('toene');
            if (neu > 0) tonSpielen('weich');
            zeigeSeite('ich');
          }),
        zeile('Letzte Fehler', (Gerät.lies('fehlerlog', []).length || 'Keine') + ' notiert — bei Problemen hier nachsehen', () => fehlerlogZeigen()),
        istDomme() ? zeile('Kopplungscode zeigen', 'Damit ein weiteres Gerät in diesen Raum kommt', () => kopplungscodeNochmal()) : null,
        zeile('Diesen Raum vom Gerät nehmen', 'Nur dieses Gerät vergisst ihn — alles Gemeinsame bleibt gespeichert', () => geraetLeeren(), true)
      )
    )
  );

  seite.append(el('p', { class: 'still klein mitte', style: { padding: '10px 0 20px' } },
    'EMBER ' + APP_VERSION + ' · nur wir beide'));
};

/* --- Bausteine ------------------------------------------------------------ */

/* Eine Gruppe von Zeilen hinter einem Kopf zum Aufklappen. Ob sie offen
   steht, merkt sich das Gerät — wer immer nur „Wünsche" braucht, hat
   seine Klappe beim nächsten Mal schon offen.

   Der Kopf muss auf einen Blick sagen: „Hier ist mehr drin" — sonst
   sieht er aus wie eine Zeile, die woandershin führt. Deshalb: Sinnbild
   vorn, die Zahl der Wege und ein Chevron im Kreis rechts, das sich
   beim Öffnen dreht. Was navigiert, trägt weiter das nackte ›. */
function klappGruppe(schluessel, bild, titel, unter, ...zeilen) {
  const stand = Gerät.lies('ichKlappen', {});
  let offen = !!stand[schluessel];
  const drin = zeilen.filter(Boolean);

  const pfeil = el('span', {
    style: {
      width: '26px', height: '26px', flex: 'none', borderRadius: '50%',
      display: 'grid', placeItems: 'center', fontSize: '15px',
      border: '1px solid ' + (offen ? 'var(--glut)' : 'var(--kante)'),
      color: offen ? 'var(--glut-hell)' : 'var(--still)',
      transition: 'transform .3s cubic-bezier(.2,.7,.3,1), border-color .3s ease, color .3s ease',
      transform: offen ? 'rotate(90deg)' : 'none',
    },
  }, '›');

  const zahl = el('span', { class: 'winzig still', style: { flex: 'none' } }, String(drin.length));

  const inhalt = el('div', { class: 'aufklapp' + (offen ? ' offen' : '') },
    el('div', { style: { minHeight: '0' } },
      el('div', {
        style: {
          marginLeft: '13px', paddingLeft: '10px', paddingBottom: '14px',
          borderLeft: '2px solid var(--kante)',
        },
      }, ...drin)));

  const kopf = el('button', {
    class: 'karte',
    style: {
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '12px', marginTop: '9px', padding: '13px 15px',
      borderColor: offen ? 'color-mix(in srgb, var(--glut) 40%, transparent)' : '',
    },
    onclick: () => {
      offen = !offen;
      const frisch = Gerät.lies('ichKlappen', {});
      frisch[schluessel] = offen;
      Gerät.schreib('ichKlappen', frisch);
      inhalt.classList.toggle('offen', offen);
      pfeil.style.transform = offen ? 'rotate(90deg)' : 'none';
      pfeil.style.borderColor = offen ? 'var(--glut)' : 'var(--kante)';
      pfeil.style.color = offen ? 'var(--glut-hell)' : 'var(--still)';
      kopf.style.borderColor = offen ? 'color-mix(in srgb, var(--glut) 40%, transparent)' : '';
      tonSpielen('tick');
    },
  },
    el('span', { style: { flex: 'none', color: 'var(--glut-hell)', display: 'grid', placeItems: 'center' } },
      sinnbild(bild, 19)),
    el('div', { style: { minWidth: '0', flex: '1' } },
      el('div', { class: 'zier', style: { fontSize: '16.5px' } }, titel),
      el('div', { class: 'still klein', style: { marginTop: '1px' } }, unter)
    ),
    zahl,
    pfeil
  );

  return el('div', {}, kopf, inhalt);
}

/* Eine Zeile mit Schiebeschalter: Der Zustand steht rechts sichtbar da,
   Antippen schiebt ihn um — eindeutiger als eine Zeile, die „irgendwas"
   tut. `tat(neu)` bekommt den Zielzustand; neu zeichnen macht der Rufer. */
function schalterZeile(titel, unter, an, tat) {
  const schieber = el('span', { class: 'schieber' + (an ? ' an' : '') });
  return el('button', {
    class: 'karte',
    style: {
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '12px', marginTop: '9px',
      padding: '13px 15px',
    },
    onclick: async () => {
      schieber.classList.toggle('an', !an);   /* sofort sichtbar, nicht erst nach dem Netz */
      tonSpielen('tick');
      await tat(!an);
    },
  },
    el('div', { style: { minWidth: '0', flex: '1' } },
      el('div', { style: { fontWeight: '500' } }, titel),
      unter ? el('div', { class: 'still klein', style: { marginTop: '1px' } }, unter) : null
    ),
    schieber
  );
}

/* Ein runder Symbol-Knopf für den Schnellzugriff ganz oben. */
function schnellKnopf(bild, marke, tat) {
  return el('button', { class: 'schnellknopf', onclick: tat },
    el('span', { class: 'rund' }, sinnbild(bild, 21)),
    el('span', { class: 'winzig' }, marke)
  );
}

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

  const an = pushErlaubnisErteilt() && Push.erlaubt;

  /* anfuegen statt append: das rohe append macht aus einem null den
     sichtbaren TEXT „null" — genau so stand er hier unter der Zeile. */
  anfuegen(platz,
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
  const geheim = el('input', { class: 'feld', type: 'password', placeholder: 'Geheimnis', style: { marginTop: '9px' }, autocapitalize: 'off' });

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
            url: boteAdresse(url.value),
            oeffentlich: schluessel.value.trim(),
            geheim: geheim.value.trim(),
          };
          Gerät.schreib('bote', Push.bote);
          datenSchreib('einst/bote', Push.bote).catch(() => {});
          b.schliessen();
          await pushAnmelden();
          zeigeSeite('ich');
        },
      }, 'Eintragen')
    )
  );
}

function fehlerlogZeigen() {
  const liste = Gerät.lies('fehlerlog', []);
  const b = blatt(
    el('h2', {}, 'Letzte Fehler'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      liste.length ? 'Das Neueste zuoberst. Hilft beim Jagen.' : 'Nichts notiert — gut so.'),
    ...liste.slice().reverse().map((f) => el('div', {
      class: 'karte', style: { padding: '10px 13px', marginTop: '8px' },
    },
      el('p', { class: 'winzig still', style: { marginBottom: '3px' } },
        new Date(f.wann).toLocaleString('de-DE')),
      el('div', { class: 'klein', style: { wordBreak: 'break-word' } }, f.text)
    )),
    liste.length ? el('button', {
      class: 'knopf leer breit', style: { marginTop: '14px' },
      onclick: () => { Gerät.loesch('fehlerlog'); b.schliessen(); zeigeSeite('ich'); },
    }, 'Leeren') : null
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
  const code = await kopplungscodeBauen(_schluesselRoh, Gerät.lies('zugang'), Gerät.lies('namen', {}), Gerät.lies('bote', null));
  zeigeKopplungscode(code, _schluesselRoh);
}

async function geraetLeeren() {
  const sicher = await frage(
    'Diesen Raum vom Gerät nehmen',
    'Schlüssel, PIN und Zwischenspeicher dieses Raums verschwinden von diesem Gerät — andere Räume bleiben. Alles Gemeinsame bleibt in der Ablage und kommt mit dem Kopplungscode zurück.',
    'Vom Gerät nehmen', true
  );
  if (!sicher) return;
  await pushAbmelden().catch(() => {});
  raumEntfernen(aktiverRaumId());
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
  if (Push.bote && pushErlaubnisErteilt()) pushAnmelden(true);

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
  if (Push.bote && pushErlaubnisErteilt()) pushAnmelden(true);
  meldung('Leer. Wie am ersten Tag.');
  setTimeout(() => location.reload(), 1200);
}

SEITEN.verwaltung = function (seite) {
  if (!istDomme()) return zeigeSeite('heim');

  seite.append(kopfzeile('Verwaltung',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')));

  seite.append(
    el('div', { class: 'abschnitt' },
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Der Inhalt'),
      zeile('Der Vorrat',
        vorratAn() ? 'An · bis Stufe ' + vorratStufe() + (vorratGetrennt() ? ' · getrennt' : '') : 'Aus',
        () => vorratBlatt())
    )
  );

  /* --- Die Bausteine: jedes große Modul einzeln abschaltbar ------------- */
  const bausteinplatz = el('div', { class: 'abschnitt' });
  seite.append(bausteinplatz);
  bausteineBauen(bausteinplatz);

  const zoegernplatz = el('div', { class: 'abschnitt' });
  seite.append(zoegernplatz);

  datenLies('einst/zoegern', false).then((an) => {
    zoegernplatz.innerHTML = '';
    zoegernplatz.append(
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Sein Warten'),
      schalterZeile('Das Zögern',
        an ? 'An — er sieht nicht, ob du seine Bitte gelesen hast' : 'Aus — er sieht, seit wann er wartet',
        an, async (neu) => {
          await datenSchreib('einst/zoegern', neu);
          zeigeSeite('verwaltung');
        })
    );
  });

  seite.append(
    el('div', { class: 'abschnitt' },
      el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Anlegen'),

      klappGruppe('vAuftrag', 'auftrag', 'Aufträge & Regeln', 'Was er tun, lassen oder erbitten muss',
        zeile('Auftrag', 'Mit Frist, wenn du willst', () => auftragAnlegen()),
        zeile('Regel', 'Steht, bis du sie wegnimmst', () => regelAnlegen()),
        zeile('Etwas Ausstehendes', 'Er sieht nur die Zahl', () => strafeAnlegen()),
        zeile('Sperre', 'Nichts ohne deine Erlaubnis', () => sperreSetzen()),
        zeile('Foto-Auftrag', 'Mit laufender Uhr', () => fotoAuftragGeben())
      ),

      klappGruppe('vSpiel', 'wuerfel', 'Spiel & Zufall', 'Decks, Räder, Lose und was von selbst feuert',
        zeile('Karte fürs Deck', 'Für das Spiel', () => dareAnlegen()),
        zeile('Rad', 'Felder beschriften', () => radAnlegen()),
        zeile('Los zum Rubbeln', 'Er deckt es selbst auf', () => losAnlegen()),
        zeile('Boss', 'Eine Prüfung mit Belohnung', () => bossAnlegen()),
        zeile('Impuls', 'Kommt, wann er kommt', () => impulsAnlegen()),
        zeile('Regie-Skript', 'Aus Bausteinen, für später', () => regieBauen()),
        zeile('Wenn-Dann-Regel', 'Feuert von selbst', () => zeigeSeite('maschine'))
      ),

      klappGruppe('vWachsen', 'pfeilauf', 'Wachsen & Ehren', 'Was er sich verdienen kann',
        zeile('Auszeichnung', 'Anlegen, später verleihen', () => ehreAnlegen()),
        zeile('Pfad', 'Stufen, die aufeinander liegen', () => pfadAnlegen())
      ),

      klappGruppe('vSpannung', 'sanduhr', 'Spannung & Kleines', 'Was wartet, tickt oder überrascht',
        zeile('Verborgenes', 'Mit Enthüllungsdatum', () => verborgenAnlegen()),
        zeile('Krümel streuen', 'Über den Tag verteilt', () => kruemelAnlegen()),
        zeile('Spruch fürs Glas', 'Einer je Tag', () => keksSchreiben(el('div')))
      )
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

/* Die großen Bausteine, jeder mit eigenem Schalter. Abschalten heißt
   ruhen lassen: Stände, Bücher und Einträge bleiben liegen und sind
   beim Wiedereinschalten unverändert da. */
async function bausteineBauen(platz) {
  platz.innerHTML = '';
  platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Bausteine'));

  const konto = await datenLies('konto').catch(() => null);
  const maschineAn = await datenLies('maschine/an', false).catch(() => false);
  const frageAn = await datenLies('einst/frage', true).catch(() => true);
  const keksAn = await datenLies('einst/keks', true).catch(() => true);
  const aufgabenAn = await datenLies('einst/aufgaben', true).catch(() => true);

  const schalter = (titel, an, unterAn, unterAus, tat) =>
    schalterZeile(titel, an ? 'An — ' + unterAn : 'Aus — ' + unterAus, an, async (neu) => {
      await tat(neu);
      bausteineBauen(platz);
    });

  platz.append(
    schalter('Der Laden', !!(konto && konto.an),
      'Münzen, Siegel, Preise, Zahltag', 'alles ruht, nichts geht verloren',
      async (neu) => {
        if (!konto && neu) return zeigeSeite('laden');   // Ersteröffnung mit Startguthaben
        await datenSchreib('konto', { ...konto, an: neu });
      }),
    schalter('Die Tagesaufgaben', aufgabenAn,
      'jeden Tag eine für jeden', 'die Zeilen verschwinden vom Heim',
      (neu) => datenSchreib('einst/aufgaben', neu)),
    schalter('Die Frage des Tages', frageAn,
      'eine ehrliche Frage, beide antworten', 'die Zeile verschwindet vom Heim',
      (neu) => datenSchreib('einst/frage', neu)),
    schalter('Der Glückskeks', keksAn,
      'einer wartet unten auf dem Heim', 'kein Keks, kein Zettel',
      (neu) => datenSchreib('einst/keks', neu)),
    schalter('Wenn — Dann', maschineAn,
      'Regeln feuern von selbst', 'keine Regel rührt sich',
      (neu) => datenSchreib('maschine/an', neu))
  );
}

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

/* --- Aussehen: Farbwelt und App-Symbol -------------------------------------

   Die Farbwelt regelt, in welcher Farbe die App glüht — die Stimmung
   (Tag/Nacht) bleibt davon unberührt, beides stapelt sich.

   Das App-Symbol ist eine iOS-Eigenheit: Es wird beim „Zum Home-
   Bildschirm hinzufügen" eingefroren. Die Wahl hier setzt das Symbol,
   das die NÄCHSTE Installation bekommt — inklusive dreier bewusst
   harmloser Tarn-Symbole, die nach Notizen, Rechner oder Wetter
   aussehen und nichts verraten.                                        */

const FARBWELTEN = [
  { key: '', name: 'Glut', wort: 'Warmes Kupfer — der Anfang von allem', farbe: '#c4785a' },
  { key: 'rose', name: 'Rosé', wort: 'Dunkles Rosé, samtig', farbe: '#c45a72' },
  { key: 'gold', name: 'Gold', wort: 'Kerzenlicht auf Messing', farbe: '#c2a14e' },
  { key: 'jade', name: 'Jade', wort: 'Kühles Grün, sehr ruhig', farbe: '#6f9b8f' },
  { key: 'mitternacht', name: 'Mitternacht', wort: 'Blaue Stunde', farbe: '#7286c4' },
];

function farbweltAnwenden() {
  const k = Gerät.lies('farbwelt', '');
  if (k) document.documentElement.setAttribute('data-thema', k);
  else document.documentElement.removeAttribute('data-thema');
}

function farbweltName() {
  const k = Gerät.lies('farbwelt', '');
  return (FARBWELTEN.find((f) => f.key === k) || FARBWELTEN[0]).name;
}

function farbweltBlatt() {
  const gewaehlt = Gerät.lies('farbwelt', '');
  const b = blatt(
    el('h2', {}, 'Die Farbwelt'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 12px' } },
      'Nur für dieses Gerät. Antippen wechselt sofort — anschauen kostet nichts.'),
    ...FARBWELTEN.map((f) => el('button', {
      class: 'karte',
      style: {
        width: '100%', textAlign: 'left', marginTop: '8px', padding: '12px 15px',
        display: 'flex', alignItems: 'center', gap: '13px',
        borderColor: f.key === gewaehlt ? 'var(--glut)' : 'var(--kante)',
      },
      onclick: () => {
        Gerät.schreib('farbwelt', f.key);
        farbweltAnwenden();
        tonSpielen('schimmer');
        b.schliessen();
        zeigeSeite('ich');
      },
    },
      el('span', {
        style: {
          width: '26px', height: '26px', borderRadius: '50%', flex: 'none',
          background: 'linear-gradient(135deg, ' + f.farbe + ', ' + f.farbe + 'cc)',
          boxShadow: '0 0 10px ' + f.farbe + '55',
        },
      }),
      el('div', {},
        el('div', { style: { fontWeight: '500' } }, f.name),
        el('div', { class: 'still klein' }, f.wort)
      )
    ))
  );
}

const APP_SYMBOLE = [
  { key: 'ember', name: 'Ember', wort: 'Die Glut — das eigentliche Gesicht', datei: 'icons/icon-180.png' },
  { key: 'notiz', name: 'Notizen', wort: 'Tarnung: sieht aus wie eine Notiz-App', datei: 'icons/tarn-notiz-180.png' },
  { key: 'rechner', name: 'Rechner', wort: 'Tarnung: sieht aus wie ein Taschenrechner', datei: 'icons/tarn-rechner-180.png' },
  { key: 'wetter', name: 'Wetter', wort: 'Tarnung: sieht aus wie eine Wetter-App', datei: 'icons/tarn-wetter-180.png' },
];

function appSymbolAnwenden() {
  const wahl = Gerät.lies('appSymbol', 'ember');
  const eintrag = APP_SYMBOLE.find((s) => s.key === wahl) || APP_SYMBOLE[0];
  const link = document.querySelector('link[rel="apple-touch-icon"]');
  if (link) link.href = eintrag.datei;
}

function appSymbolName() {
  const wahl = Gerät.lies('appSymbol', 'ember');
  return (APP_SYMBOLE.find((s) => s.key === wahl) || APP_SYMBOLE[0]).name;
}

function appSymbolBlatt() {
  const gewaehlt = Gerät.lies('appSymbol', 'ember');
  const b = blatt(
    el('h2', {}, 'Das App-Symbol'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 12px', lineHeight: '1.55' } },
      'Das Symbol auf dem Home-Bildschirm. iOS friert es beim Hinzufügen ein — ' +
      'nach der Wahl also: App einmal vom Home-Bildschirm entfernen und über Safari neu hinzufügen. ' +
      'Drinnen bleibt alles, wie es ist.'),
    ...APP_SYMBOLE.map((s) => el('button', {
      class: 'karte',
      style: {
        width: '100%', textAlign: 'left', marginTop: '8px', padding: '12px 15px',
        display: 'flex', alignItems: 'center', gap: '13px',
        borderColor: s.key === gewaehlt ? 'var(--glut)' : 'var(--kante)',
      },
      onclick: () => {
        Gerät.schreib('appSymbol', s.key);
        appSymbolAnwenden();
        tonSpielen('tick');
        b.schliessen();
        meldung(s.key === 'ember' ? 'Gewählt.' : 'Gewählt. Beim nächsten Hinzufügen trägt die App diese Maske.');
        zeigeSeite('ich');
      },
    },
      el('img', {
        src: s.datei, alt: '',
        style: { width: '44px', height: '44px', borderRadius: '10px', flex: 'none', display: 'block' },
      }),
      el('div', {},
        el('div', { style: { fontWeight: '500' } }, s.name),
        el('div', { class: 'still klein' }, s.wort)
      )
    ))
  );
}
