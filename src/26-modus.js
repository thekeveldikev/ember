/* ==========================================================================
   26-modus.js — Wer führt?

   Drei Weisen, diese App zu leben:

     gefuehrt    Sie führt, er folgt. Der Anfang und die Vorgabe.
     gleich      Niemand führt. Beide haben denselben Knopf, dieselben
                 Rechte, dieselben Seiten. Eine schöne Sex-App für zwei.
     getauscht   Er führt, sie folgt. Alles dreht sich um.

   Der Modus ist NICHT nebenbei umlegbar. Einer schlägt vor, der andere
   muss auf seinem eigenen Gerät zustimmen — sonst könnte einer im
   Alleingang die Machtverhältnisse umdrehen, und genau das wäre das
   Gegenteil von dem, worum es hier geht. Bis zur Zustimmung bleibt
   alles, wie es war.

   WICHTIG für alles Weitere: `istDomme()` beantwortet ab hier die Frage
   „darf ich führen?" — und die hängt am Modus. Wer die Automatik rechnet
   (Zahltag, versäumte Aufträge, Zeitregeln), beantwortet dagegen
   `istWaechter()`: Das ist und bleibt das Gerät mit der Rolle 'domme',
   ganz gleich, wer gerade führt. Sonst rechnete im Modus „gleich"
   plötzlich jeder alles doppelt.
   ========================================================================== */

const MODI = [
  {
    key: 'gefuehrt',
    name: 'Sie führt',
    kurz: 'Der gewohnte Weg: Eine führt, einer folgt.',
    lang: 'Sie hat den Knopf, die Verwaltung und das letzte Wort. Er bittet, erfüllt und verdient. Alle Bereiche der App sind offen.',
  },
  {
    key: 'gleich',
    name: 'Auf Augenhöhe',
    kurz: 'Niemand führt. Beide haben denselben Knopf.',
    lang: 'Keine Rollen, keine Aufträge von oben: Beide sehen dieselben Seiten, beide können den Knopf drücken, beide legen an. Spiele, Wünsche, Buch und Nähe bleiben — nur das Gefälle ist weg. Der Laden ruht in dieser Weise von selbst.',
  },
  {
    key: 'getauscht',
    name: 'Er führt',
    kurz: 'Alles dreht sich um.',
    lang: 'Er hat den Knopf und die Verwaltung, sie bittet und erfüllt. Alles Angelegte bleibt, es wechselt nur die Seite. Zum Ausprobieren — oder für länger.',
  },
];

/* Der Modus lebt in der Ablage, damit beide Geräte dasselbe wissen.
   Gelesen wird aus einem Zwischenspeicher, weil istDomme() an tausend
   Stellen und in jedem Zeichenschritt gefragt wird — ein await ginge
   dort nicht. */
let _modus = 'gefuehrt';
let _modusHorcherLaeuft = false;

const modusJetzt = () => _modus;
const modusInfo = () => MODI.find((m) => m.key === _modus) || MODI[0];

/* Der Modus wird auch auf dem Gerät gemerkt: Beim nächsten Start steht
   die richtige Rolle SOFORT, ohne auf das Netz zu warten — sonst blitzte
   für einen Moment die falsche Oberfläche auf. */
function _modusMerken() {
  try { Gerät.schreib('modus', _modus); } catch { /* dann eben nicht */ }
}

async function modusLaden() {
  _modus = await datenLies('einst/modus', 'gefuehrt').catch(() => _modus);
  if (!MODI.some((m) => m.key === _modus)) _modus = 'gefuehrt';
  _modusMerken();
  if (!_modusHorcherLaeuft) {
    _modusHorcherLaeuft = true;
    ablageHorch('einst/modus', async () => {
      const vorher = _modus;
      _modus = await datenLies('einst/modus', 'gefuehrt').catch(() => _modus);
      if (!MODI.some((m) => m.key === _modus)) _modus = 'gefuehrt';
      _modusMerken();
      if (vorher !== _modus) {
        /* Ein Moduswechsel ändert fast jede Seite — hier ist ein
           vollständiger Neuaufbau ausnahmsweise das Richtige.
           Ein noch offener Vollbild-Befehl stammt aus der alten Ordnung
           und klebte sonst über der neuen Oberfläche. */
        if (typeof befehlSchliessen === 'function') befehlSchliessen();
        baueFussleiste();
        zeigeSeite(D.seite || 'heim');
        meldung('Ihr spielt jetzt: ' + modusInfo().name + '.', 4000);
      }
    }).catch(() => {});
  }
  return _modus;
}

/* Wer führt gerade? */
function istDomme() {
  if (_modus === 'gleich') return true;          // beide führen
  if (_modus === 'getauscht') return D.rolle === 'sub';
  return D.rolle === 'domme';
}

/* Wer folgt gerade? Im Modus „gleich" niemand — das ist NICHT einfach
   das Gegenteil von istDomme(), und genau darum gibt es die Funktion. */
const istSub = () => _modus !== 'gleich' && !istDomme();

/* Wer rechnet die Automatik? Immer dasselbe Gerät, modusunabhängig:
   sonst liefe im Modus „gleich" jeder Zahltag doppelt. */
const istWaechter = () => D.rolle === 'domme';

/* Im Modus „gleich" gibt es kein Oben — dort ruhen die Bereiche, die
   ohne Gefälle sinnlos wären. */
const gefaelleAn = () => _modus !== 'gleich';

/* --- Der Wechsel: einer fragt, der andere stimmt zu ----------------------- */

function modusBlatt() {
  const b = blatt(
    el('h2', {}, 'Wie ihr spielt'),
    el('p', { class: 'leise klein', style: { margin: '8px 0 4px', lineHeight: '1.55' } },
      'Diese Wahl gilt für euch beide. Wer sie ändern will, schlägt sie vor — ' +
      'die oder der andere muss auf dem eigenen Gerät zustimmen. Vorher ändert sich nichts.'),

    ...MODI.map((m) => {
      const jetztAn = m.key === _modus;
      return el('button', {
        class: 'karte',
        style: {
          width: '100%', textAlign: 'left', marginTop: '9px', padding: '13px 15px',
          borderColor: jetztAn ? 'var(--glut)' : 'var(--kante)',
        },
        onclick: () => {
          if (jetztAn) return meldung('So spielt ihr gerade.');
          b.schliessen();
          modusVorschlagen(m);
        },
      },
        el('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' } },
          el('div', { class: 'zier', style: { fontSize: '17px' } }, m.name),
          jetztAn ? el('span', { class: 'winzig', style: { color: 'var(--gruen)', flex: 'none' } }, 'gerade') : null
        ),
        el('div', { class: 'still klein', style: { marginTop: '3px', lineHeight: '1.5' } }, m.lang)
      );
    }),

    el('p', { class: 'still klein', style: { marginTop: '14px', lineHeight: '1.5' } },
      'Nichts geht dabei verloren: Aufträge, Regeln, Buch, Münzen und alles Angelegte bleiben liegen und sind nach einem Rückwechsel unverändert da.')
  );
}

async function modusVorschlagen(m) {
  const sicher = await frage(
    'Vorschlagen: ' + m.name + '?',
    nameVon(andereRolle()) + ' bekommt die Frage und muss zustimmen. Bis dahin bleibt alles, wie es ist.',
    'Vorschlagen');
  if (!sicher) return;

  await datenSchreib('einst/modusWunsch', {
    modus: m.key, von: D.rolle, wann: jetzt(),
  });
  pushSenden(andereRolle(), 'bitte', 'Eine Frage, wie ihr spielt.');
  meldung('Vorgeschlagen. Jetzt liegt es bei ' + nameVon(andereRolle()) + '.');
}

/* Die Karte auf dem Heim: Sie erscheint nur bei dem, der ANTWORTEN muss.
   Der Vorschlagende sieht bloß, dass er wartet. */
async function modusWunschKarte(platz, ruhig = false) {
  if (!platz) return;
  const aktuell = rennwache(platz);
  platz.innerHTML = '';

  const wunsch = await datenLies('einst/modusWunsch').catch(() => null);
  if (!aktuell()) return;
  platz.innerHTML = '';
  if (!wunsch || !wunsch.modus) return;

  /* Ein Vorschlag verfällt nach drei Tagen von selbst — sonst hinge er
     ewig da und niemand traute sich, ihn wegzuklicken. */
  if (jetzt() - (wunsch.wann || 0) > 3 * 86400000) {
    if (istWaechter()) datenLoesch('einst/modusWunsch').catch(() => {});
    return;
  }

  const m = MODI.find((x) => x.key === wunsch.modus);
  if (!m) return;

  if (wunsch.von === D.rolle) {
    sanftEinfuegen(platz, el('div', { class: 'karte', style: { marginBottom: '6px' } },
      el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, 'Vorgeschlagen'),
      el('div', {}, m.name + ' — ' + nameVon(andereRolle()) + ' hat noch nicht geantwortet.'),
      el('button', {
        class: 'winzig still', style: { marginTop: '10px' },
        onclick: async () => {
          await datenLoesch('einst/modusWunsch');
          meldung('Zurückgezogen.');
          heimAuffrischen('modus', true);
        },
      }, 'Zurückziehen')
    ), ruhig);
    return;
  }

  sanftEinfuegen(platz, el('div', { class: 'karte glimmt', style: { marginBottom: '6px' } },
    el('p', { class: 'winzig still', style: { marginBottom: '4px' } },
      nameVon(wunsch.von) + ' fragt'),
    el('div', { class: 'zier', style: { fontSize: '18px', marginBottom: '4px' } }, m.name),
    el('p', { class: 'leise klein', style: { lineHeight: '1.5' } }, m.lang),
    el('div', { class: 'knopfreihe', style: { marginTop: '13px' } },
      el('button', {
        class: 'knopf leer',
        onclick: async () => {
          await datenLoesch('einst/modusWunsch');
          pushSenden(andereRolle(), 'antwort', 'Lieber nicht.');
          meldung('Abgelehnt. Alles bleibt.');
          heimAuffrischen('modus', true);
        },
      }, 'Lieber nicht'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          await datenSchreib('einst/modus', m.key);
          await datenLoesch('einst/modusWunsch');
          _modus = m.key;
          _modusMerken();
          pushSenden(andereRolle(), 'antwort', 'Einverstanden.');
          tonSpielen('schimmer');
          if (typeof konfetti === 'function') konfetti();
          if (typeof befehlSchliessen === 'function') befehlSchliessen();
          baueFussleiste();
          zeigeSeite('heim');
          meldung('Ab jetzt: ' + m.name + '.', 4000);
        },
      }, 'Einverstanden')
    )
  ), ruhig);
}
