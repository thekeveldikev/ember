# EMBER — Content-Datei 04: Tägliche Challenges

## Konzept

Die App gibt jeden Tag automatisch eine Challenge aus. Auswahl basiert auf:
- **Level** des Subs (bestimmt die Intensitäts-Range)
- **Tageszeit** (morgens/tagsüber/abends)
- **Kontext** (zusammen / getrennt / Wochentag / Wochenende)
- **Mood-Ampel** (bei Rot: nur `intensitaet: 1` oder gar keine Challenge)

## Format

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Eindeutig |
| `text` | string | Der Challenge-Text |
| `stufe` | int 1–5 | Level-Gate: Ab welchem Level verfügbar |
| `intensitaet` | int 1–5 | |
| `kontext` | string | `zusammen` \| `getrennt` \| `egal` |
| `tageszeit` | string | `morgen` \| `tag` \| `abend` \| `nacht` \| `egal` |
| `dauer_min` | int\|null | |
| `braucht_beweis` | bool | Ob Foto/Bestätigung nötig |
| `tags` | array | |

---

## STUFE 1 — Einstieg (harmlos bis andeutungsvoll)

```json
[
  {"id":"ch1-001","text":"Schick ihr ein Foto von dem was du gerade anhast.","stufe":1,"intensitaet":1,"kontext":"getrennt","tageszeit":"tag","dauer_min":2,"braucht_beweis":true,"tags":["foto"]},
  {"id":"ch1-002","text":"Küss sie heute mindestens fünfmal, ohne dass sie danach fragen muss.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["kuessen","initiative"]},
  {"id":"ch1-003","text":"Schreib ihr drei Dinge auf, die du heute an ihr besonders schön findest.","stufe":1,"intensitaet":1,"kontext":"egal","tageszeit":"egal","dauer_min":5,"braucht_beweis":true,"tags":["worte"]},
  {"id":"ch1-004","text":"Massiere ihr heute Abend zehn Minuten den Nacken. Ohne dass sie darum bittet.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"abend","dauer_min":10,"braucht_beweis":false,"tags":["massage"]},
  {"id":"ch1-005","text":"Kein Handy heute Abend, zwei Stunden lang. Nur ihr beide.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"abend","dauer_min":120,"braucht_beweis":false,"tags":["aufmerksamkeit"]},
  {"id":"ch1-006","text":"Umarme sie heute von hinten während sie etwas macht — und bleib eine Minute so stehen.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"egal","dauer_min":2,"braucht_beweis":false,"tags":["naehe"]},
  {"id":"ch1-007","text":"Schreib ihr mittags eine Nachricht, die sie zum Lächeln bringt.","stufe":1,"intensitaet":1,"kontext":"getrennt","tageszeit":"tag","dauer_min":2,"braucht_beweis":true,"tags":["nachricht"]},
  {"id":"ch1-008","text":"Zieh heute etwas an, von dem du weißt dass sie es an dir mag.","stufe":1,"intensitaet":1,"kontext":"egal","tageszeit":"morgen","dauer_min":null,"braucht_beweis":true,"tags":["kleidung"]},
  {"id":"ch1-009","text":"Bring ihr heute Abend etwas zu trinken ans Sofa, bevor sie fragt.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["dienen"]},
  {"id":"ch1-010","text":"Erzähl ihr heute von einer Erinnerung an euch, die dir besonders im Kopf geblieben ist.","stufe":1,"intensitaet":1,"kontext":"egal","tageszeit":"abend","dauer_min":10,"braucht_beweis":false,"tags":["erinnerung"]},
  {"id":"ch1-011","text":"Küss sie heute an einer Stelle, an der du sie sonst nie küsst.","stufe":1,"intensitaet":2,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["kuessen","neu"]},
  {"id":"ch1-012","text":"Halte heute beim Einschlafen ihre Hand. Die ganze Zeit bis du wegdöst.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"nacht","dauer_min":null,"braucht_beweis":false,"tags":["naehe"]},
  {"id":"ch1-013","text":"Frag sie heute nach einer Sache, die sie schon immer mal ausprobieren wollte. Und hör wirklich zu.","stufe":1,"intensitaet":2,"kontext":"zusammen","tageszeit":"abend","dauer_min":15,"braucht_beweis":false,"tags":["reden"]},
  {"id":"ch1-014","text":"Sag ihr heute einmal ganz direkt was du gerade an ihr willst. Ohne drumherum zu reden.","stufe":1,"intensitaet":2,"kontext":"egal","tageszeit":"egal","dauer_min":2,"braucht_beweis":false,"tags":["direktheit"]},
  {"id":"ch1-015","text":"Räum heute etwas auf, das sonst immer sie macht. Ohne es zu erwähnen.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["alltag","dienen"]}
]
```

---

## STUFE 2 — Aufwärmen (deutlich, aber noch verspielt)

```json
[
  {"id":"ch2-001","text":"Schick ihr ein Foto von dir, auf dem du weniger anhast als heute Morgen.","stufe":2,"intensitaet":2,"kontext":"getrennt","tageszeit":"tag","dauer_min":5,"braucht_beweis":true,"tags":["foto"]},
  {"id":"ch2-002","text":"Zieh dich heute Abend vor ihr aus. Langsam. Sie sagt dir wann du weitermachen darfst.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"abend","dauer_min":10,"braucht_beweis":false,"tags":["strip"]},
  {"id":"ch2-003","text":"Schreib ihr eine Nachricht die beschreibt, was du heute Abend mit ihr machen willst. Detailliert.","stufe":2,"intensitaet":3,"kontext":"getrennt","tageszeit":"tag","dauer_min":10,"braucht_beweis":true,"tags":["dirtytalk"]},
  {"id":"ch2-004","text":"Küss dich heute Abend von ihrem Hals bis zu ihren Füßen. Lass keine Stelle aus.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"abend","dauer_min":15,"braucht_beweis":false,"tags":["kuessen"]},
  {"id":"ch2-005","text":"Massiere sie heute komplett. Mit Öl. Sie muss keinen Finger rühren.","stufe":2,"intensitaet":2,"kontext":"zusammen","tageszeit":"abend","dauer_min":30,"braucht_beweis":false,"tags":["massage","dienen"]},
  {"id":"ch2-006","text":"Trag heute keine Unterwäsche. Sie darf jederzeit kontrollieren.","stufe":2,"intensitaet":3,"kontext":"egal","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["kleidung","geheim"]},
  {"id":"ch2-007","text":"Duscht heute zusammen. Du wäschst sie komplett.","stufe":2,"intensitaet":2,"kontext":"zusammen","tageszeit":"abend","dauer_min":20,"braucht_beweis":false,"tags":["dusche","dienen"]},
  {"id":"ch2-008","text":"Schick ihr eine Sprachnachricht, in der du ihr sagst was du gerade denkst. Ungefiltert.","stufe":2,"intensitaet":3,"kontext":"getrennt","tageszeit":"egal","dauer_min":3,"braucht_beweis":true,"tags":["voice"]},
  {"id":"ch2-009","text":"Fass sie heute Abend an, während ihr einen Film schaut. Unauffällig. Der Film läuft weiter.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"abend","dauer_min":45,"braucht_beweis":false,"tags":["subtil"]},
  {"id":"ch2-010","text":"Zieh ihr heute Abend die Schuhe aus und massiere ihre Füße. Zehn Minuten.","stufe":2,"intensitaet":2,"kontext":"zusammen","tageszeit":"abend","dauer_min":10,"braucht_beweis":false,"tags":["fuesse","dienen"]},
  {"id":"ch2-011","text":"Wecke sie heute nicht mit Worten, sondern mit deinen Händen.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"morgen","dauer_min":10,"braucht_beweis":false,"tags":["morgen"]},
  {"id":"ch2-012","text":"Sag ihr heute mindestens einmal, ganz direkt, was du dir von ihr wünschst. Mit klaren Worten.","stufe":2,"intensitaet":3,"kontext":"egal","tageszeit":"egal","dauer_min":2,"braucht_beweis":false,"tags":["worte","mut"]},
  {"id":"ch2-013","text":"Zieh heute Abend an, was sie dir raussucht. Egal was.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["kontrolle","kleidung"]},
  {"id":"ch2-014","text":"Schreib ihr auf, welche Fantasie du gerade am häufigsten hast. Schick es ab, ohne nochmal zu lesen.","stufe":2,"intensitaet":3,"kontext":"egal","tageszeit":"egal","dauer_min":10,"braucht_beweis":true,"tags":["offenheit","fantasie"]},
  {"id":"ch2-015","text":"Küss sie heute so, wie beim allerersten Mal. Und dann noch besser.","stufe":2,"intensitaet":2,"kontext":"zusammen","tageszeit":"egal","dauer_min":5,"braucht_beweis":false,"tags":["kuessen"]},
  {"id":"ch2-016","text":"Zieh dich vor dem Schlafengehen komplett aus und schlaf so ein — auch wenn nichts passiert.","stufe":2,"intensitaet":2,"kontext":"zusammen","tageszeit":"nacht","dauer_min":null,"braucht_beweis":false,"tags":["nackt","naehe"]},
  {"id":"ch2-017","text":"Frag sie heute höflich um Erlaubnis, bevor du sie anfasst. Bei jeder Berührung.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"abend","dauer_min":180,"braucht_beweis":false,"tags":["protokoll"]},
  {"id":"ch2-018","text":"Sag ihr heute den ganzen Tag über 'Ja' zu allem was sie will. Ohne Diskussion.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["gehorsam"]}
]
```

---

## STUFE 3 — Ernsthaft (explizit, aktive Dynamik)

```json
[
  {"id":"ch3-001","text":"Du machst sie heute Abend mit dem Mund fertig — und bekommst selbst nichts.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":25,"braucht_beweis":false,"tags":["oral","dienen"]},
  {"id":"ch3-002","text":"Fass dich heute an, aber komm nicht. Sie fragt heute Abend nach.","stufe":3,"intensitaet":4,"kontext":"egal","tageszeit":"tag","dauer_min":15,"braucht_beweis":false,"tags":["edging","denial"]},
  {"id":"ch3-003","text":"Knie dich heute Abend vor sie hin und warte, bis sie dir sagt was passiert.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":10,"braucht_beweis":false,"tags":["knien","warten"]},
  {"id":"ch3-004","text":"Schick ihr ein Foto von dir, das du sonst niemandem zeigen würdest.","stufe":3,"intensitaet":4,"kontext":"getrennt","tageszeit":"egal","dauer_min":5,"braucht_beweis":true,"tags":["foto","mut"]},
  {"id":"ch3-005","text":"Sie bestimmt heute Abend alles. Was du machst, wann du aufhörst, ob du überhaupt etwas bekommst.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["kontrolle"]},
  {"id":"ch3-006","text":"Du darfst heute nicht kommen. Sie schon. So oft sie will.","stufe":3,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["denial"]},
  {"id":"ch3-007","text":"Mach es dir selbst, während sie zuschaut. Sie sagt dir wann du aufhörst.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":15,"braucht_beweis":false,"tags":["masturbation","kontrolle"]},
  {"id":"ch3-008","text":"Zwei Runden heute. Zwischen den Runden eine Stunde Pause.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["training","ausdauer"]},
  {"id":"ch3-009","text":"Sie legt dir heute eine Regel fest, die den ganzen Tag gilt. Du hältst dich dran.","stufe":3,"intensitaet":4,"kontext":"egal","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["regel","gehorsam"]},
  {"id":"ch3-010","text":"Du hältst heute Abend mindestens fünfzehn Minuten durch. Schaffst du es nicht, wird morgen doppelt trainiert.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":15,"braucht_beweis":false,"tags":["ausdauer","training"]},
  {"id":"ch3-011","text":"Schreib ihr während sie arbeitet genau auf, was du heute Abend mit ihr machen wirst. Jedes Detail.","stufe":3,"intensitaet":4,"kontext":"getrennt","tageszeit":"tag","dauer_min":15,"braucht_beweis":true,"tags":["dirtytalk","vorfreude"]},
  {"id":"ch3-012","text":"Sie zieht dich heute an. Komplett. Auch die Unterwäsche.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"morgen","dauer_min":10,"braucht_beweis":false,"tags":["kontrolle","kleidung"]},
  {"id":"ch3-013","text":"Heute Abend keine Hände für dich. Nur sie bestimmt wie viel du bekommst.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["kontrolle","einschraenkung"]},
  {"id":"ch3-014","text":"Sprich sie heute den ganzen Tag mit dem Titel an, den sie sich aussucht.","stufe":3,"intensitaet":4,"kontext":"egal","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["protokoll"]},
  {"id":"ch3-015","text":"Melde dich heute jede Stunde bei ihr per Nachricht. Egal was du gerade machst.","stufe":3,"intensitaet":3,"kontext":"getrennt","tageszeit":"tag","dauer_min":480,"braucht_beweis":true,"tags":["kontrolle","meldung"]},
  {"id":"ch3-016","text":"Sie fesselt dich heute Abend. Was danach passiert, entscheidet sie.","stufe":3,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":45,"braucht_beweis":false,"tags":["bondage"]},
  {"id":"ch3-017","text":"Du gehst heute Abend runter und bleibst da, bis sie zweimal gekommen ist.","stufe":3,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":35,"braucht_beweis":false,"tags":["oral","ausdauer"]},
  {"id":"ch3-018","text":"Sie fährt dich heute Abend dreimal an die Kante und stoppt jedes Mal. Beim dritten Mal entscheidet sie spontan.","stufe":3,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":40,"braucht_beweis":false,"tags":["edging"]},
  {"id":"ch3-019","text":"Trag heute den ganzen Tag etwas von ihr unter deiner Kleidung. Niemand darf es merken.","stufe":3,"intensitaet":4,"kontext":"egal","tageszeit":"morgen","dauer_min":480,"braucht_beweis":true,"tags":["geheim","kleidung"]},
  {"id":"ch3-020","text":"Heute Abend gehört der erste Orgasmus ihr. Und der zweite auch. Erst dann bist du dran.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":60,"braucht_beweis":false,"tags":["reihenfolge","dienen"]}
]
```

---

## STUFE 4 — Fortgeschritten (intensiv, klare Machtdynamik)

```json
[
  {"id":"ch4-001","text":"Du bekommst heute keinen Orgasmus. Und morgen auch nicht. Sie sagt dir wann wieder.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["denial","lang"]},
  {"id":"ch4-002","text":"Sie benutzt dich heute Abend. Du liegst still und sagst danke.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":30,"braucht_beweis":false,"tags":["benutzen","hingabe"]},
  {"id":"ch4-003","text":"Fünfmal Edging heute Abend. Beim sechsten Mal entscheidet sie per Münzwurf.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":50,"braucht_beweis":false,"tags":["edging","zufall"]},
  {"id":"ch4-004","text":"Trag heute den ganzen Abend was sie dir reinsteckt. Auch beim Abendessen.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":180,"braucht_beweis":false,"tags":["plug","dauer"]},
  {"id":"ch4-005","text":"Sie fesselt dich, verbindet dir die Augen und lässt dich zwanzig Minuten allein.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":20,"braucht_beweis":false,"tags":["bondage","warten"]},
  {"id":"ch4-006","text":"Drei Runden heute. Zwischen jeder Runde fünfzehn Minuten Pause. Du machst alle drei mit.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":120,"braucht_beweis":false,"tags":["training","ausdauer"]},
  {"id":"ch4-007","text":"Sie macht es sich heute Abend selbst, direkt vor dir. Du darfst nur zuschauen.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":25,"braucht_beweis":false,"tags":["zuschauen","denial"]},
  {"id":"ch4-008","text":"Du bettelst heute Abend um jeden einzelnen Schritt. Überzeugend. Sonst passiert nichts.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":40,"braucht_beweis":false,"tags":["betteln"]},
  {"id":"ch4-009","text":"Ein ganzer Tag unter ihrer Kontrolle. Was du isst, was du anziehst, wann du schläfst.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["totalkontrolle"]},
  {"id":"ch4-010","text":"Sie fickt dich heute Abend mit dem Strapon. Du bereitest alles selbst vor.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":40,"braucht_beweis":false,"tags":["pegging"]},
  {"id":"ch4-011","text":"Zwei Orgasmen hintereinander. Ohne Pause. Auch wenn du bettelst dass sie aufhört.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":40,"braucht_beweis":false,"tags":["overstimulation"]},
  {"id":"ch4-012","text":"Halsband heute Abend. Den ganzen Abend. Auch wenn ihr nur auf dem Sofa sitzt.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":180,"braucht_beweis":false,"tags":["ds","protokoll"]},
  {"id":"ch4-013","text":"Sie schreibt dir etwas auf die Haut. Das bleibt bis morgen früh drauf.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":true,"tags":["markierung"]},
  {"id":"ch4-014","text":"Sie schickt dir heute alle zwanzig Minuten eine Anweisung. Du befolgst jede einzelne.","stufe":4,"intensitaet":5,"kontext":"getrennt","tageszeit":"tag","dauer_min":240,"braucht_beweis":true,"tags":["fernsteuerung"]},
  {"id":"ch4-015","text":"Eine Stunde Edging heute Abend. Danach entscheidet das Rad ob du darfst.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":60,"braucht_beweis":false,"tags":["edging","zufall"]},
  {"id":"ch4-016","text":"Sie kontrolliert heute das Toy per Fernbedienung. Den ganzen Abend. Egal wo ihr seid.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":240,"braucht_beweis":false,"tags":["remote","kontrolle"]},
  {"id":"ch4-017","text":"Du machst sie heute Abend dreimal fertig, bevor du überhaupt drankommst.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":60,"braucht_beweis":false,"tags":["dienen","ausdauer"]},
  {"id":"ch4-018","text":"Kein Blickkontakt heute Abend ohne ihre Erlaubnis. Kein einziges Mal.","stufe":4,"intensitaet":4,"kontext":"zusammen","tageszeit":"abend","dauer_min":180,"braucht_beweis":false,"tags":["protokoll"]}
]
```

---

## STUFE 5 — Maximum (das ganze Programm)

```json
[
  {"id":"ch5-001","text":"Heute gehörst du ihr komplett. Sie macht mit dir was sie will, du sagst nur Ja.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["hingabe","totalkontrolle"]},
  {"id":"ch5-002","text":"Eine Woche kein Orgasmus. Ab heute. Sie zählt mit.","stufe":5,"intensitaet":5,"kontext":"egal","tageszeit":"morgen","dauer_min":10080,"braucht_beweis":false,"tags":["denial","langzeit"]},
  {"id":"ch5-003","text":"Vier Runden heute. Sie hört nicht auf, bis du nicht mehr kannst — und dann noch einmal.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":180,"braucht_beweis":false,"tags":["ausdauer","limit"]},
  {"id":"ch5-004","text":"Gefesselt, Augen verbunden, geknebelt. Eine Stunde. Du weißt nicht was passiert.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":60,"braucht_beweis":false,"tags":["bondage","sensorisch"]},
  {"id":"ch5-005","text":"Zehnmal an die Kante heute Abend. Erst beim zehnten Mal darfst du — vielleicht.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":90,"braucht_beweis":false,"tags":["edging","extrem"]},
  {"id":"ch5-006","text":"Sie entscheidet heute, wie oft du kannst. Und dann macht sie eins mehr.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":120,"braucht_beweis":false,"tags":["overstimulation","training"]},
  {"id":"ch5-007","text":"Du kniest, wenn sie den Raum betritt. Den ganzen Tag. Jedes Mal.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["protokoll","knien"]},
  {"id":"ch5-008","text":"Sie schreibt heute Morgen auf, was am Abend passieren wird. Du liest es erst danach.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["ungewiss","geheim"]},
  {"id":"ch5-009","text":"Ein ganzes Wochenende unter ihren Regeln. Ab jetzt bis Sonntagabend.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"egal","dauer_min":2880,"braucht_beweis":false,"tags":["langzeit","totalkontrolle"]},
  {"id":"ch5-010","text":"Sie sitzt heute Abend auf deinem Gesicht, bis sie fertig ist. So oft sie will.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":45,"braucht_beweis":false,"tags":["facesitting","ausdauer"]},
  {"id":"ch5-011","text":"Du machst dich heute selbst fertig — dreimal. Und meldest jedes Mal.","stufe":5,"intensitaet":5,"kontext":"getrennt","tageszeit":"egal","dauer_min":null,"braucht_beweis":true,"tags":["training","frequenz"]},
  {"id":"ch5-012","text":"Heute darfst du nichts entscheiden. Nichts. Sie sagt dir jeden Schritt an.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["totalkontrolle"]},
  {"id":"ch5-013","text":"Sie bringt dich heute Abend an dein Limit. Und dann etwas darüber hinaus.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":90,"braucht_beweis":false,"tags":["limit","intensiv"]},
  {"id":"ch5-014","text":"Morgens, mittags, abends. Heute dreimal. Alle drei Male vollständig.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["frequenz","training"]},
  {"id":"ch5-015","text":"Sie sucht heute drei Karten aus drei verschiedenen Decks aus. Alle drei werden gemacht.","stufe":5,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":120,"braucht_beweis":false,"tags":["kombination","meta"]}
]
```

---

## SONDER-CHALLENGES (kontextabhängig, außerhalb der Stufen)

### Wochenende

```json
[
  {"id":"we-001","text":"Bleibt heute bis Mittag im Bett. Nichts anderes ist erlaubt.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"morgen","dauer_min":300,"braucht_beweis":false,"tags":["wochenende","auszeit"]},
  {"id":"we-002","text":"Heute macht ihr eine Sache von der Bucket-List. Sie sucht aus.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["wochenende","bucketlist"]},
  {"id":"we-003","text":"Ein ganzer Tag ohne Kleidung. Wohnung, Vorhänge zu, kein Besuch.","stufe":3,"intensitaet":3,"kontext":"zusammen","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["wochenende","nackt"]},
  {"id":"we-004","text":"Drehen wir heute dreimal am Rad. Alle drei Ergebnisse werden umgesetzt.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["wochenende","rad"]},
  {"id":"we-005","text":"Heute Abend ein Date wie beim ersten Mal. Danach das was danach kam.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["wochenende","romantik"]},
  {"id":"we-006","text":"Neuer Ort heute. Nicht das Schlafzimmer, nicht das Sofa. Sie sucht aus.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["wochenende","ort"]},
  {"id":"we-007","text":"Ein kompletter Verwöhn-Tag für sie. Du dienst, sie liegt rum.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"morgen","dauer_min":null,"braucht_beweis":false,"tags":["wochenende","dienen"]}
]
```

### Wenn ihr getrennt seid

```json
[
  {"id":"tr-001","text":"Videoanruf heute Abend. Sie sagt dir was du machst.","stufe":3,"intensitaet":4,"kontext":"getrennt","tageszeit":"abend","dauer_min":25,"braucht_beweis":false,"tags":["video","distanz"]},
  {"id":"tr-002","text":"Schreibt zusammen eine Fantasie. Abwechselnd, ein Satz pro Person, bis sie fertig ist.","stufe":2,"intensitaet":3,"kontext":"getrennt","tageszeit":"abend","dauer_min":30,"braucht_beweis":true,"tags":["schreiben","distanz"]},
  {"id":"tr-003","text":"Du fasst dich an, während sie dir schreibt was du machen sollst. Aber du kommst nicht.","stufe":4,"intensitaet":5,"kontext":"getrennt","tageszeit":"abend","dauer_min":25,"braucht_beweis":false,"tags":["denial","fernsteuerung"]},
  {"id":"tr-004","text":"Schick ihr heute drei Fotos über den Tag verteilt. Jedes gewagter als das vorherige.","stufe":3,"intensitaet":4,"kontext":"getrennt","tageszeit":"tag","dauer_min":null,"braucht_beweis":true,"tags":["foto","eskalation"]},
  {"id":"tr-005","text":"Sprachnachricht: Erzähl ihr in Ruhe, was du gerade machen würdest wenn sie da wäre. Alles.","stufe":3,"intensitaet":4,"kontext":"getrennt","tageszeit":"egal","dauer_min":5,"braucht_beweis":true,"tags":["voice","fantasie"]},
  {"id":"tr-006","text":"Du fasst dich heute gar nicht an. Sie fragt morgen nach — und sie merkt wenn du lügst.","stufe":4,"intensitaet":4,"kontext":"getrennt","tageszeit":"morgen","dauer_min":1440,"braucht_beweis":false,"tags":["denial","vertrauen"]}
]
```

### Ruhige Tage (Ampel gelb, wenig Energie)

```json
[
  {"id":"ru-001","text":"Heute nur kuscheln. Zwei Stunden. Nichts anderes.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"abend","dauer_min":120,"braucht_beweis":false,"tags":["ruhe","naehe"]},
  {"id":"ru-002","text":"Massiere ihr heute den Rücken, bis sie einschläft.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"nacht","dauer_min":25,"braucht_beweis":false,"tags":["ruhe","massage"]},
  {"id":"ru-003","text":"Redet heute Abend eine halbe Stunde über etwas, worüber ihr sonst nicht redet.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"abend","dauer_min":30,"braucht_beweis":false,"tags":["ruhe","reden"]},
  {"id":"ru-004","text":"Bad zusammen. Sonst nichts.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"abend","dauer_min":45,"braucht_beweis":false,"tags":["ruhe","bad"]},
  {"id":"ru-005","text":"Heute nichts. Kein Training, keine Aufgabe, keine Regel. Einfach nur ihr beide.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["ruhe","pause"]},
  {"id":"ru-006","text":"Schlaft heute früh. Zusammen. Ohne dass etwas passiert.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"nacht","dauer_min":null,"braucht_beweis":false,"tags":["ruhe","schlaf"]}
]
```

### Für sie (Challenges an Gioia)

```json
[
  {"id":"dom-001","text":"Sag ihm heute einmal ganz konkret, was du an ihm gut findest. Nicht allgemein — spezifisch.","stufe":1,"intensitaet":1,"kontext":"egal","tageszeit":"egal","dauer_min":2,"braucht_beweis":false,"tags":["domme","worte"]},
  {"id":"dom-002","text":"Leg ihm heute Morgen seine Kleidung raus. Er trägt genau das.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"morgen","dauer_min":5,"braucht_beweis":false,"tags":["domme","kontrolle"]},
  {"id":"dom-003","text":"Schick ihm mitten am Tag eine Anweisung. Ohne Vorwarnung, ohne Erklärung.","stufe":2,"intensitaet":3,"kontext":"getrennt","tageszeit":"tag","dauer_min":2,"braucht_beweis":false,"tags":["domme","spontan"]},
  {"id":"dom-004","text":"Setz heute eine neue Regel. Sag ihm nicht welche — er muss selbst nachschauen.","stufe":3,"intensitaet":4,"kontext":"egal","tageszeit":"egal","dauer_min":5,"braucht_beweis":false,"tags":["domme","regel"]},
  {"id":"dom-005","text":"Belohne ihn heute für etwas, das er letzte Woche gut gemacht hat. Er weiß nicht wofür.","stufe":2,"intensitaet":3,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["domme","belohnung"]},
  {"id":"dom-006","text":"Plane heute einen geheimen Auftrag für nächste Woche. Er sieht nur den Countdown.","stufe":3,"intensitaet":4,"kontext":"egal","tageszeit":"egal","dauer_min":10,"braucht_beweis":false,"tags":["domme","geheim"]},
  {"id":"dom-007","text":"Frag ihn heute Abend, wie es ihm mit allem geht. Richtig fragen, richtig zuhören.","stufe":1,"intensitaet":1,"kontext":"zusammen","tageszeit":"abend","dauer_min":20,"braucht_beweis":false,"tags":["domme","checkin"]},
  {"id":"dom-008","text":"Nimm dir heute etwas, ohne zu fragen. Er soll merken dass du es kannst.","stufe":3,"intensitaet":4,"kontext":"zusammen","tageszeit":"egal","dauer_min":null,"braucht_beweis":false,"tags":["domme","dominanz"]},
  {"id":"dom-009","text":"Erhöhe heute sein Ziel für diese Woche. Sag ihm die neue Zahl.","stufe":3,"intensitaet":4,"kontext":"egal","tageszeit":"egal","dauer_min":5,"braucht_beweis":false,"tags":["domme","training"]},
  {"id":"dom-010","text":"Lass ihn heute etwas machen, was er noch nie gemacht hat. Du entscheidest was.","stufe":4,"intensitaet":5,"kontext":"zusammen","tageszeit":"abend","dauer_min":null,"braucht_beweis":false,"tags":["domme","neu"]}
]
```

---

## Auswahl-Logik für die App

```json
{
  "auswahl_regeln": {
    "level_zu_stufe": {
      "1-5":   {"min_stufe":1,"max_stufe":1},
      "6-12":  {"min_stufe":1,"max_stufe":2},
      "13-20": {"min_stufe":2,"max_stufe":3},
      "21-30": {"min_stufe":2,"max_stufe":4},
      "31+":   {"min_stufe":3,"max_stufe":5}
    },
    "ampel_override": {
      "rot":  {"nur_pool":["ruhige_tage"],"max_intensitaet":1},
      "gelb": {"max_intensitaet":3},
      "gruen":{"max_intensitaet":5}
    },
    "kontext_erkennung": {
      "wochenende": "Samstag und Sonntag → Wochenend-Pool mit 40% Wahrscheinlichkeit einmischen",
      "getrennt": "Manuell durch Domme umschaltbar → nur kontext getrennt oder egal",
      "zusammen": "Standard → kontext zusammen oder egal"
    },
    "wiederholungssperre": "Eine Challenge darf frühestens nach 30 Tagen erneut kommen",
    "domme_pool": "Gioia bekommt eine eigene Challenge aus dem dom-Pool, unabhängig von Kevins",
    "domme_veto": "Domme sieht die Challenge des Tages vor Kevin und kann sie tauschen oder ersetzen"
  }
}
```

---

## Implementierungs-Hinweise

1. **Timing:** Challenge wird um 06:00 Uhr generiert und gilt bis Mitternacht. Domme sieht sie ab 05:00, damit sie tauschen kann.
2. **Beweis-Flow:** Bei `braucht_beweis: true` erscheint ein Upload-/Bestätigungs-Button. Der Beweis geht in den Chat.
3. **Streak:** Erfüllte Challenges zählen für den Streak-Counter. Ausgelassene brechen ihn — außer die Ampel stand auf Rot.
4. **Ablehnen:** Sub kann nicht ablehnen. Aber die Safeword-Funktion überschreibt alles jederzeit.
5. **Eigene Challenges:** Beide können eigene hinzufügen. Domme-erstellte Challenges haben Priorität vor automatisch generierten.
6. **Archiv:** Alle vergangenen Challenges mit Status (erfüllt/nicht erfüllt) bleiben einsehbar. Gute können als Favorit markiert und wiederverwendet werden.
