# EMBER — Content-Datei 02: Glücksrad-Befüllungen

## Format-Hinweis

Jedes Rad ist ein eigenes Objekt mit Segmenten. Die App soll mehrere Räder hintereinander drehen können und die Ergebnisse zu einer Karte kombinieren.

**Kombinations-Beispiel:** `Position × Ort × Regel` → *"Doggy + Küche + Du darfst nicht kommen bis ich es sage"*

Felder pro Rad:

| Feld | Typ | Beschreibung |
|---|---|---|
| `key` | string | Eindeutiger Rad-Schlüssel |
| `name` | string | Anzeigename |
| `icon` | string | Emoji für die UI |
| `farbe` | string | Hex-Basisfarbe |
| `kombinierbar_mit` | array | Welche Räder sinnvoll kombiniert werden können |
| `segmente` | array | Die Einträge |

Segment-Felder: `text`, `intensitaet` (1–5), `tags`

---

## Rad 1: POSITIONEN

```json
{
  "key": "positionen",
  "name": "Position",
  "icon": "🧘",
  "farbe": "#d9534f",
  "kombinierbar_mit": ["orte", "regeln", "dauer", "tempo", "kleidung"],
  "segmente": [
    {"text":"Missionar","intensitaet":2,"tags":["klassisch"]},
    {"text":"Doggy","intensitaet":3,"tags":["hinten"]},
    {"text":"Reiten","intensitaet":3,"tags":["sie_oben"]},
    {"text":"Reverse Cowgirl","intensitaet":3,"tags":["sie_oben"]},
    {"text":"Löffelchen","intensitaet":2,"tags":["seitlich"]},
    {"text":"69","intensitaet":4,"tags":["oral"]},
    {"text":"Sie sitzt auf seinem Gesicht","intensitaet":4,"tags":["oral","dominanz"]},
    {"text":"Stehend, sie an der Wand","intensitaet":4,"tags":["stehend"]},
    {"text":"Stehend, er hebt sie hoch","intensitaet":4,"tags":["stehend","kraft"]},
    {"text":"Sie auf dem Bauch, er von hinten","intensitaet":3,"tags":["liegend"]},
    {"text":"Beine über seinen Schultern","intensitaet":3,"tags":["tief"]},
    {"text":"Über die Tischkante gebeugt","intensitaet":4,"tags":["moebel"]},
    {"text":"Auf dem Stuhl, sie auf seinem Schoß","intensitaet":3,"tags":["sitzend"]},
    {"text":"Beide auf der Seite, Gesicht zu Gesicht","intensitaet":2,"tags":["intim"]},
    {"text":"Sie auf allen vieren, er kniend","intensitaet":3,"tags":["knien"]},
    {"text":"Er auf dem Rücken, sie hockt über ihm","intensitaet":4,"tags":["kontrolle"]},
    {"text":"Sie an der Bettkante, er kniend davor","intensitaet":4,"tags":["oral","knien"]},
    {"text":"Er sitzt, sie steht über ihm","intensitaet":4,"tags":["dominanz"]},
    {"text":"Beide knien, er hinter ihr","intensitaet":3,"tags":["knien"]},
    {"text":"Sie kopfüber halb vom Bett","intensitaet":4,"tags":["extrem"]},
    {"text":"Er sitzt am Bettrand, sie auf ihm mit dem Rücken zu ihm","intensitaet":3,"tags":["sitzend"]},
    {"text":"Sie liegt, ein Bein über seiner Schulter","intensitaet":3,"tags":["seitlich"]},
    {"text":"Er auf dem Rücken, sie sitzt auf seiner Brust","intensitaet":4,"tags":["dominanz"]},
    {"text":"Beide stehend vor dem Spiegel","intensitaet":4,"tags":["spiegel","stehend"]},
    {"text":"Sie liegt auf ihm, Bauch an Bauch","intensitaet":2,"tags":["intim"]},
    {"text":"Er kniend, sie stehend über ihm","intensitaet":4,"tags":["oral","dominanz"]},
    {"text":"Auf der Treppe","intensitaet":4,"tags":["ort","hoehe"]},
    {"text":"Sie im Türrahmen, ein Bein angehoben","intensitaet":4,"tags":["stehend"]},
    {"text":"Er liegt, sie rückwärts über sein Gesicht","intensitaet":5,"tags":["oral","dominanz"]},
    {"text":"Beide sitzend, ineinander verschränkt","intensitaet":3,"tags":["yab_yum","intim"]}
  ]
}
```

---

## Rad 2: ORTE

```json
{
  "key": "orte",
  "name": "Ort",
  "icon": "📍",
  "farbe": "#3d8168",
  "kombinierbar_mit": ["positionen", "regeln", "dauer", "kleidung"],
  "segmente": [
    {"text":"Schlafzimmer","intensitaet":1,"tags":["standard"]},
    {"text":"Wohnzimmer, auf dem Sofa","intensitaet":2,"tags":["wohnung"]},
    {"text":"Wohnzimmer, auf dem Boden","intensitaet":2,"tags":["wohnung"]},
    {"text":"Küche, auf der Arbeitsplatte","intensitaet":3,"tags":["wohnung"]},
    {"text":"Küchentisch","intensitaet":3,"tags":["wohnung","moebel"]},
    {"text":"Badezimmer, unter der Dusche","intensitaet":3,"tags":["nass"]},
    {"text":"Badewanne","intensitaet":3,"tags":["nass"]},
    {"text":"Vor dem Spiegel","intensitaet":4,"tags":["beobachten"]},
    {"text":"Im Flur, direkt an der Wohnungstür","intensitaet":3,"tags":["spontan"]},
    {"text":"Waschmaschine im Schleudergang","intensitaet":4,"tags":["vibration"]},
    {"text":"Treppenhaus","intensitaet":4,"tags":["risiko"]},
    {"text":"Balkon","intensitaet":4,"tags":["draussen","risiko"]},
    {"text":"Auto, Rücksitz","intensitaet":4,"tags":["auto"]},
    {"text":"Auto, Fahrersitz","intensitaet":4,"tags":["auto","eng"]},
    {"text":"Draußen im Dunkeln","intensitaet":4,"tags":["natur","nacht"]},
    {"text":"Hotelzimmer","intensitaet":3,"tags":["reise"]},
    {"text":"Hotelbalkon","intensitaet":5,"tags":["reise","risiko"]},
    {"text":"Auf dem Schreibtisch","intensitaet":3,"tags":["moebel"]},
    {"text":"Im Sessel","intensitaet":2,"tags":["moebel"]},
    {"text":"Auf dem Esstisch","intensitaet":3,"tags":["moebel"]},
    {"text":"Vor dem Fenster, Vorhang offen","intensitaet":5,"tags":["risiko","gesehen_werden"]},
    {"text":"Im Bett, aber komplett unter der Decke","intensitaet":2,"tags":["intim"]},
    {"text":"Gästezimmer","intensitaet":2,"tags":["ungewohnt"]},
    {"text":"Umkleidekabine","intensitaet":5,"tags":["oeffentlich","schnell"]},
    {"text":"Fremde Wohnung / Übernachtung bei anderen","intensitaet":5,"tags":["risiko","leise"]},
    {"text":"Sauna","intensitaet":4,"tags":["hitze"]},
    {"text":"Zelt","intensitaet":4,"tags":["camping","leise"]},
    {"text":"Aufzug","intensitaet":5,"tags":["oeffentlich","kurz"]},
    {"text":"Wo auch immer sie es sagt","intensitaet":4,"tags":["wildcard","dominanz"]},
    {"text":"Auf dem Teppich vor dem Kamin/Heizung","intensitaet":2,"tags":["gemuetlich"]}
  ]
}
```

---

## Rad 3: REGELN & EINSCHRÄNKUNGEN

```json
{
  "key": "regeln",
  "name": "Regel",
  "icon": "⛓️",
  "farbe": "#2b2d42",
  "kombinierbar_mit": ["positionen", "orte", "dauer", "tempo"],
  "segmente": [
    {"text":"Du darfst nicht kommen bis ich es sage","intensitaet":5,"tags":["denial"]},
    {"text":"Du darfst kein Wort sagen","intensitaet":3,"tags":["stille"]},
    {"text":"Du darfst mich nicht anfassen","intensitaet":4,"tags":["einschraenkung"]},
    {"text":"Deine Hände bleiben hinter dem Rücken","intensitaet":4,"tags":["haende"]},
    {"text":"Augen verbunden","intensitaet":4,"tags":["sinne"]},
    {"text":"Augen offen, Blickkontakt die ganze Zeit","intensitaet":3,"tags":["blick"]},
    {"text":"Du bewegst dich nicht — ich mache alles","intensitaet":4,"tags":["passiv"]},
    {"text":"Ich bewege mich nicht — du machst alles","intensitaet":3,"tags":["aktiv"]},
    {"text":"Nur mit einer Hand","intensitaet":3,"tags":["einschraenkung"]},
    {"text":"Keine Küsse auf den Mund","intensitaet":3,"tags":["einschraenkung"]},
    {"text":"Du fragst vor jedem Schritt um Erlaubnis","intensitaet":4,"tags":["protokoll"]},
    {"text":"Du bettelst darum","intensitaet":4,"tags":["betteln"]},
    {"text":"Du zählst laut mit","intensitaet":3,"tags":["zaehlen"]},
    {"text":"Du redest die ganze Zeit und beschreibst was du fühlst","intensitaet":4,"tags":["dirtytalk"]},
    {"text":"Wir bleiben beide angezogen","intensitaet":3,"tags":["kleidung"]},
    {"text":"Ich komme zuerst — dann erst du","intensitaet":4,"tags":["reihenfolge"]},
    {"text":"Du kommst heute gar nicht","intensitaet":5,"tags":["denial"]},
    {"text":"Zweimal hintereinander, keine Pause","intensitaet":5,"tags":["overstim"]},
    {"text":"Gefesselt","intensitaet":5,"tags":["bondage"]},
    {"text":"Du machst kein Geräusch — jedes kostet dich einen Punkt","intensitaet":4,"tags":["stille","strafe"]},
    {"text":"Du machst so viel Lärm wie möglich","intensitaet":3,"tags":["geraeusche"]},
    {"text":"Wenn du kurz davor bist, sagst du es — und wir stoppen","intensitaet":5,"tags":["edging"]},
    {"text":"Ich stoppe wann ich will, ohne Vorwarnung","intensitaet":5,"tags":["kontrolle"]},
    {"text":"Du hältst mindestens 15 Minuten durch","intensitaet":4,"tags":["ausdauer"]},
    {"text":"Alles in Zeitlupe","intensitaet":3,"tags":["tempo"]},
    {"text":"Kein Vorspiel — direkt","intensitaet":4,"tags":["direkt"]},
    {"text":"Nur Vorspiel — kein Sex","intensitaet":4,"tags":["frustration"]},
    {"text":"Du bedankst dich nach jedem Schritt","intensitaet":4,"tags":["protokoll"]},
    {"text":"Ich benutze dich — du bist nur da","intensitaet":5,"tags":["objektifizierung"]},
    {"text":"Du darfst dich selbst nicht anfassen","intensitaet":4,"tags":["einschraenkung"]},
    {"text":"Licht bleibt an","intensitaet":2,"tags":["sichtbarkeit"]},
    {"text":"Komplett dunkel","intensitaet":3,"tags":["dunkelheit"]},
    {"text":"Du sprichst mich nur mit Titel an","intensitaet":4,"tags":["protokoll"]},
    {"text":"Ich darf jederzeit abbrechen und du sagst nichts dazu","intensitaet":5,"tags":["kontrolle"]},
    {"text":"Keine Regel — heute alles erlaubt","intensitaet":3,"tags":["freiheit"]}
  ]
}
```

---

## Rad 4: DAUER

```json
{
  "key": "dauer",
  "name": "Dauer",
  "icon": "⏱️",
  "farbe": "#457b9d",
  "kombinierbar_mit": ["positionen", "orte", "regeln", "aktion"],
  "segmente": [
    {"text":"2 Minuten — Quickie","intensitaet":3,"tags":["kurz"]},
    {"text":"5 Minuten","intensitaet":2,"tags":["kurz"]},
    {"text":"10 Minuten","intensitaet":3,"tags":["mittel"]},
    {"text":"15 Minuten","intensitaet":3,"tags":["mittel"]},
    {"text":"20 Minuten","intensitaet":4,"tags":["mittel"]},
    {"text":"30 Minuten","intensitaet":4,"tags":["lang"]},
    {"text":"45 Minuten","intensitaet":5,"tags":["lang"]},
    {"text":"Eine ganze Stunde","intensitaet":5,"tags":["sehr_lang"]},
    {"text":"Bis ich komme","intensitaet":4,"tags":["offen"]},
    {"text":"Bis ich zweimal gekommen bin","intensitaet":5,"tags":["offen","mehrfach"]},
    {"text":"Bis ich sage dass Schluss ist","intensitaet":5,"tags":["offen","kontrolle"]},
    {"text":"Bis du nicht mehr kannst","intensitaet":5,"tags":["limit"]},
    {"text":"So lange ein Lied dauert","intensitaet":3,"tags":["musik"]},
    {"text":"Ein ganzes Album lang","intensitaet":5,"tags":["musik","lang"]},
    {"text":"Bis der Timer klingelt — du weißt nicht wann","intensitaet":4,"tags":["ungewiss"]},
    {"text":"Den ganzen Abend, mit Pausen","intensitaet":5,"tags":["sehr_lang"]},
    {"text":"3 Runden à 10 Minuten mit Pausen","intensitaet":5,"tags":["runden"]},
    {"text":"Solange du still bleiben kannst","intensitaet":4,"tags":["herausforderung"]}
  ]
}
```

---

## Rad 5: TEMPO & INTENSITÄT

```json
{
  "key": "tempo",
  "name": "Tempo",
  "icon": "🌡️",
  "farbe": "#e07a5f",
  "kombinierbar_mit": ["positionen", "regeln", "dauer"],
  "segmente": [
    {"text":"So langsam wie irgend möglich","intensitaet":4,"tags":["langsam"]},
    {"text":"Langsam und tief","intensitaet":3,"tags":["langsam"]},
    {"text":"Normal","intensitaet":2,"tags":["mittel"]},
    {"text":"Schnell und hart","intensitaet":4,"tags":["hart"]},
    {"text":"So hart wie du kannst","intensitaet":5,"tags":["hart"]},
    {"text":"Wechselnd — ich sage wann","intensitaet":4,"tags":["wechsel"]},
    {"text":"9 flach, 1 tief","intensitaet":4,"tags":["technik"]},
    {"text":"Zehn schnell, dann zehn Sekunden Pause","intensitaet":4,"tags":["intervall"]},
    {"text":"Erst zärtlich, dann brutal","intensitaet":5,"tags":["eskalation"]},
    {"text":"Erst hart, dann ganz sanft ausklingen","intensitaet":4,"tags":["deeskalation"]},
    {"text":"Nur die Spitze, ganz langsam","intensitaet":5,"tags":["teasing"]},
    {"text":"Im Takt der Musik","intensitaet":3,"tags":["musik"]},
    {"text":"Ich gebe dir bei jedem Stoß eine Anweisung","intensitaet":5,"tags":["kontrolle"]},
    {"text":"Anfangen, aufhören, anfangen, aufhören","intensitaet":5,"tags":["teasing"]}
  ]
}
```

---

## Rad 6: KLEIDUNG

```json
{
  "key": "kleidung",
  "name": "Kleidung",
  "icon": "👗",
  "farbe": "#e5989b",
  "kombinierbar_mit": ["positionen", "orte", "regeln"],
  "segmente": [
    {"text":"Komplett nackt, beide","intensitaet":2,"tags":["nackt"]},
    {"text":"Beide komplett angezogen — nur das Nötigste auf","intensitaet":4,"tags":["angezogen"]},
    {"text":"Sie angezogen, er nackt","intensitaet":4,"tags":["asymmetrie","dominanz"]},
    {"text":"Er angezogen, sie nackt","intensitaet":3,"tags":["asymmetrie"]},
    {"text":"Nur Unterwäsche","intensitaet":2,"tags":["teilweise"]},
    {"text":"Nur Strümpfe","intensitaet":3,"tags":["detail"]},
    {"text":"Sie in Dessous, er nackt","intensitaet":4,"tags":["dessous"]},
    {"text":"Er nur mit Halsband","intensitaet":5,"tags":["dominanz"]},
    {"text":"Sie in High Heels, sonst nichts","intensitaet":4,"tags":["schuhe"]},
    {"text":"Sein Hemd an ihr, sonst nichts","intensitaet":3,"tags":["klassiker"]},
    {"text":"Beide in Arbeitskleidung","intensitaet":3,"tags":["rollenspiel"]},
    {"text":"Sie sucht seine Kleidung aus","intensitaet":3,"tags":["kontrolle"]},
    {"text":"Augenbinde als einziges Kleidungsstück","intensitaet":4,"tags":["sinne"]},
    {"text":"Was er anhat, wird zerrissen","intensitaet":5,"tags":["wild"]},
    {"text":"Keine Unterwäsche — den ganzen Tag schon nicht","intensitaet":4,"tags":["vorbereitung"]},
    {"text":"Sie entscheidet spontan","intensitaet":3,"tags":["wildcard"]}
  ]
}
```

---

## Rad 7: WAS PASSIERT (Aktion)

```json
{
  "key": "aktion",
  "name": "Aktion",
  "icon": "🎯",
  "farbe": "#8b0000",
  "kombinierbar_mit": ["orte", "regeln", "dauer", "tempo"],
  "segmente": [
    {"text":"Oral für sie","intensitaet":4,"tags":["oral"]},
    {"text":"Oral für ihn","intensitaet":4,"tags":["oral"]},
    {"text":"Gegenseitig oral","intensitaet":4,"tags":["oral","69"]},
    {"text":"Mit den Fingern","intensitaet":3,"tags":["haende"]},
    {"text":"Handjob","intensitaet":3,"tags":["haende"]},
    {"text":"Penetration","intensitaet":4,"tags":["sex"]},
    {"text":"Nur Vorspiel — kein Sex heute","intensitaet":4,"tags":["frustration"]},
    {"text":"Er macht es sich selbst, sie schaut zu","intensitaet":4,"tags":["masturbation","zuschauen"]},
    {"text":"Sie macht es sich selbst, er schaut zu","intensitaet":4,"tags":["masturbation","zuschauen"]},
    {"text":"Beide gleichzeitig selbst, nebeneinander","intensitaet":4,"tags":["masturbation","parallel"]},
    {"text":"Massage die eskaliert","intensitaet":3,"tags":["massage"]},
    {"text":"Toy für sie","intensitaet":4,"tags":["toy"]},
    {"text":"Toy für ihn","intensitaet":5,"tags":["toy"]},
    {"text":"Strapon","intensitaet":5,"tags":["pegging"]},
    {"text":"Edging — mehrfach an die Kante","intensitaet":5,"tags":["edging"]},
    {"text":"Overstimulation nach dem ersten Mal","intensitaet":5,"tags":["overstim"]},
    {"text":"Nur Küssen und Anfassen","intensitaet":2,"tags":["soft"]},
    {"text":"Impact Play","intensitaet":5,"tags":["schmerz"]},
    {"text":"Bondage-Session","intensitaet":5,"tags":["bondage"]},
    {"text":"Sensorisches Spiel mit verbundenen Augen","intensitaet":4,"tags":["sinne"]},
    {"text":"Er dient — sie bekommt alles, er nichts","intensitaet":4,"tags":["dienen"]},
    {"text":"Rollenspiel — sie legt die Rollen fest","intensitaet":4,"tags":["rollenspiel"]},
    {"text":"Dry Humping — angezogen aneinander reiben","intensitaet":3,"tags":["grinding"]},
    {"text":"Sie sitzt auf seinem Gesicht bis sie fertig ist","intensitaet":5,"tags":["facesitting"]},
    {"text":"Alles was sie sich gerade wünscht","intensitaet":4,"tags":["wildcard"]}
  ]
}
```

---

## Rad 8: ROLLEN & SZENARIEN

```json
{
  "key": "rollen",
  "name": "Rolle",
  "icon": "🎭",
  "farbe": "#6d597a",
  "kombinierbar_mit": ["orte", "kleidung", "dauer"],
  "segmente": [
    {"text":"Chefin und Angestellter","intensitaet":4,"tags":["macht"]},
    {"text":"Lehrerin und Schüler","intensitaet":4,"tags":["macht"]},
    {"text":"Ärztin und Patient","intensitaet":4,"tags":["untersuchung"]},
    {"text":"Trainerin und Trainierender","intensitaet":4,"tags":["training"]},
    {"text":"Zwei Fremde die sich gerade kennengelernt haben","intensitaet":3,"tags":["fremde"]},
    {"text":"Sie ist die Kundin, er das Personal","intensitaet":4,"tags":["dienstleistung"]},
    {"text":"Herrin und Diener","intensitaet":5,"tags":["ds"]},
    {"text":"Sie ist die Einzige die Regeln macht","intensitaet":5,"tags":["ds"]},
    {"text":"Erstes Date das eskaliert","intensitaet":3,"tags":["date"]},
    {"text":"Verbotene Affäre — wir dürfen nicht erwischt werden","intensitaet":4,"tags":["geheim"]},
    {"text":"Sie ist die Fotografin, er das Modell","intensitaet":4,"tags":["foto"]},
    {"text":"Sie interviewt ihn und stellt sehr private Fragen","intensitaet":4,"tags":["interview"]},
    {"text":"Er ist der Neue und muss sich beweisen","intensitaet":4,"tags":["pruefung"]},
    {"text":"Sie testet ob er wirklich alles macht was sie sagt","intensitaet":5,"tags":["gehorsam"]},
    {"text":"Nachbarn die sich nicht kennen sollten","intensitaet":3,"tags":["fremde"]},
    {"text":"Sie kommt spät nach Hause und er hat gewartet","intensitaet":4,"tags":["warten"]},
    {"text":"Massage-Termin der aus dem Ruder läuft","intensitaet":4,"tags":["massage"]},
    {"text":"Keine Rollen — nur wir","intensitaet":2,"tags":["echt"]}
  ]
}
```

---

## Rad 9: KÖRPERSTELLEN

```json
{
  "key": "koerper",
  "name": "Körperstelle",
  "icon": "💋",
  "farbe": "#e07a5f",
  "kombinierbar_mit": ["dauer", "regeln", "sinne"],
  "segmente": [
    {"text":"Hals","intensitaet":2,"tags":["oben"]},
    {"text":"Ohren","intensitaet":2,"tags":["oben"]},
    {"text":"Nacken","intensitaet":2,"tags":["oben"]},
    {"text":"Schlüsselbein","intensitaet":2,"tags":["oben"]},
    {"text":"Brüste","intensitaet":3,"tags":["mitte"]},
    {"text":"Brustwarzen","intensitaet":4,"tags":["mitte","empfindlich"]},
    {"text":"Bauch","intensitaet":2,"tags":["mitte"]},
    {"text":"Hüften","intensitaet":3,"tags":["mitte"]},
    {"text":"Innenseite der Oberschenkel","intensitaet":4,"tags":["unten","empfindlich"]},
    {"text":"Kniekehlen","intensitaet":3,"tags":["unten","kitzlig"]},
    {"text":"Füße","intensitaet":3,"tags":["unten"]},
    {"text":"Rücken","intensitaet":2,"tags":["hinten"]},
    {"text":"Unterer Rücken","intensitaet":3,"tags":["hinten","empfindlich"]},
    {"text":"Po","intensitaet":3,"tags":["hinten"]},
    {"text":"Handgelenke","intensitaet":2,"tags":["arme"]},
    {"text":"Finger","intensitaet":3,"tags":["arme"]},
    {"text":"Mund und Lippen","intensitaet":3,"tags":["oben"]},
    {"text":"Überall außer da wo du es am meisten willst","intensitaet":5,"tags":["teasing"]},
    {"text":"Da wo sie es sagt","intensitaet":4,"tags":["wildcard"]},
    {"text":"Von oben bis unten, ohne etwas auszulassen","intensitaet":4,"tags":["komplett"]}
  ]
}
```

---

## Rad 10: STRAF-RAD

```json
{
  "key": "strafen",
  "name": "Strafe",
  "icon": "⚖️",
  "farbe": "#4a4a4a",
  "kombinierbar_mit": ["dauer"],
  "segmente": [
    {"text":"Heute kein Orgasmus","intensitaet":4,"tags":["denial"]},
    {"text":"Drei Tage kein Orgasmus","intensitaet":5,"tags":["denial","lang"]},
    {"text":"20 Minuten in der Ecke knien","intensitaet":4,"tags":["knien"]},
    {"text":"10 Schläge, laut mitzählen","intensitaet":4,"tags":["impact"]},
    {"text":"20 Schläge, laut mitzählen und danken","intensitaet":5,"tags":["impact"]},
    {"text":"Kalte Dusche, 5 Minuten","intensitaet":3,"tags":["kaelte"]},
    {"text":"Du machst mich fertig und bekommst nichts","intensitaet":4,"tags":["dienen"]},
    {"text":"Handy für 24 Stunden abgeben","intensitaet":3,"tags":["entzug"]},
    {"text":"Eine Woche Haushalt komplett allein","intensitaet":2,"tags":["alltag"]},
    {"text":"50 Mal handschriftlich aufschreiben was du falsch gemacht hast","intensitaet":3,"tags":["schreiben"]},
    {"text":"Zuschauen wie ich es mir selbst mache — ohne mitzumachen","intensitaet":5,"tags":["frustration"]},
    {"text":"Fünfmal Edging, dann Schluss","intensitaet":5,"tags":["edging","denial"]},
    {"text":"Du bettelst diese Woche um jeden Kuss","intensitaet":3,"tags":["betteln"]},
    {"text":"Plug tragen bis ich sage dass er raus darf","intensitaet":5,"tags":["plug"]},
    {"text":"Eine Stunde nackt knien und warten","intensitaet":5,"tags":["knien","warten"]},
    {"text":"Doppelte Trainingseinheit","intensitaet":4,"tags":["training"]},
    {"text":"Du entscheidest eine Woche lang gar nichts mehr","intensitaet":4,"tags":["kontrolle"]},
    {"text":"Glück gehabt — nochmal drehen","intensitaet":1,"tags":["wildcard"]},
    {"text":"Ich entscheide spontan","intensitaet":4,"tags":["wildcard"]},
    {"text":"Doppelte Strafe — zweimal drehen","intensitaet":5,"tags":["eskalation"]}
  ]
}
```

---

## Rad 11: BELOHNUNGS-RAD

```json
{
  "key": "belohnungen",
  "name": "Belohnung",
  "icon": "🎁",
  "farbe": "#f4a261",
  "kombinierbar_mit": ["dauer"],
  "segmente": [
    {"text":"Du darfst dir heute alles wünschen","intensitaet":4,"tags":["wunsch"]},
    {"text":"Ganzkörpermassage mit Öl","intensitaet":2,"tags":["massage"]},
    {"text":"Oral, so lange du willst","intensitaet":4,"tags":["oral"]},
    {"text":"Deine Lieblingsposition","intensitaet":3,"tags":["wunsch"]},
    {"text":"Du darfst heute einmal die Kontrolle übernehmen","intensitaet":4,"tags":["rollentausch"]},
    {"text":"Ich ziehe an was du dir wünschst","intensitaet":3,"tags":["kleidung"]},
    {"text":"Zwei Orgasmen heute","intensitaet":4,"tags":["mehrfach"]},
    {"text":"Ein Wochenende ohne Regeln","intensitaet":4,"tags":["freiheit"]},
    {"text":"Ich erfülle dir eine Fantasie von deiner Liste","intensitaet":5,"tags":["fantasie"]},
    {"text":"Frühstück ans Bett und der ganze Tag gehört dir","intensitaet":3,"tags":["tag"]},
    {"text":"Du bekommst einen Wunsch-Token für später","intensitaet":3,"tags":["token"]},
    {"text":"Ein Foto das du behalten darfst","intensitaet":3,"tags":["foto"]},
    {"text":"Bad zusammen, ich wasche dich","intensitaet":2,"tags":["pflege"]},
    {"text":"Ich sage dir eine halbe Stunde lang nur was ich an dir liebe","intensitaet":2,"tags":["worte"]},
    {"text":"Eine Strafe aus der Queue wird gestrichen","intensitaet":3,"tags":["erlass"]},
    {"text":"Doppelte Belohnung — nochmal drehen","intensitaet":4,"tags":["eskalation"]}
  ]
}
```

---

## Rad 12: SPONTAN-RAD (für den Alltag)

```json
{
  "key": "spontan",
  "name": "Spontan",
  "icon": "⚡",
  "farbe": "#c9a227",
  "kombinierbar_mit": [],
  "segmente": [
    {"text":"Jetzt sofort. Wo auch immer wir sind.","intensitaet":4,"tags":["sofort"]},
    {"text":"In genau einer Stunde. Bereite dich vor.","intensitaet":4,"tags":["countdown"]},
    {"text":"Heute Abend, aber ich sage dir nicht wann","intensitaet":4,"tags":["ungewiss"]},
    {"text":"Schick mir ein Foto in den nächsten 5 Minuten","intensitaet":3,"tags":["foto"]},
    {"text":"Zieh dich aus und warte auf mich","intensitaet":4,"tags":["warten"]},
    {"text":"Küss mich, sofort, egal wo wir sind","intensitaet":2,"tags":["kuss"]},
    {"text":"Flüster mir ins Ohr was du gerade denkst","intensitaet":3,"tags":["fluestern"]},
    {"text":"Geh ins Schlafzimmer und knie dich hin","intensitaet":4,"tags":["knien"]},
    {"text":"Nichts. Heute passiert nichts. Warte auf morgen.","intensitaet":4,"tags":["denial"]},
    {"text":"Fünf Minuten Vorspiel — dann aufhören","intensitaet":5,"tags":["frustration"]},
    {"text":"Nimm dir eine Karte aus einem beliebigen Deck","intensitaet":3,"tags":["meta"]},
    {"text":"Schreib mir auf was du gerade willst — ich entscheide ob","intensitaet":3,"tags":["bitte"]}
  ]
}
```

---

## Vorgefertigte Rad-Kombinationen

Für die App: Presets die mehrere Räder in Folge drehen.

```json
{
  "kombinationen": [
    {
      "key":"klassisch",
      "name":"Klassisch",
      "beschreibung":"Position, Ort und eine Regel",
      "raeder":["positionen","orte","regeln"]
    },
    {
      "key":"vollprogramm",
      "name":"Volles Programm",
      "beschreibung":"Alles auf einmal",
      "raeder":["aktion","positionen","orte","regeln","dauer","tempo"]
    },
    {
      "key":"schnell",
      "name":"Schnellentscheidung",
      "beschreibung":"Nur was und wo",
      "raeder":["aktion","orte"]
    },
    {
      "key":"training",
      "name":"Trainingsmodus",
      "beschreibung":"Fokus auf Ausdauer",
      "raeder":["aktion","regeln","dauer","tempo"]
    },
    {
      "key":"sinnlich",
      "name":"Sinnlich",
      "beschreibung":"Langsam und intensiv",
      "raeder":["koerper","dauer","tempo"]
    },
    {
      "key":"rollenspiel",
      "name":"Rollenspiel",
      "beschreibung":"Mit Charakteren",
      "raeder":["rollen","orte","kleidung","aktion"]
    },
    {
      "key":"kleidungsspiel",
      "name":"Angezogen",
      "beschreibung":"Kleidung als Element",
      "raeder":["kleidung","positionen","orte"]
    },
    {
      "key":"strafe",
      "name":"Strafe",
      "beschreibung":"Nur das Straf-Rad",
      "raeder":["strafen"]
    },
    {
      "key":"belohnung",
      "name":"Belohnung",
      "beschreibung":"Nur das Belohnungs-Rad",
      "raeder":["belohnungen"]
    },
    {
      "key":"blitz",
      "name":"Blitzentscheidung",
      "beschreibung":"Für zwischendurch",
      "raeder":["spontan"]
    }
  ]
}
```

---

## Implementierungs-Hinweise

1. **Rad-Animation:** Canvas oder SVG mit `requestAnimationFrame`. Easing-Funktion: `easeOutCubic` für realistisches Auslaufen. Mindestens 3 volle Umdrehungen vor dem Stopp.
2. **Intensitäts-Filter:** Domme kann pro Session ein Maximum setzen (z.B. "nur bis Intensität 3"). Segmente darüber werden aus dem Rad entfernt.
3. **Sequenz-Modus:** Bei Kombinationen dreht jedes Rad nacheinander mit kurzer Pause. Ergebnisse werden untereinander aufgebaut und am Ende als eine Karte zusammengefasst.
4. **Eigene Segmente:** Jedes Rad muss um benutzerdefinierte Einträge erweiterbar sein. Custom-Segmente bekommen `custom: true` und eine eigene Farbe.
5. **Segment-Deaktivierung:** Einzelne Segmente sollen ein-/ausschaltbar sein ohne sie zu löschen (`aktiv: bool`).
6. **Ergebnis-Historie:** Letzte 20 Drehungen speichern, damit man ein gutes Ergebnis nochmal finden kann.
7. **Zufalls-Gewichtung:** Optional Segmente gewichten (`gewicht: 1-5`), damit Favoriten häufiger kommen.
