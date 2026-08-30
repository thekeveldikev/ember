/* ==========================================================================
   57-sperre.js — Die Sperre.

   Sie legt fest, was ohne ihre Erlaubnis nicht geschieht. Die Sperre liegt
   ab dann sichtbar auf beiden Heim-Seiten: ein Siegel mit Zähler — seit
   drei Tagen, noch acht Stunden, oder ohne Ende, bis sie es sagt.

   Er kann um Erlaubnis bitten. Sie kann gewähren, ablehnen — oder ablehnen
   und verlängern. Die Verlängerung als Antwort auf das Fragen ist der
   Kern des Spiels: Fragen hat einen Preis, und er kennt ihn.
   ========================================================================== */

function sperreSetzen(vorhandene) {
  let dauer = null;   // null = bis sie es aufhebt

  const text = el('input', {
    class: 'feld', placeholder: 'Was ist gesperrt?',
    value: vorhandene ? vorhandene.text : '',
  });

  const reihe = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '4px' } });
  const zeichne = () => {
    reihe.innerHTML = '';
    [
      { marke: 'Bis ich es sage', std: null },
      { marke: '24 Std', std: 24 },
      { marke: '3 Tage', std: 72 },
      { marke: '1 Woche', std: 168 },
    ].forEach((w) => {
      reihe.append(el('button', {
        class: 'knopf' + (dauer === w.std ? ' glut' : ' leer'),
        style: { flex: '1 1 40%', minHeight: '40px', fontSize: '13px' },
        onclick: () => { dauer = w.std; zeichne(); },
      }, w.marke));
    });
  };
  zeichne();

  const b = blatt(
    el('h2', {}, vorhandene ? 'Sperre ändern' : 'Eine Sperre'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Liegt ab sofort sichtbar auf beiden Heim-Seiten. Nur du kannst sie aufheben.'),
    text,
    el('p', { class: 'winzig still', style: { margin: '15px 0 0' } }, 'Wie lange'),
    reihe,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!text.value.trim()) return meldung('Was denn?');
          b.schliessen();
          await datenSchreib('sperre', {
            aktiv: true,
            text: text.value.trim(),
            seit: vorhandene ? vorhandene.seit : jetzt(),
            bis: dauer ? jetzt() + dauer * 3600000 : null,
          });
          await datenLoesch('sperrebitte').catch(() => {});
          pushSenden('sub', 'befehl', 'Etwas gilt ab jetzt.');
          puls('befehl');
          meldung('Sie gilt.');
          heimAuffrischen('sperre');
        },
      }, 'Verhängen')
    )
  );
  setTimeout(() => text.focus(), 260);
}

/* --- Das Siegel auf dem Heim ---------------------------------------------- */

async function sperreKarte(platz, ruhig = false) {
  const sperre = await datenLies('sperre');
  if (!sperre || !sperre.aktiv) return;

  const bitte = await datenLies('sperrebitte');
  const abgelaufen = sperre.bis && sperre.bis <= jetzt();

  const dauerSeit = () => {
    const d = jetzt() - (sperre.seit || jetzt());
    const tage = Math.floor(d / 86400000);
    if (tage >= 1) return 'seit ' + tage + (tage === 1 ? ' Tag' : ' Tagen');
    const std = Math.floor(d / 3600000);
    return std >= 1 ? 'seit ' + std + ' Std' : 'seit eben';
  };

  const zeile2 = el('span', { class: 'winzig still' });
  const setzeZeile2 = () => {
    if (abgelaufen) { zeile2.textContent = 'Die Zeit ist um.'; zeile2.style.color = 'var(--glut-hell)'; return; }
    if (!sperre.bis) { zeile2.textContent = dauerSeit() + ' · bis sie es sagt'; return; }
    zeile2.textContent = dauerSeit() + ' · noch ' + bisText(sperre.bis);
  };
  setzeZeile2();

  const karte = el('div', {
    class: 'karte',
    style: {
      marginBottom: '6px',
      background: 'linear-gradient(160deg, #211510, #17100c)',
      borderColor: abgelaufen ? 'rgba(232,168,124,.45)' : 'rgba(178,69,60,.35)',
    },
  },
    el('div', { style: { display: 'flex', gap: '13px', alignItems: 'center' } },
      el('div', { style: { flex: 'none' } }, sinnbild('schloss', 26)),
      el('div', { style: { flex: '1', minWidth: '0' } },
        el('div', { class: 'zier', style: { fontSize: '17px' } }, sperre.text),
        zeile2
      )
    )
  );

  /* Der laufende Zähler, ohne die ganze Seite neu zu zeichnen. */
  const takt = setInterval(() => {
    if (!karte.isConnected) { clearInterval(takt); return; }
    setzeZeile2();
  }, 1000);

  if (istDomme()) {
    if (bitte && !bitte.antwort) {
      anfuegen(karte, 
        el('div', { class: 'trenner', style: { margin: '13px 0' } }),
        el('p', { class: 'winzig still', style: { marginBottom: '7px' } },
          nameVon('sub') + ' bittet · ' + vorZeit(bitte.wann)),
        bitte.text ? el('p', { class: 'zier', style: { fontSize: '16px', marginBottom: '12px' } }, bitte.text) : null,
        el('div', { class: 'knopfreihe' },
          el('button', {
            class: 'knopf leer warnend', style: { minHeight: '38px', fontSize: '13px' },
            onclick: () => sperreAblehnen(sperre, bitte),
          }, 'Nein'),
          el('button', {
            class: 'knopf glut', style: { minHeight: '38px', fontSize: '13px' },
            onclick: async () => {
              await datenSchreib('sperrebitte', { ...bitte, antwort: { ok: true, wann: jetzt() } });
              pushSenden('sub', 'antwort', 'Ja.');
              meldung('Gewährt. Die Sperre steht weiter — heb sie auf, wenn sie fallen soll.');
              heimAuffrischen('sperre');
            },
          }, 'Erlauben')
        )
      );
    }
    anfuegen(karte, el('div', { class: 'knopfreihe', style: { marginTop: '13px' } },
      el('button', {
        class: 'knopf leer', style: { minHeight: '38px', fontSize: '13px' },
        onclick: () => sperreSetzen(sperre),
      }, 'Ändern'),
      el('button', {
        class: 'knopf', style: { minHeight: '38px', fontSize: '13px' },
        onclick: async () => {
          await datenLoesch('sperre');
          await datenLoesch('sperrebitte').catch(() => {});
          pushSenden('sub', 'antwort', 'Aufgehoben.');
          paarXp(5);
          meldung('Aufgehoben.');
          heimAuffrischen('sperre');
        },
      }, 'Aufheben')
    ));
  } else {
    if (bitte && bitte.antwort) {
      anfuegen(karte, el('p', {
        class: 'zier',
        style: { marginTop: '11px', fontSize: '17px', color: bitte.antwort.ok ? 'var(--glut-hell)' : 'var(--rot)' },
      }, bitte.antwort.ok ? 'Erlaubt.' : (bitte.antwort.verlaengert ? 'Nein. Und jetzt dauert es länger.' : 'Nein.')));
      anfuegen(karte, el('button', {
        class: 'winzig still', style: { marginTop: '8px' },
        onclick: async () => { await datenLoesch('sperrebitte'); heimAuffrischen('sperre'); },
      }, 'Verstanden'));
    } else if (bitte) {
      anfuegen(karte, el('p', { class: 'still klein', style: { marginTop: '11px' } }, 'Gefragt. Sie hat es gesehen — oder auch nicht.'));
    } else {
      anfuegen(karte, el('button', {
        class: 'knopf leer breit', style: { marginTop: '13px', minHeight: '40px', fontSize: '13.5px' },
        onclick: () => sperreBitten(),
      }, 'Um Erlaubnis bitten'));
    }
  }

  sanftEinfuegen(platz, karte, ruhig);
}

function sperreBitten() {
  eingabeBlatt({
    titel: 'Um Erlaubnis bitten',
    hinweis: 'Denk daran: Fragen kann den Preis erhöhen.',
    platzhalter: 'Etwas dazu? Muss nicht.',
    mehrzeilig: true,
    leerErlaubt: true,
    jaText: 'Bitten',
  }, async (text) => {
    /* `wann` gehört in den Wert selbst: datenLies gibt nur den Wert
       zurück, nicht die Hülle — ohne dieses Feld stand auf ihrer Karte
       „Invalid Date". */
    await datenSchreib('sperrebitte', { text, wann: jetzt(), antwort: null });
    pushSenden('domme', 'bitte', 'Er bittet.');
    puls('bitte');
    meldung('Gefragt.');
    heimAuffrischen('sperre');
  });
}

/* Nein sagen — pur, oder mit Aufschlag. */
function sperreAblehnen(sperre, bitte) {
  const b = blatt(
    el('h2', {}, 'Nein'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } }, 'Nur nein — oder nein und länger?'),
    el('button', {
      class: 'knopf breit',
      onclick: async () => {
        b.schliessen();
        await datenSchreib('sperrebitte', { ...bitte, antwort: { ok: false, wann: jetzt() } });
        pushSenden('sub', 'antwort', 'Nein.');
        meldung('Nein.');
        heimAuffrischen('sperre');
      },
    }, 'Nur nein'),
    el('div', { class: 'knopfreihe', style: { marginTop: '9px' } },
      ...[12, 24].map((std) => el('button', {
        class: 'knopf leer warnend',
        onclick: async () => {
          b.schliessen();
          /* Ohne Ende bleibt ohne Ende — verlängern hieße, ein Ende
             zuzugeben. Mit Ende: der Aufschlag kommt obendrauf. */
          const neuBis = sperre.bis ? Math.max(sperre.bis, jetzt()) + std * 3600000 : null;
          await datenSchreib('sperre', { ...sperre, bis: neuBis });
          await datenSchreib('sperrebitte', { ...bitte, antwort: { ok: false, verlaengert: std, wann: jetzt() } });
          pushSenden('sub', 'antwort', 'Nein. Und länger.');
          puls('antwortNein');
          meldung(sperre.bis ? 'Nein — und +' + std + ' Std.' : 'Nein. (Ohne Ende bleibt ohne Ende.)');
          heimAuffrischen('sperre');
        },
      }, 'Nein, +' + std + ' Std'))
    )
  );
}

/* Der Horcher: Er soll die Bitte nicht erst beim Seitenwechsel sehen. */
let _sperreHorcherLaeuft = false;

function sperreHorcherStarten() {
  if (_sperreHorcherLaeuft) return;
  _sperreHorcherLaeuft = true;
  ablageHorch('sperrebitte', async () => {
    const bitte = await datenLies('sperrebitte');
    if (!bitte) return;
    if (istDomme() && !bitte.antwort) {
      puls('bitte');
      meldungMitTat(nameVon('sub') + ' bittet um Erlaubnis.', 'Ansehen', () => zeigeSeite('heim'), 10000);
    }
    if (!istDomme() && bitte.antwort) {
      puls(bitte.antwort.ok ? 'antwortJa' : 'antwortNein');
      if (D.seite === 'heim') heimAuffrischen('sperre');
    }
  }).catch(() => {});

  ablageHorch('sperre', async () => {
    if (D.seite === 'heim') heimAuffrischen('sperre');
  }).catch(() => {});
}
