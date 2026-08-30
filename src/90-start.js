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

  /* Kennt dieses Gerät den Boten nicht, holt es ihn aus der Ablage —
     verschlüsselt hinterlegt vom Gerät, das ihn eingerichtet hat. So
     braucht ein Folgegerät nie eine technische Angabe von Hand. */
  if (!Push.bote) {
    const geteilt = await datenLies('einst/bote').catch(() => null);
    if (geteilt && geteilt.url) {
      Gerät.schreib('bote', geteilt);
      Push.bote = geteilt;
    }
  }

  /* Selbstheilung: Eine krumme Boten-Adresse (ohne https, mit Anhang)
     wird einmal geradegezogen und zurückgeschrieben — auf dem Gerät
     UND in der Ablage, damit auch das andere Gerät gesund wird. */
  if (Push.bote && Push.bote.url) {
    const sauber = boteAdresse(Push.bote.url);
    if (sauber !== Push.bote.url) {
      Push.bote = { ...Push.bote, url: sauber };
      Gerät.schreib('bote', Push.bote);
      datenSchreib('einst/bote', Push.bote).catch(() => {});
    }
  }

  await ampelLaden().catch(() => {});
  stimmungSetzen();

  /* Der Vorrat: erst die Einstellung, dann die Tagesaufgabe des Tages. */
  await vorratLaden().catch(() => {});
  tagesaufgabenStart().catch(() => {});
  datenListe('toys').then((l) => { D.toysVorhanden = l.some((t) => t.aktiv !== false); }).catch(() => {});

  /* Der Glimm-Punkt am Auftrag-Reiter: zählt, was auf MICH wartet —
     bei ihm das Unerledigte, bei ihr das Gemeldete zum Abhaken. */
  datenHorch('auftraege', (liste) => {
    const wach = liste.filter((a) => !(a.ruhtBis && a.ruhtBis > jetzt()) && !a.bestaetigt);
    D.offeneAuftraege = istDomme()
      ? wach.filter((a) => a.erledigt).length
      : wach.filter((a) => !a.erledigt).length;
    leisteAuffrischen();
  });

  knopfHorcherStarten();
  ampelHorcherStarten();
  sperreHorcherStarten();
  fotoHorcherStarten();
  regieHorcherStarten();
  maschineStarten();
  regelWachePruefen();
  leisteAuffrischen();

  /* Jetzt, wo die Leitung steht, den ersten Stand nachziehen — Teil für
     Teil, ohne die ganze Seite sichtbar neu entstehen zu lassen. */
  if (D.seite === 'heim') heimAuffrischen();

  warteschlangeLeeren();

  /* Was aufgetaucht ist, während niemand hinsah: Krümel und der Impuls
     des Tages. */
  spannungPruefen();

  /* Hinweise stillschweigend erneuern, falls die Anmeldung abgelaufen ist. */
  if (Push.bote && pushErlaubnisErteilt()) pushAnmelden(true);
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
  fehlerWacheStarten();

  stimmungSetzen();
  dienstAnmelden();
  wischZurueckAnbringen();

  /* Ein leiser Satz unter dem Schriftzug, solange der Vorhang steht —
     aus dem harmlosesten Teil des Keks-Vorrats. Nie etwas, das auf einem
     fremden Blick peinlich wäre. */
  try {
    const zitate = VORRAT.kekse.filter((k) =>
      ['warm', 'nachdenklich', 'motivation'].includes(k.kategorie) && (k.intensitaet || 1) <= 1);
    if (zitate.length) $('#vorhang').append(el('div', { class: 'vorhangzitat' }, zufall(zitate).text));
  } catch { /* dann eben ohne */ }

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
      }, 'Diesen Raum leeren und neu beginnen')
    ));
  }

  $('#vorhang').classList.add('weg');
})();
