/* ==========================================================================
   60-funken.js — Funken.

   Ein Topf voller kurzer Sätze — zärtlich, dreckig, beides. Ein Tippen
   schickt dem anderen einen zufälligen davon in den Plausch. Für die
   Momente, in denen man etwas sagen will und die Worte woanders sind.

   Jeder füllt seinen eigenen Topf: Gesendet wird, was man selbst
   hineingelegt hat. Es soll klingen wie du, nicht wie eine App.

   Und das Paar-Level: ein gemeinsamer Stand, der durch gemeinsames Tun
   wächst. Kein Wettkampf — eine Chronik in einer Zahl.
   ========================================================================== */

async function funkeSenden() {
  const alle = await datenListe('funken').catch(() => []);
  const meine = alle.filter((f) => f.von === D.rolle);

  if (!meine.length) {
    const knopf = el('button', { class: 'knopf glut breit' }, 'Topf füllen');
    const bRef = blatt(
      el('h2', {}, 'Noch keine Funken'),
      el('p', { class: 'leise klein', style: { margin: '8px 0 16px', lineHeight: '1.5' } },
        'Leg ein paar Sätze in deinen Topf — beim Tippen fliegt später ein zufälliger davon zu ' +
        nameVon(andereRolle()) + '.'),
      knopf
    );
    knopf.addEventListener('click', () => { bRef.schliessen(); funkenPflegen(); });
    return;
  }

  const funke = zufall(meine);
  await datenAnhaengen('plausch', { text: funke.text });
  pushSenden(andereRolle(), 'denkAnDich');
  puls('denkAnDich');
  meldung('Geflogen.');
}

function funkenPflegen() {
  eingabeBlatt({
    titel: 'Funken',
    hinweis: 'Ein Satz je Zeile. Zärtlich, dreckig, beides — Hauptsache deiner.',
    platzhalter: '…',
    mehrzeilig: true,
    jaText: 'In den Topf',
  }, async (text) => {
    const zeilen = text.split('\n').map((z) => z.trim()).filter(Boolean);
    for (const z of zeilen) await datenAnhaengen('funken', { text: z });
    meldung(zeilen.length + ' im Topf.');
  });
}

/* --- Das Paar-Level ------------------------------------------------------- */

/* Wächst nebenbei: erledigte Aufträge, Einträge im Buch, gehaltene
   Rituale, Siege, Quizrunden. Niemand muss etwas dafür tun, was er nicht
   ohnehin täte — die Zahl erzählt nur, dass es passiert. */

const PAAR_JE_STUFE = 250;

function paarStufeAus(xp) {
  return {
    stufe: 1 + Math.floor((xp || 0) / PAAR_JE_STUFE),
    imLevel: (xp || 0) % PAAR_JE_STUFE,
    schwelle: PAAR_JE_STUFE,
  };
}

async function paarXp(punkte) {
  try {
    const stand = await datenLies('paarstand', { xp: 0 });
    const vorher = paarStufeAus(stand.xp).stufe;
    const neu = { xp: (stand.xp || 0) + punkte };
    await datenSchreib('paarstand', neu);

    const nachher = paarStufeAus(neu.xp).stufe;
    if (nachher > vorher) {
      await datenAnhaengen('log', {
        tag: tagstempel(), flammen: 3, stimmung: '∞',
        satz: 'Zusammen auf Stufe ' + nachher + '.',
      });
      pushSenden(andereRolle(), 'hinweis', 'Wir sind weiter.');
      meldung('Wir beide: Stufe ' + nachher + '.');
      puls('antwortJa');
      tonSpielen('weich');
      if (typeof konfetti === 'function') konfetti();
    }
  } catch { /* Das Level ist Beiwerk — nichts hängt daran. */ }
}

function paarKarte(platz, stand) {
  const { stufe, imLevel, schwelle } = paarStufeAus(stand.xp);
  const anteil = imLevel / schwelle;

  platz.append(
    el('div', { class: 'karte', style: { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '11px' } },
      el('div', { style: { textAlign: 'center', minWidth: '58px' } },
        el('div', { class: 'zier glutschrift', style: { fontSize: '30px', lineHeight: '1.1' } }, String(stufe)),
        el('div', { class: 'winzig still' }, 'zusammen')
      ),
      el('div', { style: { flex: '1' } },
        el('div', {
          style: { height: '5px', borderRadius: '3px', background: 'var(--grund2)', overflow: 'hidden' },
        }, el('div', {
          style: {
            height: '100%', width: (anteil * 100) + '%',
            background: 'var(--verlauf)', borderRadius: '3px',
          },
        })),
        el('p', { class: 'winzig still', style: { marginTop: '5px' } },
          'wächst durch alles, was wir zusammen tun')
      )
    )
  );
}
