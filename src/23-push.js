/* ==========================================================================
   23-push.js — Damit der Knopf auch ankommt, wenn die App zu ist.

   Kein Firebase Cloud Messaging: das Versenden bräuchte dort immer einen
   Server-Schlüssel. Stattdessen der Netz-Standard (Web Push mit VAPID) und
   ein winziger eigener Bote, der nur unterschreibt und weiterreicht.

   Auf dem iPhone kommt Push nur an, wenn EMBER auf dem Startbildschirm
   liegt (ab iOS 16.4). Im Safari-Reiter geht es nicht — das ist Apples
   Regel, keine Nachlässigkeit hier.
   ========================================================================== */

const Push = {
  erlaubt: false,
  anmeldung: null,
  bote: null,      // { url, geheim, oeffentlich }
};

function pushMoeglich() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/* iOS gibt Push nur der installierten App. Vorher zu fragen wäre eine
   Erlaubnis, die nichts bewirkt — deshalb erst den Hinweis. */
function istInstalliert() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

function istApple() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/* --- Anmelden ------------------------------------------------------------- */

async function pushAnmelden(still = false) {
  if (!pushMoeglich()) {
    if (!still) meldung('Dieser Browser kann keine Hinweise zustellen.');
    return false;
  }
  if (!Push.bote || !Push.bote.oeffentlich) {
    if (!still) meldung('Der Bote ist noch nicht eingerichtet.');
    return false;
  }
  if (istApple() && !istInstalliert()) {
    if (!still) meldung('Leg EMBER erst auf den Startbildschirm — sonst lässt iOS keine Hinweise zu.', 6000);
    return false;
  }

  try {
    let erlaubnis = Notification.permission;
    if (erlaubnis === 'default') erlaubnis = await Notification.requestPermission();
    if (erlaubnis !== 'granted') {
      if (!still) meldung('Ohne Erlaubnis bleiben Hinweise aus.');
      return false;
    }

    const reg = await navigator.serviceWorker.ready;
    let anmeldung = await reg.pushManager.getSubscription();

    /* Wechselt der Schlüssel des Boten, passt die alte Anmeldung nicht
       mehr — dann muss sie weg, bevor eine neue entstehen kann. */
    if (anmeldung && still === true) {
      const alt = Gerät.lies('pushSchluessel');
      if (alt && alt !== Push.bote.oeffentlich) {
        await anmeldung.unsubscribe().catch(() => {});
        anmeldung = null;
      }
    }

    if (!anmeldung) {
      anmeldung = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: b64ZuRohe(ausB64Url(Push.bote.oeffentlich)),
      });
    }

    Push.anmeldung = anmeldung.toJSON();
    Push.erlaubt = true;
    Gerät.schreib('pushSchluessel', Push.bote.oeffentlich);

    /* Die Anmeldung liegt offen in der Ablage — sie muss es, damit der Bote
       sie lesen kann. Sie enthält keinen Inhalt, nur eine Zustelladresse. */
    await ablageSchreib('push/' + D.rolle, {
      anmeldung: Push.anmeldung,
      geraet: navigator.userAgent.slice(0, 90),
      wann: jetzt(),
    });

    if (!still) meldung('Hinweise sind an.');
    return true;
  } catch (f) {
    if (!still) meldung('Hinweise ließen sich nicht einrichten.');
    return false;
  }
}

async function pushAbmelden() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const a = await reg.pushManager.getSubscription();
    if (a) await a.unsubscribe();
    await ablageLoesch('push/' + D.rolle);
    Push.erlaubt = false;
    Push.anmeldung = null;
    meldung('Hinweise sind aus.');
  } catch { meldung('Das ging gerade nicht.'); }
}

/* --- Senden --------------------------------------------------------------- */

/* Was hier mitgeht, ist bewusst nichtssagend: eine Art, ein knapper Satz,
   ein Rhythmus. Kein Inhalt, keine Namen. Was gemeint ist, steht in der
   verschlüsselten Ablage und wird erst in der geöffneten App sichtbar. */

const PUSH_HUELLEN = {
  befehl: { titel: 'Ember', text: 'Jetzt.', puls: PULS.befehl },
  bitte: { titel: 'Ember', text: 'Eine Bitte wartet.', puls: PULS.bitte },
  antwort: { titel: 'Ember', text: 'Eine Antwort ist da.', puls: PULS.antwortJa },
  plausch: { titel: 'Ember', text: 'Eine Nachricht.', puls: PULS.hinweis },
  denkAnDich: { titel: 'Ember', text: '·', puls: PULS.denkAnDich },
  auftrag: { titel: 'Ember', text: 'Etwas liegt für dich bereit.', puls: PULS.hinweis },
  regel: { titel: 'Ember', text: 'Etwas hat sich geändert.', puls: PULS.hinweis },
  hinweis: { titel: 'Ember', text: 'Etwas wartet auf dich.', puls: PULS.hinweis },
};

async function pushSenden(anRolle, art = 'hinweis', eigenerText) {
  if (!Push.bote || !Push.bote.url) return false;

  try {
    const ziel = await ablageLies('push/' + anRolle).catch(() => null);
    if (!ziel || !ziel.anmeldung) return false;

    const huelle = PUSH_HUELLEN[art] || PUSH_HUELLEN.hinweis;
    const antwort = await fetch(Push.bote.url.replace(/\/+$/, '') + '/senden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Push.bote.geheim,
      },
      body: JSON.stringify({
        an: ziel.anmeldung,
        last: {
          art,
          titel: huelle.titel,
          text: eigenerText || huelle.text,
          puls: huelle.puls,
          tag: art,
        },
        dringend: art === 'befehl',
      }),
    });

    if (antwort.status === 410 || antwort.status === 404) {
      /* Die Zustelladresse ist erloschen. Aufräumen, damit es nicht
         bei jedem Versuch erneut scheitert. */
      await ablageLoesch('push/' + anRolle).catch(() => {});
      return false;
    }
    return antwort.ok;
  } catch {
    return false;
  }
}

/* Ein Impuls an mich selbst — zum Ausprobieren, ob alles sitzt. */
async function pushProbe() {
  const ok = await pushSenden(D.rolle, 'hinweis', 'Die Zustellung steht.');
  meldung(ok ? 'Losgeschickt. Gleich müsste es klingeln.' : 'Der Bote hat nicht angenommen.');
}
