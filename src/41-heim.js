/* ==========================================================================
   41-heim.js — Die erste Seite.

   Oben, was heute gilt. In der Mitte der Knopf. Unten das Stille.
   Beide Rollen sehen dieselbe Seite, aber nicht dasselbe.
   ========================================================================== */

/* Die Plätze des Heims, solange es offen ist. Damit kann jede Ecke für
   sich frisch werden, ohne dass die ganze Seite neu entsteht und dabei
   sichtbar zuckt. */
let _heim = null;

/* Nur den betroffenen Teil neu zeichnen — oder zur Seite wechseln, wenn
   wir gar nicht auf dem Heim stehen. DAS ersetzt die alten
   zeigeSeite('heim')-Rundumschläge nach jedem Knopfdruck. */
function heimAuffrischen(teil, nurWennDa = false) {
  if (D.seite !== 'heim' || !_heim || !_heim.knopf.isConnected) {
    /* Horcher (nurWennDa) drängen sich nicht auf — nur eine bewusste
       Handlung darf zum Heim führen. Sonst risse ein einlaufendes
       Ereignis einen mitten aus dem Chat. */
    if (D.seite !== 'heim' && !nurWennDa) zeigeSeite('heim');
    return;
  }
  const ruhig = true;
  if (!teil || teil === 'knopf') { _heim.knopf.innerHTML = ''; knopfBuehneBauen(_heim.knopf); }
  if (!teil || teil === 'sperre') { _heim.sperre.innerHTML = ''; sperreKarte(_heim.sperre, ruhig); }
  if (!teil || teil === 'foto') { _heim.foto.innerHTML = ''; fotoAuftragKarte(_heim.foto, ruhig); }
  if (!teil || teil === 'aufgaben') { tagesaufgabeKarte(_heim.aufgaben, ruhig); }
}

SEITEN.heim = function (seite) {
  seite.append(
    el('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' } },
      (() => {
        /* Der Weg in die Tarnung hängt am Schriftzug — und muss es bei
           jedem Zeichnen aufs Neue, weil die Seite jedes Mal neu entsteht. */
        const zug = el('div', {},
          el('div', { class: 'zier glutschrift', style: { fontSize: '26px', letterSpacing: '.1em' } }, 'EMBER'),
          /* Wer zwei Welten trägt, soll immer sehen, in welcher er steht. */
          raeumeLies().length > 1
            ? el('div', { class: 'winzig still', style: { marginTop: '1px' } }, raumName())
            : null
        );
        tippenDreimal(zug, tarnungAn);
        return zug;
      })(),
      el('button', {
        class: 'winzig still',
        style: { padding: '6px 2px' },
        onclick: () => ampelBlatt(),
      }, ampelWort(D.ampel[D.rolle]))
    )
  );

  const sperrplatz = el('div');
  const fotoplatz = el('div');
  const tagesplatz = el('div');
  const aufgabenplatz = el('div');
  const frageplatz = el('div');
  const kontoplatz = el('div');
  const knopfplatz = el('div');
  const untenplatz = el('div');
  seite.append(sperrplatz, fotoplatz, tagesplatz, aufgabenplatz, frageplatz, kontoplatz, knopfplatz, untenplatz);

  _heim = { sperre: sperrplatz, foto: fotoplatz, aufgaben: aufgabenplatz, knopf: knopfplatz };

  knopfBuehneBauen(knopfplatz);
  sperreKarte(sperrplatz);
  fotoAuftragKarte(fotoplatz);
  tagesNachrichtLaden(tagesplatz);
  tagesaufgabeKarte(aufgabenplatz);
  checkinZeile(frageplatz);
  heimKontoZeile(kontoplatz);
  untenBauen(untenplatz);
};

/* Karten, die verspätet aus dem Netz kommen, klappen sanft auf, statt den
   Knopf ruckartig nach unten zu schieben. Der Kniff: ein Gitter, dessen
   einzige Zeile von 0fr auf 1fr wächst — Höhe wird animierbar, ohne dass
   jemand messen muss. */
function sanftEinfuegen(platz, knoten, ruhig = false) {
  /* Beim stillen Auffrischen derselben Seite stünde die Karte schon da —
     dann darf sie nicht noch einmal aufklappen, sonst hüpft alles. */
  if (ruhig || (platz.closest && platz.closest('.seite.still-wechsel'))) {
    const ruhig = el('div', { class: 'aufklapp offen' },
      el('div', { style: { minHeight: '0' } }, knoten));
    platz.append(ruhig);
    return ruhig;
  }
  const huelle = el('div', { class: 'aufklapp' },
    el('div', { style: { minHeight: '0' } }, knoten));
  platz.append(huelle);
  requestAnimationFrame(() => requestAnimationFrame(() => huelle.classList.add('offen')));
  return huelle;
}

/* --- Die Nachricht des Tages ---------------------------------------------- */

/* Sie steht unter dem Datum, nicht in einer Liste. Dadurch gibt es je Tag
   genau eine — und die von gestern ist von selbst weg. */

async function tagesNachrichtLaden(platz) {
  const heute = tagstempel();
  const aktuell = rennwache(platz);
  platz.innerHTML = '';

  const nachricht = await datenLies('tag/' + heute + '/nachricht');
  if (!aktuell()) return;
  platz.innerHTML = '';

  if (nachricht) {
    const karte = el('div', { class: 'karte glimmt', style: { marginBottom: '6px' } },
      el('p', { class: 'winzig still', style: { marginBottom: '9px' } }, 'Heute'),
      nachricht.bild ? el('img', {
        src: nachricht.bild,
        style: { width: '100%', borderRadius: '12px', marginBottom: nachricht.text ? '11px' : '0', display: 'block' },
      }) : null,
      nachricht.text ? el('p', {
        class: 'zier',
        style: { fontSize: '19px', lineHeight: '1.35' },
      }, nachricht.text) : null
    );

    if (istDomme()) {
      karte.append(el('button', {
        class: 'winzig still', style: { marginTop: '12px' },
        onclick: () => tagesNachrichtSetzen(platz),
      }, 'Ändern'));
    }
    sanftEinfuegen(platz, karte);

    /* Beim ersten Öffnen des Tages einmal groß, danach nur noch als Karte. */
    if (!istDomme() && Gerät.lies('tagGesehen') !== heute) {
      Gerät.schreib('tagGesehen', heute);
      setTimeout(() => tagesNachrichtGross(nachricht), 500);
    }
  } else if (istDomme()) {
    platz.append(el('button', {
      class: 'knopf leer breit',
      style: { marginBottom: '6px' },
      onclick: () => tagesNachrichtSetzen(platz),
    }, 'Etwas für heute hinterlegen'));
  }
}

function tagesNachrichtGross(nachricht) {
  const b = blatt(
    el('p', { class: 'winzig still mitte', style: { marginBottom: '18px' } }, 'Von ' + nameVon('domme')),
    nachricht.bild ? el('img', {
      src: nachricht.bild,
      style: { width: '100%', borderRadius: '14px', marginBottom: '16px', display: 'block' },
    }) : null,
    nachricht.text ? el('p', {
      class: 'zier mitte',
      style: { fontSize: '25px', lineHeight: '1.34', padding: '0 8px 8px' },
    }, nachricht.text) : null,
    el('button', { class: 'knopf glut breit', style: { marginTop: '18px' }, onclick: () => b.schliessen() }, 'Gelesen')
  );
  puls('hinweis');
}

function tagesNachrichtSetzen(platz) {
  let bild = null;

  const feld = el('textarea', { class: 'feld', rows: 3, placeholder: 'Was sie heute wissen soll …' });
  const vorschau = el('div');
  const dateiwahl = el('input', {
    type: 'file', accept: 'image/*', hidden: true,
    onchange: async (e) => {
      const datei = e.target.files[0];
      if (!datei) return;
      meldung('Verkleinere …');
      try {
        bild = await bildVerkleinern(datei, 1200, 0.76);
        vorschau.innerHTML = '';
        vorschau.append(el('img', { src: bild, style: { width: '100%', borderRadius: '12px', marginTop: '11px', display: 'block' } }));
      } catch { meldung('Das Bild ließ sich nicht lesen.'); }
    },
  });

  const b = blatt(
    el('h2', {}, 'Für heute'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Erscheint bei ihm einmal groß, sobald er die App heute zum ersten Mal öffnet.'),
    feld, vorschau, dateiwahl,
    el('button', { class: 'knopf leer breit', style: { marginTop: '11px' }, onclick: () => dateiwahl.click() }, 'Ein Bild dazu'),
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          const text = feld.value.trim();
          if (!text && !bild) return meldung('Da ist noch nichts.');
          b.schliessen();
          await datenSchreib('tag/' + tagstempel() + '/nachricht', { text, bild });
          pushSenden('sub', 'hinweis', 'Etwas für heute.');
          meldung('Liegt bereit.');
          tagesNachrichtLaden(platz);
        },
      }, 'Hinterlegen')
    )
  );
  setTimeout(() => feld.focus(), 260);
}

/* --- Der stille Teil ------------------------------------------------------ */

function untenBauen(platz) {
  platz.innerHTML = '';

  const funkenKnopf = el('button', {
    class: 'knopf leer', style: { fontSize: '13.5px', padding: '12px 8px' },
    onclick: funkeSenden,
  }, 'Funke');
  /* Langer Druck auf den Funken-Knopf: den eigenen Topf füllen. */
  langerDruck(funkenKnopf, funkenPflegen);

  platz.append(
    el('div', { class: 'knopfreihe', style: { marginTop: '8px' } },
      el('button', {
        class: 'knopf leer',
        style: { fontSize: '13.5px', padding: '12px 8px' },
        onclick: async () => {
          puls('denkAnDich');
          await datenSchreib('puls/' + andereRolle(), { wann: jetzt() });
          pushSenden(andereRolle(), 'denkAnDich');
          meldung('Angekommen.');
        },
      }, 'Denk an dich'),
      funkenKnopf,
      el('button', {
        class: 'knopf leer', style: { fontSize: '13.5px', padding: '12px 8px' },
        onclick: () => ampelBlatt(),
      }, 'Ampel')
    )
  );

  const keksplatz = el('div', { style: { marginTop: '14px' } });
  platz.append(keksplatz);
  gluecksKeksLaden(keksplatz);
}

/* Das Glückskeks wohnt jetzt in 61-keks.js — mit echtem Keks, Bruch und
   aufgefaltetem Zettel statt einer stillen Karte. */
