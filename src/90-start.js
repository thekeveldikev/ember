/* ==========================================================================
   90-start.js — Der Anfang.

   Drei mögliche Wege beim Öffnen:
     nichts eingerichtet  -> die Einrichtung
     eingerichtet, zu     -> das Schloss
     offen                -> die App
   ========================================================================== */

async function appStarten() {
  const zugang = Gerät.lies('zugang');
  const paarId = Gerät.lies('paarId');

  if (!zugang || !paarId || !schluesselDa()) return zeigeSchloss();

  D.rolle = Gerät.lies('rolle', 'sub');
  D.paar = { id: paarId, namen: Gerät.lies('namen', {}) };
  D.offen = true;

  Push.bote = Gerät.lies('bote', null);

  /* Zuerst die Oberfläche, dann das Netz. Was schon im Spiegel liegt, ist
     sofort da; alles Weitere trägt der Horcher nach, sobald er steht.
     Umgekehrt wäre jede zähe Verbindung ein leerer Bildschirm. */
  stimmungSetzen();
  baueFussleiste();
  notausAnbringen();
  zeigeSeite('heim');
  $('#vorhang').classList.add('weg');

  if (Gerät.lies('schuetteln')) schuettelnHorchen();

  try {
    await ablageAnmelden(zugang, paarId);
  } catch {
    /* Ohne Netz läuft die App aus dem Spiegel weiter — nur eben still. */
    meldung('Ohne Verbindung. Du siehst den letzten Stand.', 5000);
    return;
  }

  ablageSchreib('mitglieder/' + Ablage.ich, jetzt()).catch(() => {});

  await ampelLaden().catch(() => {});
  stimmungSetzen();

  knopfHorcherStarten();
  ampelHorcherStarten();
  sperreHorcherStarten();
  regelWachePruefen();
  leisteAuffrischen();

  /* Jetzt, wo die Leitung steht, den ersten Stand nachziehen. */
  if (D.seite === 'heim') zeigeSeite('heim');

  warteschlangeLeeren();

  /* Was aufgetaucht ist, während niemand hinsah: Krümel und der Impuls
     des Tages. */
  spannungPruefen();

  /* Hinweise stillschweigend erneuern, falls die Anmeldung abgelaufen ist. */
  if (Push.bote && Notification.permission === 'granted') pushAnmelden(true);
}

/* Kommt die App aus dem Hintergrund zurück, kann inzwischen ein Krümel
   oder der Impuls des Tages fällig geworden sein. Höchstens einmal pro
   Minute nachsehen — öfter brächte nichts. */
let _zuletztGeprueft = 0;
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !D.offen) return;
  if (Date.now() - _zuletztGeprueft < 60000) return;
  _zuletztGeprueft = Date.now();
  spannungPruefen();
});

/* Eine Regeländerung meldet sich, ohne zu verraten, worum es ging. */
function regelWachePruefen() {
  if (istDomme()) return;

  ablageHorch('regelStand', async (weg, wert) => {
    if (!wert) return;
    const stand = await datenLies('regelStand');
    if (!stand) return;
    const gesehen = Gerät.lies('regelStandGesehen', 0);
    if (stand.wann <= gesehen) return;
    Gerät.schreib('regelStandGesehen', stand.wann);
    if (jetzt() - stand.wann > 300000) return;
    puls('hinweis');
    meldungMitTat('Eine Regel hat sich geändert.', 'Nachsehen', () => zeigeSeite('auftrag'), 12000);
  });
}

/* --- Der Einstieg --------------------------------------------------------- */

(async function () {

  /* Vor allem anderen: In welchem Raum sind wir? Ohne dieses Vorzeichen
     läse jeder Griff zum Gerät die falsche Welt. */
  raumMigration();

  stimmungSetzen();
  dienstAnmelden();

  /* Die sichtbare Höhe mitschreiben. Auf dem iPhone ist das der einzige
     verlässliche Weg, von der Tastatur zu erfahren: Das Layout bleibt
     gleich groß, nur der sichtbare Ausschnitt schrumpft. */
  if (window.visualViewport) {
    const messen = () => {
      document.documentElement.style.setProperty('--vvh', window.visualViewport.height + 'px');
    };
    window.visualViewport.addEventListener('resize', messen);
    messen();
    /* Nach dem Schließen der Tastatur meldet iOS die Höhe gern verspätet. */
    window.addEventListener('focusout', () => setTimeout(messen, 250));
  }

  /* Der Vorhang geht nach einem Wimpernschlag auf, ganz gleich, was das
     Netz gerade treibt. Sonst starrt man bei zähem Empfang minutenlang
     ins Schwarze — die App ist offline vollständig bedienbar. */
  setTimeout(() => $('#vorhang').classList.add('weg'), 300);

  /* Was beim letzten Mal nicht rausging, geht jetzt raus. */
  Ablage._warteschlange = Gerät.lies('warteschlange', []);

  try {
    if (!istEingerichtet()) {
      zeigeEinrichtung();
      return;
    }

    /* Ohne PIN kann die App sich selbst öffnen. Mit PIN nicht — das ist
       der ganze Sinn der PIN. */
    const offen = Gerät.lies('schluessel');
    if (offen) {
      await schluesselLaden(b64ZuRohe(offen));
      await appStarten();
    } else {
      zeigeSchloss();
    }
  } catch (f) {
    $('#vorhang').classList.add('weg');
    $('#buehne').innerHTML = '';
    $('#buehne').append(el('div', { class: 'seite', style: { paddingTop: '18vh', textAlign: 'center' } },
      el('div', { class: 'zier', style: { fontSize: '21px' } }, 'Etwas ist schiefgegangen.'),
      el('p', { class: 'leise klein', style: { margin: '10px 0 20px' } }, String(f && f.message || f).slice(0, 160)),
      el('button', { class: 'knopf glut', onclick: () => location.reload() }, 'Neu versuchen'),
      el('button', {
        class: 'knopf leer breit', style: { marginTop: '10px' },
        onclick: () => { Gerät.alleLoeschen(); spiegelLeeren(); location.reload(); },
      }, 'Gerät leeren und neu beginnen')
    ));
  }

  $('#vorhang').classList.add('weg');
})();
