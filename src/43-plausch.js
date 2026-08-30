/* ==========================================================================
   43-plausch.js — Der Plausch.

   Kein WhatsApp, kein Telegram: alles bleibt in eurem System und in eurer
   Verschlüsselung. Der Vorteil ist nicht nur Verschwiegenheit — hier können
   Nachrichten Dinge sein, die anderswo nur Text wären.
   ========================================================================== */

const REAKTIONEN_FEST = ['🔥', '🧎', '❤️', '💦', '😈'];

SEITEN.plausch = function (seite) {
  /* Der Plausch füllt die Bühne, statt eine Höhe zu erraten: Die Bühne
     hört auf zu scrollen, die Seite nimmt den ganzen Platz, und die Liste
     darin scrollt selbst. Schrumpft die Sichthöhe — Tastatur —, schrumpft
     alles mit, und das Schreibfeld bleibt über den Tasten. */
  const buehne = $('#buehne');
  buehne.style.overflowY = 'hidden';
  beimVerlassen(() => { buehne.style.overflowY = ''; });

  seite.style.display = 'flex';
  seite.style.flexDirection = 'column';
  seite.style.height = '100%';

  const kopf = el('div', { style: { flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' } },
    el('h2', {}, nameVon(andereRolle())),
    el('button', { class: 'winzig still', onclick: () => ampelBlatt() }, ampelWort(D.ampel[andereRolle()]))
  );

  const liste = el('div', {
    style: { flex: '1', minHeight: '0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '9px', paddingBottom: '10px' },
  });

  const feld = el('textarea', {
    class: 'feld', rows: 1, placeholder: 'Schreib …',
    style: { flex: '1', minHeight: '46px', maxHeight: '120px', padding: '12px 14px' },
    oninput: (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    },
    onkeydown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); senden(); }
    },
  });

  const dateiwahl = el('input', {
    type: 'file', accept: 'image/*', hidden: true,
    onchange: async (e) => {
      const datei = e.target.files[0];
      e.target.value = '';
      if (!datei) return;
      meldung('Verkleinere …');
      try {
        const bild = await bildVerkleinern(datei);
        await datenAnhaengen('plausch', { bild });
        pushSenden(andereRolle(), 'plausch');
      } catch { meldung('Das Bild ließ sich nicht lesen.'); }
    },
  });

  /* Ein gewählter Ablauf gilt für die nächste Nachricht — danach wieder
     dauerhaft. Sonst verschwände irgendwann versehentlich alles. */
  let ablauf = null;
  const ablaufKnopf = el('button', {
    class: 'knopf leer', style: { minWidth: '46px', padding: '12px' },
    onclick: () => ablaufWaehlen((ms) => {
      ablauf = ms;
      ablaufKnopf.className = 'knopf' + (ms === null ? ' leer' : ' glut');
      if (ms !== null) meldung('Die nächste Nachricht zieht sich zurück.');
    }),
  }, '⏱');

  const eingabe = el('div', {
    style: { flex: 'none', display: 'flex', gap: '7px', alignItems: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--kante)' },
  },
    el('button', {
      class: 'knopf leer', style: { minWidth: '44px', padding: '12px 10px' },
      onclick: () => dateiwahl.click(),
    }, '+'),
    el('button', {
      class: 'knopf leer', style: { minWidth: '44px', padding: '12px 10px' },
      onclick: stimmeAufnehmen,
    }, '🎙'),
    ablaufKnopf,
    feld,
    el('button', { class: 'knopf glut', style: { minWidth: '44px', padding: '12px 13px' }, onclick: senden }, '↑'),
    dateiwahl
  );

  const schnell = el('div', {
    style: { flex: 'none', display: 'flex', gap: '6px', overflowX: 'auto', padding: '9px 0 2px' },
  });

  seite.append(kopf, liste, schnell, eingabe);
  schnellReaktionenBauen(schnell);

  /* Geht die Tastatur auf, schrumpft die Sichthöhe — die Liste soll dann
     am Ende stehen, nicht irgendwo in der Mitte des Gesprächs. */
  if (window.visualViewport) {
    const nachziehen = () => {
      if (!liste.isConnected) { window.visualViewport.removeEventListener('resize', nachziehen); return; }
      requestAnimationFrame(() => { liste.scrollTop = liste.scrollHeight; });
    };
    window.visualViewport.addEventListener('resize', nachziehen);
    beimVerlassen(() => window.visualViewport.removeEventListener('resize', nachziehen));
  }

  async function senden() {
    const text = feld.value.trim();
    if (!text) return;
    feld.value = '';
    feld.style.height = 'auto';
    await datenAnhaengen('plausch', ablauf === null ? { text } : { text, ablauf });
    ablauf = null;
    ablaufKnopf.className = 'knopf leer';
    pushSenden(andereRolle(), 'plausch');
  }

  let letzteAnzahl = 0;
  const stopp = datenHorch('plausch', (nachrichten) => {
    const amEnde = liste.scrollHeight - liste.scrollTop - liste.clientHeight < 90;
    plauschZeichnen(liste, nachrichten);
    if (amEnde || nachrichten.length !== letzteAnzahl) {
      requestAnimationFrame(() => { liste.scrollTop = liste.scrollHeight; });
    }
    if (nachrichten.length > letzteAnzahl && letzteAnzahl > 0) {
      const neu = nachrichten[nachrichten.length - 1];
      if (neu && neu.von !== D.rolle) puls('hinweis');
    }
    letzteAnzahl = nachrichten.length;
  });

  beimVerlassen(stopp);
};

/* --- Die Liste ------------------------------------------------------------ */

function plauschZeichnen(liste, alleNachrichten) {
  liste.innerHTML = '';

  /* Was seine Zeit hinter sich hat, wird nicht nur ausgeblendet, sondern
     aus der Ablage genommen — sonst bliebe es dort für immer liegen. */
  const nachrichten = alleNachrichten.filter((n) => {
    if (!istAbgelaufen(n)) return true;
    datenEintragLoeschen('plausch', n.id).catch(() => {});
    return false;
  });

  if (!nachrichten.length) {
    liste.append(leerlauf('Still hier', 'Das erste Wort gehört dir.'));
    return;
  }

  let letzterTag = '';

  nachrichten.forEach((n) => {
    const tag = tagstempel(n.wann);
    if (tag !== letzterTag) {
      letzterTag = tag;
      liste.append(el('p', {
        class: 'winzig still mitte',
        style: { padding: '10px 0 2px' },
      }, tag === tagstempel() ? 'Heute' : new Date(n.wann).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })));
    }

    const meins = n.von === D.rolle;
    const blase = el('div', {
      style: {
        alignSelf: meins ? 'flex-end' : 'flex-start',
        maxWidth: '82%',
        padding: n.bild ? '5px' : '10px 14px',
        borderRadius: meins ? '16px 16px 5px 16px' : '16px 16px 16px 5px',
        background: meins ? 'linear-gradient(135deg, #7d4630, #a3624199)' : 'var(--flaeche)',
        border: '1px solid ' + (meins ? 'transparent' : 'var(--kante)'),
        position: 'relative',
      },
    });

    if (n.bild) {
      blase.append(el('img', {
        src: n.bild,
        style: { width: '100%', maxWidth: '260px', borderRadius: '12px', display: 'block' },
        onclick: () => bildGross(n.bild),
      }));
    }
    if (n.stimme) {
      blase.append(stimmeZeile(n, meins));
    }
    if (n.text) {
      blase.append(el('div', { style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' } }, n.text));
    }

    /* Eine Nachricht mit Ablauf sagt das auch — sonst wäre ihr Verschwinden
       ein Fehler und keine Absicht. */
    if (n.ablauf || n.ablauf === 0) {
      blase.append(el('div', {
        class: 'winzig',
        style: { opacity: '.6', marginTop: '3px', textTransform: 'none', letterSpacing: '.02em' },
      }, n.ablauf === 0 ? 'zieht sich nach dem Lesen zurück' : 'zieht sich zurück'));
      ablaufAnstossen(n);
    }

    blase.append(el('div', {
      class: 'winzig',
      style: { opacity: '.45', marginTop: '4px', textAlign: 'right', fontSize: '10px', letterSpacing: '.03em', textTransform: 'none' },
    }, uhrzeit(n.wann)));

    if (n.reaktion) {
      blase.append(el('div', {
        style: {
          position: 'absolute', bottom: '-10px', [meins ? 'left' : 'right']: '8px',
          fontSize: '15px', background: 'var(--grund2)', borderRadius: '10px',
          padding: '1px 6px', border: '1px solid var(--kante)',
        },
      }, n.reaktion));
    }

    /* Langer Druck auf eine fremde Nachricht: eine Reaktion daraufsetzen. */
    if (!meins) langerDruck(blase, () => reaktionWaehlen(n.id));
    else langerDruck(blase, () => nachrichtWegnehmen(n.id));

    liste.append(blase);
  });
}

function bildGross(quelle) {
  const deckel = el('div', {
    class: 'deckel',
    style: { alignItems: 'center', padding: '20px' },
    onclick: () => deckel.remove(),
  }, el('img', { src: quelle, style: { maxWidth: '100%', maxHeight: '86vh', borderRadius: '14px' } }));
  document.body.append(deckel);
}

async function nachrichtWegnehmen(id) {
  const weg = await frage('Wegnehmen?', 'Bei uns beiden. Das lässt sich nicht rückgängig machen.', 'Wegnehmen', true);
  if (weg) await datenEintragLoeschen('plausch', id);
}

function reaktionWaehlen(id) {
  const eigene = Gerät.lies('eigeneReaktionen', []);
  const alle = [...REAKTIONEN_FEST, ...eigene];

  const b = blatt(
    el('p', { class: 'winzig still', style: { marginBottom: '12px' } }, 'Ein Zeichen'),
    el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '9px' } },
      ...alle.map((z) => el('button', {
        class: 'knopf', style: { fontSize: '22px', minWidth: '54px', padding: '10px' },
        onclick: async () => {
          b.schliessen();
          await datenAendern('plausch', id, { reaktion: z });
        },
      }, z)),
      el('button', {
        class: 'knopf leer', style: { minWidth: '54px', padding: '10px' },
        onclick: () => { b.schliessen(); eigeneReaktionAnlegen(); },
      }, '+')
    )
  );
}

function eigeneReaktionAnlegen() {
  eingabeBlatt({
    titel: 'Eigenes Zeichen',
    hinweis: 'Ein Emoji oder ein kurzes Wort. Nur ihr wisst, was es heißt.',
    platzhalter: 'z. B. Jawohl',
  }, (text) => {
    const eigene = Gerät.lies('eigeneReaktionen', []);
    eigene.push(text.slice(0, 14));
    Gerät.schreib('eigeneReaktionen', eigene.slice(-12));
    meldung('Angelegt.');
    if (D.seite === 'plausch') zeigeSeite('plausch');
  });
}

/* --- Die Schnellreihe ----------------------------------------------------- */

/* Nicht jede Nachricht braucht Worte. Ein Tippen statt Tippen. */
function schnellReaktionenBauen(platz) {
  const eigene = Gerät.lies('eigeneReaktionen', []);
  const worte = istDomme() ? ['Braver Junge', 'Nein.', 'Warte.'] : ['Ja', 'Jawohl', 'Bitte'];
  const alle = [...REAKTIONEN_FEST, ...worte, ...eigene];

  alle.forEach((z) => {
    platz.append(el('button', {
      class: 'knopf leer',
      style: { flex: 'none', minHeight: '38px', padding: '7px 13px', fontSize: z.length <= 2 ? '18px' : '13px' },
      onclick: async () => {
        await datenAnhaengen('plausch', { text: z });
        pushSenden(andereRolle(), 'plausch');
      },
    }, z));
  });

  platz.append(el('button', {
    class: 'knopf leer',
    style: { flex: 'none', minHeight: '38px', padding: '7px 13px' },
    onclick: eigeneReaktionAnlegen,
  }, '+'));
}
