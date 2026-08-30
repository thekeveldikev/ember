# EMBER — Content-Datei 03: Szenario-Generator

## Konzept

Der Generator setzt Szenarien aus Bausteinen zusammen. Jeder Baustein-Typ ist ein Slot. Die App füllt die Slots zufällig und rendert daraus einen zusammenhängenden Text.

**Satz-Templates** definieren, wie die Slots zu Prosa werden. Beispiel:

> `{eroeffnung} {ort_satz} {aktion_satz} {regel_satz} {ende_satz}`
> → *"Ich lasse dich warten. Wenn ich zurückkomme, kniest du im Schlafzimmer. Du machst mich mit dem Mund fertig — und du darfst dabei deine Hände nicht benutzen. Wenn ich zufrieden bin, entscheide ich ob du auch etwas bekommst."*

---

## Baustein-Format

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Eindeutig |
| `text` | string | Der Textbaustein |
| `slot` | string | Zu welchem Slot er gehört |
| `intensitaet` | int 1–5 | Filterbar |
| `tags` | array | Für thematische Kohärenz-Prüfung |
| `folgt_gut_auf` | array\|null | Optionale Kohärenz-Hilfe |

---

## Slot 1: ERÖFFNUNG (wie es anfängt)

```json
[
  {"id":"ero-001","text":"Wenn ich heute Abend nach Hause komme,","slot":"eroeffnung","intensitaet":2,"tags":["ankunft"]},
  {"id":"ero-002","text":"Sobald die Tür hinter mir zufällt,","slot":"eroeffnung","intensitaet":3,"tags":["ankunft","sofort"]},
  {"id":"ero-003","text":"Ich lasse dich erstmal eine Stunde warten. Danach","slot":"eroeffnung","intensitaet":4,"tags":["warten"]},
  {"id":"ero-004","text":"Du bekommst keine Vorwarnung. Irgendwann heute","slot":"eroeffnung","intensitaet":4,"tags":["ungewiss"]},
  {"id":"ero-005","text":"Bevor irgendetwas anderes passiert,","slot":"eroeffnung","intensitaet":3,"tags":["prioritaet"]},
  {"id":"ero-006","text":"Wir fangen ganz harmlos an. Und dann","slot":"eroeffnung","intensitaet":3,"tags":["eskalation"]},
  {"id":"ero-007","text":"Ich wecke dich mitten in der Nacht und","slot":"eroeffnung","intensitaet":4,"tags":["nacht"]},
  {"id":"ero-008","text":"Direkt nach dem Aufwachen, bevor du überhaupt richtig wach bist,","slot":"eroeffnung","intensitaet":3,"tags":["morgen"]},
  {"id":"ero-009","text":"Du weißt schon den ganzen Tag dass etwas kommt. Am Abend dann","slot":"eroeffnung","intensitaet":4,"tags":["vorfreude"]},
  {"id":"ero-010","text":"Ich schicke dir eine Nachricht und danach hast du zehn Minuten. Dann","slot":"eroeffnung","intensitaet":4,"tags":["countdown"]},
  {"id":"ero-011","text":"Wir sind mitten in etwas völlig Normalem, und plötzlich","slot":"eroeffnung","intensitaet":4,"tags":["spontan"]},
  {"id":"ero-012","text":"Du hast dich schon vorbereitet, so wie ich es dir gesagt habe. Dann","slot":"eroeffnung","intensitaet":4,"tags":["vorbereitung"]},
  {"id":"ero-013","text":"Kerzen sind an, Musik läuft, und","slot":"eroeffnung","intensitaet":2,"tags":["atmosphaere"]},
  {"id":"ero-014","text":"Ich sage kein Wort. Ich zeige nur, und","slot":"eroeffnung","intensitaet":4,"tags":["stille","dominanz"]},
  {"id":"ero-015","text":"Ich komme rein, sehe dich an, und ohne Erklärung","slot":"eroeffnung","intensitaet":4,"tags":["direkt"]},
  {"id":"ero-016","text":"Nach einem langen Tag, wenn wir beide fertig sind,","slot":"eroeffnung","intensitaet":2,"tags":["abend"]},
  {"id":"ero-017","text":"Du bekommst eine Augenbinde in die Hand gedrückt. Danach","slot":"eroeffnung","intensitaet":4,"tags":["sinne"]},
  {"id":"ero-018","text":"Ich schicke dich duschen und lege dir raus was du danach anziehst. Dann","slot":"eroeffnung","intensitaet":4,"tags":["vorbereitung","kontrolle"]},
  {"id":"ero-019","text":"Der Timer läuft schon. Wenn er klingelt,","slot":"eroeffnung","intensitaet":4,"tags":["countdown"]},
  {"id":"ero-020","text":"Du hast eine Woche gewartet. Heute","slot":"eroeffnung","intensitaet":5,"tags":["denial","belohnung"]}
]
```

---

## Slot 2: ORT

```json
[
  {"id":"ort-001","text":"wartest du auf mich im Schlafzimmer","slot":"ort","intensitaet":2,"tags":["standard"]},
  {"id":"ort-002","text":"kniest du im Flur","slot":"ort","intensitaet":4,"tags":["knien"]},
  {"id":"ort-003","text":"stehst du in der Küche an die Arbeitsplatte gelehnt","slot":"ort","intensitaet":3,"tags":["kueche"]},
  {"id":"ort-004","text":"liegst du auf dem Sofa","slot":"ort","intensitaet":2,"tags":["wohnzimmer"]},
  {"id":"ort-005","text":"stehst du unter der Dusche","slot":"ort","intensitaet":3,"tags":["bad"]},
  {"id":"ort-006","text":"sitzt du auf dem Stuhl mitten im Raum","slot":"ort","intensitaet":4,"tags":["exponiert"]},
  {"id":"ort-007","text":"stehst du vor dem großen Spiegel","slot":"ort","intensitaet":4,"tags":["spiegel"]},
  {"id":"ort-008","text":"liegst du quer über dem Bett","slot":"ort","intensitaet":3,"tags":["bett"]},
  {"id":"ort-009","text":"beugst du dich über den Esstisch","slot":"ort","intensitaet":4,"tags":["moebel"]},
  {"id":"ort-010","text":"stehst du auf dem Balkon","slot":"ort","intensitaet":4,"tags":["draussen"]},
  {"id":"ort-011","text":"sitzt du im Auto und wartest","slot":"ort","intensitaet":4,"tags":["auto"]},
  {"id":"ort-012","text":"lehnst du an der Wand im Schlafzimmer","slot":"ort","intensitaet":3,"tags":["wand"]},
  {"id":"ort-013","text":"liegst du auf dem Boden vor dem Bett","slot":"ort","intensitaet":4,"tags":["boden","demut"]},
  {"id":"ort-014","text":"sitzt du auf der Bettkante mit den Händen auf den Knien","slot":"ort","intensitaet":4,"tags":["protokoll"]},
  {"id":"ort-015","text":"wartest du im dunklen Zimmer","slot":"ort","intensitaet":4,"tags":["dunkel"]},
  {"id":"ort-016","text":"stehst du im Türrahmen","slot":"ort","intensitaet":3,"tags":["tuer"]},
  {"id":"ort-017","text":"sitzt du zu meinen Füßen","slot":"ort","intensitaet":4,"tags":["fuesse","protokoll"]},
  {"id":"ort-018","text":"liegst du im Bett und darfst dich nicht bewegen","slot":"ort","intensitaet":4,"tags":["stillhalten"]},
  {"id":"ort-019","text":"stehst du in der Mitte des Raums, komplett angezogen","slot":"ort","intensitaet":3,"tags":["angezogen"]},
  {"id":"ort-020","text":"wartest du dort wo ich es dir vorher geschrieben habe","slot":"ort","intensitaet":4,"tags":["ungewiss"]}
]
```

---

## Slot 3: ZUSTAND (wie du da sein sollst)

```json
[
  {"id":"zus-001","text":"— nackt","slot":"zustand","intensitaet":3,"tags":["nackt"]},
  {"id":"zus-002","text":"— komplett angezogen","slot":"zustand","intensitaet":3,"tags":["angezogen"]},
  {"id":"zus-003","text":"— nur in Unterwäsche","slot":"zustand","intensitaet":2,"tags":["teilweise"]},
  {"id":"zus-004","text":"— mit verbundenen Augen","slot":"zustand","intensitaet":4,"tags":["sinne"]},
  {"id":"zus-005","text":"— mit den Händen hinter dem Rücken","slot":"zustand","intensitaet":4,"tags":["haende"]},
  {"id":"zus-006","text":"— in dem was ich dir rausgelegt habe","slot":"zustand","intensitaet":4,"tags":["kontrolle"]},
  {"id":"zus-007","text":"— frisch geduscht und eingecremt","slot":"zustand","intensitaet":3,"tags":["vorbereitung"]},
  {"id":"zus-008","text":"— schon vorbereitet, so wie ich es dir gesagt habe","slot":"zustand","intensitaet":5,"tags":["vorbereitung"]},
  {"id":"zus-009","text":"— und du sagst kein Wort","slot":"zustand","intensitaet":4,"tags":["stille"]},
  {"id":"zus-010","text":"— auf den Knien","slot":"zustand","intensitaet":4,"tags":["knien"]},
  {"id":"zus-011","text":"— mit gesenktem Blick","slot":"zustand","intensitaet":4,"tags":["protokoll"]},
  {"id":"zus-012","text":"— mit dem Toy schon drin","slot":"zustand","intensitaet":5,"tags":["toy"]},
  {"id":"zus-013","text":"— und du hast dich den ganzen Tag nicht angefasst","slot":"zustand","intensitaet":5,"tags":["denial"]},
  {"id":"zus-014","text":"— gefesselt, so wie ich es vorbereitet habe","slot":"zustand","intensitaet":5,"tags":["bondage"]},
  {"id":"zus-015","text":"— und du weißt nicht was gleich passiert","slot":"zustand","intensitaet":4,"tags":["ungewiss"]},
  {"id":"zus-016","text":"— in meinem Hemd, sonst nichts","slot":"zustand","intensitaet":3,"tags":["kleidung"]},
  {"id":"zus-017","text":"— mit dem Halsband","slot":"zustand","intensitaet":5,"tags":["ds"]},
  {"id":"zus-018","text":"— und du hältst still egal was passiert","slot":"zustand","intensitaet":4,"tags":["stillhalten"]}
]
```

---

## Slot 4: AKTION (was passiert)

```json
[
  {"id":"akt-001","text":"Ich benutze dich so lange ich Lust habe.","slot":"aktion","intensitaet":5,"tags":["benutzen"]},
  {"id":"akt-002","text":"Du machst mich mit dem Mund fertig.","slot":"aktion","intensitaet":4,"tags":["oral"]},
  {"id":"akt-003","text":"Du leckst mich bis ich sage dass du aufhören darfst.","slot":"aktion","intensitaet":5,"tags":["oral","ausdauer"]},
  {"id":"akt-004","text":"Ich setze mich auf dein Gesicht und du machst deinen Job.","slot":"aktion","intensitaet":5,"tags":["facesitting"]},
  {"id":"akt-005","text":"Ich fasse dich an bis du kurz davor bist — und dann höre ich auf.","slot":"aktion","intensitaet":5,"tags":["edging"]},
  {"id":"akt-006","text":"Du fickst mich genau so wie ich es dir ansage.","slot":"aktion","intensitaet":4,"tags":["sex","kontrolle"]},
  {"id":"akt-007","text":"Ich reite dich und du liegst einfach nur da.","slot":"aktion","intensitaet":4,"tags":["reiten","passiv"]},
  {"id":"akt-008","text":"Du gehst auf die Knie und bettelst darum.","slot":"aktion","intensitaet":5,"tags":["betteln"]},
  {"id":"akt-009","text":"Ich massiere dich eine halbe Stunde lang — und lasse dabei alles Wichtige aus.","slot":"aktion","intensitaet":4,"tags":["teasing","massage"]},
  {"id":"akt-010","text":"Ich fessle dich und mache dann was mir einfällt.","slot":"aktion","intensitaet":5,"tags":["bondage"]},
  {"id":"akt-011","text":"Wir machen es so langsam dass es fast wehtut.","slot":"aktion","intensitaet":4,"tags":["langsam"]},
  {"id":"akt-012","text":"Ich nehme dich hart und ohne Rücksicht.","slot":"aktion","intensitaet":5,"tags":["hart"]},
  {"id":"akt-013","text":"Du machst es dir selbst während ich zuschaue und Anweisungen gebe.","slot":"aktion","intensitaet":4,"tags":["masturbation","kontrolle"]},
  {"id":"akt-014","text":"Ich benutze das Toy an dir bis du nicht mehr weißt wo oben und unten ist.","slot":"aktion","intensitaet":5,"tags":["toy","overstim"]},
  {"id":"akt-015","text":"Wir küssen uns eine halbe Stunde lang und sonst nichts.","slot":"aktion","intensitaet":3,"tags":["kuessen","frustration"]},
  {"id":"akt-016","text":"Du ziehst mich aus, Stück für Stück, und küsst jede Stelle die frei wird.","slot":"aktion","intensitaet":3,"tags":["ausziehen"]},
  {"id":"akt-017","text":"Ich ficke dich mit dem Strapon.","slot":"aktion","intensitaet":5,"tags":["pegging"]},
  {"id":"akt-018","text":"Du bekommst so lange nichts bis ich zweimal gekommen bin.","slot":"aktion","intensitaet":5,"tags":["reihenfolge","dienen"]},
  {"id":"akt-019","text":"Wir gehen alle Positionen durch die ich mir überlegt habe. Der Reihe nach.","slot":"aktion","intensitaet":4,"tags":["programm"]},
  {"id":"akt-020","text":"Ich lasse dich dreimal an die Kante kommen und entscheide erst beim vierten Mal.","slot":"aktion","intensitaet":5,"tags":["edging"]},
  {"id":"akt-021","text":"Du bringst mich mit den Fingern zum Kommen — und schaust mir dabei in die Augen.","slot":"aktion","intensitaet":4,"tags":["finger","blick"]},
  {"id":"akt-022","text":"Wir machen es angezogen, schnell, gegen die nächstbeste Wand.","slot":"aktion","intensitaet":4,"tags":["quickie"]},
  {"id":"akt-023","text":"Ich ziehe dir eine Augenbinde an und du errätst was ich als Nächstes mache.","slot":"aktion","intensitaet":4,"tags":["sinne","raten"]},
  {"id":"akt-024","text":"Du bekommst Schläge. Du zählst mit und bedankst dich nach jedem.","slot":"aktion","intensitaet":5,"tags":["impact"]},
  {"id":"akt-025","text":"Ich mache es mir selbst und du darfst nur zuschauen.","slot":"aktion","intensitaet":5,"tags":["zuschauen","denial"]},
  {"id":"akt-026","text":"Wir machen zwei Runden hintereinander, ohne Pause dazwischen.","slot":"aktion","intensitaet":5,"tags":["ausdauer","training"]},
  {"id":"akt-027","text":"Du dienst mir. Eine Stunde lang. Alles was ich sage.","slot":"aktion","intensitaet":5,"tags":["dienen"]},
  {"id":"akt-028","text":"Ich fahre mit Eis über deine Haut und du bewegst dich nicht.","slot":"aktion","intensitaet":4,"tags":["temperatur"]},
  {"id":"akt-029","text":"Wir machen es vor dem Spiegel und du schaust die ganze Zeit hin.","slot":"aktion","intensitaet":4,"tags":["spiegel"]},
  {"id":"akt-030","text":"Ich nehme mir was ich will und du sagst danke.","slot":"aktion","intensitaet":5,"tags":["dominanz"]}
]
```

---

## Slot 5: REGEL / EINSCHRÄNKUNG

```json
[
  {"id":"reg-001","text":"Du darfst dabei nicht kommen.","slot":"regel","intensitaet":5,"tags":["denial"]},
  {"id":"reg-002","text":"Du darfst erst kommen wenn ich es sage.","slot":"regel","intensitaet":5,"tags":["kontrolle"]},
  {"id":"reg-003","text":"Kein Wort während der ganzen Zeit.","slot":"regel","intensitaet":4,"tags":["stille"]},
  {"id":"reg-004","text":"Deine Hände bleiben wo ich sie hinlege.","slot":"regel","intensitaet":4,"tags":["haende"]},
  {"id":"reg-005","text":"Du fragst vor jedem einzelnen Schritt um Erlaubnis.","slot":"regel","intensitaet":5,"tags":["protokoll"]},
  {"id":"reg-006","text":"Du darfst mich nirgends anfassen.","slot":"regel","intensitaet":4,"tags":["einschraenkung"]},
  {"id":"reg-007","text":"Du zählst laut mit.","slot":"regel","intensitaet":3,"tags":["zaehlen"]},
  {"id":"reg-008","text":"Blickkontakt die ganze Zeit — wenn du wegschaust, fangen wir von vorne an.","slot":"regel","intensitaet":4,"tags":["blick"]},
  {"id":"reg-009","text":"Du sagst mir laut was du gerade fühlst. Ohne Pause.","slot":"regel","intensitaet":4,"tags":["dirtytalk"]},
  {"id":"reg-010","text":"Jedes Geräusch von dir kostet dich einen Tag ohne.","slot":"regel","intensitaet":5,"tags":["stille","strafe"]},
  {"id":"reg-011","text":"Du bedankst dich nach jedem Schritt.","slot":"regel","intensitaet":4,"tags":["protokoll"]},
  {"id":"reg-012","text":"Ich kann jederzeit aufhören und du sagst nichts dazu.","slot":"regel","intensitaet":5,"tags":["kontrolle"]},
  {"id":"reg-013","text":"Du bewegst dich keinen Millimeter.","slot":"regel","intensitaet":4,"tags":["stillhalten"]},
  {"id":"reg-014","text":"Du bittest mich mindestens dreimal überzeugend darum.","slot":"regel","intensitaet":5,"tags":["betteln"]},
  {"id":"reg-015","text":"Wir bleiben beide angezogen.","slot":"regel","intensitaet":3,"tags":["kleidung"]},
  {"id":"reg-016","text":"Du sprichst mich nur mit Titel an.","slot":"regel","intensitaet":4,"tags":["protokoll"]},
  {"id":"reg-017","text":"Nur eine Hand. Die andere bleibt hinter deinem Rücken.","slot":"regel","intensitaet":3,"tags":["einschraenkung"]},
  {"id":"reg-018","text":"Alles in Zeitlupe. Wenn du schneller wirst, stoppe ich.","slot":"regel","intensitaet":4,"tags":["tempo"]},
  {"id":"reg-019","text":"Ich komme zuerst. Immer.","slot":"regel","intensitaet":4,"tags":["reihenfolge"]},
  {"id":"reg-020","text":"Keine Regeln heute. Ausnahmsweise.","slot":"regel","intensitaet":2,"tags":["freiheit"]},
  {"id":"reg-021","text":"Du darfst dich selbst nicht anfassen.","slot":"regel","intensitaet":4,"tags":["einschraenkung"]},
  {"id":"reg-022","text":"Du sagst mir jedes Mal wenn du kurz davor bist.","slot":"regel","intensitaet":5,"tags":["edging"]},
  {"id":"reg-023","text":"Du hältst mindestens zwanzig Minuten durch.","slot":"regel","intensitaet":5,"tags":["ausdauer"]},
  {"id":"reg-024","text":"Wenn du eine Regel brichst, geht die Strafe in die Queue.","slot":"regel","intensitaet":4,"tags":["konsequenz"]}
]
```

---

## Slot 6: ZEITDRUCK

```json
[
  {"id":"zei-001","text":"Du hast fünf Minuten.","slot":"zeit","intensitaet":4,"tags":["kurz"]},
  {"id":"zei-002","text":"Du hast zehn Minuten.","slot":"zeit","intensitaet":3,"tags":["kurz"]},
  {"id":"zei-003","text":"Der Timer läuft: zwanzig Minuten.","slot":"zeit","intensitaet":4,"tags":["mittel"]},
  {"id":"zei-004","text":"Eine halbe Stunde. Keine Sekunde weniger.","slot":"zeit","intensitaet":4,"tags":["lang"]},
  {"id":"zei-005","text":"Eine Stunde. Wir hören nicht vorher auf.","slot":"zeit","intensitaet":5,"tags":["sehr_lang"]},
  {"id":"zei-006","text":"Bis der Wecker klingelt — du weißt nicht wann.","slot":"zeit","intensitaet":5,"tags":["ungewiss"]},
  {"id":"zei-007","text":"So lange ein Lied dauert.","slot":"zeit","intensitaet":3,"tags":["musik"]},
  {"id":"zei-008","text":"Bis ich fertig bin. Egal wie lange das dauert.","slot":"zeit","intensitaet":5,"tags":["offen"]},
  {"id":"zei-009","text":"Kein Zeitlimit. Wir hören auf wenn ich es will.","slot":"zeit","intensitaet":4,"tags":["offen"]},
  {"id":"zei-010","text":"Drei Runden mit jeweils fünf Minuten Pause.","slot":"zeit","intensitaet":5,"tags":["runden"]},
  {"id":"zei-011","text":"Schaffst du es nicht rechtzeitig, machen wir es morgen doppelt.","slot":"zeit","intensitaet":5,"tags":["konsequenz"]}
]
```

---

## Slot 7: DAS ENDE

```json
[
  {"id":"end-001","text":"Danach schläfst du in meinen Armen ein.","slot":"ende","intensitaet":1,"tags":["zaertlich"]},
  {"id":"end-002","text":"Danach machst du sauber. Alles.","slot":"ende","intensitaet":5,"tags":["demut"]},
  {"id":"end-003","text":"Danach bedankst du dich.","slot":"ende","intensitaet":4,"tags":["protokoll"]},
  {"id":"end-004","text":"Danach entscheide ich ob du auch etwas bekommst.","slot":"ende","intensitaet":5,"tags":["denial"]},
  {"id":"end-005","text":"Danach ziehst du dich an und wir machen weiter als wäre nichts gewesen.","slot":"ende","intensitaet":4,"tags":["alltag"]},
  {"id":"end-006","text":"Danach machen wir eine Pause — und dann nochmal.","slot":"ende","intensitaet":5,"tags":["runde_zwei"]},
  {"id":"end-007","text":"Danach erzählst du mir was dir am besten gefallen hat.","slot":"ende","intensitaet":2,"tags":["feedback"]},
  {"id":"end-008","text":"Danach liegen wir noch eine Stunde einfach nur da.","slot":"ende","intensitaet":1,"tags":["naehe"]},
  {"id":"end-009","text":"Danach bekommst du gar nichts. Heute war das für mich.","slot":"ende","intensitaet":5,"tags":["denial"]},
  {"id":"end-010","text":"Danach lasse ich dich allein und du denkst darüber nach.","slot":"ende","intensitaet":5,"tags":["nachwirkung"]},
  {"id":"end-011","text":"Danach duschen wir zusammen und ich wasche dich.","slot":"ende","intensitaet":2,"tags":["pflege"]},
  {"id":"end-012","text":"Danach schreibst du mir auf wie es war. Ehrlich.","slot":"ende","intensitaet":3,"tags":["reflexion"]},
  {"id":"end-013","text":"Danach bekommst du einen Punkt gutgeschrieben.","slot":"ende","intensitaet":3,"tags":["karma"]},
  {"id":"end-014","text":"Danach ist morgen dasselbe nochmal fällig.","slot":"ende","intensitaet":5,"tags":["fortsetzung"]},
  {"id":"end-015","text":"Danach entscheide ich per Münzwurf wie es weitergeht.","slot":"ende","intensitaet":4,"tags":["zufall"]},
  {"id":"end-016","text":"Danach machst du mir was zu essen. Nackt.","slot":"ende","intensitaet":4,"tags":["dienen"]},
  {"id":"end-017","text":"Danach reden wir darüber — richtig, in Ruhe.","slot":"ende","intensitaet":1,"tags":["aftercare"]}
]
```

---

## Slot 8: TWIST (optionaler Zusatz-Baustein)

```json
[
  {"id":"twi-001","text":"Und du weißt bis zum letzten Moment nicht, was ich vorhabe.","slot":"twist","intensitaet":4,"tags":["ungewiss"]},
  {"id":"twi-002","text":"Wenn du eine Regel brichst, fangen wir komplett von vorne an.","slot":"twist","intensitaet":5,"tags":["konsequenz"]},
  {"id":"twi-003","text":"Ich habe mir vorher aufgeschrieben was passieren wird. Du liest es erst danach.","slot":"twist","intensitaet":4,"tags":["geheimnis"]},
  {"id":"twi-004","text":"Zwischendurch stelle ich dir Fragen. Falsche Antwort bedeutet weniger für dich.","slot":"twist","intensitaet":4,"tags":["quiz"]},
  {"id":"twi-005","text":"Ich drehe zwischendurch am Rad und wir machen was rauskommt.","slot":"twist","intensitaet":4,"tags":["zufall"]},
  {"id":"twi-006","text":"Ein Timer klingelt zwischendurch — dann wechseln wir sofort.","slot":"twist","intensitaet":4,"tags":["wechsel"]},
  {"id":"twi-007","text":"Du darfst einmal eine Sache ablehnen. Nur einmal.","slot":"twist","intensitaet":3,"tags":["joker"]},
  {"id":"twi-008","text":"Wenn du es gut machst, gibt es hinterher etwas für dich. Wenn nicht, nicht.","slot":"twist","intensitaet":4,"tags":["belohnung"]},
  {"id":"twi-009","text":"Ich filme oder fotografiere mit. Nur für uns.","slot":"twist","intensitaet":5,"tags":["aufnahme"]},
  {"id":"twi-010","text":"Ich sage dir dabei die ganze Zeit was ich denke.","slot":"twist","intensitaet":4,"tags":["dirtytalk"]},
  {"id":"twi-011","text":"Es läuft ein Song. Wenn er zu Ende ist, ändert sich etwas.","slot":"twist","intensitaet":3,"tags":["musik"]},
  {"id":"twi-012","text":"Mittendrin höre ich einfach auf und gehe raus. Ich komme wieder wenn ich Lust habe.","slot":"twist","intensitaet":5,"tags":["frustration"]}
]
```

---

## Satz-Templates

Die App setzt aus den Slots einen Text zusammen. Verschiedene Templates für Abwechslung.

```json
{
  "templates": [
    {
      "id":"tpl-001",
      "name":"Standard",
      "muster":"{eroeffnung} {ort} {zustand}. {aktion} {regel} {ende}",
      "benoetigt":["eroeffnung","ort","zustand","aktion","regel","ende"]
    },
    {
      "id":"tpl-002",
      "name":"Mit Zeitdruck",
      "muster":"{eroeffnung} {ort} {zustand}. {zeit} {aktion} {regel}",
      "benoetigt":["eroeffnung","ort","zustand","zeit","aktion","regel"]
    },
    {
      "id":"tpl-003",
      "name":"Kurz und direkt",
      "muster":"{ort} {zustand}. {aktion} {regel}",
      "benoetigt":["ort","zustand","aktion","regel"]
    },
    {
      "id":"tpl-004",
      "name":"Mit Twist",
      "muster":"{eroeffnung} {ort} {zustand}. {aktion} {regel} {twist} {ende}",
      "benoetigt":["eroeffnung","ort","zustand","aktion","regel","twist","ende"]
    },
    {
      "id":"tpl-005",
      "name":"Nur Aktion",
      "muster":"{aktion} {regel} {zeit}",
      "benoetigt":["aktion","regel","zeit"]
    },
    {
      "id":"tpl-006",
      "name":"Volles Programm",
      "muster":"{eroeffnung} {ort} {zustand}. {zeit} {aktion} {regel} {twist} {ende}",
      "benoetigt":["eroeffnung","ort","zustand","zeit","aktion","regel","twist","ende"]
    },
    {
      "id":"tpl-007",
      "name":"Sanft",
      "muster":"{eroeffnung} {ort}. {aktion} {ende}",
      "benoetigt":["eroeffnung","ort","aktion","ende"],
      "max_intensitaet":3
    }
  ]
}
```

---

## Beispiel-Outputs

Damit klar ist wie es sich anfühlt:

> **Beispiel 1 (Intensität 3–4, Template "Standard"):**
> *"Wenn ich heute Abend nach Hause komme, wartest du auf mich im Schlafzimmer — nur in Unterwäsche. Du ziehst mich aus, Stück für Stück, und küsst jede Stelle die frei wird. Deine Hände bleiben wo ich sie hinlege. Danach erzählst du mir was dir am besten gefallen hat."*

> **Beispiel 2 (Intensität 5, Template "Mit Twist"):**
> *"Du hast eine Woche gewartet. Heute kniest du im Flur — und du hast dich den ganzen Tag nicht angefasst. Ich lasse dich dreimal an die Kante kommen und entscheide erst beim vierten Mal. Du darfst erst kommen wenn ich es sage. Wenn du eine Regel brichst, fangen wir komplett von vorne an. Danach entscheide ich ob du auch etwas bekommst."*

> **Beispiel 3 (Intensität 2, Template "Sanft"):**
> *"Kerzen sind an, Musik läuft, und liegst du auf dem Sofa. Wir küssen uns eine halbe Stunde lang und sonst nichts. Danach liegen wir noch eine Stunde einfach nur da."*

---

## Implementierungs-Hinweise

1. **Grammatik-Glättung:** Bausteine sind so formuliert dass sie zusammenpassen, aber die App sollte einen kleinen Post-Prozessor haben: doppelte Leerzeichen entfernen, Satzanfänge großschreiben, `. —` zu ` —` korrigieren.
2. **Intensitäts-Filter:** Der Generator zieht nur Bausteine bis zur eingestellten Maximal-Intensität. Domme setzt das Limit.
3. **Tag-Kohärenz (optional, aber lohnt sich):** Wenn `zustand` das Tag `bondage` hat, sollte `aktion` mit dem Tag `zuschauen` weniger wahrscheinlich sein. Einfache Regel: bei Konflikt-Tags neu ziehen (max. 3 Versuche).
4. **Domme-Freigabe:** Generiertes Szenario landet erst bei ihr. Sie kann: annehmen → geht an Sub, neu würfeln, oder editieren und dann senden.
5. **Favoriten:** Gute Kombinationen speicherbar, damit sie wiederverwendet werden können.
6. **Eigene Bausteine:** Jeder Slot muss um eigene Einträge erweiterbar sein. Je mehr, desto unvorhersehbarer — das ist der Sinn.
7. **Kombinatorik:** Mit den aktuellen Zahlen (20 × 20 × 18 × 30 × 24 × 11 × 17 × 12) ergeben sich über 1,5 Milliarden mögliche Kombinationen. Die App wird euch nicht so schnell langweilen.
