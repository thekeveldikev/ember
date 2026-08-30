/* ==========================================================================
   62-tagesaufgabe.js — Die Aufgabe des Tages.

   Jeden Tag eine — für ihn nach seiner Stufe gestaffelt, für sie aus dem
   eigenen Topf, damit die App für sie mehr ist als Verwaltung. Beide
   Geräte sehen dieselbe Aufgabe, weil sie in der Ablage liegt, nicht im
   Zufall des jeweiligen Geräts.

   Sie sieht seine Aufgabe mit und kann sie tauschen oder wegnehmen —
   ihr Veto gehört zum Spiel. Erledigte zählen auf die Serie.
   ========================================================================== */

async function tagesaufgabeSichern(rolle) {
  if (!vorratAn()) return null;
  const pfad = 'tag/' + tagstempel() + '/aufgabe_' + rolle;
  const da = await datenLies(pfad).catch(() => null);
  if (da) return da;

  const historie = await datenLies('einst/aufgabenHistorie', {}).catch(() => ({}));
  const stand = rolle === 'sub' ? await datenLies('wachsen/stand', {}).catch(() => ({})) : {};
  const level = rolle === 'sub' ? stufeAus(stand.xp || 0).stufe : 1;

  const wahl = vorratTagesaufgabe(rolle, level, historie[rolle] || []);
  if (!wahl) return null;

  const aufgabe = {
    id: wahl.id, text: wahl.text, intensitaet: wahl.intensitaet,
    beweis: !!wahl.braucht_beweis, status: 'offen',
  };
  await datenSchreib(pfad, aufgabe);
  await datenSchreib('einst/aufgabenHistorie', {
    ...historie,
    [rolle]: [...(historie[rolle] || []), wahl.id].slice(-30),
  });
  return aufgabe;
}

/* Beim Start: die eigene sicherstellen. Die des anderen legt dessen Gerät
   an — oder unser nächster Blick auf die Karte, falls es nie öffnet. */
async function tagesaufgabenStart() {
  try { await tagesaufgabeSichern(D.rolle); } catch { /* dann später */ }
}

/* --- Die Karte auf dem Heim ------------------------------------------------ */

async function tagesaufgabeKarte(platz) {
  platz.innerHTML = '';
  if (!vorratAn()) return;

  const heute = tagstempel();
  const eigene = await datenLies('tag/' + heute + '/aufgabe_' + D.rolle).catch(() => null)
    || await tagesaufgabeSichern(D.rolle).catch(() => null);
  const seine = istDomme()
    ? await datenLies('tag/' + heute + '/aufgabe_sub').catch(() => null)
    : null;
  const serie = await datenLies('aufgabenSerie', { zahl: 0, letzterTag: '' }).catch(() => ({ zahl: 0 }));

  if (eigene) sanftEinfuegen(platz, _aufgabeKarte(eigene, D.rolle, serie, platz));
  if (seine && istDomme()) sanftEinfuegen(platz, _aufgabeKarte(seine, 'sub', serie, platz));
}

/* Bewusst nur eine schmale Zeile: Das Heim gehört dem Knopf. Was die
   Aufgabe genau will, steht im Blatt — ein Tipp entfernt. */
function _aufgabeKarte(aufgabe, fuerRolle, serie, platz) {
  const meine = fuerRolle === D.rolle;
  const erledigt = aufgabe.status === 'erledigt';

  const zeile = el('button', {
    class: 'aufgabenzeile' + (erledigt ? ' fertig' : ''),
    onclick: () => _aufgabeBlatt(aufgabe, fuerRolle, platz),
  },
    el('span', { class: 'lichtpunkt' + (erledigt ? ' gruen' : '') }),
    el('span', { class: 'klein', style: { flex: '1', textAlign: 'left', minWidth: '0' } },
      (meine ? 'Deine Aufgabe heute' : nameVon('sub') + 's Aufgabe') +
      (erledigt ? ' — erledigt' : '')),
    fuerRolle === 'sub' && serie && serie.zahl > 1
      ? el('span', { class: 'winzig', style: { color: 'var(--glut-hell)', flex: 'none' } }, '🔥 ' + serie.zahl)
      : null,
    el('span', { class: 'still', style: { flex: 'none', fontSize: '15px' } }, '›')
  );
  return zeile;
}

function _aufgabeBlatt(aufgabe, fuerRolle, platz) {
  const meine = fuerRolle === D.rolle;
  const erledigt = aufgabe.status === 'erledigt';
  const pfad = 'tag/' + tagstempel() + '/aufgabe_' + fuerRolle;

  const b = blatt(
    el('p', { class: 'winzig still mitte' },
      (meine ? 'Deine Aufgabe heute' : nameVon('sub') + 's Aufgabe heute') +
      (aufgabe.intensitaet ? ' · ' + '🔥'.repeat(aufgabe.intensitaet) : '')),
    el('p', {
      class: 'zier mitte',
      style: {
        fontSize: '21px', lineHeight: '1.35', padding: '14px 6px 6px',
        textDecoration: erledigt ? 'line-through' : 'none', opacity: erledigt ? '.6' : '1',
      },
    }, aufgabe.text),
    aufgabe.beweis && !erledigt
      ? el('p', { class: 'still klein mitte', style: { marginTop: '4px' } }, 'Mit Beweis — der landet im Chat.')
      : null,
    erledigt
      ? el('p', { class: 'winzig mitte', style: { marginTop: '10px', color: 'var(--gruen)' } }, 'Erledigt.')
      : null,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      !erledigt && meine ? el('button', {
        class: 'knopf glut',
        onclick: async () => {
          b.schliessen();
          await datenSchreib(pfad, { ...aufgabe, status: 'erledigt', erledigtWann: jetzt() });
          if (D.rolle === 'sub') {
            await _serieZaehlen();
            const stand = await datenLies('wachsen/stand', {}).catch(() => ({}));
            await datenSchreib('wachsen/stand', { ...stand, xp: (stand.xp || 0) + 10 }).catch(() => {});
          }
          if (typeof paarXp === 'function') paarXp(10);
          tonSpielen('weich');
          pushSenden(andereRolle(), 'hinweis', 'Tagesaufgabe erledigt.');
          puls('antwortJa');
          meldung('Zählt.');
          if (typeof maschineEreignis === 'function') maschineEreignis('aufgabe');
          tagesaufgabeKarte(platz);
        },
      }, 'Erledigt') : null,
      !erledigt && istDomme() && fuerRolle === 'sub' ? el('button', {
        class: 'knopf leer',
        onclick: async () => {
          const historie = await datenLies('einst/aufgabenHistorie', {}).catch(() => ({}));
          const stand = await datenLies('wachsen/stand', {}).catch(() => ({}));
          const level = stufeAus(stand.xp || 0).stufe;
          const neu = vorratTagesaufgabe('sub', level, [...(historie.sub || []), aufgabe.id]);
          if (!neu) return meldung('Der Topf gibt nichts anderes her.');
          b.schliessen();
          await datenSchreib(pfad, {
            id: neu.id, text: neu.text, intensitaet: neu.intensitaet,
            beweis: !!neu.braucht_beweis, status: 'offen',
          });
          meldung('Getauscht.');
          tagesaufgabeKarte(platz);
        },
      }, 'Tauschen') : null,
      erledigt || (!meine && !istDomme()) ? el('button', {
        class: 'knopf leer', onclick: () => b.schliessen(),
      }, 'Schließen') : null
    ),
    !erledigt && istDomme() && fuerRolle === 'sub' ? el('button', {
      class: 'winzig still', style: { display: 'block', margin: '13px auto 0' },
      onclick: async () => {
        b.schliessen();
        const weg = await frage('Aufgabe für heute wegnehmen?', aufgabe.text, 'Wegnehmen', true);
        if (weg) { await datenLoesch(pfad); tagesaufgabeKarte(platz); }
      },
    }, 'Für heute wegnehmen') : null
  );
}

/* Die Serie: jeder erledigte Tag zählt weiter, eine Lücke setzt zurück —
   außer die Ampel stand auf Rot, dann war Pause verordnet. */
async function _serieZaehlen() {
  const heute = tagstempel();
  const gestern = tagstempel(Date.now() - 86400000);
  const serie = await datenLies('aufgabenSerie', { zahl: 0, letzterTag: '' }).catch(() => null);
  if (!serie) return;
  if (serie.letzterTag === heute) return;

  const rot = [D.ampel.domme, D.ampel.sub].includes('rot');
  const zahl = (serie.letzterTag === gestern || rot) ? (serie.zahl || 0) + 1 : 1;
  await datenSchreib('aufgabenSerie', { zahl, letzterTag: heute }).catch(() => {});
  if (typeof maschineEreignis === 'function') maschineEreignis('serie', { zahl });
}
