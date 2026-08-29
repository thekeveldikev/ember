/* ==========================================================================
   30-setup.js — Das erste Mal.

   Zwei Wege: Das erste Gerät richtet alles ein und bekommt am Ende einen
   Kopplungscode. Das zweite Gerät fügt diesen Code ein und ist fertig.

   Absicht dahinter: Im öffentlichen Quelltext steht nichts über euch. Keine
   Zugangsdaten, kein Schlüssel, keine Namen. Wer das Repository findet,
   findet eine leere App.
   ========================================================================== */

function istEingerichtet() {
  return !!(Gerät.lies('zugang') && (Gerät.lies('schrank') || Gerät.lies('schluessel')));
}

function zeigeEinrichtung() {
  $('#fussleiste').hidden = true;
  const b = $('#buehne');
  b.innerHTML = '';

  const seite = el('div', { class: 'seite' },
    el('div', { style: { textAlign: 'center', padding: '30px 0 26px' } },
      el('div', { class: 'zier glutschrift', style: { fontSize: '44px', letterSpacing: '.12em' } }, 'EMBER'),
      el('p', { class: 'leise klein', style: { marginTop: '10px' } }, 'Etwas, das nur euch gehört.')
    ),
    el('div', { class: 'karte glimmt' },
      el('h2', {}, 'Zum ersten Mal hier?'),
      el('p', { class: 'leise klein', style: { margin: '8px 0 18px' } },
        'Ein Gerät richtet ein und gibt dem anderen einen Code. Danach nie wieder.'),
      el('button', { class: 'knopf glut breit', onclick: einrichtungErstes }, 'Ich richte ein'),
      el('button', { class: 'knopf leer breit', style: { marginTop: '9px' }, onclick: einrichtungCode },
        'Ich habe einen Code')
    ),
    el('p', { class: 'still klein mitte', style: { marginTop: '22px' } }, 'Fassung ' + APP_VERSION),
    el('button', {
      class: 'still klein mitte',
      style: { display: 'block', margin: '10px auto 0', padding: '8px' },
      onclick: raumWechslerBlatt,
    }, 'Raum: ' + (raumName() || '—') + ' · wechseln')
  );

  b.append(seite);
  $('#vorhang').classList.add('weg');
}

/* --- Weg 1: Das erste Gerät ----------------------------------------------- */

function einrichtungErstes() {
  const felder = {};
  const feld = (name, marke, platzhalter, hinweis) => {
    felder[name] = el('input', { class: 'feld', placeholder: platzhalter, autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
    return el('div', { style: { marginTop: '14px' } },
      el('label', { class: 'feldmarke' }, marke),
      felder[name],
      hinweis ? el('p', { class: 'still klein', style: { marginTop: '5px' } }, hinweis) : null
    );
  };

  const b = blatt(
    el('h2', {}, 'Einrichten'),
    el('p', { class: 'leise klein', style: { marginTop: '7px' } },
      'Die Zugangsdaten stehen in der Anleitung (EINRICHTEN.md). Sie bleiben auf diesem Gerät.'),

    el('div', { class: 'trenner' }),
    el('p', { class: 'winzig still' }, 'Die Namen'),
    feld('domme', 'Sie', 'Name'),
    feld('sub', 'Er', 'Name'),

    el('div', { class: 'trenner' }),
    el('p', { class: 'winzig still' }, 'Die Ablage — Firebase'),
    feld('projekt', 'Projekt-Kennung', 'mein-projekt-1234'),
    feld('apikey', 'Web-API-Schlüssel', 'AIza…'),
    feld('datenbank', 'Adresse der Datenbank', 'https://….firebasedatabase.app'),

    el('div', { class: 'trenner' }),
    el('p', { class: 'winzig still' }, 'Der Bote — für Hinweise'),
    feld('boteUrl', 'Adresse', 'https://ember-bote.….workers.dev'),
    feld('boteSchluessel', 'Öffentlicher Schlüssel', 'B…'),
    feld('boteGeheim', 'Geheimnis', '…', 'Ohne Boten läuft alles, nur ohne Hinweise.'),

    el('div', { style: { marginTop: '24px' } },
      el('button', { class: 'knopf glut breit', onclick: () => los() }, 'Einrichten')
    )
  );

  async function los() {
    const wert = (n) => felder[n].value.trim();
    if (!wert('domme') || !wert('sub')) return meldung('Beide Namen fehlen noch.');
    if (!wert('projekt') || !wert('apikey') || !wert('datenbank')) {
      return meldung('Ohne die drei Firebase-Angaben geht es nicht.');
    }

    const zugang = {
      projekt: wert('projekt'),
      schluessel: wert('apikey'),
      datenbank: wert('datenbank').replace(/\/+$/, ''),
    };
    const namen = { domme: wert('domme'), sub: wert('sub') };
    const bote = wert('boteUrl') ? {
      url: wert('boteUrl').replace(/\/+$/, ''),
      oeffentlich: wert('boteSchluessel'),
      geheim: wert('boteGeheim'),
    } : null;

    meldung('Verbinde …');
    const roh = await schluesselErzeugen();
    const paarId = await paarKennung(roh);

    try {
      await schluesselLaden(roh);
      await ablageAnmelden(zugang, paarId);
      /* Die Kennung dieses Geräts eintragen — daran erkennen die Regeln
         der Ablage später, wer hier schreiben darf. */
      await ablageSchreib('mitglieder/' + Ablage.ich, jetzt());
    } catch (f) {
      schluesselVergessen();
      return meldung('Die Ablage nimmt uns nicht an: ' + String(f.message || f).slice(0, 90), 7000);
    }

    Gerät.schreib('zugang', zugang);
    Gerät.schreib('namen', namen);
    Gerät.schreib('paarId', paarId);
    if (bote) Gerät.schreib('bote', bote);
    Gerät.schreib('rolle', 'domme');

    await datenSchreib('paar', { namen, begonnen: jetzt() });

    b.schliessen();
    const code = await kopplungscodeBauen(roh, zugang, namen);
    zeigeKopplungscode(code, roh);
  }
}

function zeigeKopplungscode(code, roh) {
  blatt(
    el('h2', {}, 'Der Code für das andere Gerät'),
    el('p', { class: 'leise klein', style: { margin: '8px 0 14px' } },
      'Er enthält euren Schlüssel. Nur direkt aufs andere Gerät — nicht per WhatsApp, nicht per Mail.'),
    el('textarea', {
      class: 'feld',
      readonly: true,
      rows: 5,
      style: { fontSize: '12px', fontFamily: 'ui-monospace, Menlo, monospace', wordBreak: 'break-all' },
      onclick: (e) => e.target.select(),
    }, code),
    el('button', {
      class: 'knopf glut breit',
      style: { marginTop: '14px' },
      onclick: async () => {
        try { await navigator.clipboard.writeText(code); meldung('Kopiert.'); }
        catch { meldung('Markier ihn und kopier von Hand.'); }
      },
    }, 'Kopieren'),
    el('div', { class: 'trenner' }),
    el('button', {
      class: 'knopf breit',
      onclick: () => pinFragen(roh, () => location.reload()),
    }, 'Weiter')
  );
}

/* --- Weg 2: Das zweite Gerät ---------------------------------------------- */

function einrichtungCode() {
  const feld = el('textarea', {
    class: 'feld', rows: 5, placeholder: 'EMBER1.…',
    style: { fontSize: '12px', fontFamily: 'ui-monospace, Menlo, monospace' },
    autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false',
  });

  const b = blatt(
    el('h2', {}, 'Code einfügen'),
    el('p', { class: 'leise klein', style: { margin: '8px 0 14px' } },
      'Den Code vom eingerichteten Gerät hier hineinlegen.'),
    feld,
    el('div', { style: { marginTop: '16px' } },
      el('button', { class: 'knopf glut breit', onclick: los }, 'Verbinden')
    )
  );

  async function los() {
    const gelesen = kopplungscodeLesen(feld.value);
    if (!gelesen) return meldung('Das sieht nicht nach einem EMBER-Code aus.');

    meldung('Verbinde …');
    const paarId = await paarKennung(gelesen.roh);

    try {
      await schluesselLaden(gelesen.roh);
      await ablageAnmelden(gelesen.ablage, paarId);
      await ablageSchreib('mitglieder/' + Ablage.ich, jetzt());
      /* Eine Probe: Kommt hier etwas Lesbares an, stimmt der Schlüssel. */
      const paar = await datenLies('paar');
      if (!paar) throw new Error('Der Schlüssel passt nicht zu dieser Ablage.');
    } catch (f) {
      schluesselVergessen();
      return meldung(String(f.message || f).slice(0, 110), 7000);
    }

    Gerät.schreib('zugang', gelesen.ablage);
    Gerät.schreib('namen', gelesen.namen);
    Gerät.schreib('paarId', paarId);
    Gerät.schreib('rolle', 'sub');

    b.schliessen();
    rolleWaehlenBeimEinrichten(gelesen.roh, gelesen.namen);
  }
}

/* Wer bin ich auf diesem Gerät? Die Wahl gilt dauerhaft und lässt sich
   später in den Einstellungen ändern. */
function rolleWaehlenBeimEinrichten(roh, namen) {
  const b = blatt(
    el('h2', {}, 'Wer bist du?'),
    el('p', { class: 'leise klein', style: { margin: '8px 0 16px' } }, 'Auf diesem Gerät.'),
    el('div', { class: 'knopfreihe' },
      el('button', {
        class: 'knopf glut', onclick: () => weiter('domme'),
      }, namen.domme || 'Sie'),
      el('button', {
        class: 'knopf', onclick: () => weiter('sub'),
      }, namen.sub || 'Er')
    )
  );

  function weiter(rolle) {
    Gerät.schreib('rolle', rolle);
    b.schliessen();
    pinFragen(roh, () => location.reload());
  }
}

/* --- Die PIN -------------------------------------------------------------- */

/* Sie ist freiwillig — aber sie ist echt: Mit PIN liegt auf dem Gerät nur
   ein verschlossener Schlüssel. Ohne PIN liegt er offen da, und wer das
   Handy in die Hand bekommt, kann alles lesen. */

function pinFragen(roh, fertig) {
  const feld = el('input', {
    class: 'feld', type: 'password', inputmode: 'numeric', maxlength: '8',
    placeholder: '••••', style: { textAlign: 'center', letterSpacing: '.5em', fontSize: '22px' },
  });
  const feld2 = el('input', {
    class: 'feld', type: 'password', inputmode: 'numeric', maxlength: '8',
    placeholder: 'noch einmal', style: { textAlign: 'center', letterSpacing: '.5em', fontSize: '22px', marginTop: '9px' },
  });

  const b = blatt(
    el('h2', {}, 'Eine PIN?'),
    el('p', { class: 'leise klein', style: { margin: '8px 0 16px' } },
      'Mit PIN bleibt alles verschlossen, wenn dir jemand das Handy aus der Hand nimmt. Ohne PIN nicht.'),
    feld, feld2,
    el('div', { style: { marginTop: '18px' } },
      el('button', { class: 'knopf glut breit', onclick: mitPin }, 'PIN setzen'),
      el('button', { class: 'knopf leer breit', style: { marginTop: '9px' }, onclick: ohnePin }, 'Ohne PIN')
    )
  );

  async function mitPin() {
    const pin = feld.value.trim();
    if (pin.length < 4) return meldung('Mindestens vier Ziffern.');
    if (pin !== feld2.value.trim()) return meldung('Die beiden stimmen nicht überein.');
    meldung('Einen Moment …');
    const schrank = await schluesselEinschliessen(roh, pin);
    Gerät.schreib('schrank', schrank);
    Gerät.loesch('schluessel');
    b.schliessen();
    fertig();
  }

  function ohnePin() {
    Gerät.schreib('schluessel', roheZuB64(roh));
    Gerät.loesch('schrank');
    b.schliessen();
    fertig();
  }
}
