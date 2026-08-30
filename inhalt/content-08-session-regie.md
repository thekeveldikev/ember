# EMBER — Content-Datei 08: Die Session-Regie

## Warum das etwas völlig anderes ist

Alle bisherigen Features geben euch **vorher** etwas: eine Karte, ein Ergebnis, ein Szenario. Danach legt ihr das Handy weg und macht euer Ding.

Die Session-Regie läuft **währenddessen**. Sie ist ein Dirigent: Ein Skript mit zeitgesteuerten Schritten, das live durchläuft. Das Handy liegt daneben, der Bildschirm zeigt jeweils nur den aktuellen Schritt, ein Timer läuft, und beim Ablauf wechselt es automatisch weiter. Optional mit Vibrations-Signal oder Ton beim Wechsel.

Der Effekt: **Keiner von euch entscheidet mehr.** Ihr folgt beide. Für Gioia bedeutet das, dass sie die Kontrolle abgeben kann, ohne sie an Kevin abzugeben — sie hat das Skript vorher ausgesucht. Für Kevin bedeutet es maximale Ungewissheit, weil er den nächsten Schritt nie sieht.

### Anzeige-Modi

| Modus | Beschreibung |
|---|---|
| `beide` | Beide sehen den aktuellen Schritt |
| `nur_domme` | Nur Gioia sieht das Skript, sie gibt die Anweisungen mündlich weiter |
| `nur_sub` | Nur Kevin sieht es — er führt aus, sie lässt sich überraschen |
| `getrennt` | Jeder sieht eine eigene Anweisung pro Schritt (unterschiedliche Rollen) |

### Format

```
Skript
├── meta (name, dauer, intensität, benötigt)
└── schritte []
    ├── dauer_sek
    ├── text_domme
    ├── text_sub
    ├── signal (vibration | ton | still)
    └── typ (aufbau | aktion | pause | wechsel | finale)
```

---

## Skript 1: „Aufwärmen" (12 Minuten, Intensität 2)

```json
{
  "id": "reg-001",
  "name": "Aufwärmen",
  "beschreibung": "Sanfter Einstieg. Gut für Abende, an denen niemand weiß, ob überhaupt was passieren soll.",
  "gesamtdauer_min": 12,
  "intensitaet": 2,
  "anzeige": "beide",
  "benoetigt": [],
  "schritte": [
    {"nr":1,"dauer_sek":60,"text_domme":"Setzt euch gegenüber. Nichts sagen. Nur anschauen.","text_sub":"Setz dich mir gegenüber. Sag nichts. Schau mich an.","signal":"still","typ":"aufbau"},
    {"nr":2,"dauer_sek":90,"text_domme":"Fahr ihm mit einer Hand übers Gesicht, den Hals, die Schultern. Er darf sich nicht bewegen.","text_sub":"Halt still. Bewege dich nicht, egal was passiert.","signal":"vibration","typ":"aktion"},
    {"nr":3,"dauer_sek":90,"text_domme":"Jetzt er. Er darf dich anfassen — nur mit einer Hand, nur oberhalb der Schultern.","text_sub":"Fass sie an. Eine Hand. Nur oberhalb der Schultern.","signal":"vibration","typ":"wechsel"},
    {"nr":4,"dauer_sek":120,"text_domme":"Küssen. Er darf die Hände nicht benutzen.","text_sub":"Küss sie. Hände hinter dem Rücken.","signal":"vibration","typ":"aktion"},
    {"nr":5,"dauer_sek":30,"text_domme":"Stopp. Beide Hände weg. Nur atmen.","text_sub":"Stopp. Hände weg. Atmen.","signal":"ton","typ":"pause"},
    {"nr":6,"dauer_sek":120,"text_domme":"Zieh ihm ein Kleidungsstück aus. Deine Wahl.","text_sub":"Halt still.","signal":"vibration","typ":"aktion"},
    {"nr":7,"dauer_sek":180,"text_domme":"Er zieht dich aus. Langsam. Bei jedem Teil küsst er die Stelle, die frei wird.","text_sub":"Zieh sie aus. Langsam. Bei jedem Teil küsst du die Stelle, die frei wird.","signal":"vibration","typ":"aktion"},
    {"nr":8,"dauer_sek":30,"text_domme":"Ende der Regie. Ab hier entscheidest du.","text_sub":"Ende der Regie.","signal":"ton","typ":"finale"}
  ]
}
```

---

## Skript 2: „Langsam" (25 Minuten, Intensität 3)

```json
{
  "id": "reg-002",
  "name": "Langsam",
  "beschreibung": "Alles doppelt so langsam wie sonst. Testet Geduld auf beiden Seiten.",
  "gesamtdauer_min": 25,
  "intensitaet": 3,
  "anzeige": "beide",
  "benoetigt": ["Öl oder Lotion"],
  "schritte": [
    {"nr":1,"dauer_sek":120,"text_domme":"Er liegt auf dem Bauch. Du machst nichts. Nur zwei Minuten neben ihm sitzen.","text_sub":"Leg dich auf den Bauch. Warte.","signal":"still","typ":"aufbau"},
    {"nr":2,"dauer_sek":300,"text_domme":"Massiere seinen Rücken. Mit Öl. Fünf Minuten, kein Wort.","text_sub":"Nichts tun. Nichts sagen.","signal":"vibration","typ":"aktion"},
    {"nr":3,"dauer_sek":180,"text_domme":"Weiter runter. Beine, Kniekehlen, Füße. Immer noch kein Wort.","text_sub":"Weiter stillhalten.","signal":"vibration","typ":"aktion"},
    {"nr":4,"dauer_sek":60,"text_domme":"Dreh ihn um. Schau ihn an. Sag nichts.","text_sub":"Dreh dich um wenn sie dich dreht.","signal":"ton","typ":"wechsel"},
    {"nr":5,"dauer_sek":240,"text_domme":"Fahr ihn mit den Fingerspitzen ab. Überall — außer da, wo er es am meisten will.","text_sub":"Halt still. Auch wenn es schwer wird.","signal":"vibration","typ":"aktion"},
    {"nr":6,"dauer_sek":60,"text_domme":"Stopp. Hände weg. Er darf sich immer noch nicht bewegen.","text_sub":"Stopp. Nicht bewegen.","signal":"ton","typ":"pause"},
    {"nr":7,"dauer_sek":300,"text_domme":"Jetzt darfst du hin. Aber so langsam wie irgend möglich.","text_sub":"Halt aus.","signal":"vibration","typ":"aktion"},
    {"nr":8,"dauer_sek":120,"text_domme":"Stopp. Fünf Minuten Pause. Nur nebeneinander liegen.","text_sub":"Stopp. Pause. Nichts machen.","signal":"ton","typ":"pause"},
    {"nr":9,"dauer_sek":120,"text_domme":"Er darf jetzt reden. Er sagt dir genau, was er will.","text_sub":"Sag ihr jetzt, was du willst. Genau. Ohne Umschweife.","signal":"vibration","typ":"wechsel"},
    {"nr":10,"dauer_sek":10,"text_domme":"Ende der Regie. Du entscheidest, ob er es bekommt.","text_sub":"Ende der Regie.","signal":"ton","typ":"finale"}
  ]
}
```

---

## Skript 3: „Das Countdown-Spiel" (30 Minuten, Intensität 4)

```json
{
  "id": "reg-003",
  "name": "Das Countdown-Spiel",
  "beschreibung": "Immer kürzere Intervalle, immer schnellere Wechsel. Baut Druck auf.",
  "gesamtdauer_min": 30,
  "intensitaet": 4,
  "anzeige": "beide",
  "benoetigt": [],
  "schritte": [
    {"nr":1,"dauer_sek":300,"text_domme":"Fünf Minuten: Küssen und Anfassen. Sonst nichts.","text_sub":"Fünf Minuten. Küssen und Anfassen. Nicht mehr.","signal":"vibration","typ":"aufbau"},
    {"nr":2,"dauer_sek":240,"text_domme":"Vier Minuten: Er geht runter.","text_sub":"Vier Minuten. Geh runter.","signal":"vibration","typ":"aktion"},
    {"nr":3,"dauer_sek":180,"text_domme":"Drei Minuten: Rollentausch. Du bist dran.","text_sub":"Drei Minuten. Sie ist dran.","signal":"ton","typ":"wechsel"},
    {"nr":4,"dauer_sek":120,"text_domme":"Zwei Minuten: Position deiner Wahl.","text_sub":"Zwei Minuten. Ihre Wahl.","signal":"vibration","typ":"aktion"},
    {"nr":5,"dauer_sek":60,"text_domme":"Eine Minute: So hart wie er kann.","text_sub":"Eine Minute. So hart du kannst.","signal":"vibration","typ":"aktion"},
    {"nr":6,"dauer_sek":30,"text_domme":"Dreißig Sekunden: Stopp. Nichts. Nur atmen.","text_sub":"Stopp. Atmen.","signal":"ton","typ":"pause"},
    {"nr":7,"dauer_sek":300,"text_domme":"Und wieder von vorn: Fünf Minuten, aber jetzt bestimmst du alles.","text_sub":"Wieder fünf Minuten. Sie bestimmt.","signal":"vibration","typ":"aktion"},
    {"nr":8,"dauer_sek":240,"text_domme":"Vier Minuten: Er darf sich nicht bewegen. Du machst alles.","text_sub":"Vier Minuten. Nicht bewegen.","signal":"vibration","typ":"aktion"},
    {"nr":9,"dauer_sek":180,"text_domme":"Drei Minuten: Er darf betteln.","text_sub":"Drei Minuten. Du darfst betteln.","signal":"vibration","typ":"aktion"},
    {"nr":10,"dauer_sek":120,"text_domme":"Zwei Minuten: Du entscheidest, ob er darf.","text_sub":"Zwei Minuten. Sie entscheidet.","signal":"vibration","typ":"finale"},
    {"nr":11,"dauer_sek":30,"text_domme":"Ende.","text_sub":"Ende.","signal":"ton","typ":"finale"}
  ]
}
```

---

## Skript 4: „Edging-Programm" (45 Minuten, Intensität 5)

```json
{
  "id": "reg-004",
  "name": "Edging-Programm",
  "beschreibung": "Strukturiertes Ausdauertraining. Fünf Runden mit fest getakteten Pausen.",
  "gesamtdauer_min": 45,
  "intensitaet": 5,
  "anzeige": "nur_domme",
  "benoetigt": ["Öl oder Gleitmittel"],
  "schritte": [
    {"nr":1,"dauer_sek":180,"text_domme":"Aufwärmen. Ganz langsam. Er soll noch weit weg sein.","text_sub":"","signal":"vibration","typ":"aufbau"},
    {"nr":2,"dauer_sek":300,"text_domme":"Runde 1: Bring ihn hoch. Er sagt Bescheid, bevor es zu spät ist.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":3,"dauer_sek":120,"text_domme":"Pause 1. Hände komplett weg. Zwei Minuten.","text_sub":"","signal":"ton","typ":"pause"},
    {"nr":4,"dauer_sek":300,"text_domme":"Runde 2: Schneller als beim ersten Mal.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":5,"dauer_sek":120,"text_domme":"Pause 2. Zwei Minuten. Rede mit ihm, aber fass ihn nicht an.","text_sub":"","signal":"ton","typ":"pause"},
    {"nr":6,"dauer_sek":300,"text_domme":"Runde 3: Jetzt mit dem Mund.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":7,"dauer_sek":180,"text_domme":"Pause 3. Drei Minuten. Lass ihn warten.","text_sub":"","signal":"ton","typ":"pause"},
    {"nr":8,"dauer_sek":300,"text_domme":"Runde 4: Er macht es selbst. Du gibst das Tempo vor.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":9,"dauer_sek":180,"text_domme":"Pause 4. Er bettelt jetzt. Drei Minuten lang.","text_sub":"","signal":"ton","typ":"pause"},
    {"nr":10,"dauer_sek":600,"text_domme":"Runde 5: Letzte Runde. Du entscheidest am Ende, ob er darf. Münzwurf ist auch erlaubt.","text_sub":"","signal":"vibration","typ":"finale"},
    {"nr":11,"dauer_sek":60,"text_domme":"Ende. Egal wie du entschieden hast — bleib danach bei ihm.","text_sub":"","signal":"ton","typ":"finale"}
  ]
}
```

---

## Skript 5: „Blind" (20 Minuten, Intensität 4)

```json
{
  "id": "reg-005",
  "name": "Blind",
  "beschreibung": "Er sieht nichts. Sensorisches Programm mit wechselnden Reizen.",
  "gesamtdauer_min": 20,
  "intensitaet": 4,
  "anzeige": "nur_domme",
  "benoetigt": ["Augenbinde", "Eiswürfel", "Feder oder etwas Weiches", "etwas Warmes"],
  "schritte": [
    {"nr":1,"dauer_sek":60,"text_domme":"Augenbinde auf. Dann lass ihn eine Minute einfach so liegen.","text_sub":"","signal":"still","typ":"aufbau"},
    {"nr":2,"dauer_sek":120,"text_domme":"Nur deine Hände. Langsam, unvorhersehbar.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":3,"dauer_sek":120,"text_domme":"Wechsel zu etwas Weichem. Feder, Stoff, was du hast.","text_sub":"","signal":"vibration","typ":"wechsel"},
    {"nr":4,"dauer_sek":90,"text_domme":"Eis. Er weiß nicht, wo du als Nächstes hingehst.","text_sub":"","signal":"vibration","typ":"wechsel"},
    {"nr":5,"dauer_sek":60,"text_domme":"Nichts. Eine Minute lang gar nichts. Geh weg vom Bett, er soll dich nicht hören.","text_sub":"","signal":"ton","typ":"pause"},
    {"nr":6,"dauer_sek":90,"text_domme":"Etwas Warmes. Kontrast zum Eis.","text_sub":"","signal":"vibration","typ":"wechsel"},
    {"nr":7,"dauer_sek":120,"text_domme":"Nur dein Mund. Überall, aber unregelmäßig.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":8,"dauer_sek":120,"text_domme":"Er soll raten, womit du ihn gerade berührst. Bei jedem Fehler machst du weiter.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":9,"dauer_sek":180,"text_domme":"Freie Wahl. Nutze alles, was du bis jetzt benutzt hast, in schneller Folge.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":10,"dauer_sek":60,"text_domme":"Augenbinde ab. Erste Sache, die er sieht, bist du.","text_sub":"","signal":"ton","typ":"finale"}
  ]
}
```

---

## Skript 6: „Rollentausch-Regie" (20 Minuten, Intensität 3)

```json
{
  "id": "reg-006",
  "name": "Rollentausch",
  "beschreibung": "Alle drei Minuten wechselt, wer bestimmt. Für Abende, an denen ihr beide nicht führen wollt.",
  "gesamtdauer_min": 20,
  "intensitaet": 3,
  "anzeige": "getrennt",
  "benoetigt": [],
  "schritte": [
    {"nr":1,"dauer_sek":180,"text_domme":"Du führst. Drei Minuten. Er macht was du sagst.","text_sub":"Sie führt. Du machst was sie sagt.","signal":"vibration","typ":"aktion"},
    {"nr":2,"dauer_sek":180,"text_domme":"Wechsel. Er führt jetzt. Du machst mit.","text_sub":"Wechsel. Du führst. Drei Minuten.","signal":"ton","typ":"wechsel"},
    {"nr":3,"dauer_sek":180,"text_domme":"Zurück zu dir. Und diesmal härter.","text_sub":"Zurück zu ihr.","signal":"ton","typ":"wechsel"},
    {"nr":4,"dauer_sek":180,"text_domme":"Er führt. Er darf alles, was er in den letzten Minuten gelernt hat.","text_sub":"Du führst. Nutze alles, was du gerade gelernt hast.","signal":"ton","typ":"wechsel"},
    {"nr":5,"dauer_sek":120,"text_domme":"Beide gleichzeitig. Keiner führt.","text_sub":"Beide gleichzeitig. Keiner führt.","signal":"vibration","typ":"aktion"},
    {"nr":6,"dauer_sek":300,"text_domme":"Du führst bis zum Ende. Endgültig.","text_sub":"Sie führt bis zum Ende.","signal":"ton","typ":"finale"},
    {"nr":7,"dauer_sek":60,"text_domme":"Ende.","text_sub":"Ende.","signal":"ton","typ":"finale"}
  ]
}
```

---

## Skript 7: „Der lange Abend" (90 Minuten, Intensität 5)

```json
{
  "id": "reg-007",
  "name": "Der lange Abend",
  "beschreibung": "Ein durchgetakteter Abend mit echten Pausen dazwischen. Nicht durchgehend Sex — sondern ein Abend, der davon durchzogen ist.",
  "gesamtdauer_min": 90,
  "intensitaet": 5,
  "anzeige": "nur_domme",
  "benoetigt": ["Zeit", "keine Termine danach"],
  "schritte": [
    {"nr":1,"dauer_sek":600,"text_domme":"Ganz normal zusammen sitzen. Reden, essen, was auch immer. Aber sag ihm, dass es losgeht.","text_sub":"","signal":"still","typ":"aufbau"},
    {"nr":2,"dauer_sek":300,"text_domme":"Fass ihn nebenbei an. Als wäre nichts. Er darf nicht reagieren.","text_sub":"","signal":"vibration","typ":"aufbau"},
    {"nr":3,"dauer_sek":600,"text_domme":"Weitermachen wie vorher. Ignorier ihn komplett.","text_sub":"","signal":"ton","typ":"pause"},
    {"nr":4,"dauer_sek":900,"text_domme":"Erste richtige Runde. Nimm dir was du willst.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":5,"dauer_sek":900,"text_domme":"Pause. Fünfzehn Minuten. Steh auf, mach was anderes. Lass ihn liegen.","text_sub":"","signal":"ton","typ":"pause"},
    {"nr":6,"dauer_sek":900,"text_domme":"Zweite Runde. Anders als die erste.","text_sub":"","signal":"vibration","typ":"aktion"},
    {"nr":7,"dauer_sek":600,"text_domme":"Pause. Duschen, trinken, reden.","text_sub":"","signal":"ton","typ":"pause"},
    {"nr":8,"dauer_sek":1200,"text_domme":"Dritte Runde. Die letzte. Nimm dir Zeit.","text_sub":"","signal":"vibration","typ":"finale"},
    {"nr":9,"dauer_sek":600,"text_domme":"Aftercare. Zehn Minuten mindestens. Nichts anderes.","text_sub":"","signal":"ton","typ":"finale"}
  ]
}
```

---

## Skript 8: „Fernsteuerung" (Distanz, 30 Minuten, Intensität 4)

```json
{
  "id": "reg-008",
  "name": "Fernsteuerung",
  "beschreibung": "Für wenn ihr nicht zusammen seid. Er folgt Anweisungen, sie sieht was er machen soll und kann eingreifen.",
  "gesamtdauer_min": 30,
  "intensitaet": 4,
  "anzeige": "getrennt",
  "benoetigt": ["beide allein und ungestört"],
  "schritte": [
    {"nr":1,"dauer_sek":120,"text_domme":"Er zieht sich aus. Du siehst zu — Foto oder Video, deine Wahl.","text_sub":"Zieh dich aus. Schick ihr ein Foto.","signal":"vibration","typ":"aufbau"},
    {"nr":2,"dauer_sek":180,"text_domme":"Er legt sich hin und fasst sich an. Langsam.","text_sub":"Leg dich hin. Fass dich an. Langsam.","signal":"vibration","typ":"aktion"},
    {"nr":3,"dauer_sek":60,"text_domme":"Stopp. Er hört auf. Du schreibst ihm, was du gerade denkst.","text_sub":"Stopp. Hände weg. Warte auf ihre Nachricht.","signal":"ton","typ":"pause"},
    {"nr":4,"dauer_sek":240,"text_domme":"Weiter. Schneller als vorher.","text_sub":"Weiter. Schneller.","signal":"vibration","typ":"aktion"},
    {"nr":5,"dauer_sek":60,"text_domme":"Stopp. Er sagt dir per Sprachnachricht, wie nah er war.","text_sub":"Stopp. Schick ihr eine Sprachnachricht — wie nah warst du?","signal":"ton","typ":"pause"},
    {"nr":6,"dauer_sek":300,"text_domme":"Weiter. Diesmal bis kurz davor.","text_sub":"Weiter. Bis kurz davor. Nicht weiter.","signal":"vibration","typ":"aktion"},
    {"nr":7,"dauer_sek":120,"text_domme":"Stopp. Zwei Minuten. Er darf nichts machen.","text_sub":"Stopp. Zwei Minuten nichts.","signal":"ton","typ":"pause"},
    {"nr":8,"dauer_sek":300,"text_domme":"Letzte Runde. Du entscheidest, ob er darf — schreib ihm die Entscheidung.","text_sub":"Letzte Runde. Warte auf ihre Entscheidung.","signal":"vibration","typ":"finale"},
    {"nr":9,"dauer_sek":120,"text_domme":"Redet danach. Kurz reicht. Aber redet.","text_sub":"Ruf sie an. Kurz reicht.","signal":"ton","typ":"finale"}
  ]
}
```

---

## Skript 9: „Aftercare-Regie" (15 Minuten, Intensität 1)

```json
{
  "id": "reg-009",
  "name": "Aftercare",
  "beschreibung": "Für nach intensiven Sessions. Strukturiert, damit nichts vergessen wird.",
  "gesamtdauer_min": 15,
  "intensitaet": 1,
  "anzeige": "beide",
  "benoetigt": ["Wasser", "Decke"],
  "schritte": [
    {"nr":1,"dauer_sek":180,"text_domme":"Nichts sagen. Nur nebeneinander liegen. Körperkontakt.","text_sub":"Nichts sagen. Nur liegen.","signal":"still","typ":"aufbau"},
    {"nr":2,"dauer_sek":60,"text_domme":"Wasser. Beide trinken.","text_sub":"Trink etwas.","signal":"ton","typ":"aktion"},
    {"nr":3,"dauer_sek":180,"text_domme":"Frag ihn, wie es ihm geht. Richtig fragen. Und dann zuhören, ohne zu unterbrechen.","text_sub":"Sag ihr ehrlich, wie es dir geht. Auch das Unangenehme.","signal":"vibration","typ":"aktion"},
    {"nr":4,"dauer_sek":180,"text_domme":"Jetzt du. Sag ihm, wie es dir ging. Auch du darfst müde oder überfordert sein.","text_sub":"Hör zu. Nicht kommentieren, nur zuhören.","signal":"ton","typ":"wechsel"},
    {"nr":5,"dauer_sek":120,"text_domme":"Sag ihm eine Sache, die er heute gut gemacht hat. Konkret.","text_sub":"Nimm es an. Nicht abwehren.","signal":"vibration","typ":"aktion"},
    {"nr":6,"dauer_sek":180,"text_domme":"Einfach liegen bleiben. Fertig.","text_sub":"Einfach liegen bleiben.","signal":"still","typ":"finale"}
  ]
}
```

---

## Skript 10: „Morgens, schnell" (8 Minuten, Intensität 3)

```json
{
  "id": "reg-010",
  "name": "Morgens, schnell",
  "beschreibung": "Für Wochentage. Acht Minuten, straff durchgetaktet, funktioniert vor der Arbeit.",
  "gesamtdauer_min": 8,
  "intensitaet": 3,
  "anzeige": "beide",
  "benoetigt": [],
  "schritte": [
    {"nr":1,"dauer_sek":60,"text_domme":"Kein Vorspiel. Küssen, eine Minute, dann direkt.","text_sub":"Küssen. Eine Minute.","signal":"vibration","typ":"aufbau"},
    {"nr":2,"dauer_sek":120,"text_domme":"Er macht dich fertig. Zwei Minuten. Er hat nicht mehr.","text_sub":"Zwei Minuten. Mach sie fertig.","signal":"vibration","typ":"aktion"},
    {"nr":3,"dauer_sek":240,"text_domme":"Vier Minuten für ihn. Position deiner Wahl.","text_sub":"Vier Minuten. Ihre Wahl.","signal":"vibration","typ":"aktion"},
    {"nr":4,"dauer_sek":60,"text_domme":"Letzte Minute. Wenn er es nicht schafft, hat er Pech.","text_sub":"Letzte Minute.","signal":"vibration","typ":"finale"},
    {"nr":5,"dauer_sek":30,"text_domme":"Ende. Aufstehen.","text_sub":"Ende. Aufstehen.","signal":"ton","typ":"finale"}
  ]
}
```

---

## Bausteine für eigene Skripte

Damit Gioia schnell eigene Regien bauen kann, ohne jeden Schritt zu tippen:

```json
{
  "bausteine": [
    {"key":"aufwaermen_60","text":"Küssen und Anfassen","dauer_sek":60,"typ":"aufbau"},
    {"key":"aufwaermen_180","text":"Küssen und Anfassen, ausgiebig","dauer_sek":180,"typ":"aufbau"},
    {"key":"strip_er","text":"Er zieht sich aus","dauer_sek":90,"typ":"aufbau"},
    {"key":"strip_sie","text":"Er zieht sie aus","dauer_sek":120,"typ":"aufbau"},
    {"key":"massage_ruecken","text":"Rückenmassage","dauer_sek":300,"typ":"aktion"},
    {"key":"oral_sie","text":"Er geht runter","dauer_sek":300,"typ":"aktion"},
    {"key":"oral_er","text":"Sie geht runter","dauer_sek":300,"typ":"aktion"},
    {"key":"haende","text":"Nur mit den Händen","dauer_sek":240,"typ":"aktion"},
    {"key":"penetration","text":"Position ihrer Wahl","dauer_sek":600,"typ":"aktion"},
    {"key":"pause_kurz","text":"Stopp. Hände weg.","dauer_sek":60,"typ":"pause"},
    {"key":"pause_mittel","text":"Pause. Nichts machen.","dauer_sek":180,"typ":"pause"},
    {"key":"pause_lang","text":"Lange Pause. Steh auf, mach was anderes.","dauer_sek":600,"typ":"pause"},
    {"key":"wechsel","text":"Wechsel. Der andere ist dran.","dauer_sek":10,"typ":"wechsel"},
    {"key":"betteln","text":"Er bettelt","dauer_sek":120,"typ":"aktion"},
    {"key":"stillhalten","text":"Er bewegt sich nicht","dauer_sek":180,"typ":"aktion"},
    {"key":"selbst","text":"Er macht es sich selbst, sie schaut zu","dauer_sek":300,"typ":"aktion"},
    {"key":"finale_frei","text":"Freie Wahl bis zum Ende","dauer_sek":600,"typ":"finale"},
    {"key":"aftercare","text":"Liegen bleiben, reden","dauer_sek":300,"typ":"finale"}
  ]
}
```

---

## Implementierungs-Hinweise

1. **Vollbild-Modus:** Während der Regie läuft die App im Vollbild, Bildschirm bleibt an (`Screen Wake Lock API`). Nur der aktuelle Schritt ist sichtbar, groß, gut lesbar aus zwei Metern Entfernung.
2. **Nächster Schritt versteckt:** Kevin darf nie vorblättern. Gioia hat optional einen "Vorschau"-Button, der ihr die nächsten zwei Schritte zeigt.
3. **Pause/Stopp:** Ein großer Pause-Button und der Safeword-Button sind immer erreichbar. Bei Pause friert der Timer ein.
4. **Signale:** `vibration` = kurzer Doppelimpuls, `ton` = leiser Gong, `still` = nur visueller Wechsel. Alle abschaltbar.
5. **Verlängern/Kürzen:** Gioia kann jeden Schritt live um 30 Sekunden verlängern oder ihn überspringen. Kevin sieht nicht, dass sie es getan hat.
6. **Skript-Editor:** Drag-and-Drop aus den Bausteinen, Dauer per Slider, eigener Text pro Schritt. Skripte speicherbar und benennbar.
7. **Anzeige-Modus `getrennt`:** Braucht zwei Geräte. Jedes zeigt nur den Text für die eigene Rolle. Synchronisiert über Firebase, Timer läuft serverseitig damit beide identisch bleiben.
8. **Nach der Session:** Automatischer Übergang zum Session-Log mit vorausgefüllter Dauer und dem verwendeten Skript. Ein Tap zum Bewerten.
9. **Skript-Historie:** Wie oft wurde welches Skript genutzt, wie wurde es bewertet. Die App kann Vorschläge machen ("Ihr habt 'Langsam' dreimal mit 5 Flammen bewertet — wie wäre es wieder?").
