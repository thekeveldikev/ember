# EMBER — Content-Datei 07: Lose (Rubbellose)

## Konzept

Digitale Rubbellose. Kevin rubbelt mit dem Finger frei, was darunter liegt. Der Reiz liegt in der **Ungewissheit** — nicht jedes Los ist ein Gewinn, und manche sind Fallen.

### Los-Typen

| Typ | Beschreibung |
|---|---|
| `sofort` | Sofort einlösbar, passiert jetzt |
| `gutschein` | Wird gespeichert, später einlösbar |
| `niete` | Nichts. Die Enttäuschung ist Teil des Spiels |
| `falle` | Negativ — Strafe, Entzug, Aufgabe |
| `zeitschloss` | Erst ab einem bestimmten Datum/Zeitpunkt einlösbar |
| `bedingt` | Nur einlösbar wenn eine Bedingung erfüllt ist |
| `blind` | Gioia schreibt den Inhalt erst, wenn er freigerubbelt wird |
| `wildcard` | Verweist auf ein anderes System (Rad, Deck, Liste) |
| `jackpot` | Selten, groß |
| `handel` | Übertragbar oder eintauschbar |

### Seltenheiten

| Stufe | Farbe | Wahrscheinlichkeit | Bezeichnung |
|---|---|---|---|
| 1 | Grau | 40% | Standard |
| 2 | Bronze | 30% | Gut |
| 3 | Silber | 18% | Selten |
| 4 | Gold | 10% | Sehr selten |
| 5 | Rotgold | 2% | Jackpot |

### Format

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Eindeutig |
| `text` | string | Was unter der Rubbelschicht steht |
| `typ` | string | Siehe Los-Typen |
| `seltenheit` | int 1–5 | |
| `einloesbar_bis` | string\|null | `null` = unbegrenzt, sonst `"7d"`, `"30d"` etc. |
| `bedingung` | string\|null | Nur bei `typ: bedingt` |
| `verweis` | string\|null | Nur bei `typ: wildcard` — auf welches System |
| `tags` | array | |

---

## Typ: SOFORT (wird jetzt eingelöst)

```json
[
  {"id":"los-s001","text":"Ein Kuss. Jetzt sofort. So lange du willst.","typ":"sofort","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["kuss"]},
  {"id":"los-s002","text":"Zehn Minuten Massage. Für dich.","typ":"sofort","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["massage"]},
  {"id":"los-s003","text":"Ich ziehe ein Kleidungsstück aus. Du darfst wählen welches.","typ":"sofort","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["strip"]},
  {"id":"los-s004","text":"Du darfst mich fünf Minuten lang anfassen, wo du willst.","typ":"sofort","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["beruehrung"]},
  {"id":"los-s005","text":"Ich sage dir jetzt fünf Dinge, die ich an dir liebe. Und du hörst zu ohne zu unterbrechen.","typ":"sofort","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["worte"]},
  {"id":"los-s006","text":"Oral. Jetzt. Für dich.","typ":"sofort","seltenheit":4,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["oral"]},
  {"id":"los-s007","text":"Zieh dich aus und knie dich hin. Der Rest kommt gleich.","typ":"sofort","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["ds"]},
  {"id":"los-s008","text":"Ein Foto von mir. Jetzt. Du sagst wovon.","typ":"sofort","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["foto"]},
  {"id":"los-s009","text":"Du darfst mir jetzt eine Frage stellen. Jede. Und ich antworte ehrlich.","typ":"sofort","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["wahrheit"]},
  {"id":"los-s010","text":"Ein Punkt aufs Karma-Konto. Sofort gutgeschrieben.","typ":"sofort","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["karma"]},
  {"id":"los-s011","text":"Fünf Minuten kuscheln. Nichts anderes. Sofort.","typ":"sofort","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["naehe"]},
  {"id":"los-s012","text":"Du darfst dich jetzt anfassen. Ich schaue zu.","typ":"sofort","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["masturbation"]}
]
```

---

## Typ: GUTSCHEIN (später einlösbar)

```json
[
  {"id":"los-g001","text":"Gutschein: Ein Abend, an dem du bestimmst.","typ":"gutschein","seltenheit":4,"einloesbar_bis":"30d","bedingung":null,"verweis":null,"tags":["kontrolle","gross"]},
  {"id":"los-g002","text":"Gutschein: Eine Fantasie deiner Wahl wird umgesetzt.","typ":"gutschein","seltenheit":5,"einloesbar_bis":"60d","bedingung":null,"verweis":null,"tags":["fantasie","jackpot"]},
  {"id":"los-g003","text":"Gutschein: Eine Strafe wird gestrichen. Du wählst welche.","typ":"gutschein","seltenheit":4,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["erlass"]},
  {"id":"los-g004","text":"Gutschein: Ganzkörpermassage mit Öl. Vierzig Minuten. Einlösbar wann du willst.","typ":"gutschein","seltenheit":3,"einloesbar_bis":"30d","bedingung":null,"verweis":null,"tags":["massage"]},
  {"id":"los-g005","text":"Gutschein: Einmal 'Nein' sagen dürfen. Ohne Konsequenz.","typ":"gutschein","seltenheit":4,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["joker","gross"]},
  {"id":"los-g006","text":"Gutschein: Ein Frühstück ans Bett. Du bestimmst den Tag.","typ":"gutschein","seltenheit":2,"einloesbar_bis":"30d","bedingung":null,"verweis":null,"tags":["verwoehnen"]},
  {"id":"los-g007","text":"Gutschein: Deine Lieblingsposition, so lange du willst.","typ":"gutschein","seltenheit":3,"einloesbar_bis":"14d","bedingung":null,"verweis":null,"tags":["wunsch"]},
  {"id":"los-g008","text":"Gutschein: Eine Regel wird für 24 Stunden ausgesetzt. Du wählst welche.","typ":"gutschein","seltenheit":4,"einloesbar_bis":"30d","bedingung":null,"verweis":null,"tags":["freiheit"]},
  {"id":"los-g009","text":"Gutschein: Ein Kinoabend nach deiner Wahl. Film, Essen, alles.","typ":"gutschein","seltenheit":2,"einloesbar_bis":"30d","bedingung":null,"verweis":null,"tags":["date"]},
  {"id":"los-g010","text":"Gutschein: Du darfst mir eine Aufgabe geben. Eine. Ich mache sie.","typ":"gutschein","seltenheit":5,"einloesbar_bis":"30d","bedingung":null,"verweis":null,"tags":["rollentausch","jackpot"]},
  {"id":"los-g011","text":"Gutschein: Ein Bad, das ich dir einlasse. Inklusive Bedienung.","typ":"gutschein","seltenheit":2,"einloesbar_bis":"30d","bedingung":null,"verweis":null,"tags":["pflege"]},
  {"id":"los-g012","text":"Gutschein: Eine Nacht ohne Regeln. Komplett.","typ":"gutschein","seltenheit":5,"einloesbar_bis":"60d","bedingung":null,"verweis":null,"tags":["freiheit","jackpot"]},
  {"id":"los-g013","text":"Gutschein: Einmal beim Rad-Drehen neu würfeln dürfen.","typ":"gutschein","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["meta"]},
  {"id":"los-g014","text":"Gutschein: Ein Tag, an dem ich alles mache, was du sagst.","typ":"gutschein","seltenheit":5,"einloesbar_bis":"90d","bedingung":null,"verweis":null,"tags":["rollentausch","jackpot"]}
]
```

---

## Typ: NIETE (nichts)

```json
[
  {"id":"los-n001","text":"Leider nichts. Versuch's morgen nochmal.","typ":"niete","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["niete"]},
  {"id":"los-n002","text":"Nichts. Aber du siehst süß aus, wenn du enttäuscht bist.","typ":"niete","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["niete"]},
  {"id":"los-n003","text":"Leer. Das Leben ist unfair.","typ":"niete","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["niete"]},
  {"id":"los-n004","text":"Nichts drin. Aber du darfst noch einmal rubbeln — morgen.","typ":"niete","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["niete"]},
  {"id":"los-n005","text":"Diesmal nicht. Frag mich trotzdem nett, vielleicht überlege ich es mir.","typ":"niete","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["niete","teasing"]},
  {"id":"los-n006","text":"Nichts. Ich hätte auch einfach nein sagen können, aber so ist es spannender.","typ":"niete","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["niete","teasing"]},
  {"id":"los-n007","text":"Fast. Aber eben nur fast.","typ":"niete","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["niete"]},
  {"id":"los-n008","text":"Nichts — außer der Erkenntnis, dass du zu oft rubbelst.","typ":"niete","seltenheit":1,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["niete","frech"]}
]
```

---

## Typ: FALLE (negativ)

```json
[
  {"id":"los-f001","text":"Pech. Heute Abend bekommst du nichts.","typ":"falle","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["denial"]},
  {"id":"los-f002","text":"Falle: Eine zusätzliche Aufgabe. Ich sage dir gleich welche.","typ":"falle","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["aufgabe"]},
  {"id":"los-f003","text":"Falle: Ein Karma-Punkt weg.","typ":"falle","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["karma"]},
  {"id":"los-f004","text":"Falle: Du darfst dich 48 Stunden nicht selbst anfassen.","typ":"falle","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["denial"]},
  {"id":"los-f005","text":"Falle: Dreh am Straf-Rad.","typ":"falle","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":"strafen_rad","tags":["rad","strafe"]},
  {"id":"los-f006","text":"Falle: Du machst mich heute Abend fertig — und bekommst selbst nichts.","typ":"falle","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["dienen","denial"]},
  {"id":"los-f007","text":"Falle: Zwanzig Minuten knien. Jetzt.","typ":"falle","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["knien"]},
  {"id":"los-f008","text":"Falle: Deine Streak ist mir egal. Heute wird trainiert, doppelt.","typ":"falle","seltenheit":3,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["training"]},
  {"id":"los-f009","text":"Falle: Ein Gutschein aus deinem Bestand wird gelöscht. Ich wähle welcher.","typ":"falle","seltenheit":4,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["verlust","gemein"]},
  {"id":"los-f010","text":"Falle: Du darfst heute Abend nur zuschauen.","typ":"falle","seltenheit":4,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["zuschauen","denial"]}
]
```

---

## Typ: ZEITSCHLOSS (später freigeschaltet)

```json
[
  {"id":"los-z001","text":"Etwas wartet auf dich. Aber erst in 24 Stunden.","typ":"zeitschloss","seltenheit":3,"einloesbar_bis":null,"bedingung":"24h","verweis":null,"tags":["warten"]},
  {"id":"los-z002","text":"Freigeschaltet am Wochenende. Bis dahin: Geduld.","typ":"zeitschloss","seltenheit":3,"einloesbar_bis":null,"bedingung":"naechstes_wochenende","verweis":null,"tags":["warten"]},
  {"id":"los-z003","text":"Dieses Los öffnet sich heute Nacht um Mitternacht.","typ":"zeitschloss","seltenheit":3,"einloesbar_bis":null,"bedingung":"mitternacht","verweis":null,"tags":["warten","nacht"]},
  {"id":"los-z004","text":"In sieben Tagen erfährst du, was hier steht. Nicht früher.","typ":"zeitschloss","seltenheit":4,"einloesbar_bis":null,"bedingung":"7d","verweis":null,"tags":["warten","lang"]},
  {"id":"los-z005","text":"Freigeschaltet, sobald du deine nächste Trainings-Woche geschafft hast.","typ":"zeitschloss","seltenheit":4,"einloesbar_bis":null,"bedingung":"training_woche_erfuellt","verweis":null,"tags":["warten","training"]},
  {"id":"los-z006","text":"Öffnet sich an unserem nächsten Jahrestag.","typ":"zeitschloss","seltenheit":5,"einloesbar_bis":null,"bedingung":"jahrestag","verweis":null,"tags":["warten","special"]},
  {"id":"los-z007","text":"Dieses Los braucht drei Tage. Dann sehen wir weiter.","typ":"zeitschloss","seltenheit":3,"einloesbar_bis":null,"bedingung":"3d","verweis":null,"tags":["warten"]}
]
```

---

## Typ: BEDINGT (an Bedingungen geknüpft)

```json
[
  {"id":"los-b001","text":"Einlösbar — aber nur, wenn du diese Woche keine Aufgabe verpasst hast.","typ":"bedingt","seltenheit":3,"einloesbar_bis":"7d","bedingung":"keine_verpassten_tasks","verweis":null,"tags":["leistung"]},
  {"id":"los-b002","text":"Gültig, sobald deine Streak bei sieben Tagen steht.","typ":"bedingt","seltenheit":4,"einloesbar_bis":null,"bedingung":"streak_7","verweis":null,"tags":["streak"]},
  {"id":"los-b003","text":"Einlösbar, wenn du mich vorher überzeugend darum bittest.","typ":"bedingt","seltenheit":2,"einloesbar_bis":"14d","bedingung":"betteln","verweis":null,"tags":["betteln"]},
  {"id":"los-b004","text":"Gültig nur, wenn deine Ampel und meine beide auf Grün stehen.","typ":"bedingt","seltenheit":2,"einloesbar_bis":"30d","bedingung":"beide_gruen","verweis":null,"tags":["mood"]},
  {"id":"los-b005","text":"Einlösbar, sobald du das nächste Level erreicht hast.","typ":"bedingt","seltenheit":3,"einloesbar_bis":null,"bedingung":"level_up","verweis":null,"tags":["level"]},
  {"id":"los-b006","text":"Gültig, wenn die Bestrafungs-Queue leer ist.","typ":"bedingt","seltenheit":3,"einloesbar_bis":null,"bedingung":"queue_leer","verweis":null,"tags":["strafe"]},
  {"id":"los-b007","text":"Einlösbar nur an einem Tag, an dem wir nicht zusammen waren.","typ":"bedingt","seltenheit":3,"einloesbar_bis":"30d","bedingung":"getrennt","verweis":null,"tags":["distanz"]},
  {"id":"los-b008","text":"Gültig, sobald ihr etwas Neues von der Bucket-List abgehakt habt.","typ":"bedingt","seltenheit":4,"einloesbar_bis":null,"bedingung":"bucketlist_item","verweis":null,"tags":["bucketlist"]}
]
```

---

## Typ: BLIND (Gioia schreibt live)

```json
[
  {"id":"los-bl001","text":"[Blindlos — sie schreibt jetzt, was hier steht]","typ":"blind","seltenheit":3,"einloesbar_bis":"24h","bedingung":null,"verweis":"domme_eingabe","tags":["blind"]},
  {"id":"los-bl002","text":"[Blindlos — sie hat 60 Sekunden Zeit, sich etwas auszudenken]","typ":"blind","seltenheit":4,"einloesbar_bis":"24h","bedingung":null,"verweis":"domme_eingabe_timer","tags":["blind","zeitdruck"]},
  {"id":"los-bl003","text":"[Blindlos — sie schreibt es, aber du liest es erst heute Abend]","typ":"blind","seltenheit":4,"einloesbar_bis":null,"bedingung":"abends","verweis":"domme_eingabe_verzoegert","tags":["blind","warten"]},
  {"id":"los-bl004","text":"[Doppelblind — sie schreibt etwas, ohne zu wissen, wofür du gerubbelt hast]","typ":"blind","seltenheit":4,"einloesbar_bis":"24h","bedingung":null,"verweis":"domme_eingabe_kontextlos","tags":["blind","chaos"]}
]
```

---

## Typ: WILDCARD (verweist auf andere Systeme)

```json
[
  {"id":"los-w001","text":"Dreh am Glücksrad. Was rauskommt, passiert heute.","typ":"wildcard","seltenheit":3,"einloesbar_bis":"24h","bedingung":null,"verweis":"gluecksrad","tags":["rad"]},
  {"id":"los-w002","text":"Zieh eine Karte aus einem Deck deiner Wahl.","typ":"wildcard","seltenheit":3,"einloesbar_bis":"24h","bedingung":null,"verweis":"dare_deck_frei","tags":["karte"]},
  {"id":"los-w003","text":"Zieh eine Karte — aber ich bestimme das Deck.","typ":"wildcard","seltenheit":3,"einloesbar_bis":"24h","bedingung":null,"verweis":"dare_deck_domme","tags":["karte"]},
  {"id":"los-w004","text":"Das oberste Item auf der Bucket-List wird heute abgehakt.","typ":"wildcard","seltenheit":4,"einloesbar_bis":"7d","bedingung":null,"verweis":"bucketlist_top","tags":["bucketlist"]},
  {"id":"los-w005","text":"Der Szenario-Generator entscheidet. Einmal würfeln, keine Wiederholung.","typ":"wildcard","seltenheit":4,"einloesbar_bis":"24h","bedingung":null,"verweis":"szenario_generator","tags":["szenario"]},
  {"id":"los-w006","text":"Eine Runde Wahrheit oder Pflicht. Sofort. Stufe 3.","typ":"wildcard","seltenheit":4,"einloesbar_bis":"24h","bedingung":null,"verweis":"wahrheit_pflicht_st3","tags":["spiel"]},
  {"id":"los-w007","text":"Ein zweites Los. Sofort. Rubbel weiter.","typ":"wildcard","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":"neues_los","tags":["meta"]},
  {"id":"los-w008","text":"Zwei Lose auf einmal. Beide gelten.","typ":"wildcard","seltenheit":4,"einloesbar_bis":null,"bedingung":null,"verweis":"zwei_lose","tags":["meta","gross"]}
]
```

---

## Typ: JACKPOT (selten, groß)

```json
[
  {"id":"los-j001","text":"JACKPOT — Ein ganzes Wochenende nach deinen Regeln. Du bestimmst alles.","typ":"jackpot","seltenheit":5,"einloesbar_bis":"90d","bedingung":null,"verweis":null,"tags":["jackpot","rollentausch"]},
  {"id":"los-j002","text":"JACKPOT — Drei Wünsche. Keine Bedingungen, keine Ausreden.","typ":"jackpot","seltenheit":5,"einloesbar_bis":"90d","bedingung":null,"verweis":null,"tags":["jackpot","wunsch"]},
  {"id":"los-j003","text":"JACKPOT — Alle offenen Strafen sind gestrichen. Sauberer Tisch.","typ":"jackpot","seltenheit":5,"einloesbar_bis":null,"bedingung":null,"verweis":null,"tags":["jackpot","erlass"]},
  {"id":"los-j004","text":"JACKPOT — Eine Nacht, in der du nichts machen musst außer genießen.","typ":"jackpot","seltenheit":5,"einloesbar_bis":"60d","bedingung":null,"verweis":null,"tags":["jackpot","verwoehnen"]},
  {"id":"los-j005","text":"JACKPOT — Deine wildeste Fantasie. Vollständig. Wir planen es zusammen.","typ":"jackpot","seltenheit":5,"einloesbar_bis":"90d","bedingung":null,"verweis":null,"tags":["jackpot","fantasie"]},
  {"id":"los-j006","text":"JACKPOT — Ein Kurzurlaub. Zwei Nächte, irgendwo, nur wir.","typ":"jackpot","seltenheit":5,"einloesbar_bis":"180d","bedingung":null,"verweis":null,"tags":["jackpot","reise"]}
]
```

---

## Typ: HANDEL (übertragbar / tauschbar)

```json
[
  {"id":"los-h001","text":"Übertragbar: Du kannst dieses Los an mich verschenken. Dann gilt es für mich.","typ":"handel","seltenheit":3,"einloesbar_bis":"30d","bedingung":null,"verweis":"uebertragen","tags":["handel"]},
  {"id":"los-h002","text":"Tauschbar: Gib zwei Gutscheine ab und du bekommst dafür einen Jackpot.","typ":"handel","seltenheit":4,"einloesbar_bis":null,"bedingung":"zwei_gutscheine","verweis":"tausch_jackpot","tags":["handel"]},
  {"id":"los-h003","text":"Verkaufbar: Tausche dieses Los gegen fünf Karma-Punkte ein.","typ":"handel","seltenheit":2,"einloesbar_bis":null,"bedingung":null,"verweis":"tausch_karma","tags":["handel","karma"]},
  {"id":"los-h004","text":"Pfand: Du kannst dieses Los als Einsatz bei einer Wette verwenden.","typ":"handel","seltenheit":3,"einloesbar_bis":"30d","bedingung":null,"verweis":"wette","tags":["handel","wette"]},
  {"id":"los-h005","text":"Verdopplung: Setze ein anderes Los ein. Bei Kopf verdoppelt es sich, bei Zahl ist es weg.","typ":"handel","seltenheit":4,"einloesbar_bis":null,"bedingung":null,"verweis":"muenzwurf_verdoppeln","tags":["handel","gluecksspiel"]}
]
```

---

## Los-Bezugsquellen

Wo Lose herkommen — nicht alle sind einfach da:

```json
{
  "quellen": [
    {"key":"taeglich","name":"Tageslos","beschreibung":"Ein kostenloses Los pro Tag","seltenheits_boost":0},
    {"key":"streak","name":"Streak-Los","beschreibung":"Bei 7 Tagen Streak: ein Bonus-Los","seltenheits_boost":1},
    {"key":"levelup","name":"Level-Los","beschreibung":"Bei jedem Level-Up: ein Los","seltenheits_boost":1},
    {"key":"karma","name":"Gekauft","beschreibung":"10 Karma-Punkte = 1 Los","seltenheits_boost":0},
    {"key":"belohnung","name":"Vergeben","beschreibung":"Gioia schenkt ein Los","seltenheits_boost":2},
    {"key":"achievement","name":"Achievement","beschreibung":"Bei bestimmten Erfolgen","seltenheits_boost":2},
    {"key":"jahrestag","name":"Special","beschreibung":"An besonderen Tagen","seltenheits_boost":3},
    {"key":"bossfight","name":"Boss-Belohnung","beschreibung":"Nach bestandenem Boss-Fight","seltenheits_boost":3}
  ],
  "seltenheits_boost_erklaerung": "Erhöht die Wahrscheinlichkeit für höhere Seltenheitsstufen. Boost 3 garantiert mindestens Silber."
}
```

## Los-Serien (thematische Sets)

```json
{
  "serien": [
    {
      "key":"basis",
      "name":"Standard-Serie",
      "beschreibung":"Der normale Pool",
      "aktiv":true
    },
    {
      "key":"belohnung",
      "name":"Belohnungs-Serie",
      "beschreibung":"Nur positive Lose, keine Fallen. Von Gioia freigeschaltet.",
      "aktiv":false,
      "nur_positive":true
    },
    {
      "key":"grausam",
      "name":"Grausame Serie",
      "beschreibung":"Erhöhter Anteil an Fallen und Nieten",
      "aktiv":false,
      "fallen_anteil":0.5
    },
    {
      "key":"jahrestag",
      "name":"Jahrestags-Serie",
      "beschreibung":"Nur an besonderen Tagen verfügbar",
      "aktiv":false,
      "nur_an_daten":true
    },
    {
      "key":"distanz",
      "name":"Fernbeziehungs-Serie",
      "beschreibung":"Lose, die auch aus der Ferne einlösbar sind",
      "aktiv":false
    },
    {
      "key":"sanft",
      "name":"Sanfte Serie",
      "beschreibung":"Maximal Intensität 2. Für ruhige Tage.",
      "aktiv":false,
      "max_intensitaet":2
    }
  ]
}
```

---

## Implementierungs-Hinweise

1. **Rubbel-Mechanik:** Canvas mit `globalCompositeOperation = 'destination-out'`. Touch/Mouse-Move malt die Deckschicht weg. Bei ~60% freigelegter Fläche automatisch komplett aufdecken.
2. **Haptik:** Bei Rubbelbewegung kurze Vibrationsimpulse (`navigator.vibrate(10)` im Intervall). Macht den Effekt spürbar.
3. **Seltenheits-Feedback:** Beim Aufdecken eines seltenen Loses: Glüh-Animation, Partikel, längere Vibration. Bei Niete: nichts, nur der graue Text. Der Kontrast ist der Punkt.
4. **Los-Bestand:** Gutscheine landen in einem "Portemonnaie". Sichtbarer Bestand mit Verfallsdaten. Ablaufende Lose werden 3 Tage vorher markiert.
5. **Gioia-Kontrolle:** Sie kann den aktiven Pool bestimmen (welche Serie), einzelne Lose deaktivieren, eigene erstellen, und Lose direkt vergeben.
6. **Einlösung:** Gutscheine werden per Button eingelöst → Benachrichtigung an Gioia. Sie muss bestätigen. Bei Ablehnung: Los bleibt gültig (oder verfällt, je nach Einstellung).
7. **Blindlose:** Wenn Kevin ein Blindlos aufdeckt, bekommt Gioia eine Push-Benachrichtigung mit Eingabefeld. Bei `domme_eingabe_timer` läuft für sie ein 60-Sekunden-Countdown — was sie in der Zeit tippt, gilt.
8. **Manipulation:** Gioia kann ein Los "präparieren" — d.h. das nächste Los, das Kevin zieht, ist ein von ihr bestimmtes. Er merkt den Unterschied nicht.
