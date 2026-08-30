/* ==========================================================================
   43b-stimme.js — Sprachnachrichten, Ablauf, Signale.

   Drei Erweiterungen des Plauschs:

     Stimme    Eine Aufnahme trifft anders als Text. Auch mitten am Tag.
     Ablauf    Nachrichten, die sich von selbst zurückziehen.
     Signale   Zeichen, deren Bedeutung nur ihr kennt.
   ========================================================================== */

/* --- Aufnehmen ------------------------------------------------------------ */

/* Die Aufnahme wird als Text in die Ablage gelegt, wie die Bilder auch.
   Deshalb ist sie kurz begrenzt: eine Minute reicht für das, wofür das
   hier gedacht ist, und bleibt unter dem, was eine Zeile tragen kann. */

const STIMME_MAX_SEKUNDEN = 60;

let _aufnahme = null;

async function stimmeAufnehmen() {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    return meldung('Dieses Gerät kann hier nicht aufnehmen.');
  }

  let strom;
  try {
    strom = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return meldung('Ohne Erlaubnis zum Mikrofon geht es nicht.');
  }

  /* Nicht jeder Browser kann dasselbe Format. Der erste Treffer gewinnt. */
  const formate = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  const format = formate.find((f) => MediaRecorder.isTypeSupported(f)) || '';

  const geraet = new MediaRecorder(strom, format ? { mimeType: format } : undefined);
  const stuecke = [];
  geraet.addEventListener('dataavailable', (e) => { if (e.data.size) stuecke.push(e.data); });

  const anzeige = el('div', {
    class: 'zier',
    style: { fontSize: '40px', textAlign: 'center', color: 'var(--glut-hell)', fontVariantNumeric: 'tabular-nums' },
  }, '0:00');

  const balken = el('div', {
    style: { height: '5px', borderRadius: '3px', background: 'var(--grund2)', overflow: 'hidden', margin: '16px 0 4px' },
  });
  const fuellung = el('div', {
    style: { height: '100%', width: '0%', background: 'var(--verlauf)', transition: 'width .3s linear' },
  });
  balken.append(fuellung);

  const punkt = el('div', {
    style: {
      width: '14px', height: '14px', borderRadius: '50%', background: 'var(--rot)',
      margin: '0 auto 14px', boxShadow: '0 0 10px rgba(178,69,60,.6)',
      transition: 'transform .08s ease-out, box-shadow .08s ease-out',
    },
  });

  /* Der Punkt atmet mit der Stimme: ein Analyser lauscht am Strom (ohne
     ihn an die Lautsprecher zu legen!) und skaliert den Punkt mit der
     Lautstärke. Man SIEHT, dass die Aufnahme einen hört. */
  let pegelRaf = null;
  try {
    const ac = _klang();
    if (ac) {
      const quelle = ac.createMediaStreamSource(strom);
      const lauscher = ac.createAnalyser();
      lauscher.fftSize = 256;
      quelle.connect(lauscher);
      const daten = new Uint8Array(lauscher.fftSize);
      const lauschen = () => {
        lauscher.getByteTimeDomainData(daten);
        let summe = 0;
        for (let i = 0; i < daten.length; i++) { const d = (daten[i] - 128) / 128; summe += d * d; }
        const pegel = Math.min(1, Math.sqrt(summe / daten.length) * 3.4);
        punkt.style.transform = 'scale(' + (1 + pegel * 1.9) + ')';
        punkt.style.boxShadow = '0 0 ' + (10 + pegel * 26) + 'px rgba(178,69,60,' + (0.4 + pegel * 0.5) + ')';
        pegelRaf = requestAnimationFrame(lauschen);
      };
      lauschen();
    }
  } catch { punkt.style.animation = 'funkeln 1.2s ease-in-out infinite'; }

  let sekunden = 0;
  const takt = setInterval(() => {
    sekunden++;
    anzeige.textContent = Math.floor(sekunden / 60) + ':' + String(sekunden % 60).padStart(2, '0');
    fuellung.style.width = (sekunden / STIMME_MAX_SEKUNDEN * 100) + '%';
    if (sekunden >= STIMME_MAX_SEKUNDEN) beenden(true);
  }, 1000);

  const b = blatt(
    el('p', { class: 'winzig still mitte', style: { marginBottom: '14px' } }, 'Nimmt auf'),
    punkt, anzeige, balken,
    el('p', { class: 'winzig still mitte' }, 'höchstens eine Minute'),
    el('div', { class: 'knopfreihe', style: { marginTop: '20px' } },
      el('button', { class: 'knopf leer', onclick: () => beenden(false) }, 'Verwerfen'),
      el('button', { class: 'knopf glut', onclick: () => beenden(true) }, 'Senden')
    )
  );

  geraet.start();
  puls('hinweis');
  tonSpielen('tick');

  let abgeschlossen = false;

  async function beenden(senden) {
    /* Ein zweiter Tipp auf „Senden" darf die Aufnahme nicht doppelt
       verschicken — der erste Durchlauf gewinnt. */
    if (abgeschlossen) return;
    abgeschlossen = true;

    clearInterval(takt);
    if (pegelRaf) cancelAnimationFrame(pegelRaf);

    /* Erst das Ohr an das Stop-Ereignis legen, DANN anhalten — sonst
       kann das Ereignis verpuffen, bevor jemand zuhört. */
    const gestoppt = new Promise((fertig) => {
      geraet.addEventListener('stop', fertig, { once: true });
      setTimeout(fertig, 700);
    });
    if (geraet.state !== 'inactive') geraet.stop();
    strom.getTracks().forEach((s) => s.stop());
    b.schliessen();

    if (!senden) return;
    if (!sekunden) return meldung('Zu kurz — sprich einen Moment länger.');

    /* Der Rekorder liefert die letzten Daten erst nach dem Anhalten. */
    await gestoppt;

    if (!stuecke.length) return meldung('Es ist nichts angekommen.');

    const brocken = new Blob(stuecke, { type: format || 'audio/webm' });
    if (brocken.size > 900000) return meldung('Zu lang für die Ablage. Etwas kürzer noch einmal?');

    meldung('Schickt …');
    const daten = await new Promise((fertig) => {
      const leser = new FileReader();
      leser.onload = () => fertig(leser.result);
      leser.readAsDataURL(brocken);
    });

    await datenAnhaengen('plausch', { stimme: daten, dauer: sekunden });
    pushSenden(andereRolle(), 'plausch', 'Eine Stimme.');
  }
}

/* --- Abspielen ------------------------------------------------------------ */

/* Eine schlichte Zeile mit Knopf und Balken. Kein Wellenbild — das würde
   die Aufnahme im Vorhinein verraten, und darum geht es hier nicht. */

let _spieltGerade = null;

function stimmeZeile(nachricht, meins) {
  const ton = new Audio(nachricht.stimme);
  let laeuft = false;

  const knopf = el('button', {
    style: {
      width: '38px', height: '38px', flex: 'none', borderRadius: '50%',
      display: 'grid', placeItems: 'center', fontSize: '13px',
      background: meins ? 'rgba(27,15,9,.35)' : 'var(--verlauf)',
      color: meins ? 'var(--schrift)' : '#1b0f09',
    },
  }, '▶');

  const fuellung = el('div', {
    style: { height: '100%', width: '0%', background: meins ? 'rgba(255,255,255,.55)' : 'var(--glut)', borderRadius: '2px' },
  });

  const balken = el('div', {
    style: {
      flex: '1', height: '4px', borderRadius: '2px', minWidth: '86px',
      background: meins ? 'rgba(0,0,0,.28)' : 'var(--grund2)',
    },
  }, fuellung);

  const zeit = el('span', {
    class: 'winzig',
    style: { opacity: '.7', minWidth: '32px', textAlign: 'right', textTransform: 'none' },
  }, Math.floor((nachricht.dauer || 0) / 60) + ':' + String((nachricht.dauer || 0) % 60).padStart(2, '0'));

  knopf.addEventListener('click', () => {
    if (laeuft) { ton.pause(); return; }
    /* Immer nur eine Stimme zur Zeit. Über eine Merkstelle, nicht über
       den Baum — new Audio() hängt in keinem Baum und wäre über
       querySelectorAll nie zu finden gewesen. */
    if (_spieltGerade && _spieltGerade !== ton) _spieltGerade.pause();
    _spieltGerade = ton;
    ton.play().catch(() => meldung('Das ließ sich nicht abspielen.'));
  });

  ton.addEventListener('play', () => { laeuft = true; knopf.textContent = '❚❚'; });
  ton.addEventListener('pause', () => { laeuft = false; knopf.textContent = '▶'; });
  ton.addEventListener('ended', () => {
    laeuft = false;
    knopf.textContent = '▶';
    fuellung.style.width = '0%';
  });
  ton.addEventListener('timeupdate', () => {
    if (ton.duration) fuellung.style.width = (ton.currentTime / ton.duration * 100) + '%';
  });

  return el('div', {
    style: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: '176px' },
  }, knopf, balken, zeit);
}

/* --- Ablauf --------------------------------------------------------------- */

/* Eine Nachricht mit Ablauf verschwindet bei beiden. Die Prüfung passiert
   beim Zeichnen — das genügt, weil beide dieselbe Uhr lesen, und es
   braucht keinen Dienst, der im Hintergrund aufräumt. */

const ABLAUF_WAHL = [
  { marke: 'Nach dem Lesen', ms: 0 },
  { marke: '5 Minuten', ms: 5 * 60000 },
  { marke: '1 Stunde', ms: 3600000 },
  { marke: '1 Tag', ms: 86400000 },
];

function istAbgelaufen(n) {
  if (!n.ablauf && n.ablauf !== 0) return false;
  if (n.ablauf === 0) return !!n.gelesen && jetzt() - n.gelesen > 12000;
  return jetzt() - n.wann > n.ablauf;
}

/* Beim ersten Anschauen einer fremden Nachricht die Uhr starten. */
function ablaufAnstossen(n) {
  if (n.ablauf !== 0 || n.von === D.rolle || n.gelesen) return;
  datenAendern('plausch', n.id, { gelesen: jetzt() }).catch(() => {});
}

function ablaufWaehlen(fertig) {
  const b = blatt(
    el('h2', {}, 'Zieht sich zurück'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 4px' } },
      'Die Nachricht verschwindet danach bei uns beiden.'),
    ...ABLAUF_WAHL.map((w) => el('button', {
      class: 'karte', style: { width: '100%', textAlign: 'left', marginTop: '9px' },
      onclick: () => { b.schliessen(); fertig(w.ms); },
    }, w.marke)),
    el('button', {
      class: 'knopf leer breit', style: { marginTop: '13px' },
      onclick: () => { b.schliessen(); fertig(null); },
    }, 'Doch dauerhaft')
  );
}

/* --- Geheime Signale ------------------------------------------------------ */

/* Ein Zeichen und seine Bedeutung. Im Plausch verschickt sieht es aus wie
   ein Emoji — was es heißt, steht nur in eurem Nachschlagewerk. */

SEITEN.signale = function (seite) {
  seite.append(kopfzeile('Signale',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '18px', lineHeight: '1.5' } },
    'Zeichen, deren Bedeutung nur ihr kennt. Verschickt im Plausch sehen sie aus wie nichts.'));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('signale', (liste) => signaleZeichnen(platz, liste));
  beimVerlassen(stopp);
};

function signaleZeichnen(platz, liste) {
  platz.innerHTML = '';

  if (!liste.length) {
    platz.append(leerlauf('Noch keine', 'Ein Emoji, ein Wort — und was es zwischen euch bedeutet.'));
  }

  liste.forEach((s) => {
    const karte = el('div', {
      class: 'karte',
      style: { display: 'flex', gap: '15px', alignItems: 'center', marginTop: '9px' },
    },
      el('div', { style: { fontSize: '28px', flex: 'none', minWidth: '38px', textAlign: 'center' } }, s.zeichen),
      el('div', { style: { flex: '1' } },
        el('div', {}, s.bedeutung),
        el('div', { class: 'winzig still', style: { marginTop: '2px' } }, 'von ' + nameVon(s.von))
      ),
      el('button', {
        class: 'winzig still', style: { padding: '10px', flex: 'none' },
        onclick: async () => {
          await datenAnhaengen('plausch', { text: s.zeichen });
          pushSenden(andereRolle(), 'plausch');
          meldung('Gesendet.');
        },
      }, 'Senden')
    );

    langerDruck(karte, async () => {
      const weg = await frage('Signal wegnehmen?', s.zeichen + ' — ' + s.bedeutung, 'Wegnehmen', true);
      if (weg) await datenEintragLoeschen('signale', s.id);
    });

    platz.append(karte);
  });

  platz.append(el('button', {
    class: 'knopf leer breit', style: { marginTop: '13px' },
    onclick: signalAnlegen,
  }, '+ Signal'));
}

function signalAnlegen() {
  const zeichen = el('input', {
    class: 'feld', maxlength: '4', placeholder: '· · ·',
    style: { textAlign: 'center', fontSize: '30px' },
  });
  const bedeutung = el('input', { class: 'feld', placeholder: 'Was heißt es?', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Ein Signal'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Nur ihr wisst, was es bedeutet. Für alle anderen ist es ein Emoji.'),
    zeichen, bedeutung,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!zeichen.value.trim() || !bedeutung.value.trim()) return meldung('Beides fehlt noch.');
          b.schliessen();
          await datenAnhaengen('signale', {
            zeichen: zeichen.value.trim(),
            bedeutung: bedeutung.value.trim(),
          });
          meldung('Steht im Nachschlagewerk.');
        },
      }, 'Anlegen')
    )
  );
  setTimeout(() => zeichen.focus(), 260);
}
