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
  farbweltAnwenden();
  appSymbolAnwenden();
  /* Der Modus entscheidet, wer führt — er muss VOR dem ersten Zeichnen
     stehen, sonst baut sich die Seite in der falschen Rolle auf. Der
     letzte bekannte Stand liegt auf dem Gerät; die Ablage bestätigt
     ihn gleich darauf. */
  _modus = Gerät.lies('modus', 'gefuehrt');
  baueFussleiste();
  notausAnbringen();
  zeigeSeite('heim');
  $('#vorhang').classList.add('weg');

  /* SOFORT, nicht erst nach dem Netz: Wer getarnt weggelegt hat, darf
     beim Zurückkommen keine Sekunde EMBER aufblitzen sehen. */
  if (Gerät.lies('getarnt')) tarnungAn();

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

  /* Wer führt: aus der Ablage bestätigen und ab da mithorchen. Das Gerät
     hat den letzten Stand schon vor dem ersten Zeichnen geliefert. */
  await modusLaden().catch(() => {});

  /* Der Vorrat: erst die Einstellung, dann die Tagesaufgabe des Tages. */
  await vorratLaden().catch(() => {});
  tagesaufgabenStart().catch(() => {});

  /* Der Laden: Konto laden, dann rechnet ihr Gerät Gehalt, Zinsen und
     den Glutverlust nach — einmal je Fälligkeit, nie doppelt. */
  kontoLaden().then(() => ladenPflegen()).catch(() => {});
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

  /* Nach einer neuen Fassung einmal zeigen, was dazugekommen ist. */
  if (typeof neuerungenPruefen === 'function') neuerungenPruefen();

  /* Der allererste Moment auf diesem Gerät: eine kurze, warme Begrüßung
     mit den drei Dingen, die den Einstieg tragen. Einmal — nie wieder. */
  if (!Gerät.lies('begruesst')) {
    Gerät.schreib('begruesst', true);
    setTimeout(() => {
      if (istGetarnt()) return;
      const punkt = (zahl, text) => el('div', { style: { display: 'flex', gap: '11px', marginTop: '11px', alignItems: 'baseline' } },
        el('span', { class: 'zier glutschrift', style: { fontSize: '17px', flex: 'none' } }, zahl),
        el('p', { class: 'leise klein', style: { lineHeight: '1.5' } }, text));
      const b = blatt(
        el('h2', {}, istDomme() ? 'Schön, dass du da bist.' : 'Es kann losgehen.'),
        el('p', { class: 'leise klein', style: { margin: '8px 0 4px' } },
          istDomme() ? 'Diese App gehört euch beiden — und du führst sie. Drei Dinge zuerst:'
            : 'Diese App gehört euch beiden. Drei Dinge zuerst:'),
        punkt('1', 'Das kleine ? unten rechts erklärt dir jede Seite — in einfachen Worten, mit Beispiel.'),
        punkt('2', istDomme()
          ? 'Unter Ich → Verwaltung findest du deinen Werkzeugkasten — und unter Bausteine schaltest du die großen Module an und aus.'
          : 'Auf dem Heim steht alles, was heute zählt — von oben nach unten, alles antippbar.'),
        punkt('3', 'Schalte die Hinweise ein (Ich → Hinweise), damit euch nichts entgeht.'),
        el('button', { class: 'knopf glut breit', style: { marginTop: '18px' }, onclick: () => b.schliessen() },
          istDomme() ? 'Dann führe ich mal' : 'Verstanden')
      );
    }, 1200);
  }
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
  /* Niemals in einem fremden Rahmen laufen: Wer EMBER in ein iframe
     sperrt, bekommt stattdessen die echte Seite obenauf. (frame-ancestors
     lässt sich über GitHub Pages nicht setzen — dies ist der Ersatz.) */
  try { if (window.top !== window.self) window.top.location = window.location; } catch { /* fremde Herkunft: dann eben nur wir */ }

  raumMigration();
  fehlerWacheStarten();

  /* Getarnt gestartet heißt: schon der VORHANG ist eine Notiz-Seite —
     kein Glutpunkt, keine Wortmarke, kein Zitat, kein dunkler Grund. */
  if (Gerät.lies('getarnt')) {
    tarnStilAnbringen();
    document.title = 'Notizen';
    document.documentElement.setAttribute('data-stimmung', 'tarnung');
  }

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
    const vv = window.visualViewport;
    const messen = () => {
      /* Die Höhe allein reicht NICHT. Geht die Tastatur auf, schiebt iOS
         das ganze Layout-Fenster nach oben, damit das Feld sichtbar wird —
         und eine fixierte Hülle wandert stur mit hinaus. Sichtbar bleibt
         dann nur der obere Rand: Eingabezeile und Fußleiste kleben oben,
         darunter Schwarz. Deshalb wird auch der Versatz mitgeschrieben
         und die Hülle darum zurückgeschoben. */
      document.documentElement.style.setProperty('--vvh', vv.height + 'px');
      document.documentElement.style.setProperty('--vvt', (vv.offsetTop || 0) + 'px');
      /* Was von unten misst (Meldungen, Hilfe-Knopf), braucht den Abstand
         zwischen Sichtkante und Layout-Boden — sonst liegt es unter der
         Tastatur. */
      const unten = Math.max(0, window.innerHeight - ((vv.offsetTop || 0) + vv.height));
      document.documentElement.style.setProperty('--vvb', unten + 'px');
    };
    vv.addEventListener('resize', messen);
    vv.addEventListener('scroll', messen);
    messen();
    /* Nach dem Schließen der Tastatur meldet iOS die Höhe gern verspätet —
       und lässt das Fenster gern verschoben stehen. Beides geradeziehen. */
    window.addEventListener('focusout', () => {
      setTimeout(() => { window.scrollTo(0, 0); messen(); }, 60);
      setTimeout(() => { window.scrollTo(0, 0); messen(); }, 320);
    });
  }

  /* Solange getippt wird, hat der schwebende Hilfe-Knopf nichts über der
     Tastatur zu suchen — er säße sonst mitten im Bild. */
  document.addEventListener('focusin', (e) => {
    if (e.target && e.target.matches && e.target.matches('input, textarea, [contenteditable]')) {
      document.body.classList.add('tippt');
    }
  });
  document.addEventListener('focusout', () => {
    setTimeout(() => {
      const a = document.activeElement;
      if (!a || !a.matches || !a.matches('input, textarea, [contenteditable]')) {
        document.body.classList.remove('tippt');
      }
    }, 80);
  });

  /* Der Vorhang geht nach einem Wimpernschlag auf, ganz gleich, was das
     Netz gerade treibt. Sonst starrt man bei zähem Empfang minutenlang
     ins Schwarze — die App ist offline vollständig bedienbar. */
  setTimeout(() => $('#vorhang').classList.add('weg'), 300);

  /* Was beim letzten Mal nicht rausging, geht jetzt raus. */
  Ablage._warteschlange = Gerät.lies('warteschlange', []);

  try {
    /* Aussehen zuerst — auch das Schloss und die Einrichtung sollen schon
       in der gewählten Farbwelt und mit dem gewählten Symbol dastehen. */
    farbweltAnwenden();
    appSymbolAnwenden();

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
