/* ==========================================================================
   51-notaus.js — Der Notausgang.

   Er ist immer da. Auf jeder Seite, auch mitten im Vollbild-Befehl, auch
   im Ruheschirm. Es gibt keinen Zustand in dieser App, aus dem heraus er
   nicht erreichbar wäre — das ist die Bedingung dafür, dass der Rest
   überhaupt sein darf.

   Bewusst unauffällig gestaltet: Wer über die Schulter schaut, sieht einen
   Punkt. Wer ihn braucht, findet ihn sofort.
   ========================================================================== */

function notausAnbringen() {
  if ($('#notaus')) return;

  const griff = el('button', {
    id: 'notaus',
    'aria-label': 'Notausgang',
    style: {
      position: 'fixed',
      top: 'calc(env(safe-area-inset-top) + 10px)',
      right: '12px',
      zIndex: '850',
      width: '34px',
      height: '34px',
      display: 'grid',
      placeItems: 'center',
      borderRadius: '50%',
      /* Hell statt rot: Der Ausgang muss auch auf dem tiefroten Grund des
         Befehlsschirms zu sehen sein — gerade dort. Ein roter Punkt auf
         Rot wäre genau dann unsichtbar, wenn er gebraucht wird. */
      background: 'rgba(0,0,0,.34)',
      border: '1px solid rgba(240,230,211,.26)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
    onclick: notausBlatt,
  }, el('span', {
    style: {
      width: '9px', height: '9px', borderRadius: '50%',
      background: 'var(--schrift)', opacity: '.8',
      boxShadow: '0 0 9px rgba(240,230,211,.45)',
    },
  }));

  document.body.append(griff);
}

function notausBlatt() {
  const knopf = (farbe, titel, unter, tat) => el('button', {
    class: 'karte',
    style: {
      width: '100%', textAlign: 'left', display: 'flex', gap: '14px',
      alignItems: 'center', marginTop: '9px', borderColor: 'var(--kante)',
    },
    onclick: () => { b.schliessen(); tat(); },
  },
    el('span', {
      style: {
        width: '13px', height: '13px', borderRadius: '50%', flex: 'none',
        background: AMPEL_FARBEN[farbe], boxShadow: '0 0 12px ' + AMPEL_FARBEN[farbe],
      },
    }),
    el('div', {},
      el('div', { style: { fontWeight: '500' } }, titel),
      el('div', { class: 'still klein' }, unter)
    )
  );

  const b = blatt(
    el('h2', {}, 'Notausgang'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 4px' } },
      'Kein Erklären nötig. Kein Nachfragen.'),

    knopf('gelb', 'Gelb', 'Langsamer. Ich bin noch da.', () => ampelSetzen('gelb')),
    knopf('rot', 'Rot', 'Es hört jetzt auf. Alles hält an.', () => ampelSetzen('rot')),

    el('div', { class: 'trenner' }),

    el('button', {
      class: 'knopf leer breit',
      onclick: () => { b.schliessen(); tarnungAn(); },
      style: { marginBottom: '9px' },
    }, 'Jemand schaut mit'),

    D.ruhe ? el('button', {
      class: 'knopf glut breit',
      onclick: () => { b.schliessen(); ampelSetzen('gruen'); },
    }, 'Es geht wieder') : null,

    el('p', { class: 'still klein', style: { marginTop: '16px', lineHeight: '1.5' } },
      'Rot löscht nichts und beschuldigt niemanden. Es hält nur an.')
  );
}
