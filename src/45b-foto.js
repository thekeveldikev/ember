/* ==========================================================================
   45b-foto.js — Der Foto-Auftrag.

   Sie schreibt, was sie sehen will, und stellt eine Frist. Bei ihm liegt
   ab sofort eine Karte mit laufender Uhr auf dem Heim — das Foto geht
   direkt in den Plausch. Läuft die Uhr ab, wandert der Auftrag von selbst
   in die Warteschlange der ausstehenden Dinge.

   Es gibt immer höchstens einen. Einer mit Uhr ist genug Druck.
   ========================================================================== */

function fotoAuftragGeben() {
  let minuten = 30;

  const text = el('textarea', { class: 'feld', rows: 2, placeholder: 'Wovon?' });
  const reihe = el('div', { style: { display: 'flex', gap: '7px', marginTop: '4px' } });
  const zeichne = () => {
    reihe.innerHTML = '';
    [10, 30, 60, 180].forEach((m) => {
      reihe.append(el('button', {
        class: 'knopf' + (minuten === m ? ' glut' : ' leer'),
        style: { flex: '1', minHeight: '40px', fontSize: '13px' },
        onclick: () => { minuten = m; zeichne(); },
      }, m < 60 ? m + ' Min' : (m / 60) + ' Std'));
    });
  };
  zeichne();

  const b = blatt(
    el('h2', {}, 'Foto-Auftrag'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Die Uhr läuft, sobald du sendest. Verpasst er sie, landet es bei den ausstehenden Dingen — von selbst.'),
    text,
    el('p', { class: 'winzig still', style: { margin: '15px 0 0' } }, 'Er hat …'),
    reihe,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!text.value.trim()) return meldung('Wovon denn?');
          b.schliessen();
          await datenSchreib('fotoauftrag', {
            text: text.value.trim(),
            bis: jetzt() + minuten * 60000,
            status: 'offen',
          });
          pushSenden('sub', 'befehl', 'Die Uhr läuft.');
          puls('befehl');
          meldung('Die Uhr läuft.');
        },
      }, 'Senden')
    )
  );
  setTimeout(() => text.focus(), 260);
}

/* Der Horcher: Ein frischer Auftrag soll auf seinem Heim AUFTAUCHEN,
   nicht auf den nächsten Seitenwechsel warten. */
let _fotoHorcherLaeuft = false;

function fotoHorcherStarten() {
  if (_fotoHorcherLaeuft) return;
  _fotoHorcherLaeuft = true;

  let letzter = null;
  ablageHorch('fotoauftrag', async () => {
    const auftrag = await datenLies('fotoauftrag');
    const stempel = auftrag ? (auftrag.wann + ':' + auftrag.status) : 'leer';
    const erster = letzter === null;
    if (stempel === letzter) return;
    letzter = stempel;

    if (!erster && auftrag && auftrag.status === 'offen' && !istDomme()) {
      puls('befehl');
      meldungMitTat('Ein Foto-Auftrag — die Uhr läuft.', 'Ansehen', () => zeigeSeite('heim'), 10000);
    }
    heimAuffrischen('foto', true);
  }).catch(() => {});
}

/* --- Die Karte auf dem Heim ----------------------------------------------- */

async function fotoAuftragKarte(platz, ruhig = false) {
  const aktuell = rennwache(platz);
  const auftrag = await datenLies('fotoauftrag');
  if (!auftrag || !auftrag.status) return;

  /* Verpasst? Das stellt das Domme-Gerät fest — sonst schrieben beide
     gleichzeitig eine Strafe, und es wären zwei. */
  if (auftrag.status === 'offen' && auftrag.bis && auftrag.bis < jetzt()) {
    if (istDomme()) {
      await datenSchreib('fotoauftrag', { ...auftrag, status: 'versaeumt' });
      await datenAnhaengen('strafen', {
        text: 'Foto-Auftrag versäumt: ' + auftrag.text,
        enthuellt: false, erledigt: false,
      });
      pushSenden('sub', 'hinweis', 'Zu spät.');
      auftrag.status = 'versaeumt';
    } else {
      auftrag.status = 'versaeumt';
    }
  }

  const karte = el('div', {
    class: 'karte glimmt',
    style: { marginBottom: '6px', borderColor: auftrag.status === 'versaeumt' ? 'rgba(178,69,60,.45)' : undefined },
  });

  if (auftrag.status === 'offen') {
    const uhr = el('span', {
      class: 'zier',
      style: { fontSize: '25px', color: 'var(--glut-hell)', fontVariantNumeric: 'tabular-nums' },
    });

    const ticken = () => {
      if (!karte.isConnected) { clearInterval(takt); return; }
      const uebrig = (auftrag.bis || 0) - jetzt();
      if (uebrig <= 0) {
        clearInterval(takt);
        uhr.textContent = '00:00';
        uhr.style.color = 'var(--rot)';
        /* Neu zeichnen, damit die Versäumnis-Logik läuft. */
        setTimeout(() => fotoAuftragKarte(platz), 900);
        return;
      }
      uhr.textContent = dauerText(uebrig);
    };
    const takt = setInterval(ticken, 1000);
    ticken();

    if (istDomme()) {
      anfuegen(karte, 
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' } },
          el('div', {},
            el('p', { class: 'winzig still', style: { marginBottom: '3px' } }, 'Foto-Auftrag läuft'),
            el('div', { class: 'zier', style: { fontSize: '16px' } }, auftrag.text)
          ),
          uhr
        ),
        el('button', {
          class: 'winzig still', style: { marginTop: '10px' },
          onclick: async () => { await datenLoesch('fotoauftrag'); heimAuffrischen('foto'); },
        }, 'Zurückziehen')
      );
    } else {
      const dateiwahl = el('input', {
        type: 'file', accept: 'image/*', hidden: true,
        onchange: async (e) => {
          const datei = e.target.files[0];
          e.target.value = '';
          if (!datei) return;

          /* Zwei getrennte Fehlerwege: Ein unlesbares Bild ist etwas
             anderes als ein gescheiterter Versand — und beides muss
             LAUT sein. Das stille Versagen hier hat am ersten Testtag
             ein Foto verschluckt, ohne ein Wort zu sagen. */
          const laufend = meldung('Bild wird vorbereitet …', 90000);
          let bild;
          try {
            bild = await bildVerkleinern(datei);
          } catch (f) {
            laufend.remove();
            fehlerNotieren('Foto lesen: ' + (f && f.message || f));
            return meldung('Dieses Bild ließ sich nicht lesen. Versuch eine andere Aufnahme.', 6000);
          }

          laufend.textContent = 'Schickt … bleib kurz in der App.';
          try {
            await datenAnhaengen('plausch', { bild });
            await datenSchreib('fotoauftrag', { ...auftrag, status: 'erfuellt', erfuelltWann: jetzt() });
          } catch (f) {
            laufend.remove();
            fehlerNotieren('Foto senden: ' + (f && f.message || f));
            return meldung('Senden gescheitert: ' + String(f && f.message || f).slice(0, 70) + ' — noch einmal.', 7000);
          }

          laufend.remove();
          pushSenden('domme', 'hinweis', 'Es ist da.');
          puls('antwortJa');
          meldung('Angekommen.');
          heimAuffrischen('foto');
        },
      });

      anfuegen(karte, 
        el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, nameVon('domme') + ' will ein Foto'),
        el('div', { class: 'zier', style: { fontSize: '19px', marginBottom: '10px' } }, auftrag.text),
        el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' } },
          uhr,
          el('button', { class: 'knopf glut', style: { minHeight: '42px' }, onclick: () => dateiwahl.click() }, 'Foto senden')
        ),
        dateiwahl
      );
    }
  } else if (auftrag.status === 'erfuellt') {
    anfuegen(karte, 
      el('p', { class: 'winzig', style: { color: 'var(--glut-hell)', marginBottom: '4px' } }, 'Foto-Auftrag erfüllt'),
      el('div', { class: 'leise klein' }, auftrag.text + ' — das Bild liegt im Plausch.'),
      istDomme()
        ? el('div', { class: 'knopfreihe', style: { marginTop: '11px' } },
            el('button', {
              class: 'knopf leer', style: { minHeight: '38px', fontSize: '13px' },
              onclick: () => zeigeSeite('plausch'),
            }, 'Ansehen'),
            el('button', {
              class: 'knopf glut', style: { minHeight: '38px', fontSize: '13px' },
              onclick: async () => { await datenLoesch('fotoauftrag'); paarXp(10); heimAuffrischen('foto'); },
            }, 'Gut so')
          )
        : null
    );
  } else if (auftrag.status === 'versaeumt') {
    anfuegen(karte, 
      el('p', { class: 'winzig', style: { color: 'var(--rot)', marginBottom: '4px' } }, 'Versäumt'),
      el('div', { class: 'leise klein' }, auftrag.text),
      el('p', { class: 'still klein', style: { marginTop: '7px' } },
        istDomme() ? 'Liegt jetzt bei den ausstehenden Dingen.' : 'Das wird Folgen haben.'),
      istDomme()
        ? el('button', {
            class: 'winzig still', style: { marginTop: '9px' },
            onclick: async () => { await datenLoesch('fotoauftrag'); heimAuffrischen('foto'); },
          }, 'Wegräumen')
        : null
    );
  }

  if (!aktuell()) return;
  platz.innerHTML = '';
  sanftEinfuegen(platz, karte, ruhig);
}
