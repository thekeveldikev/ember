# EMBER — Content-Datei 09: Die Wenn-Dann-Maschine

## Warum das etwas völlig anderes ist

Alle bisherigen Features **warten darauf, dass jemand etwas anstößt**. Jemand zieht eine Karte, dreht am Rad, öffnet eine Challenge. Ohne Aktion passiert nichts.

Die Wenn-Dann-Maschine ist **Infrastruktur, kein Inhalt**. Sie läuft im Hintergrund und lässt Dinge von selbst passieren. Gioia baut Regeln nach dem Muster `WENN Bedingung DANN Aktion`, und die App führt sie automatisch aus — auch wenn beide gerade nicht dran denken.

Der Effekt: Die Dynamik hört auf, ein Spiel zu sein, das man startet. Sie wird zu einem System, das läuft. Kevin weiß irgendwann nicht mehr, ob Gioia gerade aktiv etwas entschieden hat oder ob eine Regel gegriffen hat, die sie vor drei Wochen gebaut hat. Das ist genau der Punkt.

---

## Aufbau einer Regel

```
Regel
├── name
├── aktiv (bool)
├── ausloeser (Trigger)
│   ├── typ
│   └── parameter
├── bedingungen [] (optional, alle müssen zutreffen)
└── aktionen []
    ├── typ
    └── parameter
```

---

## Verfügbare AUSLÖSER

```json
{
  "ausloeser": [
    {"key":"uhrzeit","name":"Zu einer Uhrzeit","parameter":["zeit","wochentage"],"beschreibung":"Feuert täglich oder an bestimmten Tagen zur gesetzten Zeit"},
    {"key":"zufallszeit","name":"Zu einer Zufallszeit","parameter":["zeitfenster_von","zeitfenster_bis","wahrscheinlichkeit"],"beschreibung":"Irgendwann im Fenster, nicht vorhersehbar"},
    {"key":"app_oeffnen","name":"Beim App-Öffnen","parameter":["wer","erstes_mal_am_tag"],"beschreibung":"Wenn jemand die App öffnet"},
    {"key":"button_gedrueckt","name":"Button gedrückt","parameter":["wer"],"beschreibung":"Der zentrale Button"},
    {"key":"ampel_wechsel","name":"Ampel wechselt","parameter":["wer","auf_farbe"],"beschreibung":"Mood-Status ändert sich"},
    {"key":"task_erledigt","name":"Aufgabe erledigt","parameter":["kategorie"],"beschreibung":"Eine Aufgabe wird abgehakt"},
    {"key":"task_verpasst","name":"Aufgabe verpasst","parameter":["kategorie"],"beschreibung":"Deadline überschritten"},
    {"key":"streak_erreicht","name":"Streak erreicht","parameter":["tage"],"beschreibung":"X Tage in Folge"},
    {"key":"streak_gebrochen","name":"Streak gebrochen","parameter":[],"beschreibung":"Serie reißt"},
    {"key":"level_up","name":"Level-Up","parameter":["level"],"beschreibung":"Neues Level erreicht"},
    {"key":"karma_schwelle","name":"Karma-Schwelle","parameter":["wert","richtung"],"beschreibung":"Punktestand über oder unter einem Wert"},
    {"key":"session_geloggt","name":"Session geloggt","parameter":["bewertung_min"],"beschreibung":"Nach dem Eintrag ins Log"},
    {"key":"keine_session","name":"Keine Session seit","parameter":["tage"],"beschreibung":"X Tage nichts passiert"},
    {"key":"regel_gebrochen","name":"Regel gebrochen","parameter":["regel_id"],"beschreibung":"Eine stehende Regel wurde verletzt"},
    {"key":"nachricht_ungelesen","name":"Nachricht ungelesen","parameter":["minuten"],"beschreibung":"Chat-Nachricht bleibt liegen"},
    {"key":"foto_erhalten","name":"Foto erhalten","parameter":["von"],"beschreibung":"Jemand schickt ein Foto"},
    {"key":"safeword","name":"Safeword benutzt","parameter":["farbe"],"beschreibung":"Gelb oder Rot ausgelöst"},
    {"key":"datum","name":"An einem Datum","parameter":["datum","jaehrlich"],"beschreibung":"Jahrestage, Geburtstage"},
    {"key":"standort","name":"Standort erreicht","parameter":["ort","betreten_verlassen"],"beschreibung":"Geofencing — Zuhause, Arbeit, etc."},
    {"key":"getrennt_seit","name":"Getrennt seit","parameter":["stunden"],"beschreibung":"Räumliche Distanz über Zeit"},
    {"key":"los_gezogen","name":"Los gezogen","parameter":["typ"],"beschreibung":"Nach einem Rubbellos"},
    {"key":"manuell","name":"Manuell","parameter":[],"beschreibung":"Gioia löst per Knopfdruck aus"}
  ]
}
```

## Verfügbare BEDINGUNGEN (Filter)

```json
{
  "bedingungen": [
    {"key":"wochentag","name":"Nur an bestimmten Wochentagen","parameter":["tage"]},
    {"key":"uhrzeit_zwischen","name":"Nur zwischen Uhrzeiten","parameter":["von","bis"]},
    {"key":"ampel_ist","name":"Ampel steht auf","parameter":["wer","farbe"]},
    {"key":"beide_zuhause","name":"Beide zuhause","parameter":[]},
    {"key":"getrennt","name":"Nicht zusammen","parameter":[]},
    {"key":"karma_ueber","name":"Karma über","parameter":["wert"]},
    {"key":"karma_unter","name":"Karma unter","parameter":["wert"]},
    {"key":"level_mindestens","name":"Level mindestens","parameter":["wert"]},
    {"key":"queue_leer","name":"Bestrafungs-Queue leer","parameter":[]},
    {"key":"queue_voll","name":"Mindestens X Strafen offen","parameter":["anzahl"]},
    {"key":"letzte_session_vor","name":"Letzte Session vor mehr als","parameter":["stunden"]},
    {"key":"kein_safeword_seit","name":"Kein Safeword seit","parameter":["tage"]},
    {"key":"wahrscheinlichkeit","name":"Nur mit Wahrscheinlichkeit","parameter":["prozent"]}
  ]
}
```

## Verfügbare AKTIONEN

```json
{
  "aktionen": [
    {"key":"nachricht","name":"Nachricht senden","parameter":["an","text"]},
    {"key":"befehl","name":"Sofort-Befehl","parameter":["an","text","timer_min"]},
    {"key":"benachrichtigung","name":"Push-Benachrichtigung","parameter":["an","text"]},
    {"key":"vibration","name":"Vibrations-Impuls","parameter":["an","muster"]},
    {"key":"task_erstellen","name":"Aufgabe anlegen","parameter":["text","deadline","kategorie"]},
    {"key":"karte_ziehen","name":"Karte ziehen und senden","parameter":["deck","an"]},
    {"key":"rad_drehen","name":"Rad drehen und Ergebnis senden","parameter":["rad","an"]},
    {"key":"szenario_generieren","name":"Szenario erzeugen","parameter":["max_intensitaet","an"]},
    {"key":"los_vergeben","name":"Los vergeben","parameter":["an","serie","seltenheit_min"]},
    {"key":"karma_aendern","name":"Karma anpassen","parameter":["wert"]},
    {"key":"xp_vergeben","name":"XP vergeben","parameter":["wert","attribut"]},
    {"key":"strafe_hinzufuegen","name":"Strafe in Queue","parameter":["text"]},
    {"key":"strafe_streichen","name":"Strafe streichen","parameter":["anzahl"]},
    {"key":"belohnung","name":"Belohnung freischalten","parameter":["text"]},
    {"key":"regel_aktivieren","name":"Stehende Regel aktivieren","parameter":["regel_id","dauer"]},
    {"key":"regel_deaktivieren","name":"Regel aussetzen","parameter":["regel_id","dauer"]},
    {"key":"timer_starten","name":"Countdown starten","parameter":["an","dauer","text_bei_ablauf"]},
    {"key":"foto_freischalten","name":"Foto aus Tresor freigeben","parameter":["an","foto_id"]},
    {"key":"regie_vorschlagen","name":"Session-Regie vorschlagen","parameter":["skript_id","an"]},
    {"key":"breadcrumb","name":"Breadcrumb platzieren","parameter":["text","wo"]},
    {"key":"app_modus","name":"App-Modus wechseln","parameter":["modus"]},
    {"key":"domme_alarm","name":"Gioia informieren","parameter":["text"]}
  ]
}
```

---

## Vorgefertigte Regel-Bibliothek

Damit man nicht bei null anfängt. Alle sofort einsetzbar, alle editierbar.

### Alltag & Rhythmus

```json
[
  {
    "id":"reg-a001",
    "name":"Morgengruß",
    "aktiv":true,
    "ausloeser":{"typ":"uhrzeit","zeit":"07:00","wochentage":["mo","di","mi","do","fr"]},
    "bedingungen":[],
    "aktionen":[{"typ":"nachricht","an":"sub","text":"Guten Morgen. Denk heute an deine Regeln."}]
  },
  {
    "id":"reg-a002",
    "name":"Zufalls-Ping",
    "aktiv":true,
    "ausloeser":{"typ":"zufallszeit","zeitfenster_von":"09:00","zeitfenster_bis":"17:00","wahrscheinlichkeit":60},
    "bedingungen":[{"typ":"wochentag","tage":["mo","di","mi","do","fr"]}],
    "aktionen":[{"typ":"vibration","an":"sub","muster":"kurz_doppelt"},{"typ":"nachricht","an":"sub","text":"Nur damit du weißt, dass ich an dich denke."}]
  },
  {
    "id":"reg-a003",
    "name":"Abendliche Meldung",
    "aktiv":true,
    "ausloeser":{"typ":"uhrzeit","zeit":"21:00","wochentage":["alle"]},
    "bedingungen":[],
    "aktionen":[{"typ":"befehl","an":"sub","text":"Melde dich. Wie war dein Tag, und hast du alles erledigt?","timer_min":30}]
  },
  {
    "id":"reg-a004",
    "name":"Sonntags-Reset",
    "aktiv":true,
    "ausloeser":{"typ":"uhrzeit","zeit":"19:00","wochentage":["so"]},
    "bedingungen":[],
    "aktionen":[{"typ":"benachrichtigung","an":"beide","text":"Wochenrückblick: Ziele geschafft? Neue Woche planen."}]
  },
  {
    "id":"reg-a005",
    "name":"Feierabend-Erinnerung",
    "aktiv":false,
    "ausloeser":{"typ":"standort","ort":"zuhause","betreten_verlassen":"betreten"},
    "bedingungen":[{"typ":"uhrzeit_zwischen","von":"16:00","bis":"20:00"}],
    "aktionen":[{"typ":"nachricht","an":"sub","text":"Du bist zuhause. Zieh dich um und warte auf mich."}]
  }
]
```

### Belohnung & Konsequenz

```json
[
  {
    "id":"reg-b001",
    "name":"Streak-Belohnung",
    "aktiv":true,
    "ausloeser":{"typ":"streak_erreicht","tage":7},
    "bedingungen":[],
    "aktionen":[
      {"typ":"los_vergeben","an":"sub","serie":"belohnung","seltenheit_min":3},
      {"typ":"nachricht","an":"sub","text":"Sieben Tage. Du hast dir etwas verdient."},
      {"typ":"domme_alarm","text":"Kevin hat 7-Tage-Streak erreicht."}
    ]
  },
  {
    "id":"reg-b002",
    "name":"Verpasste Aufgabe",
    "aktiv":true,
    "ausloeser":{"typ":"task_verpasst","kategorie":"alle"},
    "bedingungen":[],
    "aktionen":[
      {"typ":"karma_aendern","wert":-2},
      {"typ":"strafe_hinzufuegen","text":"Verpasste Aufgabe — Strafe wird noch festgelegt"},
      {"typ":"nachricht","an":"sub","text":"Du hast etwas vergessen. Ich auch nicht."}
    ]
  },
  {
    "id":"reg-b003",
    "name":"Streak gebrochen",
    "aktiv":true,
    "ausloeser":{"typ":"streak_gebrochen"},
    "bedingungen":[],
    "aktionen":[
      {"typ":"karma_aendern","wert":-3},
      {"typ":"nachricht","an":"sub","text":"Streak weg. Wir fangen von vorne an."},
      {"typ":"domme_alarm","text":"Streak gebrochen. Willst du reagieren?"}
    ]
  },
  {
    "id":"reg-b004",
    "name":"Karma-Tief",
    "aktiv":true,
    "ausloeser":{"typ":"karma_schwelle","wert":-10,"richtung":"unter"},
    "bedingungen":[],
    "aktionen":[
      {"typ":"regel_aktivieren","regel_id":"kein_orgasmus","dauer":"72h"},
      {"typ":"nachricht","an":"sub","text":"Dein Konto ist tief im Minus. Du weißt, was das bedeutet."}
    ]
  },
  {
    "id":"reg-b005",
    "name":"Karma-Hoch",
    "aktiv":true,
    "ausloeser":{"typ":"karma_schwelle","wert":25,"richtung":"ueber"},
    "bedingungen":[],
    "aktionen":[
      {"typ":"belohnung","text":"Wunsch-Token freigeschaltet"},
      {"typ":"nachricht","an":"sub","text":"Du hast dir einen Wunsch verdient. Überleg dir gut, wofür."}
    ]
  },
  {
    "id":"reg-b006",
    "name":"Gute Session",
    "aktiv":true,
    "ausloeser":{"typ":"session_geloggt","bewertung_min":5},
    "bedingungen":[],
    "aktionen":[
      {"typ":"xp_vergeben","wert":50,"attribut":"gesamt"},
      {"typ":"karma_aendern","wert":3}
    ]
  }
]
```

### Spannung & Ungewissheit

```json
[
  {
    "id":"reg-s001",
    "name":"Der stille Alarm",
    "aktiv":false,
    "ausloeser":{"typ":"zufallszeit","zeitfenster_von":"08:00","zeitfenster_bis":"22:00","wahrscheinlichkeit":25},
    "bedingungen":[{"typ":"ampel_ist","wer":"domme","farbe":"gruen"}],
    "aktionen":[{"typ":"vibration","an":"sub","muster":"lang"},{"typ":"nachricht","an":"sub","text":"Nichts. Wollte nur sehen, ob du zusammenzuckst."}]
  },
  {
    "id":"reg-s002",
    "name":"Countdown ins Nichts",
    "aktiv":false,
    "ausloeser":{"typ":"zufallszeit","zeitfenster_von":"14:00","zeitfenster_bis":"18:00","wahrscheinlichkeit":30},
    "bedingungen":[],
    "aktionen":[{"typ":"timer_starten","an":"sub","dauer":"120min","text_bei_ablauf":"Zeit um. Geh ins Schlafzimmer."}]
  },
  {
    "id":"reg-s003",
    "name":"Breadcrumb-Serie",
    "aktiv":false,
    "ausloeser":{"typ":"uhrzeit","zeit":"10:00","wochentage":["fr"]},
    "bedingungen":[],
    "aktionen":[
      {"typ":"breadcrumb","text":"Heute Abend.","wo":"home"},
      {"typ":"breadcrumb","text":"Zieh nichts an, was du behalten willst.","wo":"chat"},
      {"typ":"breadcrumb","text":"Und iss vorher etwas.","wo":"spiel"}
    ]
  },
  {
    "id":"reg-s004",
    "name":"Zufallskarte",
    "aktiv":false,
    "ausloeser":{"typ":"zufallszeit","zeitfenster_von":"18:00","zeitfenster_bis":"22:00","wahrscheinlichkeit":20},
    "bedingungen":[{"typ":"beide_zuhause"},{"typ":"ampel_ist","wer":"sub","farbe":"gruen"}],
    "aktionen":[{"typ":"karte_ziehen","deck":"zufall","an":"beide"}]
  },
  {
    "id":"reg-s005",
    "name":"Die Wartezeit",
    "aktiv":false,
    "ausloeser":{"typ":"button_gedrueckt","wer":"sub"},
    "bedingungen":[{"typ":"wahrscheinlichkeit","prozent":40}],
    "aktionen":[{"typ":"benachrichtigung","an":"sub","text":"Deine Anfrage wurde registriert."},{"typ":"timer_starten","an":"sub","dauer":"90min","text_bei_ablauf":"Antwort: nein."}]
  }
]
```

### Fürsorge & Balance

```json
[
  {
    "id":"reg-f001",
    "name":"Safeword-Protokoll",
    "aktiv":true,
    "ausloeser":{"typ":"safeword","farbe":"rot"},
    "bedingungen":[],
    "aktionen":[
      {"typ":"app_modus","modus":"ruhe"},
      {"typ":"regel_deaktivieren","regel_id":"alle","dauer":"24h"},
      {"typ":"domme_alarm","text":"Safeword Rot. Alle Regeln pausiert."},
      {"typ":"regie_vorschlagen","skript_id":"reg-009","an":"beide"}
    ]
  },
  {
    "id":"reg-f002",
    "name":"Gelb-Anpassung",
    "aktiv":true,
    "ausloeser":{"typ":"safeword","farbe":"gelb"},
    "bedingungen":[],
    "aktionen":[
      {"typ":"app_modus","modus":"reduziert"},
      {"typ":"domme_alarm","text":"Gelb. Intensität automatisch auf max. 2 gesetzt."}
    ]
  },
  {
    "id":"reg-f003",
    "name":"Zu lange nichts",
    "aktiv":true,
    "ausloeser":{"typ":"keine_session","tage":10},
    "bedingungen":[],
    "aktionen":[
      {"typ":"benachrichtigung","an":"beide","text":"Zehn Tage. Alles okay bei euch? Kein Vorwurf — nur eine Frage."}
    ]
  },
  {
    "id":"reg-f004",
    "name":"Nach intensiven Sessions",
    "aktiv":true,
    "ausloeser":{"typ":"session_geloggt","bewertung_min":1},
    "bedingungen":[],
    "aktionen":[{"typ":"regie_vorschlagen","skript_id":"reg-009","an":"beide"}]
  },
  {
    "id":"reg-f005",
    "name":"Ampel Rot respektieren",
    "aktiv":true,
    "ausloeser":{"typ":"ampel_wechsel","wer":"beliebig","auf_farbe":"rot"},
    "bedingungen":[],
    "aktionen":[
      {"typ":"regel_deaktivieren","regel_id":"automatische_challenges","dauer":"bis_ampel_wechselt"},
      {"typ":"benachrichtigung","an":"beide","text":"Ampel steht auf Rot. Heute läuft nichts automatisch."}
    ]
  },
  {
    "id":"reg-f006",
    "name":"Der Morgen danach",
    "aktiv":true,
    "ausloeser":{"typ":"uhrzeit","zeit":"09:00","wochentage":["alle"]},
    "bedingungen":[{"typ":"letzte_session_vor","stunden":12}],
    "aktionen":[{"typ":"nachricht","an":"sub","text":"Wie geht's dir heute Morgen? Ehrlich."}]
  }
]
```

### Distanz

```json
[
  {
    "id":"reg-d001",
    "name":"Getrennt seit 24 Stunden",
    "aktiv":false,
    "ausloeser":{"typ":"getrennt_seit","stunden":24},
    "bedingungen":[],
    "aktionen":[{"typ":"karte_ziehen","deck":"distanz","an":"sub"}]
  },
  {
    "id":"reg-d002",
    "name":"Foto-Auftrag bei Trennung",
    "aktiv":false,
    "ausloeser":{"typ":"zufallszeit","zeitfenster_von":"10:00","zeitfenster_bis":"20:00","wahrscheinlichkeit":50},
    "bedingungen":[{"typ":"getrennt"}],
    "aktionen":[{"typ":"befehl","an":"sub","text":"Foto. Jetzt. Du weißt, was ich sehen will.","timer_min":10}]
  },
  {
    "id":"reg-d003",
    "name":"Gute-Nacht-Ritual",
    "aktiv":false,
    "ausloeser":{"typ":"uhrzeit","zeit":"22:30","wochentage":["alle"]},
    "bedingungen":[{"typ":"getrennt"}],
    "aktionen":[{"typ":"nachricht","an":"sub","text":"Schlaf gut. Und du weißt, dass du dich nicht anfassen darfst."}]
  }
]
```

### Meta & Spielerisches

```json
[
  {
    "id":"reg-m001",
    "name":"Freitags-Rad",
    "aktiv":false,
    "ausloeser":{"typ":"uhrzeit","zeit":"20:00","wochentage":["fr"]},
    "bedingungen":[{"typ":"beide_zuhause"},{"typ":"ampel_ist","wer":"sub","farbe":"gruen"}],
    "aktionen":[{"typ":"rad_drehen","rad":"vollprogramm","an":"beide"}]
  },
  {
    "id":"reg-m002",
    "name":"Level-Up-Feier",
    "aktiv":true,
    "ausloeser":{"typ":"level_up","level":"beliebig"},
    "bedingungen":[],
    "aktionen":[
      {"typ":"los_vergeben","an":"sub","serie":"belohnung","seltenheit_min":2},
      {"typ":"benachrichtigung","an":"beide","text":"Level-Up. Neuer Rang freigeschaltet."}
    ]
  },
  {
    "id":"reg-m003",
    "name":"Jahrestag",
    "aktiv":true,
    "ausloeser":{"typ":"datum","datum":"[EINTRAGEN]","jaehrlich":true},
    "bedingungen":[],
    "aktionen":[
      {"typ":"los_vergeben","an":"beide","serie":"jahrestag","seltenheit_min":4},
      {"typ":"nachricht","an":"beide","text":"Heute ist unser Tag."}
    ]
  },
  {
    "id":"reg-m004",
    "name":"Ignorierte Nachricht",
    "aktiv":false,
    "ausloeser":{"typ":"nachricht_ungelesen","minuten":60},
    "bedingungen":[{"typ":"uhrzeit_zwischen","von":"08:00","bis":"22:00"}],
    "aktionen":[{"typ":"karma_aendern","wert":-1},{"typ":"nachricht","an":"sub","text":"Eine Stunde. Ich warte nicht gern."}]
  },
  {
    "id":"reg-m005",
    "name":"Monatliche Grenzen-Prüfung",
    "aktiv":true,
    "ausloeser":{"typ":"uhrzeit","zeit":"18:00","wochentage":["so"]},
    "bedingungen":[{"typ":"wahrscheinlichkeit","prozent":25}],
    "aktionen":[{"typ":"benachrichtigung","an":"beide","text":"Schaut euch mal wieder die Grenzen-Map an. Hat sich was verschoben?"}]
  }
]
```

---

## Regel-Ketten

Regeln können sich gegenseitig auslösen. Beispiel für eine Kette, die über Tage läuft:

```json
{
  "beispiel_kette": {
    "name": "Die Woche der Steigerung",
    "beschreibung": "Baut über sieben Tage auf. Jeder Tag hängt vom vorherigen ab.",
    "regeln": [
      {"tag":1,"ausloeser":"manuell","aktion":"Aufgabe: einmal. Bei Erfolg → Tag 2 aktivieren"},
      {"tag":2,"ausloeser":"task_erledigt","aktion":"Aufgabe: einmal + Edging. Bei Erfolg → Tag 3"},
      {"tag":3,"ausloeser":"task_erledigt","aktion":"Aufgabe: zweimal. Bei Erfolg → Tag 4"},
      {"tag":4,"ausloeser":"task_erledigt","aktion":"Ruhetag. Kein Orgasmus erlaubt. → Tag 5"},
      {"tag":5,"ausloeser":"uhrzeit","aktion":"Aufgabe: zweimal + Session-Regie. Bei Erfolg → Tag 6"},
      {"tag":6,"ausloeser":"task_erledigt","aktion":"Boss-Fight. Bei Erfolg → Tag 7"},
      {"tag":7,"ausloeser":"task_erledigt","aktion":"Belohnung: Jackpot-Los + freier Abend"}
    ],
    "abbruch": "Bei Ampel Rot oder Safeword bricht die Kette ohne Konsequenz ab"
  }
}
```

---

## Sicherungen

Wichtig — ein automatisiertes System braucht Notbremsen:

```json
{
  "sicherungen": [
    {"key":"safeword_override","beschreibung":"Safeword Rot pausiert ALLE Regeln für 24h. Nicht abschaltbar.","fest":true},
    {"key":"ampel_rot_stopp","beschreibung":"Ampel Rot deaktiviert alle Regeln mit Intensität > 1","fest":true},
    {"key":"nachtruhe","beschreibung":"Zwischen 23:00 und 07:00 feuern keine Regeln, außer explizit erlaubt","fest":false,"standard":true},
    {"key":"max_pro_tag","beschreibung":"Maximal X automatische Aktionen pro Tag","fest":false,"standard":5},
    {"key":"master_schalter","beschreibung":"Ein Schalter deaktiviert die gesamte Maschine","fest":true},
    {"key":"protokoll","beschreibung":"Jede ausgelöste Regel wird protokolliert und ist einsehbar","fest":true},
    {"key":"kein_kaskaden_loop","beschreibung":"Eine Regel kann sich nicht selbst auslösen; max. 3 Kettenglieder pro Auslösung","fest":true},
    {"key":"sub_einsicht","beschreibung":"Kevin kann sehen DASS Regeln existieren, aber nicht WELCHE — außer Gioia gibt sie frei","fest":false,"standard":true}
  ]
}
```

---

## Implementierungs-Hinweise

1. **Ausführung:** Zeitbasierte Trigger brauchen einen Scheduler. Ohne eigenen Server geht das über Firebase Cloud Functions (kostenloser Tier reicht) oder — einfacher — die App prüft beim Öffnen und im Hintergrund via Service Worker, ob fällige Regeln offen sind.
2. **Zufallszeit-Trigger:** Beim Tageswechsel würfelt die App die konkreten Zeitpunkte für alle Zufalls-Regeln aus und legt sie als geplante Events ab. So ist es wirklich unvorhersehbar, aber technisch planbar.
3. **Regel-Editor:** Visueller Baukasten. Drei Spalten: WENN / UND / DANN. Dropdowns statt Freitext, wo möglich. Sofortige Vorschau als Satz: *"Wenn eine Aufgabe verpasst wird, und die Ampel auf Grün steht, dann Karma -2 und Strafe hinzufügen."*
4. **Testlauf:** Jede Regel hat einen "Jetzt testen"-Button, der sie einmal ausführt, ohne dass sie scharf geschaltet werden muss.
5. **Protokoll:** Eine Seite zeigt, was wann gefeuert hat. Für Gioia vollständig, für Kevin nur die Ereignisse, die ihn betrafen — ohne die Regel dahinter zu zeigen.
6. **Import/Export:** Regeln als JSON exportierbar, damit man sie sichern oder neu aufsetzen kann.
7. **Konflikt-Erkennung:** Wenn zwei Regeln sich widersprechen (eine aktiviert eine Regel, die andere deaktiviert sie), warnt der Editor beim Speichern.
