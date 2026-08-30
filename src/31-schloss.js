/* ==========================================================================
   31-schloss.js — Der Weg hinein.

   Ohne PIN: einmal antippen. Mit PIN: die PIR entschlüsselt den Schlüssel.
   Es gibt hier keine Prüfung gegen ein gespeichertes Passwort — die falsche
   PIN gibt schlicht keinen brauchbaren Schlüssel her. Nichts zum Umgehen.
   ========================================================================== */

let _fehlversuche = 0;

function zeigeSchloss() {
  $('#fussleiste').hidden = true;
  const b = $('#buehne');
  b.innerHTML = '';

  const namen = Gerät.lies('namen', {});
  const rolle = Gerät.lies('rolle', 'sub');
  const schrank = Gerät.lies('schrank');

  const seite = el('div', { class: 'seite', style: { paddingTop: '12vh' } },
    el('div', { class: 'mitte', style: { marginBottom: '34px' } },
      el('div', { class: 'zier glutschrift', style: { fontSize: '38px', letterSpacing: '.14em' } }, 'EMBER'),
      el('p', { class: 'still klein', style: { marginTop: '8px' } }, namen[rolle] || '')
    )
  );

  if (!schrank) {
    seite.append(
      el('div', { class: 'knopfbuehne' },
        el('button', {
          class: 'derknopf bitte',
          onclick: async (e) => {
            e.target.disabled = true;
            const roh = b64ZuRohe(Gerät.lies('schluessel'));
            await schluesselLaden(roh);
            appStarten();
          },
        }, 'Öffnen')
      )
    );
  } else {
    const feld = el('input', {
      class: 'feld', type: 'password', inputmode: 'numeric', maxlength: '8',
      placeholder: '••••', autofocus: true,
      style: { textAlign: 'center', letterSpacing: '.5em', fontSize: '24px' },
      onkeydown: (e) => { if (e.key === 'Enter') pruefen(); },
    });

    const knopf = el('button', { class: 'knopf glut breit', style: { marginTop: '12px' }, onclick: () => pruefen() }, 'Öffnen');

    seite.append(
      el('div', { style: { maxWidth: '260px', margin: '0 auto' } }, feld, knopf),
      el('p', {
        class: 'still klein mitte', style: { marginTop: '26px' },
        onclick: alleszurueck,
      }, 'PIN vergessen?')
    );

    async function pruefen() {
      const pin = feld.value.trim();
      if (pin.length < 4) return;

      /* Die Bremse überlebt den Neustart: Ab dem fünften Fehlversuch
         verdoppelt sich die Wartezeit (30 s, 1 min, 2 min … höchstens
         15 min) — und ein Neuladen der Seite setzt sie NICHT zurück.
         Vier Ziffern durchzuprobieren soll sich schlicht nicht lohnen. */
      const fehl = Gerät.lies('pinFehl', { n: 0, wann: 0 });
      if (fehl.n >= 5) {
        const sperre = Math.min(15 * 60000, Math.pow(2, fehl.n - 5) * 30000);
        const uebrig = fehl.wann + sperre - Date.now();
        if (uebrig > 0) {
          feld.value = '';
          return meldung('Zu oft daneben. Warte noch ' + Math.ceil(uebrig / 1000) + ' Sekunden.', 4000);
        }
      }

      knopf.disabled = true;
      knopf.textContent = 'Einen Moment …';

      const roh = await schluesselAufschliessen(schrank, pin);
      if (!roh) {
        Gerät.schreib('pinFehl', { n: (fehl.n || 0) + 1, wann: Date.now() });
        _fehlversuche++;
        feld.value = '';
        knopf.textContent = 'Öffnen';
        const strafe = Math.min(_fehlversuche * 400, 4000);
        meldung(_fehlversuche > 2 ? 'Nicht die richtige.' : 'Falsch.');
        setTimeout(() => { knopf.disabled = false; feld.focus(); }, strafe);
        puls('antwortNein');
        return;
      }

      Gerät.loesch('pinFehl');
      _fehlversuche = 0;
      await schluesselLaden(roh);
      appStarten();
    }

    setTimeout(() => feld.focus(), 300);
  }

  /* Welcher Raum hier gerade offen ist — und der Weg zu den anderen.
     Über „Neuer Raum" beginnt auch die zweite Einrichtung auf einem
     Gerät, das schon einen Raum trägt. */
  seite.append(el('button', {
    class: 'still klein mitte',
    style: { display: 'block', margin: '30px auto 0', padding: '8px' },
    onclick: raumWechslerBlatt,
  }, 'Raum: ' + (raumName() || '—') + ' · wechseln'));

  b.append(seite);
  $('#vorhang').classList.add('weg');
}

/* Wer die PIN verliert, verliert den Schlüssel — das ist der Preis dafür,
   dass ihn sonst niemand hat. Der Weg zurück führt über das andere Gerät. */
async function alleszurueck() {
  const sicher = await frage(
    'PIN vergessen',
    'Ohne PIN lässt sich der Schlüssel dieses Raums nicht öffnen. Du kannst den Raum von diesem Gerät nehmen und mit dem Kopplungscode vom anderen Gerät neu hereinkommen. Alles Gemeinsame bleibt dabei erhalten — es liegt in der Ablage.',
    'Raum vom Gerät nehmen', true
  );
  if (!sicher) return;
  raumEntfernen(aktiverRaumId());
}

/* --- Abschließen ---------------------------------------------------------- */

function abschliessen() {
  schluesselVergessen();
  alleHorcherStoppen();
  D.offen = false;
  D.daten = {};

  /* Läuft gerade die Tarnung, gibt es die Bühne nicht — das Schloss zu
     zeichnen würde ins Leere greifen und stürzen. Die Notizliste bleibt
     stehen; der Rückweg aus der Tarnung führt dann von selbst ans
     Schloss, weil die App nicht mehr offen ist. */
  if (typeof _getarnt !== 'undefined' && _getarnt) {
    const griffGetarnt = $('#notaus');
    if (griffGetarnt) griffGetarnt.remove();
    return;
  }

  /* Der Notausgang gehört zur geöffneten App. Bliebe er stehen, führte er
     ins Leere: Ohne Schlüssel lässt sich keine Ampel mehr setzen. */
  const griff = $('#notaus');
  if (griff) griff.remove();
  $('#meldungen').innerHTML = '';

  zeigeSchloss();
}

/* Kommt die App nach langer Pause zurück, schließt sie sich von selbst. */
let _weggegangen = 0;

document.addEventListener('visibilitychange', () => {
  if (!D.offen || !Gerät.lies('schrank')) return;
  if (document.visibilityState === 'hidden') {
    _weggegangen = Date.now();
    return;
  }
  const stille = Gerät.lies('schliesstNach', 15) * 60000;
  if (stille > 0 && _weggegangen && Date.now() - _weggegangen > stille) abschliessen();
  _weggegangen = 0;
});
