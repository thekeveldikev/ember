/* ==========================================================================
   49b-grenzen.js — Die Grenzenkarte.

   Eine Skala von „Auf keinen Fall" bis „Brauche ich". Beide füllen sie
   getrennt aus; nebeneinander wird sichtbar, wo ihr übereinstimmt und wo
   nicht. Das ist das nüchternste Werkzeug in dieser App — und das, ohne
   das der Rest nicht verantwortbar wäre.

   Was hier steht, ist nie endgültig. Jede Änderung bleibt als Spur
   erhalten, denn die Verschiebung über Monate ist oft die eigentliche
   Auskunft: Was einmal ein Vielleicht war, ist inzwischen ein Ja.
   ========================================================================== */

const GRENZSTUFEN = [
  { wert: 0, marke: 'Auf keinen Fall', farbe: 'var(--rot)' },
  { wert: 1, marke: 'Lieber nicht', farbe: '#a8623c' },
  { wert: 2, marke: 'Neugierig', farbe: 'var(--gelb)' },
  { wert: 3, marke: 'Mag ich', farbe: '#b08a4e' },
  { wert: 4, marke: 'Liebe ich', farbe: 'var(--glut)' },
  { wert: 5, marke: 'Brauche ich', farbe: 'var(--glut-hell)' },
];

SEITEN.grenzen = function (seite) {
  seite.append(kopfzeile('Grenzen',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '18px', lineHeight: '1.5' } },
    'Jeder trägt für sich ein. Nebeneinander sehen wir, wo wir uns treffen — und wo nicht.'));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('grenzen', (liste) => grenzenZeichnen(platz, liste));
  beimVerlassen(stopp);
};

function grenzenZeichnen(platz, liste) {
  platz.innerHTML = '';

  /* Ein Thema kann von beiden bewertet sein. Zusammengefasst wird über
     den Namen — deshalb ist er die Kennung, nicht der Eintrag. */
  const themen = {};
  liste.forEach((e) => {
    const name = (e.thema || '').trim();
    if (!name) return;
    const schluessel = name.toLowerCase();
    themen[schluessel] = themen[schluessel] || { name, eintraege: {} };
    /* Der jüngste Eintrag je Rolle zählt; ältere bleiben als Spur liegen. */
    const bisher = themen[schluessel].eintraege[e.von];
    if (!bisher || e.wann > bisher.wann) themen[schluessel].eintraege[e.von] = e;
  });

  const alle = Object.values(themen).sort((a, b) => a.name.localeCompare(b.name, 'de'));

  if (!alle.length) {
    platz.append(leerlauf('Noch leer', 'Fang mit drei oder vier Dingen an. Der Rest kommt mit der Zeit.'));
  }

  alle.forEach((thema) => {
    const meins = thema.eintraege[D.rolle];
    const seins = thema.eintraege[andereRolle()];

    /* Ein Nein von einer Seite ist ein Nein. Das wird auch so gezeigt. */
    const einNein = (meins && meins.stufe === 0) || (seins && seins.stufe === 0);
    const treffer = meins && seins && Math.abs(meins.stufe - seins.stufe) <= 1 && !einNein;

    const karte = el('div', {
      class: 'karte' + (treffer ? ' glimmt' : ''),
      style: {
        marginTop: '9px',
        borderColor: einNein ? 'rgba(178,69,60,.4)' : undefined,
      },
    },
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '11px' } },
        el('div', { class: 'zier', style: { fontSize: '17px' } }, thema.name),
        einNein
          ? el('span', { class: 'winzig', style: { color: 'var(--rot)' } }, 'Nein')
          : treffer ? el('span', { class: 'winzig', style: { color: 'var(--glut-hell)' } }, 'Einig') : null
      ),
      leiste(nameVon(D.rolle), meins),
      leiste(nameVon(andereRolle()), seins, true)
    );

    karte.addEventListener('click', () => grenzeSetzen(thema.name, meins));
    platz.append(karte);
  });

  platz.append(el('button', {
    class: 'knopf leer breit', style: { marginTop: '13px' },
    onclick: () => grenzeSetzen(),
  }, '+ Thema'));

  if (alle.length) {
    platz.append(el('button', {
      class: 'winzig still', style: { display: 'block', margin: '18px auto 0' },
      onclick: () => grenzenVerlauf(liste),
    }, 'Was sich verschoben hat'));
  }
}

/* Eine Zeile: Name, Punkte auf der Skala, Wort. */
function leiste(name, eintrag, gedimmt) {
  const stufe = eintrag ? eintrag.stufe : null;

  return el('div', { style: { display: 'flex', alignItems: 'center', gap: '11px', marginTop: gedimmt ? '9px' : '0' } },
    el('span', {
      class: 'winzig still',
      style: { minWidth: '54px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    }, name),

    el('div', { style: { display: 'flex', gap: '4px', flex: 'none' } },
      ...GRENZSTUFEN.map((s) => el('div', {
        style: {
          width: '15px', height: '7px', borderRadius: '2px',
          background: stufe !== null && s.wert <= stufe ? GRENZSTUFEN[stufe].farbe : 'var(--grund2)',
          opacity: stufe === null ? '.4' : gedimmt ? '.72' : '1',
          boxShadow: 'inset 0 0 0 1px var(--kante)',
        },
      }))),

    el('span', {
      class: 'klein',
      style: {
        flex: '1', textAlign: 'right', fontSize: '12px',
        color: stufe !== null ? GRENZSTUFEN[stufe].farbe : 'var(--schrift-still)',
      },
    }, stufe !== null ? GRENZSTUFEN[stufe].marke : 'noch nichts')
  );
}

/* --- Eintragen ------------------------------------------------------------ */

function grenzeSetzen(vorhandenesThema, bisher) {
  let stufe = bisher ? bisher.stufe : 2;

  const thema = el('input', {
    class: 'feld', placeholder: 'Worum geht es?',
    value: vorhandenesThema || '',
    readonly: !!vorhandenesThema,
    style: vorhandenesThema ? { opacity: '.65' } : {},
  });

  const anzeige = el('div', {
    class: 'zier mitte',
    style: { fontSize: '21px', margin: '18px 0 12px', minHeight: '28px' },
  });

  const skala = el('div', { style: { display: 'flex', gap: '5px' } });
  const zeichne = () => {
    anzeige.textContent = GRENZSTUFEN[stufe].marke;
    anzeige.style.color = GRENZSTUFEN[stufe].farbe;
    skala.innerHTML = '';
    GRENZSTUFEN.forEach((s) => {
      skala.append(el('button', {
        style: {
          flex: '1', height: '46px', borderRadius: '9px',
          background: s.wert <= stufe ? GRENZSTUFEN[stufe].farbe : 'var(--grund2)',
          border: '1px solid ' + (s.wert === stufe ? 'var(--schrift)' : 'var(--kante)'),
          transition: 'background .2s ease',
        },
        onclick: () => { stufe = s.wert; zeichne(); puls('hinweis'); },
      }));
    });
  };
  zeichne();

  const b = blatt(
    el('h2', {}, vorhandenesThema ? 'Wie steht es dazu?' : 'Ein Thema'),
    el('div', { style: { height: '12px' } }),
    thema,
    anzeige,
    skala,
    el('p', { class: 'still klein mitte', style: { marginTop: '10px' } },
      'Von „auf keinen Fall" bis „brauche ich".'),
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          const name = thema.value.trim();
          if (!name) return meldung('Ein Thema fehlt.');
          b.schliessen();
          /* Jede Bewertung ist ein neuer Eintrag, kein Überschreiben —
             so bleibt die Verschiebung nachvollziehbar. */
          await datenAnhaengen('grenzen', { thema: name, stufe });
          meldung(GRENZSTUFEN[stufe].marke + '.');
        },
      }, 'Eintragen')
    )
  );
}

/* --- Der Verlauf ---------------------------------------------------------- */

/* Was sich verschoben hat, ist oft die eigentliche Auskunft. */
function grenzenVerlauf(liste) {
  const meine = liste.filter((e) => e.von === D.rolle);
  const nachThema = {};
  meine.forEach((e) => {
    const k = (e.thema || '').toLowerCase();
    (nachThema[k] = nachThema[k] || []).push(e);
  });

  const bewegt = Object.values(nachThema)
    .filter((eintraege) => eintraege.length > 1)
    .map((eintraege) => {
      const sortiert = eintraege.slice().sort((a, b) => a.wann - b.wann);
      return { erst: sortiert[0], zuletzt: sortiert[sortiert.length - 1] };
    })
    .filter((v) => v.erst.stufe !== v.zuletzt.stufe);

  blatt(
    el('h2', {}, 'Was sich verschoben hat'),
    el('div', { style: { height: '12px' } }),
    bewegt.length
      ? el('div', {}, ...bewegt.map((v) => el('div', { class: 'karte', style: { marginTop: '9px', padding: '12px 14px' } },
          el('div', { class: 'zier', style: { fontSize: '16px', marginBottom: '7px' } }, v.zuletzt.thema),
          el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' } },
            el('span', { style: { color: GRENZSTUFEN[v.erst.stufe].farbe } }, GRENZSTUFEN[v.erst.stufe].marke),
            el('span', { class: 'still' }, '→'),
            el('span', { style: { color: GRENZSTUFEN[v.zuletzt.stufe].farbe } }, GRENZSTUFEN[v.zuletzt.stufe].marke)
          ),
          el('p', { class: 'winzig still', style: { marginTop: '6px' } },
            'seit ' + new Date(v.erst.wann).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }))
        )))
      : el('p', { class: 'leise klein' },
          'Noch nichts. Trag dasselbe Thema später noch einmal ein — dann steht hier, wohin es sich bewegt hat.')
  );
}
