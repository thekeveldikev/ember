/* ==========================================================================
   49-wuensche.js — Wünsche, blind abgeglichen.

   Beide tragen ein, was sie wollen. Keiner sieht, was der andere geschrieben
   hat — bis beide dasselbe Thema genannt haben. Dann, und nur dann, wird es
   sichtbar: „Ihr wollt beide dasselbe."

   Warum das mehr ist als eine gemeinsame Liste: Man muss sich nicht als
   Erster exponieren. Der Wunsch, der unbeantwortet bleibt, bleibt geheim.

   Ehrlichkeit an dieser Stelle: Ihr habt denselben Schlüssel. Wer wollte,
   könnte in der Ablage nachsehen. Die App zeigt es nicht — das ist eine
   Abmachung zwischen euch, kein Schloss. Ein echtes Schloss wäre nur mit
   getrennten Schlüsseln möglich, und dann ginge der Abgleich nicht mehr.
   ========================================================================== */

SEITEN.wuensche = function (seite) {
  seite.append(kopfzeile('Wünsche',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  const treffplatz = el('div', { class: 'abschnitt' });
  const meineplatz = el('div', { class: 'abschnitt' });
  const listeplatz = el('div', { class: 'abschnitt' });
  seite.append(treffplatz, meineplatz, listeplatz);

  const s1 = datenHorch('wuensche', (liste) => {
    treffZeichnen(treffplatz, liste);
    meineZeichnen(meineplatz, liste);
  });
  const s2 = datenHorch('liste', (eintraege) => wunschlisteZeichnen(listeplatz, eintraege));

  beimVerlassen(s1); beimVerlassen(s2);
};

/* Zwei Menschen schreiben dasselbe selten gleich. Die Normalform nimmt
   Groß- und Kleinschreibung, Artikel und Endungen aus dem Weg, damit
   „Die Augenbinde" und „augenbinden" sich treffen.

   Die Endung `e` muss mit weg, sonst bleiben genau solche Paare getrennt:
   „augenbinde" und „augenbinden" ergäben sonst zwei verschiedene Stämme. */

const STOPPWORTE = [
  'der', 'die', 'das', 'den', 'dem', 'ein', 'eine', 'einen', 'einem',
  'mit', 'und', 'oder', 'fur', 'von', 'bei', 'auf', 'aus', 'ich', 'mir',
  'mich', 'dir', 'dich', 'wir', 'uns', 'sein', 'ihr', 'mal', 'ganz', 'sehr',
];

function stamm(wort) {
  const kurz = wort.replace(/(en|er|es|em|e|n|s)$/, '');
  /* Zu kurze Reste taugen nichts mehr als Stamm. */
  return kurz.length >= 3 ? kurz : wort;
}

function woerter(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[äöüß]/g, (z) => ({ ä: 'a', ö: 'o', ü: 'u', ß: 'ss' })[z])
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPPWORTE.includes(w))
    .map(stamm)
    .filter(Boolean);
}

function normalform(text) {
  return woerter(text).sort().join(' ');
}

/* Zwei Einträge meinen dasselbe, wenn ihre Normalform gleich ist — oder
   wenn sie ein tragendes Wort teilen. „Augenbinde benutzen" und „die
   Augenbinde" gehören zusammen; „nur ich" und „nur du" nicht, weil
   Füllwörter vorher herausfallen. */
function meinenDasselbe(a, b) {
  const wa = woerter(a);
  const wb = woerter(b);
  if (!wa.length || !wb.length) return false;
  if (wa.slice().sort().join(' ') === wb.slice().sort().join(' ')) return true;
  return wa.some((w) => w.length >= 4 && wb.includes(w));
}

/* --- Die Treffer ---------------------------------------------------------- */

function treffZeichnen(platz, liste) {
  const meine = liste.filter((w) => w.von === D.rolle && w.art !== 'token');
  const fremde = liste.filter((w) => w.von !== D.rolle && w.art !== 'token');

  const treffer = [];
  const schonGetroffen = new Set();
  fremde.forEach((f) => {
    const passend = meine.find((m) => !schonGetroffen.has(m.id) && meinenDasselbe(m.text, f.text));
    if (passend) {
      schonGetroffen.add(passend.id);
      treffer.push({ meins: passend, seins: f });
    }
  });

  platz.innerHTML = '';

  if (!treffer.length) {
    platz.append(
      el('div', { class: 'karte', style: { textAlign: 'center', borderStyle: 'dashed', background: 'transparent' } },
        el('p', { class: 'leise klein', style: { lineHeight: '1.5' } },
          meine.length
            ? 'Noch kein Treffer. Was du einträgst, bleibt bei dir, bis es auch der andere nennt.'
            : 'Trag ein, was du willst. Niemand sieht es — außer ihr wollt beide dasselbe.')
      )
    );
    return;
  }

  platz.append(kopfzeile('Ihr wollt beide'));
  treffer.forEach((t, i) => {
    platz.append(el('div', {
      class: 'karte glimmt',
      style: { marginTop: '9px', animation: 'einblenden .35s ease ' + (i * 0.07) + 's both' },
    },
      el('div', { style: { display: 'flex', gap: '12px', alignItems: 'flex-start' } },
        el('div', { style: { color: 'var(--glut-hell)', lineHeight: '1' } }, sinnbild('flamme', 21)),
        el('div', { style: { flex: '1' } },
          el('div', { class: 'zier', style: { fontSize: '18px' } }, t.meins.text),
          t.seins.text.trim().toLowerCase() !== t.meins.text.trim().toLowerCase()
            ? el('p', { class: 'still klein', style: { marginTop: '4px' } },
                nameVon(t.seins.von) + ' schrieb: ' + t.seins.text)
            : null,
          el('button', {
            class: 'winzig still', style: { marginTop: '10px' },
            onclick: async (e) => {
              /* Zweimal getippt hieße zweimal auf der Liste. */
              e.target.disabled = true;
              await datenAnhaengen('liste', { text: t.meins.text, stand: 'geplant' });
              meldung('Steht auf der Liste.');
            },
          }, 'Auf die Liste →')
        )
      )
    ));
  });
}

/* --- Meine Einträge ------------------------------------------------------- */

function meineZeichnen(platz, liste) {
  const meine = liste.filter((w) => w.von === D.rolle && w.art !== 'token');
  const fremdeAnzahl = liste.filter((w) => w.von !== D.rolle && w.art !== 'token').length;

  platz.innerHTML = '';
  platz.append(kopfzeile('Deine',
    el('button', { class: 'winzig still', onclick: wunschAnlegen }, '+ Neu')
  ));

  if (!meine.length) {
    platz.append(leerlauf('Noch nichts', 'Was du hier einträgst, sieht zunächst niemand.'));
  }

  meine.forEach((w) => {
    const zeile = el('div', { class: 'karte', style: { padding: '12px 14px', marginTop: '8px' } }, w.text);
    langerDruck(zeile, async () => {
      const weg = await frage('Zurücknehmen?', w.text, 'Zurücknehmen', true);
      if (weg) await datenEintragLoeschen('wuensche', w.id);
    });
    platz.append(zeile);
  });

  /* Die bloße Zahl verrät nichts — macht aber neugierig. */
  if (fremdeAnzahl) {
    platz.append(el('p', { class: 'winzig still mitte', style: { marginTop: '13px' } },
      nameVon(andereRolle()) + ' hat ' + fremdeAnzahl + (fremdeAnzahl === 1 ? ' Eintrag' : ' Einträge') + '. Mehr nicht.'));
  }

  /* Geäußerte Wunsch-Marken landen im selben Topf und gehören ihr gezeigt. */
  const token = liste.filter((w) => w.art === 'token' && !w.erfuellt);
  if (istDomme() && token.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '20px 0 8px' } }, 'Eingelöste Wünsche'));
    token.forEach((t) => {
      platz.append(el('div', { class: 'karte glimmt', style: { padding: '12px 14px', marginTop: '8px' } },
        el('div', {}, t.text),
        el('button', {
          class: 'winzig still', style: { marginTop: '9px' },
          onclick: async () => { await datenAendern('wuensche', t.id, { erfuellt: true }); meldung('Erledigt.'); },
        }, 'Erledigt')
      ));
    });
  }
}

function wunschAnlegen() {
  eingabeBlatt({
    titel: 'Was willst du?',
    hinweis: 'Kurz und deutlich — dann findet der Abgleich es auch. Sichtbar wird es nur, wenn der andere dasselbe nennt.',
    platzhalter: 'Ein Wort oder ein Satz',
    mehrzeilig: true,
    jaText: 'Eintragen',
  }, async (text) => {
    await datenAnhaengen('wuensche', { text, art: 'wunsch' });
    meldung('Eingetragen. Niemand sieht es.');
  });
}

/* --- Die Liste ------------------------------------------------------------ */

/* Was ihr vorhabt, in vier Zuständen. Was erledigt und bewertet ist,
   wandert nach unten und bleibt als Erinnerung stehen. */

const LISTENSTAENDE = [
  { id: 'wunsch', marke: 'Irgendwann' },
  { id: 'geplant', marke: 'Geplant' },
  { id: 'erledigt', marke: 'Erledigt' },
];

function wunschlisteZeichnen(platz, eintraege) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Die Liste',
    el('button', { class: 'winzig still', onclick: listeAnlegen }, '+ Neu')
  ));

  if (!eintraege.length) {
    platz.append(leerlauf('Noch leer', 'Was ihr ausprobieren wollt — mit einem Haken am Ende.'));
    return;
  }

  LISTENSTAENDE.forEach((stand) => {
    const drin = eintraege.filter((e) => (e.stand || 'wunsch') === stand.id);
    if (!drin.length) return;

    platz.append(el('p', { class: 'winzig still', style: { margin: '18px 0 8px 2px' } }, stand.marke));

    drin.forEach((e) => {
      const karte = el('div', {
        class: 'karte' + (e.stand === 'erledigt' ? ' glimmt' : ''),
        style: { padding: '12px 14px', marginTop: '8px' },
      },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' } },
          el('div', { style: { flex: '1' } }, e.text),
          e.stand === 'erledigt' && e.flammen
            ? el('span', { style: { flex: 'none' } }, glutPunkte(e.flammen))
            : null
        )
      );

      if (e.stand !== 'erledigt') {
        karte.append(el('div', { class: 'knopfreihe', style: { marginTop: '11px' } },
          e.stand === 'wunsch'
            ? el('button', {
                class: 'knopf leer', style: { minHeight: '36px', fontSize: '12.5px' },
                onclick: () => datenAendern('liste', e.id, { stand: 'geplant' }),
              }, 'Planen')
            : el('button', {
                class: 'knopf leer', style: { minHeight: '36px', fontSize: '12.5px' },
                onclick: () => datenAendern('liste', e.id, { stand: 'wunsch' }),
              }, 'Zurück'),
          el('button', {
            class: 'knopf glut', style: { minHeight: '36px', fontSize: '12.5px' },
            onclick: () => listeAbhaken(e),
          }, 'Geschafft')
        ));
      }

      langerDruck(karte, async () => {
        const weg = await frage('Von der Liste nehmen?', e.text, 'Wegnehmen', true);
        if (weg) await datenEintragLoeschen('liste', e.id);
      });

      platz.append(karte);
    });
  });
}

function listeAbhaken(e) {
  let flammen = 4;
  const reihe = el('div', { style: { display: 'flex', gap: '7px', justifyContent: 'center', margin: '10px 0' } });
  const zeichne = () => {
    reihe.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      reihe.append(el('button', {
        style: { fontSize: '26px', padding: '5px', opacity: i <= flammen ? '1' : '.22' },
        onclick: () => { flammen = i; zeichne(); puls('hinweis'); },
      }, el('span', { style: { color: 'var(--glut-hell)' } }, sinnbild('flamme', 24))));
    }
  };
  zeichne();

  const b = blatt(
    el('h2', { class: 'mitte' }, 'Geschafft'),
    el('p', { class: 'leise klein mitte', style: { margin: '7px 0 4px' } }, e.text),
    reihe,
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '12px' },
      onclick: async () => {
        b.schliessen();
        await datenAendern('liste', e.id, { stand: 'erledigt', flammen, erledigtWann: jetzt() });
        await datenAnhaengen('log', {
          tag: tagstempel(), flammen, stimmung: '✦', satz: 'Von der Liste: ' + e.text,
        });
        paarXp(20);
        meldung('Steht als geschafft.');
      },
    }, 'Eintragen')
  );
}

function listeAnlegen() {
  eingabeBlatt({
    titel: 'Auf die Liste',
    hinweis: 'Etwas, das ihr ausprobieren wollt. Beide sehen es.',
    platzhalter: '…',
    mehrzeilig: true,
    jaText: 'Aufschreiben',
  }, async (text) => {
    await datenAnhaengen('liste', { text, stand: 'wunsch' });
    meldung('Steht drauf.');
  });
}
