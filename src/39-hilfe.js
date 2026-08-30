/* ==========================================================================
   39-hilfe.js — Der Hilfe-Knopf.

   Auf jeder Seite schwebt ein kleines ?, und dahinter steht in einfachen
   Sätzen: Was ist das hier, was kann ich damit tun, wie hängt es mit dem
   Rest zusammen. Je Rolle ein eigener Text — sie liest ihre Möglichkeiten,
   er seine. Für alle, die sich nicht durch dreißig Seiten raten wollen.

   Der Knopf ist abschaltbar (Einstellungen → Die App) und verschwindet
   in der Tarnung von selbst mit allem anderen.
   ========================================================================== */

const HILFE = {
  heim: {
    titel: 'Das Heim',
    sie: [
      'Das Heim ist die gemeinsame Startseite. Alles, was heute zählt, steht hier untereinander: seine Aufgabe, die Frage des Tages, laufende Sperren oder Foto-Aufträge, sein Glut-Stand, der große Knopf.',
      'Du kannst eine Tagesnachricht hinterlegen (Text oder Foto) — sie steht dann bei ihm ganz oben. Der Schriftzug EMBER reagiert auf dreimal Tippen: Tarnung.',
      'Was hier auftaucht und was nicht, steuerst du unter Verwaltung → Bausteine.',
    ],
    er: [
      'Das Heim ist deine Startseite. Von oben nach unten: was sie dir hinterlassen hat, deine Aufgabe heute, die Frage des Tages, deine Glut, der große Knopf.',
      'Alles ist antippbar. Dreimal auf EMBER tippen tarnt die App sofort.',
    ],
  },
  plausch: {
    titel: 'Der Plausch',
    sie: [
      'Euer privater Chat — verschlüsselt, nur ihr zwei. Text, Fotos, Sprachnachrichten, schnelle Reaktionen.',
      'Nachrichten mit Ablauf verschwinden von selbst. Die Schnellwahl unten spart Tippen.',
    ],
    er: [
      'Euer privater Chat — verschlüsselt, nur ihr zwei. Text, Fotos, Sprachnachrichten.',
      'Manche Nachrichten haben ein Ablaufdatum — was weg ist, ist weg.',
    ],
  },
  spiel: {
    titel: 'Das Spiel',
    sie: [
      'Die Spielhalle: Oben liegen die Wege zu Rad, Baukasten, Wahrheit oder Pflicht, Losen, Quiz, Regie, Timer — und dem Laden, wenn er geöffnet ist.',
      'Darunter die Decks: Kartenstapel zum Ziehen. Eigene Karten legst du mit „+ Karte" an, fertige Decks kommen aus dem Vorrat.',
      '„Überrasch mich" lässt die App entscheiden, was jetzt dran ist.',
    ],
    er: [
      'Die Spielhalle: oben die Spiele, darunter die Decks zum Kartenziehen.',
      'Eine gezogene Karte kannst du annehmen — dann liegt sie als Auftrag bei dir. „Überrasch mich" lässt die App wählen.',
    ],
  },
  auftrag: {
    titel: 'Die Aufträge',
    sie: [
      'Drei Bereiche: Aufträge (was er tun soll, mit Frist wenn du willst), Ausstehendes (Strafen — er sieht nur die Anzahl, nicht den Inhalt) und Regeln (was dauerhaft gilt).',
      'Neues legst du hier oder unter Verwaltung → Anlegen an. Erledigtes bestätigst du — erst dann zählt es für ihn.',
    ],
    er: [
      'Deine offenen Aufträge, die Zahl deiner ausstehenden Strafen und die Regeln, die gerade gelten.',
      'Erledigt melden heißt: Sie sieht es und bestätigt. Erst dann zählt es — auch für deine Glut.',
    ],
  },
  ich: {
    titel: 'Die Ich-Seite',
    sie: [
      'Deine Schaltzentrale. Oben deine Ampel und der Weg in die Verwaltung, darunter die Bereiche der App in Klappen, unten Hinweise, Räume, Sicherheit und die App-Einstellungen.',
      'Eine Klappe (Kreis mit Pfeil) öffnet eine Gruppe. Eine Zeile mit › führt direkt auf eine Seite.',
    ],
    er: [
      'Deine Übersicht: Ampel, die Bereiche der App in Klappen, unten Hinweise und Einstellungen.',
      'Deine Ampel darfst du jederzeit ändern — sie wirkt sofort und überall.',
    ],
  },
  verwaltung: {
    titel: 'Die Verwaltung',
    sie: [
      'Dein Werkzeugkasten — nur du siehst ihn. Der Vorrat füllt die App mit fertigem Inhalt (mit Intensitäts-Obergrenze). Die Bausteine schalten ganze Bereiche an oder aus, ohne dass etwas verloren geht.',
      'Unter Anlegen erstellst du alles Eigene: Aufträge, Regeln, Karten, Räder, Lose, Pfade und mehr — sortiert in vier Klappen.',
      '„Alles auf Anfang" leert nur den gemeinsamen Bestand, die Einrichtung bleibt.',
    ],
    er: [],
  },
  laden: {
    titel: 'Der Laden',
    sie: [
      'Seine kleine Wirtschaft: Er verdient Glut (●) mit Aufgaben, du steuerst alles andere — Gehalt, Preise, Angebote, Bußgelder, Gnade.',
      'Unten bei „Deine Hebel" greifst du ein. Einen Artikel gedrückt halten: Preis, Ausverkauft, Angebot.',
      'Der Knopf „Wie es funktioniert" erklärt das ganze System in Ruhe.',
    ],
    er: [
      'Hier gibst du deine Glut aus. Jeder Artikel sagt dir, was er kostet und was dann passiert.',
      'Gekauftes liegt erst als offener Kauf bei dir — einlösen heißt: ihr vorlegen, sie wählt den Moment. Artikel gedrückt halten startet ein Sparziel.',
      '„Wie es funktioniert" erklärt alles — auch Zahltag, Zinsen und den Monatsschwund.',
    ],
  },
  rad: {
    titel: 'Die Räder',
    sie: [
      'Glücksräder: antippen, drehen, das Feld unterm Zeiger gilt. Fertige Räder kommen aus dem Vorrat, eigene baust du unter Verwaltung → Anlegen.',
      'Du kannst mehrere Räder hintereinander drehen lassen — die Ergebnisse ergeben zusammen eine Ansage.',
    ],
    er: [
      'Antippen, drehen lassen, das Feld unterm Zeiger gilt. Was auf den Feldern steht, bestimmt sie.',
    ],
  },
  szenario: {
    titel: 'Der Baukasten',
    sie: [
      'Ein Würfel für ganze Szenen: Ort, Stimmung, Handlung und mehr werden zufällig kombiniert — über eine Milliarde Möglichkeiten.',
      'Einzelne Teile kannst du festhalten und nur den Rest neu würfeln. Das Ergebnis lässt sich direkt als Auftrag geben.',
    ],
    er: [
      'Die App würfelt eine ganze Szene zusammen. Gefällt ein Teil nicht, wird nur der neu gewürfelt.',
    ],
  },
  wahrheit: {
    titel: 'Wahrheit oder Pflicht',
    sie: [
      'Der Klassiker, gefüttert aus dem Vorrat und euren eigenen Karten. Drei Stufen, mehrere Modi.',
      'Eigene Fragen und Pflichten zählen doppelt — sie treffen euren Ton am besten.',
    ],
    er: [
      'Wahrheit heißt ehrlich antworten, Pflicht heißt tun. Die Stufe entscheidet, wie weit es geht.',
    ],
  },
  rubbeln: {
    titel: 'Die Lose',
    sie: [
      'Rubbellose: Du legst sie an (oder der Vorrat), er deckt sie mit dem Finger frei. Was drunter liegt, weiß er vorher nicht.',
      'Ein Blindlos dreht es um: Er rubbelt zuerst, DANN schreibst du, was gilt.',
    ],
    er: [
      'Mit dem Finger freirubbeln, was drunter liegt. Ein Los pro Tag gibt es geschenkt — nicht jedes ist ein Gewinn.',
    ],
  },
  quiz: {
    titel: 'Das Quiz',
    sie: [
      'Wie gut kennt ihr euch? Beide beantworten dieselben Fragen — einmal über sich, einmal ratend über den anderen. Die App vergleicht.',
    ],
    er: [
      'Beide beantworten dieselben Fragen — über sich und ratend über den anderen. Am Ende zeigt die App, wie gut ihr euch kennt.',
    ],
  },
  regie: {
    titel: 'Die Regie',
    sie: [
      'Ein Skript führt euch Schritt für Schritt durch eine Szene. Du siehst alle Schritte, er bekommt immer nur den nächsten.',
      'Fertige Skripte liegen im Vorrat, eigene baust du unter Verwaltung → Anlegen → Regie-Skript.',
    ],
    er: [
      'Sie startet ein Skript — du bekommst immer nur den nächsten Schritt, nie den ganzen Plan. Genau das ist der Reiz.',
    ],
  },
  timer: {
    titel: 'Der Timer',
    sie: [
      'Eine Uhr für alles: feste Dauer oder Zufall. Der Blind-Timer zeigt nicht einmal die Restzeit — nur, DASS er läuft.',
    ],
    er: [
      'Eine Uhr mit fester oder zufälliger Dauer. Beim Blind-Timer weißt du nur: Er läuft noch.',
    ],
  },
  wachsen: {
    titel: 'Das Wachsen',
    sie: [
      'Seine Entwicklung in Zahlen: Stufe, Punkte, sechs Werte, Serien. Erledigte Aufgaben und Aufträge zahlen automatisch ein.',
      'Auszeichnungen legst du selbst an und verleihst sie, wann du willst. Meilensteine bringen ihm Siegel für den Laden.',
    ],
    er: [
      'Deine Stufe, deine Punkte, deine Werte. Alles, was du erledigst, zahlt hier von selbst ein.',
      'Meilensteine — eine neue Stufe, lange Serien — bringen dir Siegel für den Laden.',
    ],
  },
  pfade: {
    titel: 'Die Pfade',
    sie: [
      'Ein Pfad ist ein Stufenplan: Du legst Stufen fest, er arbeitet sich hoch — und sieht immer nur die nächste, nie das Ziel.',
      'Anlegen unter Verwaltung → Anlegen → Pfad. Stufen können verborgen sein, bis sie erreicht werden.',
    ],
    er: [
      'Stufenpläne, die sie für dich gebaut hat. Du siehst immer nur die nächste Stufe — das Ziel kennt nur sie.',
    ],
  },
  spannung: {
    titel: 'Die Spannung',
    sie: [
      'Alles, was Vorfreude baut: eine Uhr, die er ablaufen sieht. Verborgenes mit Enthüllungsdatum. Krümel, die sich über den Tag verteilen. Ein Topf, aus dem die App zu zufälligen Zeiten Impulse zieht.',
      'Er sieht immer nur, DASS etwas kommt — nie was.',
    ],
    er: [
      'Was sie für dich vorbereitet hat: Uhren, Verborgenes, Krümel, Impulse. Du siehst, dass etwas kommt — mehr nicht.',
    ],
  },
  wuensche: {
    titel: 'Die Wünsche',
    sie: [
      'Jeder trägt blind ein, was er sich wünscht — die App zeigt nur, was BEIDE eingetragen haben. Kein Risiko, sich zu offenbaren.',
      'Daneben eine offene Liste für alles, was ihr ausprobieren wollt.',
    ],
    er: [
      'Trag ehrlich ein, was du dir wünschst — sichtbar wird nur, was ihr beide wollt. Der Rest bleibt dein Geheimnis.',
    ],
  },
  grenzen: {
    titel: 'Die Grenzen',
    sie: [
      'Was geht, was nicht, was vielleicht — festgehalten, damit es nicht im Kopf verrutscht. Änderungen bleiben als Verlauf sichtbar.',
      'Fang mit wenigen Einträgen an; die Karte wächst mit euch.',
    ],
    er: [
      'Was geht, was nicht, was vielleicht. Ehrlich eintragen — genau dafür ist die Seite da, und ändern ist jederzeit erlaubt.',
    ],
  },
  koerper: {
    titel: 'Die Körperkarte',
    sie: [
      'Zone für Zone: Liebe ich, mag ich, neutral, bitte nicht. Jeder pflegt seine eigene Karte — und sieht die des anderen.',
    ],
    er: [
      'Zone für Zone eintragen: Liebe ich, mag ich, neutral, bitte nicht. Sie sieht deine Karte, du ihre.',
    ],
  },
  signale: {
    titel: 'Die Signale',
    sie: [
      'Eigene Codewörter mit fester Bedeutung — ein Zeichen im Chat, und beide wissen, was gemeint ist, ohne dass es dasteht.',
    ],
    er: [
      'Eure Codewörter: kurz gesendet, klar verstanden — ohne dass es jemand mitlesen könnte.',
    ],
  },
  glossar: {
    titel: 'Unsere Wörter',
    sie: [
      'Euer privates Wörterbuch: Begriffe, die nur zwischen euch etwas bedeuten. Jeder darf anlegen und ergänzen.',
    ],
    er: [
      'Euer privates Wörterbuch. Leg Wörter an, die nur ihr zwei versteht — mit ihrer Bedeutung.',
    ],
  },
  vertrag: {
    titel: 'Der Vertrag',
    sie: [
      'Eure Abmachung, schwarz auf weiß: Ihr schreibt sie gemeinsam, beide unterschreiben. Ändern geht jederzeit — dann wird neu unterschrieben.',
      'Ältere Fassungen bleiben nachlesbar.',
    ],
    er: [
      'Eure Abmachung. Beide unterschreiben — und wenn sich etwas ändert, wird sie geändert und neu unterschrieben.',
    ],
  },
  buch: {
    titel: 'Das Buch',
    sie: [
      'Euer gemeinsames Tagebuch: kurze Einträge nach einer Session, mit Flammen als Bewertung. Die Wärmekarte oben zeigt eure gemeinsame Geschichte auf einen Blick.',
    ],
    er: [
      'Euer Tagebuch. Ein paar Zeilen nach einer Session reichen — die Wärmekarte oben füllt sich von selbst.',
    ],
  },
  rituale: {
    titel: 'Die Rituale',
    sie: [
      'Was regelmäßig wiederkehren soll — ein Morgengruß, ein Abend-Blick. Dranbleiben baut eine Serie auf, die beide sehen.',
      'Darunter: Countdowns auf besondere Tage.',
    ],
    er: [
      'Was jeden Tag gleich abläuft — abhaken hält die Serie am Leben. Darunter ticken die Countdowns auf besondere Tage.',
    ],
  },
  nachher: {
    titel: 'Das Danach',
    sie: [
      'Nach einer Session schreibt jeder für sich, wie es war — erst wenn beide fertig sind, wird zusammen gelesen. So färbt keiner den anderen.',
    ],
    er: [
      'Nach einer Session: erst getrennt schreiben, dann zusammen lesen. Ehrlich hilft — genau dafür ist es da.',
    ],
  },
  reparatur: {
    titel: 'Die Reparatur',
    sie: [
      'Nach einem Streit: drei ruhige Schritte, die beide nacheinander freischalten. Keine Punkte, keine Strafen — nur der Weg zurück zueinander.',
    ],
    er: [
      'Nach einem Streit: drei ruhige Schritte, beide müssen jeden freigeben. Hier zählt nichts — es geht nur um euch.',
    ],
  },
  tresor: {
    titel: 'Der Tresor',
    sie: [
      'Dein Bilder-Safe: Du lädst hoch und gibst einzeln frei, was er sehen darf — und nimmst es auch wieder zurück.',
    ],
    er: [
      'Bilder, die sie für dich freigegeben hat. Was du hier siehst, hat sie bewusst geöffnet.',
    ],
  },
  toys: {
    titel: 'Das Regal',
    sie: [
      'Was an Spielzeug wirklich da ist. Die Decks und der Baukasten richten sich danach — was fehlt, wird nicht vorgeschlagen.',
    ],
    er: [
      'Was bei euch wirklich da ist. Die Spiele schlagen nur vor, was im Regal steht.',
    ],
  },
  eigenes: {
    titel: 'Nur für dich',
    sie: [
      'Private Notizen, die dieses Gerät nie verlassen — nicht verschlüsselt in die Ablage, nirgendwohin. Für Gedanken, die noch reifen.',
    ],
    er: [
      'Private Notizen, die dieses Gerät nie verlassen. Auch sie kann sie nicht lesen.',
    ],
  },
  maschine: {
    titel: 'Wenn — Dann',
    sie: [
      'Regeln, die von selbst feuern: WENN etwas passiert (eine Uhrzeit, eine verpasste Aufgabe, eine Serie), DANN tut die App etwas (ein Hinweis, ein Auftrag, eine Buchung).',
      'Du baust die Regeln, die App führt sie aus — auch wenn ihr nicht in der App seid.',
    ],
    er: [
      'Regeln, die von selbst feuern — sie hat sie gebaut, die App führt sie aus. Ob gerade welche laufen, siehst du hier.',
    ],
  },
};

const hilfeAn = () => Gerät.lies('hilfeKnopf', true) !== false;

function hilfeZeigen(id) {
  const h = HILFE[id];
  if (!h) return;
  const saetze = (istDomme() ? h.sie : h.er);
  const text = saetze.length ? saetze : h.sie;   /* Seiten nur für sie */

  blatt(
    el('p', { class: 'winzig still' }, 'Kurz erklärt'),
    el('h2', { style: { margin: '4px 0 12px' } }, h.titel),
    ...text.map((s) => el('p', { class: 'leise klein', style: { lineHeight: '1.6', marginBottom: '10px' } }, s)),
    el('p', { class: 'still klein', style: { marginTop: '6px' } },
      'Diesen Knopf gibt es auf jeder Seite. Abschalten: Einstellungen → Die App.')
  );
}

/* Der schwebende Knopf. Er lebt IN der Bühne — beim Seitenwechsel wird
   sie geleert, und er verschwindet von selbst mit. */
function hilfeKnopfAnbringen(buehne, id) {
  if (!HILFE[id] || !hilfeAn() || istGetarnt()) return;
  buehne.append(el('button', {
    class: 'hilfeknopf',
    'aria-label': 'Was ist das hier?',
    onclick: () => { tonSpielen('tick'); hilfeZeigen(id); },
  }, '?'));
}
