# EMBER — Content-Datei 06: Wahrheit oder Pflicht

## Konzept

Klassisches Spielprinzip mit **Eskalationssystem**: Das Spiel läuft in drei Stufen. Stufe 1 startet immer harmlos. Nach einer einstellbaren Anzahl Runden (Standard: 6) oder wenn beide zustimmen, steigt das Spiel auf Stufe 2, dann auf Stufe 3.

**Zwei Modi:**
- **Klassisch:** Abwechselnd, jeder wählt selbst Wahrheit oder Pflicht.
- **Ihre Wahl:** Gioia entscheidet für Kevin, ob er Wahrheit oder Pflicht bekommt. Kevin wählt für sich nicht selbst.

**Verweigern:** Wer nicht will, kann passen — aber jedes Passen kostet einen Karma-Punkt und landet in der Bestrafungs-Queue. Drei Mal passen beendet das Spiel.

## Format

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Eindeutig |
| `text` | string | Frage oder Aufgabe |
| `typ` | string | `wahrheit` \| `pflicht` |
| `stufe` | int 1–3 | Eskalationsstufe |
| `intensitaet` | int 1–5 | |
| `an` | string | `sub` \| `domme` \| `beide` |
| `kategorie` | string | Siehe Kategorien |
| `dauer_min` | int\|null | Nur bei Pflichten |
| `tags` | array | |

---

# TEIL A: WAHRHEIT

## Stufe 1 — Aufwärmen

### Kategorie: Beziehung & Erinnerung

```json
[
  {"id":"w1-001","text":"Wann hast du zum ersten Mal gedacht, dass aus uns etwas wird?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["anfang"]},
  {"id":"w1-002","text":"Was war der Moment, in dem du am meisten in mich verliebt warst?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["gefuehle"]},
  {"id":"w1-003","text":"Was hast du bei unserem ersten Treffen wirklich über mich gedacht — die ehrliche Version?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["anfang","ehrlich"]},
  {"id":"w1-004","text":"Welche Angewohnheit von mir findest du insgeheim nervig, hast es aber nie gesagt?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["ehrlich"]},
  {"id":"w1-005","text":"Was ist die kleinste Sache, die ich mache, die dir jedes Mal auffällt?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["detail"]},
  {"id":"w1-006","text":"Wann hast du dich das letzte Mal von mir richtig gesehen gefühlt?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["tief"]},
  {"id":"w1-007","text":"Was erzählst du anderen über mich, wenn ich nicht dabei bin?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["aussenwirkung"]},
  {"id":"w1-008","text":"Gibt es einen Streit, der dich mehr beschäftigt hat, als du damals zugegeben hast?","typ":"wahrheit","stufe":1,"intensitaet":3,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["konflikt"]},
  {"id":"w1-009","text":"Welche gemeinsame Erinnerung holst du hervor, wenn du dich schlecht fühlst?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["trost"]},
  {"id":"w1-010","text":"Was hast du an mir gelernt, das du vorher über dich nicht wusstest?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["tief"]},
  {"id":"w1-011","text":"Was wäre dein perfekter gemeinsamer Tag, wenn Geld und Zeit egal wären?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["traum"]},
  {"id":"w1-012","text":"Bei welchem Song denkst du automatisch an mich?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["musik"]},
  {"id":"w1-013","text":"Was ist das Netteste, das ich je für dich getan habe — und weiß ich, dass es dir so viel bedeutet hat?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["dankbarkeit"]},
  {"id":"w1-014","text":"Wovor hattest du am Anfang unserer Beziehung Angst?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["angst"]},
  {"id":"w1-015","text":"Was war die peinlichste Situation, in die wir uns gemeinsam gebracht haben?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"beziehung","dauer_min":null,"tags":["lustig"]}
]
```

### Kategorie: Körper & Anziehung

```json
[
  {"id":"w1-101","text":"Welchen Teil deines eigenen Körpers magst du am liebsten?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["selbstbild"]},
  {"id":"w1-102","text":"Was war das Erste, das dir körperlich an mir aufgefallen ist?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["anziehung"]},
  {"id":"w1-103","text":"Welche Stelle an dir wird zu selten beachtet?","typ":"wahrheit","stufe":1,"intensitaet":3,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["wunsch"]},
  {"id":"w1-104","text":"Wo willst du berührt werden, wenn du gestresst bist?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["beruehrung"]},
  {"id":"w1-105","text":"Was ziehe ich an, das dich sofort auf andere Gedanken bringt?","typ":"wahrheit","stufe":1,"intensitaet":3,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["kleidung"]},
  {"id":"w1-106","text":"Gibt es eine Stelle an dir, bei der du dich unsicher fühlst — und was würde helfen?","typ":"wahrheit","stufe":1,"intensitaet":3,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["verletzlich"]},
  {"id":"w1-107","text":"Welcher meiner Gerüche gefällt dir am besten?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["sinne"]},
  {"id":"w1-108","text":"Was macht meine Stimme mit dir, wenn ich leise rede?","typ":"wahrheit","stufe":1,"intensitaet":3,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["stimme"]},
  {"id":"w1-109","text":"Welche Bewegung von mir findest du unwiderstehlich, ohne dass ich es weiß?","typ":"wahrheit","stufe":1,"intensitaet":3,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["detail"]},
  {"id":"w1-110","text":"Was war dein Gedanke, als du mich das erste Mal nackt gesehen hast?","typ":"wahrheit","stufe":1,"intensitaet":3,"an":"beide","kategorie":"koerper","dauer_min":null,"tags":["erinnerung"]}
]
```

### Kategorie: Peinlich & Lustig

```json
[
  {"id":"w1-201","text":"Was war deine peinlichste Situation beim Sex — jemals, mit irgendwem?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"lustig","dauer_min":null,"tags":["peinlich"]},
  {"id":"w1-202","text":"Was ist das Seltsamste, das du je gegoogelt hast?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"lustig","dauer_min":null,"tags":["peinlich"]},
  {"id":"w1-203","text":"Wann hast du zuletzt so getan, als hättest du etwas verstanden, obwohl du keine Ahnung hattest?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"lustig","dauer_min":null,"tags":["gestaendnis"]},
  {"id":"w1-204","text":"Welche Lüge hast du mir schon mal erzählt, die völlig belanglos war?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"lustig","dauer_min":null,"tags":["gestaendnis"]},
  {"id":"w1-205","text":"Wofür hast du dich zuletzt fremdgeschämt — bei mir?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"lustig","dauer_min":null,"tags":["ehrlich"]},
  {"id":"w1-206","text":"Was ist deine unattraktivste Angewohnheit, von der du hoffst dass ich sie nicht bemerkt habe?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"lustig","dauer_min":null,"tags":["gestaendnis"]},
  {"id":"w1-207","text":"Was war dein cringiestes Verhalten, als du in mich verliebt warst und es noch nicht klar war?","typ":"wahrheit","stufe":1,"intensitaet":2,"an":"beide","kategorie":"lustig","dauer_min":null,"tags":["anfang"]},
  {"id":"w1-208","text":"In wen warst du als Jugendlicher am peinlichsten verknallt?","typ":"wahrheit","stufe":1,"intensitaet":1,"an":"beide","kategorie":"lustig","dauer_min":null,"tags":["vergangenheit"]}
]
```

---

## Stufe 2 — Wird ernster

### Kategorie: Vorlieben & Wünsche

```json
[
  {"id":"w2-001","text":"Was hast du dir schon mal gewünscht, aber nie ausgesprochen?","typ":"wahrheit","stufe":2,"intensitaet":3,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["ungesagt"]},
  {"id":"w2-002","text":"Was machen wir zu selten, das du eigentlich liebst?","typ":"wahrheit","stufe":2,"intensitaet":3,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["wunsch"]},
  {"id":"w2-003","text":"Gibt es etwas, das ich mache, das du eigentlich nicht so magst, aber nie gesagt hast?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["ehrlich","heikel"]},
  {"id":"w2-004","text":"Was war das beste Mal zwischen uns — und was genau war anders?","typ":"wahrheit","stufe":2,"intensitaet":3,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["erinnerung"]},
  {"id":"w2-005","text":"Wobei denkst du 'mehr davon', sagst es aber nicht laut?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["ungesagt"]},
  {"id":"w2-006","text":"Was würdest du gerne mal ausprobieren, traust dich aber nicht vorzuschlagen?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["mut"]},
  {"id":"w2-007","text":"Welches Wort oder welchen Satz willst du von mir hören, wenn wir zusammen sind?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["worte"]},
  {"id":"w2-008","text":"Was ist zu schnell vorbei, wenn wir es machen?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["tempo"]},
  {"id":"w2-009","text":"Was dauert dir manchmal zu lange?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["ehrlich"]},
  {"id":"w2-010","text":"Was würdest du wollen, dass ich öfter mit dir mache — auch wenn es untypisch für uns wäre?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["wunsch"]},
  {"id":"w2-011","text":"Wenn du eine Sache an unserem Sexleben ändern könntest — was?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["ehrlich"]},
  {"id":"w2-012","text":"Was tust du hauptsächlich für mich und nicht so sehr für dich?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"wuensche","dauer_min":null,"tags":["heikel"]}
]
```

### Kategorie: Dynamik (D/s)

```json
[
  {"id":"w2-101","text":"Was gefällt dir am meisten daran, dass ich bestimme?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds"]},
  {"id":"w2-102","text":"Was war der Moment, in dem du gemerkt hast, dass du das hier wirklich willst?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds","erkenntnis"]},
  {"id":"w2-103","text":"Welche Regel fällt dir am schwersten — und warum machst du trotzdem mit?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds","ehrlich"]},
  {"id":"w2-104","text":"Was macht es mit dir, wenn ich nein sage?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds","denial"]},
  {"id":"w2-105","text":"Wann hast du dich zuletzt gegen eine Regel entschieden und es mir nicht gesagt?","typ":"wahrheit","stufe":2,"intensitaet":5,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds","gestaendnis"]},
  {"id":"w2-106","text":"Was fühlst du in dem Moment, in dem du kniest?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds"]},
  {"id":"w2-107","text":"Was ist schwieriger für dich: gehorchen oder warten?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds"]},
  {"id":"w2-108","text":"Wie fühlt es sich für dich an, wenn ich zufrieden mit dir bin?","typ":"wahrheit","stufe":2,"intensitaet":3,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds","lob"]},
  {"id":"w2-109","text":"Gibt es eine Strafe, auf die du insgeheim hoffst?","typ":"wahrheit","stufe":2,"intensitaet":5,"an":"sub","kategorie":"dynamik","dauer_min":null,"tags":["ds","gestaendnis"]},
  {"id":"w2-110","text":"Was gefällt dir daran, die Kontrolle zu haben?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"domme","kategorie":"dynamik","dauer_min":null,"tags":["ds"]},
  {"id":"w2-111","text":"Wann hast du dich zuletzt unsicher gefühlt in der Rolle — und was hat geholfen?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"domme","kategorie":"dynamik","dauer_min":null,"tags":["ds","verletzlich"]},
  {"id":"w2-112","text":"Was ist anstrengend daran, immer zu entscheiden?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"domme","kategorie":"dynamik","dauer_min":null,"tags":["ds","ehrlich"]},
  {"id":"w2-113","text":"Was machst du mit mir am liebsten, wenn ich mich wehre — auch wenn es nur gespielt ist?","typ":"wahrheit","stufe":2,"intensitaet":5,"an":"domme","kategorie":"dynamik","dauer_min":null,"tags":["ds"]},
  {"id":"w2-114","text":"Was würdest du gerne von mir verlangen, hast dich aber noch nicht getraut?","typ":"wahrheit","stufe":2,"intensitaet":5,"an":"domme","kategorie":"dynamik","dauer_min":null,"tags":["ds","mut"]},
  {"id":"w2-115","text":"Ändert sich für dich etwas an mir, wenn ich gehorche?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"domme","kategorie":"dynamik","dauer_min":null,"tags":["ds"]}
]
```

### Kategorie: Vergangenheit

```json
[
  {"id":"w2-201","text":"Wie alt warst du beim ersten Mal — und wie war es wirklich?","typ":"wahrheit","stufe":2,"intensitaet":3,"an":"beide","kategorie":"vergangenheit","dauer_min":null,"tags":["erstes_mal"]},
  {"id":"w2-202","text":"Was hast du in einer früheren Beziehung gemacht, das wir nie gemacht haben?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"vergangenheit","dauer_min":null,"tags":["heikel"]},
  {"id":"w2-203","text":"Wann hast du das erste Mal gemerkt, dass du auf Machtdynamiken stehst?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"vergangenheit","dauer_min":null,"tags":["ds","erkenntnis"]},
  {"id":"w2-204","text":"Was war der ungewöhnlichste Ort, an dem du je Sex hattest?","typ":"wahrheit","stufe":2,"intensitaet":3,"an":"beide","kategorie":"vergangenheit","dauer_min":null,"tags":["ort"]},
  {"id":"w2-205","text":"Gab es je jemanden, bei dem du gedacht hast 'das war ein Fehler' — und warum?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"vergangenheit","dauer_min":null,"tags":["heikel"]},
  {"id":"w2-206","text":"Was war dein erstes wirklich intensives sexuelles Erlebnis, an das du dich klar erinnerst?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"vergangenheit","dauer_min":null,"tags":["erinnerung"]},
  {"id":"w2-207","text":"Hast du je jemandem etwas vorgespielt? Was und warum?","typ":"wahrheit","stufe":2,"intensitaet":4,"an":"beide","kategorie":"vergangenheit","dauer_min":null,"tags":["gestaendnis"]},
  {"id":"w2-208","text":"Was hast du vor mir noch nie jemandem erzählt?","typ":"wahrheit","stufe":2,"intensitaet":5,"an":"beide","kategorie":"vergangenheit","dauer_min":null,"tags":["vertrauen"]}
]
```

---

## Stufe 3 — Kein Zurück

### Kategorie: Fantasien

```json
[
  {"id":"w3-001","text":"Erzähl mir deine Fantasie, die du am häufigsten hast. Komplett, von Anfang bis Ende.","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["explizit"]},
  {"id":"w3-002","text":"Woran denkst du, wenn du dich allein anfasst?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["explizit"]},
  {"id":"w3-003","text":"Was ist die Fantasie, von der du glaubst, sie wäre mir zu viel?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["grenze"]},
  {"id":"w3-004","text":"Gibt es etwas, das dich anmacht, wovon du wünschst, es würde dich nicht anmachen?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["verletzlich"]},
  {"id":"w3-005","text":"Was ist das Extremste, das du dir vorstellen kannst, tatsächlich zu machen?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["grenze"]},
  {"id":"w3-006","text":"Beschreib mir genau, was du willst, dass ich als Nächstes mit dir mache. Detailliert.","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["explizit","direkt"]},
  {"id":"w3-007","text":"Welche Szene aus deinem Kopf würdest du gerne einmal genau so erleben?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["explizit"]},
  {"id":"w3-008","text":"Was wolltest du schon immer mal sagen dürfen, ohne dass es komisch wird?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["worte"]},
  {"id":"w3-009","text":"Gibt es eine Rolle, in die du gerne mal schlüpfen würdest, die gar nicht zu dir passt?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["rollenspiel"]},
  {"id":"w3-010","text":"Was auf deiner Liste hast du noch nicht eingetragen, weil du dich nicht getraut hast?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["mut"]},
  {"id":"w3-011","text":"Welche Fantasie hast du, in der ich vorkomme, die du mir nie erzählt hast?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":null,"tags":["explizit"]},
  {"id":"w3-012","text":"Was ist das Härteste, das du dir von mir wünschen würdest?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"sub","kategorie":"fantasie","dauer_min":null,"tags":["ds","grenze"]}
]
```

### Kategorie: Direkt & Schamlos

```json
[
  {"id":"w3-101","text":"Wie oft hast du diese Woche an mich gedacht, während du dich angefasst hast?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["explizit"]},
  {"id":"w3-102","text":"Was macht dich schneller fertig als alles andere?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["explizit"]},
  {"id":"w3-103","text":"Wann hast du mich zuletzt angesehen und sofort daran gedacht?","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["explizit"]},
  {"id":"w3-104","text":"Was ist das Schmutzigste, das du je gedacht hast, während wir in der Öffentlichkeit waren?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["explizit","public"]},
  {"id":"w3-105","text":"Wo willst du mich gerade jetzt anfassen?","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["jetzt"]},
  {"id":"w3-106","text":"Wie geil bist du gerade, auf einer Skala von eins bis zehn — und ehrlich.","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["jetzt"]},
  {"id":"w3-107","text":"Was hättest du gerade am liebsten in dir oder an dir?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["explizit","jetzt"]},
  {"id":"w3-108","text":"Was war das letzte Mal, bei dem du dich beim Sex komplett hast fallen lassen — und was war der Unterschied?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["tief"]},
  {"id":"w3-109","text":"Welches Geräusch von mir macht dich am meisten an?","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["sinne"]},
  {"id":"w3-110","text":"Was würdest du jetzt sofort machen, wenn ich sagen würde 'alles ist erlaubt'?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"direkt","dauer_min":null,"tags":["jetzt","explizit"]}
]
```

### Kategorie: Tief & Verletzlich

```json
[
  {"id":"w3-201","text":"Was ist die größte Angst, die du in Bezug auf uns hast?","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"tief","dauer_min":null,"tags":["angst"]},
  {"id":"w3-202","text":"Wann hast du dich zuletzt einsam gefühlt, obwohl ich da war?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"tief","dauer_min":null,"tags":["heikel"]},
  {"id":"w3-203","text":"Was brauchst du von mir, das du dich nicht traust einzufordern?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"tief","dauer_min":null,"tags":["beduerfnis"]},
  {"id":"w3-204","text":"Was denkst du über dich selbst, das du dir nie laut sagst?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"tief","dauer_min":null,"tags":["verletzlich"]},
  {"id":"w3-205","text":"Wovor hast du am meisten Angst, dass ich es über dich herausfinde?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"tief","dauer_min":null,"tags":["verletzlich"]},
  {"id":"w3-206","text":"Was würdest du an dir ändern, wenn du könntest — und was hält dich davon ab, es zu versuchen?","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"tief","dauer_min":null,"tags":["selbstbild"]},
  {"id":"w3-207","text":"Wann warst du zuletzt richtig stolz auf dich?","typ":"wahrheit","stufe":3,"intensitaet":2,"an":"beide","kategorie":"tief","dauer_min":null,"tags":["positiv"]},
  {"id":"w3-208","text":"Was ist etwas, das ich sagen könnte, das dich sofort umhauen würde — im guten Sinn?","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"tief","dauer_min":null,"tags":["beduerfnis"]}
]
```

### Kategorie: Hypothetisch

```json
[
  {"id":"w3-301","text":"Wenn du mich für 24 Stunden komplett kontrollieren könntest — was würdest du machen?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"hypothetisch","dauer_min":null,"tags":["macht"]},
  {"id":"w3-302","text":"Wenn ich dir eine einzige Grenze aufheben würde — welche?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"hypothetisch","dauer_min":null,"tags":["grenze"]},
  {"id":"w3-303","text":"Wenn wir einen Tag lang die Rollen tauschen würden — was wäre das Erste, das du machen würdest?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"hypothetisch","dauer_min":null,"tags":["rollentausch"]},
  {"id":"w3-304","text":"Wenn du einen Abend lang völlig ohne Konsequenzen handeln könntest — was?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"hypothetisch","dauer_min":null,"tags":["freiheit"]},
  {"id":"w3-305","text":"Wenn du eine Sache aus unserer Vergangenheit ungeschehen machen könntest — welche?","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"hypothetisch","dauer_min":null,"tags":["heikel"]},
  {"id":"w3-306","text":"Wenn wir ein Wochenende irgendwo hinfahren könnten, nur um alles auszuprobieren — wo und was?","typ":"wahrheit","stufe":3,"intensitaet":4,"an":"beide","kategorie":"hypothetisch","dauer_min":null,"tags":["reise"]},
  {"id":"w3-307","text":"Wenn du mir eine Regel auferlegen dürftest, die ein Jahr gilt — welche?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"hypothetisch","dauer_min":null,"tags":["macht"]},
  {"id":"w3-308","text":"Wenn du wüsstest, ich würde nie urteilen — was würdest du mir sofort erzählen?","typ":"wahrheit","stufe":3,"intensitaet":5,"an":"beide","kategorie":"hypothetisch","dauer_min":null,"tags":["vertrauen"]}
]
```

---

# TEIL B: PFLICHT

## Stufe 1 — Aufwärmen

```json
[
  {"id":"p1-001","text":"Küss mich zehn Sekunden lang, ohne die Hände zu benutzen.","typ":"pflicht","stufe":1,"intensitaet":2,"an":"beide","kategorie":"kuessen","dauer_min":1,"tags":["kuessen"]},
  {"id":"p1-002","text":"Sag mir drei Dinge, die du gerade an mir attraktiv findest — ohne zu zögern.","typ":"pflicht","stufe":1,"intensitaet":2,"an":"beide","kategorie":"worte","dauer_min":2,"tags":["kompliment"]},
  {"id":"p1-003","text":"Zieh ein Kleidungsstück aus. Du wählst welches.","typ":"pflicht","stufe":1,"intensitaet":2,"an":"beide","kategorie":"strip","dauer_min":1,"tags":["strip"]},
  {"id":"p1-004","text":"Massiere mir zwei Minuten den Nacken.","typ":"pflicht","stufe":1,"intensitaet":1,"an":"beide","kategorie":"beruehrung","dauer_min":2,"tags":["massage"]},
  {"id":"p1-005","text":"Schau mir eine Minute lang in die Augen. Ohne zu reden, ohne wegzuschauen.","typ":"pflicht","stufe":1,"intensitaet":2,"an":"beide","kategorie":"intim","dauer_min":1,"tags":["blick"]},
  {"id":"p1-006","text":"Zeig mir dein letztes Selfie, das du niemandem geschickt hast.","typ":"pflicht","stufe":1,"intensitaet":2,"an":"beide","kategorie":"handy","dauer_min":1,"tags":["peinlich"]},
  {"id":"p1-007","text":"Küss mich an drei Stellen, die ich mir aussuche.","typ":"pflicht","stufe":1,"intensitaet":2,"an":"beide","kategorie":"kuessen","dauer_min":2,"tags":["kuessen"]},
  {"id":"p1-008","text":"Beschreib mit geschlossenen Augen, was ich gerade anhabe. Jedes Teil.","typ":"pflicht","stufe":1,"intensitaet":1,"an":"beide","kategorie":"spiel","dauer_min":2,"tags":["aufmerksamkeit"]},
  {"id":"p1-009","text":"Flüster mir etwas ins Ohr, das du sonst nicht laut sagen würdest.","typ":"pflicht","stufe":1,"intensitaet":3,"an":"beide","kategorie":"worte","dauer_min":1,"tags":["fluestern"]},
  {"id":"p1-010","text":"Setz dich für die nächsten drei Runden auf meinen Schoß.","typ":"pflicht","stufe":1,"intensitaet":2,"an":"beide","kategorie":"naehe","dauer_min":null,"tags":["position"]},
  {"id":"p1-011","text":"Führ meine Hand dahin, wo du gerne berührt werden willst. Ohne zu reden.","typ":"pflicht","stufe":1,"intensitaet":3,"an":"beide","kategorie":"beruehrung","dauer_min":1,"tags":["zeigen"]},
  {"id":"p1-012","text":"Imitiere mich, wenn ich genervt bin. Übertreib ruhig.","typ":"pflicht","stufe":1,"intensitaet":1,"an":"beide","kategorie":"lustig","dauer_min":2,"tags":["lustig"]},
  {"id":"p1-013","text":"Trink etwas — und ich bestimme was.","typ":"pflicht","stufe":1,"intensitaet":1,"an":"beide","kategorie":"lustig","dauer_min":1,"tags":["lustig"]},
  {"id":"p1-014","text":"Schreib mir mit dem Finger ein Wort auf den Rücken. Ich muss es erraten.","typ":"pflicht","stufe":1,"intensitaet":2,"an":"beide","kategorie":"spiel","dauer_min":3,"tags":["spiel"]},
  {"id":"p1-015","text":"Umarme mich eine Minute lang, ohne loszulassen.","typ":"pflicht","stufe":1,"intensitaet":1,"an":"beide","kategorie":"naehe","dauer_min":1,"tags":["naehe"]}
]
```

## Stufe 2 — Wird ernster

```json
[
  {"id":"p2-001","text":"Zieh dich bis auf die Unterwäsche aus und bleib so für den Rest des Spiels.","typ":"pflicht","stufe":2,"intensitaet":3,"an":"beide","kategorie":"strip","dauer_min":null,"tags":["strip"]},
  {"id":"p2-002","text":"Küss mich drei Minuten lang. Deine Hände bleiben, wo ich sie hinlege.","typ":"pflicht","stufe":2,"intensitaet":3,"an":"sub","kategorie":"kuessen","dauer_min":3,"tags":["kontrolle"]},
  {"id":"p2-003","text":"Zeig mir, wie du dich anfasst, wenn du an mich denkst. Nur zeigen, nicht weitermachen.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"beide","kategorie":"zeigen","dauer_min":2,"tags":["masturbation"]},
  {"id":"p2-004","text":"Knie dich vor mich und warte, bis ich dir sage, dass du aufstehen darfst.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"sub","kategorie":"ds","dauer_min":3,"tags":["knien"]},
  {"id":"p2-005","text":"Zieh mir ein Kleidungsstück mit den Zähnen aus.","typ":"pflicht","stufe":2,"intensitaet":3,"an":"beide","kategorie":"strip","dauer_min":2,"tags":["zaehne"]},
  {"id":"p2-006","text":"Küss dich von meinem Hals bis zum Bauchnabel. Nimm dir Zeit.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"beide","kategorie":"kuessen","dauer_min":5,"tags":["kuessen"]},
  {"id":"p2-007","text":"Sag mir laut und deutlich, was du gerade willst. Ohne Umschreibungen.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"beide","kategorie":"worte","dauer_min":1,"tags":["direkt"]},
  {"id":"p2-008","text":"Fass mich zwei Minuten lang an, wo du willst — außer da, wo du am liebsten würdest.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"beide","kategorie":"beruehrung","dauer_min":2,"tags":["teasing"]},
  {"id":"p2-009","text":"Nimm einen Eiswürfel und fahr damit über meine Haut. Ich sage wo.","typ":"pflicht","stufe":2,"intensitaet":3,"an":"beide","kategorie":"sinne","dauer_min":3,"tags":["temperatur"]},
  {"id":"p2-010","text":"Schick mir jetzt sofort eine Nachricht mit dem, was du heute Nacht machen willst.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"beide","kategorie":"worte","dauer_min":3,"tags":["schreiben"]},
  {"id":"p2-011","text":"Lass dir die Augen verbinden und errate, womit ich dich berühre. Drei Versuche.","typ":"pflicht","stufe":2,"intensitaet":3,"an":"beide","kategorie":"sinne","dauer_min":5,"tags":["raten"]},
  {"id":"p2-012","text":"Mach zwei Minuten lang genau das, was ich dir ansage. Ohne Nachfragen.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"sub","kategorie":"ds","dauer_min":2,"tags":["gehorsam"]},
  {"id":"p2-013","text":"Zieh das an, was ich dir gebe. Egal was es ist.","typ":"pflicht","stufe":2,"intensitaet":3,"an":"sub","kategorie":"kleidung","dauer_min":3,"tags":["kontrolle"]},
  {"id":"p2-014","text":"Sitz die nächsten drei Runden auf dem Boden zu meinen Füßen.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"sub","kategorie":"ds","dauer_min":null,"tags":["protokoll"]},
  {"id":"p2-015","text":"Beschreib mir eine Minute lang, was du an mir am geilsten findest. Nicht aufhören zu reden.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"beide","kategorie":"worte","dauer_min":1,"tags":["dirtytalk"]},
  {"id":"p2-016","text":"Lass mich eine Minute lang mit dir machen, was ich will. Du hältst still.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"sub","kategorie":"ds","dauer_min":1,"tags":["passiv"]},
  {"id":"p2-017","text":"Zeig mir eine Position, die du gerne mal ausprobieren würdest. Angezogen reicht.","typ":"pflicht","stufe":2,"intensitaet":3,"an":"beide","kategorie":"zeigen","dauer_min":2,"tags":["position"]},
  {"id":"p2-018","text":"Bettel darum, dass ich dich küsse. Überzeugend.","typ":"pflicht","stufe":2,"intensitaet":4,"an":"sub","kategorie":"ds","dauer_min":1,"tags":["betteln"]}
]
```

## Stufe 3 — Kein Zurück

```json
[
  {"id":"p3-001","text":"Zieh dich komplett aus. Das Spiel geht so weiter.","typ":"pflicht","stufe":3,"intensitaet":4,"an":"beide","kategorie":"strip","dauer_min":null,"tags":["nackt"]},
  {"id":"p3-002","text":"Mach es dir selbst, während ich zuschaue. Ich sage, wann du aufhörst.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"beide","kategorie":"masturbation","dauer_min":5,"tags":["zuschauen"]},
  {"id":"p3-003","text":"Geh runter. Fünf Minuten. Der Timer läuft.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"oral","dauer_min":5,"tags":["oral"]},
  {"id":"p3-004","text":"Bring mich mit den Fingern an die Kante — und hör auf, bevor ich soweit bin.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"haende","dauer_min":10,"tags":["edging"]},
  {"id":"p3-005","text":"Lass dich fesseln. Das Spiel geht so weiter.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"bondage","dauer_min":null,"tags":["bondage"]},
  {"id":"p3-006","text":"Erzähl mir deine Fantasie — und mach sie gleichzeitig an mir vor, so weit es geht.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"beide","kategorie":"fantasie","dauer_min":10,"tags":["explizit"]},
  {"id":"p3-007","text":"Zehn Minuten lang gehörst du mir. Ich sage jeden Schritt an, du machst ihn.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"ds","dauer_min":10,"tags":["kontrolle"]},
  {"id":"p3-008","text":"Bettel um Erlaubnis zu kommen. Ich sage nein.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"ds","dauer_min":3,"tags":["denial","betteln"]},
  {"id":"p3-009","text":"Zieh eine Karte aus einem beliebigen Deck. Sie wird jetzt gemacht.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"beide","kategorie":"meta","dauer_min":null,"tags":["karte"]},
  {"id":"p3-010","text":"Dreh am Rad. Was rauskommt, passiert. Sofort.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"beide","kategorie":"meta","dauer_min":null,"tags":["rad"]},
  {"id":"p3-011","text":"Lass mich fünf Minuten lang machen, was ich will. Du sagst kein Wort und bewegst dich nicht.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"ds","dauer_min":5,"tags":["passiv","stille"]},
  {"id":"p3-012","text":"Sag mir dreimal hintereinander, was du bist — mit den Worten, die ich dir vorgebe.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"ds","dauer_min":2,"tags":["worte","demut"]},
  {"id":"p3-013","text":"Nimm das Toy, das ich dir gebe, und benutze es an dir. Ich schaue zu.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"beide","kategorie":"toys","dauer_min":10,"tags":["toy","zuschauen"]},
  {"id":"p3-014","text":"Halt drei Minuten lang komplett still, egal was ich mache.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"ds","dauer_min":3,"tags":["stillhalten"]},
  {"id":"p3-015","text":"Küss mich überall — und ich sage dir bei jeder Stelle, ob du bleiben darfst oder weitermusst.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"kuessen","dauer_min":10,"tags":["kontrolle"]},
  {"id":"p3-016","text":"Schick mir jetzt ein Foto von dir, das nur ich je sehen darf.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"beide","kategorie":"foto","dauer_min":3,"tags":["foto"]},
  {"id":"p3-017","text":"Das Spiel pausiert. Wir machen das, was gerade auf der Wunschliste ganz oben steht.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"beide","kategorie":"meta","dauer_min":null,"tags":["wunschliste"]},
  {"id":"p3-018","text":"Ich schreibe dir etwas auf die Haut. Du entscheidest nicht, was.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"ds","dauer_min":5,"tags":["markierung"]},
  {"id":"p3-019","text":"Frag mich um Erlaubnis für jeden einzelnen Schritt, den du machen willst. Für den Rest des Spiels.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"ds","dauer_min":null,"tags":["protokoll"]},
  {"id":"p3-020","text":"Das Spiel ist vorbei. Du machst jetzt das, was ich sage.","typ":"pflicht","stufe":3,"intensitaet":5,"an":"sub","kategorie":"meta","dauer_min":null,"tags":["ende"]}
]
```

---

## Spiel-Mechanik

```json
{
  "mechanik": {
    "eskalation": {
      "stufe_1_runden": 6,
      "stufe_2_runden": 6,
      "stufe_3_runden": "unbegrenzt",
      "manueller_sprung": "Beide müssen zustimmen um früher zu eskalieren",
      "domme_override": "Gioia kann jederzeit eine Stufe überspringen"
    },
    "passen": {
      "erlaubt": true,
      "kosten": "1 Karma-Punkt + Eintrag in Bestrafungs-Queue",
      "max_pro_spiel": 3,
      "nach_max": "Spiel endet, Domme entscheidet über Konsequenz"
    },
    "modi": [
      {"key":"klassisch","name":"Klassisch","beschreibung":"Jeder wählt selbst Wahrheit oder Pflicht"},
      {"key":"ihre_wahl","name":"Ihre Wahl","beschreibung":"Gioia entscheidet für Kevin"},
      {"key":"zufall","name":"Zufall","beschreibung":"Die App entscheidet für beide"},
      {"key":"nur_wahrheit","name":"Nur Wahrheit","beschreibung":"Für Gespräche ohne Aktion"},
      {"key":"nur_pflicht","name":"Nur Pflicht","beschreibung":"Für wenn nicht geredet wird"}
    ],
    "safeword": "Jederzeit verfügbar, beendet das Spiel sofort ohne Konsequenz",
    "wiederholungssperre": "Eine Frage/Aufgabe frühestens nach 20 Spielen erneut",
    "eigene_eintraege": "Beide können eigene Fragen und Pflichten hinzufügen; diese haben doppelte Gewichtung"
  }
}
```

## Implementierungs-Hinweise

1. **Kartenoptik:** Wahrheit und Pflicht sollten optisch klar unterscheidbar sein — z.B. Wahrheit in kühlem Blau, Pflicht in warmem Rot. Flip-Animation beim Aufdecken.
2. **Stufenanzeige:** Eine dezente Fortschrittsleiste zeigt, wie nah die nächste Eskalationsstufe ist. Baut Spannung auf.
3. **Timer-Integration:** Bei Pflichten mit `dauer_min` startet automatisch ein sichtbarer Countdown.
4. **Meta-Karten:** Karten mit `kategorie: meta` greifen auf andere App-Bereiche zu (Rad drehen, Karte ziehen, Wunschliste öffnen). Die App muss diese Verweise auflösen können.
5. **Antwort-Archiv:** Wahrheiten mit tiefen Antworten können optional gespeichert werden — mit Zustimmung beider. Ergibt über Zeit ein sehr wertvolles Archiv.
6. **Filter für `an`:** Karten mit `an: sub` oder `an: domme` werden nur der jeweiligen Person gestellt.
