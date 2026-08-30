# EMBER — Content-Datei 01: Dare-Decks

## Format-Hinweis für die Implementierung

Alle Karten liegen als JSON-Array vor. Felder:

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Eindeutige ID, Präfix = Deck-Kürzel |
| `text` | string | Der Karteninhalt (an Sub gerichtet, außer `richtung` sagt anders) |
| `deck` | string | Deck-Zugehörigkeit |
| `intensitaet` | int 1–5 | 1 = harmlos, 5 = sehr intensiv |
| `richtung` | string | `an_sub` \| `an_domme` \| `beide` |
| `dauer_min` | int\|null | Geschätzte Dauer in Minuten |
| `tags` | array | Für Filterung |
| `braucht_timer` | bool | Ob ein Countdown sinnvoll ist |

Decks: `soft`, `spicy`, `hardcore`, `oral`, `haende`, `toys`, `public`, `bestrafung`, `verwoehnen`, `romantik`, `training`, `distanz`, `kontrolle`, `sinne`, `worte`

---

## Deck: SOFT

```json
[
  {"id":"soft-001","text":"Zieh dich vor mir aus. Langsam. Ich sage dir wann du weitermachen darfst.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":5,"tags":["strip","gehorsam"],"braucht_timer":false},
  {"id":"soft-002","text":"Küss mich fünf Minuten lang. Nur küssen. Deine Hände bleiben wo ich sie hinlege.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":5,"tags":["kuessen","kontrolle"],"braucht_timer":true},
  {"id":"soft-003","text":"Massiere mir zehn Minuten den Rücken. Öl ist Pflicht. Kein Wort dabei.","deck":"soft","intensitaet":1,"richtung":"an_sub","dauer_min":10,"tags":["massage","stille"],"braucht_timer":true},
  {"id":"soft-004","text":"Leg dich hin und schließ die Augen. Ich fahre dich mit den Fingerspitzen ab. Du sagst mir bei jeder Stelle ob es kitzelt oder anmacht.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":10,"tags":["beruehrung","erkunden"],"braucht_timer":false},
  {"id":"soft-005","text":"Zieh mir aus was ich anhabe. Ein Kleidungsstück nach dem anderen, und bei jedem küsst du die Stelle die frei wird.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":8,"tags":["ausziehen","kuessen"],"braucht_timer":false},
  {"id":"soft-006","text":"Duscht zusammen. Er wäscht sie komplett. Sie rührt keinen Finger.","deck":"soft","intensitaet":2,"richtung":"beide","dauer_min":15,"tags":["dusche","dienen"],"braucht_timer":false},
  {"id":"soft-007","text":"Setz dich zwischen meine Beine, Rücken an meine Brust. Ich fasse dich an wo ich will, du fasst dich nicht selbst an.","deck":"soft","intensitaet":3,"richtung":"an_sub","dauer_min":10,"tags":["kontrolle","kuscheln"],"braucht_timer":false},
  {"id":"soft-008","text":"Zieh das an was ich dir hinlege. Alles. Auch wenn es dir peinlich ist.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":5,"tags":["kleidung","demut"],"braucht_timer":false},
  {"id":"soft-009","text":"Zwanzig Minuten nackt nebeneinander liegen. Keine Berührung. Nur schauen und reden über das was ihr gerade denkt.","deck":"soft","intensitaet":1,"richtung":"beide","dauer_min":20,"tags":["naehe","reden"],"braucht_timer":true},
  {"id":"soft-010","text":"Küss dich von meinem Hals bis zu meinen Füßen. Lass keine Stelle aus. Nimm dir Zeit.","deck":"soft","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["kuessen","gruendlich"],"braucht_timer":false},
  {"id":"soft-011","text":"Ich zeichne dir mit dem Finger Wörter auf den Rücken. Du musst raten. Bei jedem Fehler ein Kleidungsstück weniger.","deck":"soft","intensitaet":2,"richtung":"beide","dauer_min":15,"tags":["spiel","strip"],"braucht_timer":false},
  {"id":"soft-012","text":"Zieh mir die Schuhe aus und massiere meine Füße. Zehn Minuten. Ohne Kommentar.","deck":"soft","intensitaet":1,"richtung":"an_sub","dauer_min":10,"tags":["fuesse","dienen"],"braucht_timer":true},
  {"id":"soft-013","text":"Streichel mich überall — außer da wo ich es am meisten will. Bis ich es dir erlaube.","deck":"soft","intensitaet":3,"richtung":"an_sub","dauer_min":10,"tags":["teasing","gehorsam"],"braucht_timer":false},
  {"id":"soft-014","text":"Bürste mir die Haare. Langsam. Danach küsst du meinen Nacken.","deck":"soft","intensitaet":1,"richtung":"an_sub","dauer_min":8,"tags":["pflege","zaertlich"],"braucht_timer":false},
  {"id":"soft-015","text":"Schreib mir mit dem Finger auf die Haut wo du mich als Nächstes küssen willst. Ich entscheide ob du darfst.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":5,"tags":["teasing","erlaubnis"],"braucht_timer":false},
  {"id":"soft-016","text":"Wir küssen uns, aber du darfst deine Zunge nicht benutzen bis ich es sage.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":5,"tags":["kuessen","regel"],"braucht_timer":false},
  {"id":"soft-017","text":"Zieh dich bis auf die Unterhose aus und knie dich vor mich. Warte. Ich sage dir wann.","deck":"soft","intensitaet":3,"richtung":"an_sub","dauer_min":5,"tags":["knien","warten"],"braucht_timer":false},
  {"id":"soft-018","text":"Ich lege mich hin. Du erforschst mich mit den Lippen und sagst mir bei jeder Stelle was dir daran gefällt.","deck":"soft","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["erkunden","worte"],"braucht_timer":false},
  {"id":"soft-019","text":"Bade mit mir. Du sitzt hinter mir und wäschst mich. Danach cremst du mich ein.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":25,"tags":["bad","pflege"],"braucht_timer":false},
  {"id":"soft-020","text":"Zieh mich an. Komplett. Ich sage dir welches Teil, du machst es. Auch die BH-Verschlüsse.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":10,"tags":["anziehen","dienen"],"braucht_timer":false},
  {"id":"soft-021","text":"Wir liegen uns gegenüber und atmen im selben Rhythmus. Fünf Minuten. Augen offen, Blickkontakt.","deck":"soft","intensitaet":1,"richtung":"beide","dauer_min":5,"tags":["intimitaet","blick"],"braucht_timer":true},
  {"id":"soft-022","text":"Du darfst mich anfassen, aber nur mit einer Hand. Die andere bleibt hinter deinem Rücken.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":10,"tags":["einschraenkung"],"braucht_timer":false},
  {"id":"soft-023","text":"Eiswürfel. Ich fahre damit über deine Haut. Du bewegst dich nicht.","deck":"soft","intensitaet":3,"richtung":"an_sub","dauer_min":10,"tags":["temperatur","stillhalten"],"braucht_timer":false},
  {"id":"soft-024","text":"Zieh dir etwas von mir an. Irgendwas. Und trag es den Rest des Abends.","deck":"soft","intensitaet":2,"richtung":"an_sub","dauer_min":null,"tags":["kleidung","demut"],"braucht_timer":false},
  {"id":"soft-025","text":"Ich lege dir die Hand auf den Mund und küsse dich überall sonst.","deck":"soft","intensitaet":2,"richtung":"an_domme","dauer_min":10,"tags":["stille","kontrolle"],"braucht_timer":false}
]
```

---

## Deck: SPICY

```json
[
  {"id":"spicy-001","text":"Fass mich an wo ich dir sage. Nur da. Und du hörst auf wenn ich es sage — auch mittendrin.","deck":"spicy","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["kontrolle","finger"],"braucht_timer":false},
  {"id":"spicy-002","text":"Leck mich, aber du darfst meine Klitoris nicht berühren bis ich es erlaube. Nur drumherum.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["oral","teasing"],"braucht_timer":false},
  {"id":"spicy-003","text":"Zieh dich aus und fass dich an, während ich zuschaue. Du hörst auf wenn ich es sage.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["masturbation","beobachtung"],"braucht_timer":false},
  {"id":"spicy-004","text":"Fick mich, aber du darfst nicht kommen bevor ich gekommen bin. Wenn du es tust, gibt's Konsequenzen.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["kontrolle","orgasmus"],"braucht_timer":false},
  {"id":"spicy-005","text":"Zieh mir den Slip mit den Zähnen aus.","deck":"spicy","intensitaet":3,"richtung":"an_sub","dauer_min":3,"tags":["ausziehen","zaehne"],"braucht_timer":false},
  {"id":"spicy-006","text":"Auf allen vieren. Du bewegst dich nicht bis ich sage dass du darfst.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["position","gehorsam"],"braucht_timer":false},
  {"id":"spicy-007","text":"Ich sitze auf deinem Gesicht. Du hörst nicht auf bis ich fertig bin.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["oral","facesitting"],"braucht_timer":false},
  {"id":"spicy-008","text":"Zwei Finger. Langsam. Und du schaust mir dabei in die Augen.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["finger","blick"],"braucht_timer":false},
  {"id":"spicy-009","text":"Du fickst mich von hinten und hältst dabei meine Haare fest. Fest.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["doggy","haare"],"braucht_timer":false},
  {"id":"spicy-010","text":"Ich reite dich. Deine Hände bleiben über deinem Kopf. Du fasst mich nicht an.","deck":"spicy","intensitaet":4,"richtung":"beide","dauer_min":15,"tags":["reiten","einschraenkung"],"braucht_timer":false},
  {"id":"spicy-011","text":"Du darfst nur meine Brüste anfassen. Sonst nichts. Zehn Minuten lang.","deck":"spicy","intensitaet":3,"richtung":"an_sub","dauer_min":10,"tags":["brueste","einschraenkung"],"braucht_timer":true},
  {"id":"spicy-012","text":"Blas mir eine Augenbinde auf und mach mit mir was du willst — aber sag mir vorher jeden Schritt an.","deck":"spicy","intensitaet":4,"richtung":"an_domme","dauer_min":20,"tags":["augenbinde","ansage"],"braucht_timer":false},
  {"id":"spicy-013","text":"69. Wer zuerst aufhört, hat verloren und muss die nächste Karte doppelt machen.","deck":"spicy","intensitaet":4,"richtung":"beide","dauer_min":15,"tags":["69","wettbewerb"],"braucht_timer":false},
  {"id":"spicy-014","text":"Ich fessel dir die Hände. Dann bin ich zwanzig Minuten lang gemein zu dir.","deck":"spicy","intensitaet":4,"richtung":"an_domme","dauer_min":20,"tags":["bondage","teasing"],"braucht_timer":true},
  {"id":"spicy-015","text":"Du darfst mich lecken, aber ich zähle. Nach hundert Zungenschlägen hörst du auf — egal wo ich gerade bin.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["oral","zaehlen"],"braucht_timer":false},
  {"id":"spicy-016","text":"Missionar, aber ganz langsam. Wenn du schneller wirst, ziehen wir raus und fangen von vorne an.","deck":"spicy","intensitaet":4,"richtung":"beide","dauer_min":20,"tags":["langsam","kontrolle"],"braucht_timer":false},
  {"id":"spicy-017","text":"Zieh dich komplett aus und knie dich hin. Ich entscheide gleich was mit dir passiert.","deck":"spicy","intensitaet":3,"richtung":"an_sub","dauer_min":5,"tags":["knien","warten"],"braucht_timer":false},
  {"id":"spicy-018","text":"Du liegst auf dem Rücken. Ich reibe mich an dir bis ich komme. Du darfst nicht rein.","deck":"spicy","intensitaet":4,"richtung":"beide","dauer_min":15,"tags":["grinding","frustration"],"braucht_timer":false},
  {"id":"spicy-019","text":"Erzähl mir während du mich fickst genau was du gerade mit mir machen willst. Details.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["dirtytalk"],"braucht_timer":false},
  {"id":"spicy-020","text":"Ich lege mich auf den Bauch. Du machst was du willst — aber du darfst mich nicht umdrehen.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["position","freiheit"],"braucht_timer":false},
  {"id":"spicy-021","text":"Fünf Minuten lang nur Nacken, Ohren und Schlüsselbein. Nichts anderes. Dann darfst du weiter.","deck":"spicy","intensitaet":3,"richtung":"an_sub","dauer_min":5,"tags":["hals","teasing"],"braucht_timer":true},
  {"id":"spicy-022","text":"Wir ficken auf dem Boden. Nicht im Bett. Egal welcher Raum, ich zeige dir wo.","deck":"spicy","intensitaet":3,"richtung":"beide","dauer_min":20,"tags":["ort","boden"],"braucht_timer":false},
  {"id":"spicy-023","text":"Du steckst nur die Spitze rein. Und da bleibst du bis ich dir sage dass du weiter darfst.","deck":"spicy","intensitaet":5,"richtung":"an_sub","dauer_min":10,"tags":["teasing","selbstkontrolle"],"braucht_timer":false},
  {"id":"spicy-024","text":"Ich stelle mich vor den Spiegel. Du kommst von hinten. Wir schauen beide hin.","deck":"spicy","intensitaet":4,"richtung":"beide","dauer_min":15,"tags":["spiegel","beobachtung"],"braucht_timer":false},
  {"id":"spicy-025","text":"Du machst mich mit der Hand fertig, während du mich küsst. Aufhören darfst du nicht.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["finger","kuessen"],"braucht_timer":false},
  {"id":"spicy-026","text":"Beide angezogen. Nur das Nötigste aufmachen. Schnell und dreckig.","deck":"spicy","intensitaet":4,"richtung":"beide","dauer_min":10,"tags":["quickie","angezogen"],"braucht_timer":false},
  {"id":"spicy-027","text":"Du liegst still. Ich benutze dich. Kein Bewegen, kein Kommentar.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["benutzen","stillhalten"],"braucht_timer":false},
  {"id":"spicy-028","text":"Zeig mir wie du dich anfasst wenn du an mich denkst. Genau so wie sonst allein.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["masturbation","zeigen"],"braucht_timer":false},
  {"id":"spicy-029","text":"Du darfst mich überall küssen außer auf den Mund. Fünfzehn Minuten.","deck":"spicy","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["kuessen","einschraenkung"],"braucht_timer":true},
  {"id":"spicy-030","text":"Fick mich gegen die Wand. Ich will die Füße nicht auf dem Boden haben.","deck":"spicy","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["wand","kraft"],"braucht_timer":false},
  {"id":"spicy-031","text":"Ich lege deine Hand dahin wo ich sie haben will und du bewegst dich genau so wie ich es dir zeige.","deck":"spicy","intensitaet":3,"richtung":"an_sub","dauer_min":10,"tags":["fuehren","finger"],"braucht_timer":false},
  {"id":"spicy-032","text":"Du gehst runter und bleibst da bis ich zweimal gekommen bin.","deck":"spicy","intensitaet":5,"richtung":"an_sub","dauer_min":25,"tags":["oral","ausdauer"],"braucht_timer":false},
  {"id":"spicy-033","text":"Ich binde dir die Augen zu. Du weißt nicht was als Nächstes kommt.","deck":"spicy","intensitaet":4,"richtung":"an_domme","dauer_min":20,"tags":["augenbinde","ungewissheit"],"braucht_timer":false},
  {"id":"spicy-034","text":"Löffelchen, aber ich bestimme das Tempo indem ich mich bewege. Du hältst still.","deck":"spicy","intensitaet":4,"richtung":"beide","dauer_min":15,"tags":["loeffel","kontrolle"],"braucht_timer":false},
  {"id":"spicy-035","text":"Du hast fünf Minuten mich mit dem Mund zum Kommen zu bringen. Schaffst du es nicht, gibt's nichts für dich heute.","deck":"spicy","intensitaet":5,"richtung":"an_sub","dauer_min":5,"tags":["oral","zeitdruck"],"braucht_timer":true}
]
```

---

## Deck: HARDCORE

```json
[
  {"id":"hard-001","text":"Du bekommst heute keinen Orgasmus. Aber ich benutze dich so lange ich Lust habe.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":45,"tags":["denial","benutzen"],"braucht_timer":false},
  {"id":"hard-002","text":"Ich bringe dich fünfmal an die Kante und stoppe jedes Mal. Beim sechsten Mal entscheide ich spontan.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":40,"tags":["edging","denial"],"braucht_timer":false},
  {"id":"hard-003","text":"Hände gefesselt, Augen verbunden, Mund geknebelt. Eine Stunde gehörst du mir komplett.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":60,"tags":["bondage","sensorisch"],"braucht_timer":true},
  {"id":"hard-004","text":"Du zählst laut jeden Schlag und bedankst dich. Wenn du dich verzählst, fangen wir von vorne an.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":15,"tags":["impact","zaehlen"],"braucht_timer":false},
  {"id":"hard-005","text":"Ich ficke dich mit dem Strapon. Du bedankst dich anschließend.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":25,"tags":["pegging","strapon"],"braucht_timer":false},
  {"id":"hard-006","text":"Zwei Orgasmen hintereinander. Ohne Pause. Auch wenn du bettelst.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":30,"tags":["overstimulation"],"braucht_timer":false},
  {"id":"hard-007","text":"Du kommst nicht raus bis ich es sage. Egal wie lange es dauert.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":30,"tags":["ausdauer","kontrolle"],"braucht_timer":false},
  {"id":"hard-008","text":"Hände hinter dem Rücken gefesselt und du machst mich nur mit dem Mund fertig. So oft wie ich will.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":40,"tags":["oral","bondage"],"braucht_timer":false},
  {"id":"hard-009","text":"Du bettelst um jeden einzelnen Schritt. Wenn du nicht überzeugend genug bettelst, passiert nichts.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":30,"tags":["betteln","demut"],"braucht_timer":false},
  {"id":"hard-010","text":"Kerzenwachs. Ich entscheide wo. Du bewegst dich nicht.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":20,"tags":["wachs","stillhalten"],"braucht_timer":false},
  {"id":"hard-011","text":"Halsband und Leine. Du folgst mir durch die Wohnung und machst genau das was ich sage.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":30,"tags":["petplay","gehorsam"],"braucht_timer":false},
  {"id":"hard-012","text":"Du wirst gefesselt und ich lasse dich zwanzig Minuten allein. Ich komme wieder wenn ich Lust habe.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":20,"tags":["bondage","warten"],"braucht_timer":true},
  {"id":"hard-013","text":"Deine Hände sind fixiert und ich benutze den Vibrator an dir bis du bettelst dass ich aufhöre. Dann mache ich noch fünf Minuten weiter.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":25,"tags":["overstimulation","toy"],"braucht_timer":false},
  {"id":"hard-014","text":"Du machst mich fertig und danach wird abgeleckt. Alles.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":30,"tags":["cleanup","demut"],"braucht_timer":false},
  {"id":"hard-015","text":"Ich schreibe dir etwas auf die Haut. Das bleibt bis morgen früh drauf.","deck":"hardcore","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["markierung","besitz"],"braucht_timer":false},
  {"id":"hard-016","text":"Du liegst da und bewegst dich keinen Millimeter. Jede Bewegung kostet dich einen Tag ohne.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":25,"tags":["stillhalten","strafe"],"braucht_timer":false},
  {"id":"hard-017","text":"Ich fessel dich ans Bett und mache mich selbst fertig, direkt vor deinen Augen. Du darfst nur zuschauen.","deck":"hardcore","intensitaet":5,"richtung":"an_domme","dauer_min":20,"tags":["denial","zuschauen"],"braucht_timer":false},
  {"id":"hard-018","text":"Du hältst still während ich dir sage was für ein braver Junge du bist. Und du antwortest jedes Mal.","deck":"hardcore","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["degradierung","antworten"],"braucht_timer":false},
  {"id":"hard-019","text":"Klammern. Wo ich will. Du sagst wann es zu viel ist — aber ich entscheide ob ich zuhöre.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":20,"tags":["klammern","schmerz"],"braucht_timer":false},
  {"id":"hard-020","text":"Deep throat. Ich bestimme das Tempo, du hältst durch.","deck":"hardcore","intensitaet":5,"richtung":"an_domme","dauer_min":15,"tags":["oral","kontrolle"],"braucht_timer":false},
  {"id":"hard-021","text":"Eine Stunde Edging. Danach entscheide ich per Münzwurf ob du kommen darfst.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":60,"tags":["edging","zufall"],"braucht_timer":true},
  {"id":"hard-022","text":"Du gehst auf die Knie und bleibst da bis ich zurückkomme. Ich sage dir nicht wie lange.","deck":"hardcore","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["knien","warten"],"braucht_timer":false},
  {"id":"hard-023","text":"Ich fessel dir die Hände hinter den Rücken und du machst mich stehend mit dem Mund fertig.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":20,"tags":["oral","bondage"],"braucht_timer":false},
  {"id":"hard-024","text":"Heute wird nichts gefragt und nichts erklärt. Ich mache mit dir was ich will und du sagst nur Ja.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":45,"tags":["kontrolle","hingabe"],"braucht_timer":false},
  {"id":"hard-025","text":"Du bekommst einen Plug rein und trägst ihn den ganzen Abend. Auch beim Abendessen.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":180,"tags":["plug","dauer"],"braucht_timer":false},
  {"id":"hard-026","text":"Ich bin heute Abend gemein zu dir. Kein Grund, keine Erklärung. Du nimmst es.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":45,"tags":["dominanz","hingabe"],"braucht_timer":false},
  {"id":"hard-027","text":"Vier Runden. Zwischen jeder Runde fünf Minuten Pause. Du machst alle vier mit.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":90,"tags":["ausdauer","training"],"braucht_timer":true},
  {"id":"hard-028","text":"Gefesselt, Augen zu, und ich benutze verschiedene Sachen an dir. Du sagst jedes Mal was du glaubst was es ist.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":30,"tags":["sensorisch","raten"],"braucht_timer":false},
  {"id":"hard-029","text":"Du bittest mich alle fünf Minuten höflich um Erlaubnis zu kommen. Und ich sage jedes Mal nein.","deck":"hardcore","intensitaet":5,"richtung":"an_sub","dauer_min":30,"tags":["denial","betteln"],"braucht_timer":true},
  {"id":"hard-030","text":"Ich sitze auf deinem Gesicht bis du kaum noch Luft bekommst. Du klopfst wenn es zu viel ist.","deck":"hardcore","intensitaet":5,"richtung":"an_domme","dauer_min":20,"tags":["facesitting","intensiv"],"braucht_timer":false}
]
```

---

## Deck: ORAL

```json
[
  {"id":"oral-001","text":"Zehn Minuten nur mit der Zunge. Keine Finger, keine Hände.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["zunge","einschraenkung"],"braucht_timer":true},
  {"id":"oral-002","text":"Du leckst mich während ich mein Handy benutze. Ich sage dir wann du gut genug bist dass ich es weglege.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["ignorieren","dienen"],"braucht_timer":false},
  {"id":"oral-003","text":"Eiswürfel im Mund. Dann runter.","deck":"oral","intensitaet":4,"richtung":"beide","dauer_min":10,"tags":["temperatur"],"braucht_timer":false},
  {"id":"oral-004","text":"Du bleibst unten bis ich dich am Kopf wegziehe. Nicht früher.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["ausdauer","kontrolle"],"braucht_timer":false},
  {"id":"oral-005","text":"Ich sage dir bei jedem Zug ob es richtig war. Du korrigierst sofort.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["training","feedback"],"braucht_timer":false},
  {"id":"oral-006","text":"Augen zu, Hände auf dem Rücken. Nur Mund.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["einschraenkung"],"braucht_timer":false},
  {"id":"oral-007","text":"Du machst mich mit dem Mund fertig während du dich selbst anfasst. Aber du kommst nicht.","deck":"oral","intensitaet":5,"richtung":"an_sub","dauer_min":20,"tags":["denial","gleichzeitig"],"braucht_timer":false},
  {"id":"oral-008","text":"Ich stehe, du kniest. Und du schaust dabei hoch.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["knien","blick"],"braucht_timer":false},
  {"id":"oral-009","text":"Zwanzig Minuten. Ich zähle mit. Wenn du vorher aufhörst, machen wir es morgen nochmal — dann dreißig.","deck":"oral","intensitaet":5,"richtung":"an_sub","dauer_min":20,"tags":["ausdauer","konsequenz"],"braucht_timer":true},
  {"id":"oral-010","text":"Du fängst an während ich noch angezogen bin. Ich sage dir wann du weiter darfst.","deck":"oral","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["angezogen","aufbau"],"braucht_timer":false},
  {"id":"oral-011","text":"69, aber du darfst dich nicht bewegen. Nur ich.","deck":"oral","intensitaet":4,"richtung":"beide","dauer_min":15,"tags":["69","stillhalten"],"braucht_timer":false},
  {"id":"oral-013","text":"Du leckst mich morgens direkt nach dem Aufwachen. Bevor irgendwas anderes passiert.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["morgen","ritual"],"braucht_timer":false},
  {"id":"oral-014","text":"Ich sitze auf dem Sofa, du kniest davor. Ganz normaler Abend, Serie läuft weiter.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":25,"tags":["alltag","nebenbei"],"braucht_timer":false},
  {"id":"oral-015","text":"Erst wenn du mich zum Kommen gebracht hast, darfst du überhaupt etwas für dich erwarten.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["reihenfolge","dienen"],"braucht_timer":false},
  {"id":"oral-016","text":"Ich halte deinen Kopf und bestimme genau wo und wie schnell.","deck":"oral","intensitaet":5,"richtung":"an_domme","dauer_min":15,"tags":["fuehren","kontrolle"],"braucht_timer":false},
  {"id":"oral-017","text":"Du machst nur Geräusche, keine Worte. Und du machst viele.","deck":"oral","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["geraeusche"],"braucht_timer":false},
  {"id":"oral-018","text":"Erst wenn ich dreimal gekommen bin ist Schluss.","deck":"oral","intensitaet":5,"richtung":"an_sub","dauer_min":40,"tags":["mehrfach","ausdauer"],"braucht_timer":false}
]
```

---

## Deck: HÄNDE

```json
[
  {"id":"hand-001","text":"Nur ein Finger. Zehn Minuten. Kein zweiter, egal wie sehr ich es will.","deck":"haende","intensitaet":3,"richtung":"an_sub","dauer_min":10,"tags":["finger","einschraenkung"],"braucht_timer":true},
  {"id":"hand-002","text":"Ich führe deine Hand. Du machst genau das was ich dir zeige und nichts anderes.","deck":"haende","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["fuehren","lernen"],"braucht_timer":false},
  {"id":"hand-003","text":"Du fasst mich an, während wir beide angezogen auf dem Sofa sitzen. Ganz unauffällig.","deck":"haende","intensitaet":3,"richtung":"an_sub","dauer_min":20,"tags":["angezogen","subtil"],"braucht_timer":false},
  {"id":"hand-004","text":"Handjob mit Öl. Langsam. Du sagst mir wenn du kurz davor bist und ich höre auf.","deck":"haende","intensitaet":4,"richtung":"an_domme","dauer_min":20,"tags":["edging","oel"],"braucht_timer":false},
  {"id":"hand-005","text":"Deine Hand bleibt in meiner Hose während wir einen Film schauen. Bewegen darfst du dich nur wenn ich es dir sage.","deck":"haende","intensitaet":4,"richtung":"an_sub","dauer_min":45,"tags":["film","kontrolle"],"braucht_timer":false},
  {"id":"hand-006","text":"Beide Hände. Verschiedene Stellen. Gleichzeitig.","deck":"haende","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["multitasking"],"braucht_timer":false},
  {"id":"hand-007","text":"Du fasst mich an bis ich komme, und in dem Moment hörst du auf. Sofort.","deck":"haende","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["kontrolle","timing"],"braucht_timer":false},
  {"id":"hand-008","text":"Ich fasse dich an während du versuchst ein normales Gespräch mit mir zu führen. Wenn du den Faden verlierst, höre ich auf.","deck":"haende","intensitaet":4,"richtung":"an_domme","dauer_min":15,"tags":["ablenkung","spiel"],"braucht_timer":false},
  {"id":"hand-009","text":"Fünf Minuten Handjob, dann fünf Minuten Pause. Vier Runden.","deck":"haende","intensitaet":5,"richtung":"an_domme","dauer_min":40,"tags":["edging","runden"],"braucht_timer":true},
  {"id":"hand-010","text":"Du fasst dich selbst an, aber meine Hand liegt auf deiner. Ich bestimme das Tempo.","deck":"haende","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["gefuehrt","masturbation"],"braucht_timer":false},
  {"id":"hand-011","text":"Ich halte deine Hände fest und du kannst nichts machen außer es zu genießen.","deck":"haende","intensitaet":4,"richtung":"an_domme","dauer_min":20,"tags":["festhalten","passiv"],"braucht_timer":false},
  {"id":"hand-012","text":"Nur außen. Nichts rein. Bis ich es erlaube.","deck":"haende","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["teasing","regel"],"braucht_timer":false}
]
```

---

## Deck: TOYS

```json
[
  {"id":"toy-001","text":"Der Vibrator bleibt an bis ich sage dass er ausgeht. Du hältst durch.","deck":"toys","intensitaet":5,"richtung":"an_sub","dauer_min":25,"tags":["vibrator","ausdauer"],"braucht_timer":false},
  {"id":"toy-002","text":"Du benutzt das Toy an mir während du mich küsst. Beides gleichzeitig, kein Nachlassen.","deck":"toys","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["vibrator","multitasking"],"braucht_timer":false},
  {"id":"toy-003","text":"Fernbedienbares Toy. Ich habe die Kontrolle. Den ganzen Abend.","deck":"toys","intensitaet":5,"richtung":"beide","dauer_min":180,"tags":["remote","dauer"],"braucht_timer":false},
  {"id":"toy-004","text":"Du liegst gefesselt da und das Toy macht den Rest. Ich schaue nur zu.","deck":"toys","intensitaet":5,"richtung":"an_sub","dauer_min":25,"tags":["bondage","toy"],"braucht_timer":false},
  {"id":"toy-005","text":"Plug rein, und dann machen wir ganz normal weiter mit dem Abend.","deck":"toys","intensitaet":4,"richtung":"an_sub","dauer_min":120,"tags":["plug","alltag"],"braucht_timer":false},
  {"id":"toy-006","text":"Ich benutze das Toy an mir. Du darfst nur zuschauen und nichts anfassen. Auch dich nicht.","deck":"toys","intensitaet":4,"richtung":"an_domme","dauer_min":20,"tags":["zuschauen","denial"],"braucht_timer":false},
  {"id":"toy-007","text":"Zwei Toys gleichzeitig. Ich sage dir wo.","deck":"toys","intensitaet":5,"richtung":"an_sub","dauer_min":25,"tags":["mehrfach"],"braucht_timer":false},
  {"id":"toy-008","text":"Strapon. Du bereitest es selbst vor und bedankst dich dafür dass du darfst.","deck":"toys","intensitaet":5,"richtung":"an_sub","dauer_min":30,"tags":["pegging","vorbereitung"],"braucht_timer":false},
  {"id":"toy-009","text":"Cockring. Und dann machen wir so lange bis ich zufrieden bin.","deck":"toys","intensitaet":5,"richtung":"an_sub","dauer_min":40,"tags":["ring","ausdauer"],"braucht_timer":false},
  {"id":"toy-010","text":"Du wählst das Toy — aber ich entscheide ob wir es benutzen.","deck":"toys","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["wahl","erlaubnis"],"braucht_timer":false},
  {"id":"toy-011","text":"Wand am Anschlag. Du bewegst dich nicht weg, egal wie viel es ist.","deck":"toys","intensitaet":5,"richtung":"an_sub","dauer_min":15,"tags":["overstimulation"],"braucht_timer":false},
  {"id":"toy-012","text":"Federkitzler zuerst, dann was Härteres. Ich wechsle wann ich will.","deck":"toys","intensitaet":4,"richtung":"an_sub","dauer_min":25,"tags":["kontrast","sensorisch"],"braucht_timer":false}
]
```

---

## Deck: PUBLIC / HALBÖFFENTLICH

```json
[
  {"id":"pub-001","text":"Keine Unterwäsche beim Essengehen. Ich kontrolliere vorher.","deck":"public","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["kleidung","restaurant"],"braucht_timer":false},
  {"id":"pub-002","text":"Im Kino sitzt meine Hand da wo ich will. Du bleibst ruhig.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":120,"tags":["kino","stillhalten"],"braucht_timer":false},
  {"id":"pub-003","text":"Auf der Autofahrt fasst du mich an. Ich fahre weiter als wäre nichts.","deck":"public","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["auto"],"braucht_timer":false},
  {"id":"pub-004","text":"Umkleidekabine. Du hast fünf Minuten.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":5,"tags":["umkleide","zeitdruck"],"braucht_timer":true},
  {"id":"pub-005","text":"Du gehst auf die Toilette und schickst mir ein Foto von dem was du da machst.","deck":"public","intensitaet":4,"richtung":"an_sub","dauer_min":5,"tags":["toilette","foto"],"braucht_timer":true},
  {"id":"pub-006","text":"Fahrstuhl. So lange die Fahrt dauert.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":2,"tags":["fahrstuhl","kurz"],"braucht_timer":false},
  {"id":"pub-007","text":"Nachts am See oder im Park. Wir bleiben angezogen — größtenteils.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":20,"tags":["draussen","nacht"],"braucht_timer":false},
  {"id":"pub-008","text":"Ich flüstere dir in aller Öffentlichkeit ins Ohr was ich später mit dir machen werde. Du reagierst nicht sichtbar.","deck":"public","intensitaet":3,"richtung":"an_domme","dauer_min":5,"tags":["dirtytalk","beherrschen"],"braucht_timer":false},
  {"id":"pub-009","text":"Auf dem Balkon. Egal wer schauen könnte.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":15,"tags":["balkon","risiko"],"braucht_timer":false},
  {"id":"pub-010","text":"Du trägst heute den ganzen Tag etwas von mir unter der Kleidung. Niemand darf es merken.","deck":"public","intensitaet":3,"richtung":"an_sub","dauer_min":480,"tags":["geheimnis","dauer"],"braucht_timer":false},
  {"id":"pub-011","text":"Rücksitz. Parkplatz. Sofort.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":20,"tags":["auto","spontan"],"braucht_timer":false},
  {"id":"pub-012","text":"Beim Wandern — die erste abgelegene Stelle die wir finden.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":20,"tags":["natur","wandern"],"braucht_timer":false},
  {"id":"pub-013","text":"Hotelzimmer mit Fenster zur Straße. Vorhang bleibt auf.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":30,"tags":["hotel","fenster"],"braucht_timer":false},
  {"id":"pub-014","text":"Du fasst mich unterm Tisch an während wir mit anderen essen. Dein Gesicht bleibt neutral.","deck":"public","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["tisch","beherrschen"],"braucht_timer":false},
  {"id":"pub-015","text":"Treppenhaus. Zwischen zwei Etagen. Schnell.","deck":"public","intensitaet":4,"richtung":"beide","dauer_min":10,"tags":["treppe","quickie"],"braucht_timer":false}
]
```

---

## Deck: BESTRAFUNG

```json
[
  {"id":"str-001","text":"Heute Abend kommst du nicht. Punkt.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["denial"],"braucht_timer":false},
  {"id":"str-002","text":"Zwanzig Minuten in der Ecke knien. Danach reden wir.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["knien","demut"],"braucht_timer":true},
  {"id":"str-003","text":"Du schreibst mir fünfzig Mal auf was du falsch gemacht hast. Handschriftlich.","deck":"bestrafung","intensitaet":3,"richtung":"an_sub","dauer_min":30,"tags":["schreiben","reflexion"],"braucht_timer":false},
  {"id":"str-004","text":"Du machst mich fertig und bekommst nichts zurück. Zweimal diese Woche.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["dienen","denial"],"braucht_timer":false},
  {"id":"str-005","text":"Zehn Schläge. Du zählst mit und bedankst dich nach jedem.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["impact","zaehlen"],"braucht_timer":false},
  {"id":"str-006","text":"Drei Tage lang kein Anfassen ohne meine ausdrückliche Erlaubnis. Nicht mal Händchen halten.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":4320,"tags":["entzug","dauer"],"braucht_timer":false},
  {"id":"str-007","text":"Du wirst gefesselt und musst zuschauen wie ich es mir selbst mache. Ohne mitzumachen.","deck":"bestrafung","intensitaet":5,"richtung":"an_sub","dauer_min":25,"tags":["zuschauen","frustration"],"braucht_timer":false},
  {"id":"str-008","text":"Ich bringe dich an die Kante und stoppe. Fünfmal. Dann ist Schluss für heute.","deck":"bestrafung","intensitaet":5,"richtung":"an_sub","dauer_min":40,"tags":["edging","denial"],"braucht_timer":false},
  {"id":"str-009","text":"Du übernimmst diese Woche alles im Haushalt. Und zwar ohne einmal zu murren.","deck":"bestrafung","intensitaet":2,"richtung":"an_sub","dauer_min":null,"tags":["alltag","dienen"],"braucht_timer":false},
  {"id":"str-010","text":"Kalte Dusche. Fünf Minuten. Ich stoppe die Zeit.","deck":"bestrafung","intensitaet":3,"richtung":"an_sub","dauer_min":5,"tags":["kaelte","koerperlich"],"braucht_timer":true},
  {"id":"str-011","text":"Du bittest mich jeden Abend um Verzeihung. Eine Woche lang. Auf den Knien.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["ritual","demut"],"braucht_timer":false},
  {"id":"str-012","text":"Ein Wochenende ohne Handy. Ich verwahre es.","deck":"bestrafung","intensitaet":3,"richtung":"an_sub","dauer_min":2880,"tags":["entzug","alltag"],"braucht_timer":false},
  {"id":"str-013","text":"Du darfst dich nicht anfassen bis ich es erlaube. Ich kontrolliere per Nachricht.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["denial","kontrolle"],"braucht_timer":false},
  {"id":"str-014","text":"Alles was du diese Woche gerne machen würdest, wird gestrichen. Ich sage dir was stattdessen passiert.","deck":"bestrafung","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["entzug","kontrolle"],"braucht_timer":false},
  {"id":"str-015","text":"Du drehst am Straf-Rad. Was auch immer rauskommt, du nimmst es an.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["zufall","rad"],"braucht_timer":false},
  {"id":"str-016","text":"Du bettelst um jeden Kuss diese Woche. Und manchmal sage ich nein.","deck":"bestrafung","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["betteln","entzug"],"braucht_timer":false},
  {"id":"str-017","text":"Doppelte Trainingseinheit heute. Ohne Diskussion.","deck":"bestrafung","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["training","zusatz"],"braucht_timer":false},
  {"id":"str-018","text":"Du machst es dir selbst, direkt vor meinen Augen — und darfst nicht kommen.","deck":"bestrafung","intensitaet":5,"richtung":"an_sub","dauer_min":20,"tags":["masturbation","denial"],"braucht_timer":false}
]
```

---

## Deck: VERWÖHNEN

```json
[
  {"id":"ver-001","text":"Heute geht es nur um dich. Sag mir was du willst und ich mache es.","deck":"verwoehnen","intensitaet":3,"richtung":"an_domme","dauer_min":45,"tags":["belohnung","wunsch"],"braucht_timer":false},
  {"id":"ver-002","text":"Ganzkörpermassage mit Öl. Danach schläfst du in meinen Armen ein.","deck":"verwoehnen","intensitaet":2,"richtung":"an_domme","dauer_min":45,"tags":["massage","zaertlich"],"braucht_timer":false},
  {"id":"ver-003","text":"Du darfst heute einmal alles bestimmen. Einmal. Nutze es gut.","deck":"verwoehnen","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["rollentausch","belohnung"],"braucht_timer":false},
  {"id":"ver-004","text":"Ich mache dir ein Bad, wasche dir die Haare und danach bringe ich dich ins Bett.","deck":"verwoehnen","intensitaet":2,"richtung":"an_domme","dauer_min":60,"tags":["bad","pflege"],"braucht_timer":false},
  {"id":"ver-005","text":"So lange und so oft wie du willst. Heute keine Regeln.","deck":"verwoehnen","intensitaet":4,"richtung":"an_domme","dauer_min":90,"tags":["freiheit","belohnung"],"braucht_timer":false},
  {"id":"ver-006","text":"Ich mache es dir mit dem Mund und du sagst mir genau was du willst.","deck":"verwoehnen","intensitaet":4,"richtung":"an_domme","dauer_min":25,"tags":["oral","wunsch"],"braucht_timer":false},
  {"id":"ver-007","text":"Deine Lieblingsposition. So lange du willst.","deck":"verwoehnen","intensitaet":4,"richtung":"beide","dauer_min":30,"tags":["wunsch","belohnung"],"braucht_timer":false},
  {"id":"ver-008","text":"Ich ziehe an was du dir wünschst. Sag es mir.","deck":"verwoehnen","intensitaet":3,"richtung":"an_domme","dauer_min":null,"tags":["kleidung","wunsch"],"braucht_timer":false},
  {"id":"ver-009","text":"Kuscheln. Zwei Stunden. Nichts anderes.","deck":"verwoehnen","intensitaet":1,"richtung":"beide","dauer_min":120,"tags":["naehe","ruhe"],"braucht_timer":false},
  {"id":"ver-010","text":"Du sagst mir eine Fantasie und wir machen sie heute Abend genau so.","deck":"verwoehnen","intensitaet":4,"richtung":"beide","dauer_min":60,"tags":["fantasie","umsetzung"],"braucht_timer":false},
  {"id":"ver-011","text":"Frühstück ans Bett, Massage danach, und der Rest des Tages gehört dir.","deck":"verwoehnen","intensitaet":2,"richtung":"an_domme","dauer_min":180,"tags":["tag","verwoehnen"],"braucht_timer":false},
  {"id":"ver-012","text":"Ich sage dir eine halbe Stunde lang nur was ich an dir mag. Ohne Unterbrechung.","deck":"verwoehnen","intensitaet":1,"richtung":"an_domme","dauer_min":30,"tags":["worte","bestaetigung"],"braucht_timer":false}
]
```

---

## Deck: ROMANTIK

```json
[
  {"id":"rom-001","text":"Kerzen, Musik, kein Handy. Wir nehmen uns zwei Stunden nur füreinander.","deck":"romantik","intensitaet":2,"richtung":"beide","dauer_min":120,"tags":["atmosphaere"],"braucht_timer":false},
  {"id":"rom-002","text":"Wir tanzen im Wohnzimmer. Langsam. Bis wir nicht mehr tanzen.","deck":"romantik","intensitaet":2,"richtung":"beide","dauer_min":20,"tags":["tanzen"],"braucht_timer":false},
  {"id":"rom-003","text":"Du erzählst mir was du beim ersten Mal gedacht hast. Dann machen wir es nochmal so.","deck":"romantik","intensitaet":3,"richtung":"beide","dauer_min":45,"tags":["erinnerung"],"braucht_timer":false},
  {"id":"rom-004","text":"Wir schlafen heute nackt ein. Ohne dass etwas passiert.","deck":"romantik","intensitaet":1,"richtung":"beide","dauer_min":null,"tags":["naehe","zurueckhaltung"],"braucht_timer":false},
  {"id":"rom-005","text":"Zwanzig Minuten nur Blickkontakt und Küsse. Keine Hände unter der Kleidung.","deck":"romantik","intensitaet":2,"richtung":"beide","dauer_min":20,"tags":["kuessen","langsam"],"braucht_timer":true},
  {"id":"rom-006","text":"Wir schreiben uns beide auf einen Zettel was wir aneinander am meisten lieben und lesen es vor.","deck":"romantik","intensitaet":1,"richtung":"beide","dauer_min":20,"tags":["worte"],"braucht_timer":false},
  {"id":"rom-007","text":"Duschen zusammen, danach in Handtücher gewickelt aufs Sofa, und wir reden über alles was wir noch machen wollen.","deck":"romantik","intensitaet":2,"richtung":"beide","dauer_min":60,"tags":["dusche","planen"],"braucht_timer":false},
  {"id":"rom-008","text":"Sex bei Tageslicht. Vorhänge auf. Wir schauen uns dabei an.","deck":"romantik","intensitaet":3,"richtung":"beide","dauer_min":30,"tags":["licht","intimitaet"],"braucht_timer":false},
  {"id":"rom-009","text":"Wir machen alles doppelt so langsam wie sonst. Alles.","deck":"romantik","intensitaet":3,"richtung":"beide","dauer_min":60,"tags":["langsam"],"braucht_timer":false},
  {"id":"rom-010","text":"Handy aus, Bett, und wir bleiben da bis morgen früh.","deck":"romantik","intensitaet":2,"richtung":"beide","dauer_min":null,"tags":["auszeit"],"braucht_timer":false}
]
```

---

## Deck: TRAINING (Ausdauer & Steigerung)

```json
[
  {"id":"tra-001","text":"Heute zweimal. Zwischen den Runden eine Stunde Pause.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["frequenz","runden"],"braucht_timer":false},
  {"id":"tra-002","text":"Morgens und abends. Beide Male vollständig.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["frequenz","tag"],"braucht_timer":false},
  {"id":"tra-003","text":"Wir machen so lange bis du nicht mehr kannst — und dann noch einmal.","deck":"training","intensitaet":5,"richtung":"an_sub","dauer_min":null,"tags":["ausdauer","limit"],"braucht_timer":false},
  {"id":"tra-004","text":"Edging-Training: Ich bringe dich zehnmal an die Kante bevor du darfst.","deck":"training","intensitaet":5,"richtung":"an_sub","dauer_min":45,"tags":["edging","kontrolle"],"braucht_timer":false},
  {"id":"tra-005","text":"Du hältst mindestens fünfzehn Minuten durch. Schaffst du es nicht, machen wir es morgen mit zwanzig.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["ausdauer","steigerung"],"braucht_timer":true},
  {"id":"tra-006","text":"Nach dem ersten Mal bekommst du fünfzehn Minuten. Dann geht's weiter.","deck":"training","intensitaet":5,"richtung":"an_sub","dauer_min":null,"tags":["refraktaer","training"],"braucht_timer":true},
  {"id":"tra-007","text":"Drei Tage in Folge. Jeden Tag mindestens einmal. Ich hake ab.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["streak","frequenz"],"braucht_timer":false},
  {"id":"tra-008","text":"Atemtechnik-Übung: Wenn du kurz davor bist, atmest du tief und wir machen weiter. Fünf Durchgänge.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":30,"tags":["technik","kontrolle"],"braucht_timer":false},
  {"id":"tra-009","text":"Diese Woche wird jeden Tag gesteigert. Tag 1: einmal. Tag 7: du weißt schon.","deck":"training","intensitaet":5,"richtung":"an_sub","dauer_min":null,"tags":["progression","woche"],"braucht_timer":false},
  {"id":"tra-010","text":"Du machst mich zweimal fertig bevor du überhaupt drankommst.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":45,"tags":["reihenfolge","ausdauer"],"braucht_timer":false},
  {"id":"tra-011","text":"Heute keine Hände für dich. Nur ich bestimme wie viel Stimulation du bekommst.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["kontrolle"],"braucht_timer":false},
  {"id":"tra-012","text":"Wir zählen mit. Ziel ist eine Zahl die ich vorher aufschreibe und du erst am Ende siehst.","deck":"training","intensitaet":5,"richtung":"an_sub","dauer_min":null,"tags":["ziel","ungewissheit"],"braucht_timer":false},
  {"id":"tra-013","text":"Pause-Technik: Alle zwei Minuten stoppen wir dreißig Sekunden. Zehn Runden.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":25,"tags":["technik","runden"],"braucht_timer":true},
  {"id":"tra-014","text":"Ein Tag ohne, ein Tag doppelt. Diese Woche im Wechsel.","deck":"training","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["rhythmus","woche"],"braucht_timer":false}
]
```

---

## Deck: DISTANZ (wenn ihr nicht zusammen seid)

```json
[
  {"id":"dis-001","text":"Schick mir jetzt ein Foto. Ich sage dir wovon.","deck":"distanz","intensitaet":3,"richtung":"an_sub","dauer_min":5,"tags":["foto"],"braucht_timer":true},
  {"id":"dis-002","text":"Sprachnachricht. Erzähl mir was du gerade denkst. Ungefiltert.","deck":"distanz","intensitaet":3,"richtung":"an_sub","dauer_min":3,"tags":["voice"],"braucht_timer":false},
  {"id":"dis-003","text":"Du fasst dich an während ich dir schreibe was du machen sollst. Aber du kommst nicht.","deck":"distanz","intensitaet":5,"richtung":"an_sub","dauer_min":20,"tags":["denial","fernsteuerung"],"braucht_timer":false},
  {"id":"dis-004","text":"Videoanruf. Du machst was ich sage.","deck":"distanz","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["video","kontrolle"],"braucht_timer":false},
  {"id":"dis-005","text":"Schreib mir drei Sätze über das was du machen würdest wenn ich jetzt da wäre. Detailliert.","deck":"distanz","intensitaet":3,"richtung":"an_sub","dauer_min":10,"tags":["schreiben","fantasie"],"braucht_timer":false},
  {"id":"dis-006","text":"Du darfst dich heute nicht anfassen. Ich frage morgen nach.","deck":"distanz","intensitaet":4,"richtung":"an_sub","dauer_min":1440,"tags":["denial","vertrauen"],"braucht_timer":false},
  {"id":"dis-007","text":"Zieh das an was ich dir schicke und schick mir ein Foto davon.","deck":"distanz","intensitaet":3,"richtung":"an_sub","dauer_min":10,"tags":["kleidung","foto"],"braucht_timer":true},
  {"id":"dis-008","text":"Wir schreiben zusammen eine Fantasie. Abwechselnd, ein Satz pro Person.","deck":"distanz","intensitaet":3,"richtung":"beide","dauer_min":30,"tags":["schreiben","gemeinsam"],"braucht_timer":false},
  {"id":"dis-009","text":"Ich schicke dir alle zehn Minuten eine Anweisung. Du befolgst jede.","deck":"distanz","intensitaet":4,"richtung":"an_sub","dauer_min":60,"tags":["fernsteuerung"],"braucht_timer":false},
  {"id":"dis-010","text":"Sag mir per Sprachnachricht wie du dich fühlst wenn du an gestern denkst. Ohne dich zurückzuhalten.","deck":"distanz","intensitaet":3,"richtung":"an_sub","dauer_min":5,"tags":["voice","erinnerung"],"braucht_timer":false}
]
```

---

## Deck: KONTROLLE (D/s-Dynamik im Alltag)

```json
[
  {"id":"kon-001","text":"Du fragst heute vor jeder Mahlzeit um Erlaubnis.","deck":"kontrolle","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["alltag","erlaubnis"],"braucht_timer":false},
  {"id":"kon-002","text":"Ich lege dir heute Morgen deine Kleidung raus. Du trägst genau das.","deck":"kontrolle","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["kleidung","alltag"],"braucht_timer":false},
  {"id":"kon-003","text":"Du sprichst mich heute den ganzen Tag mit einem Titel an. Ich sage dir welchem.","deck":"kontrolle","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["anrede","protokoll"],"braucht_timer":false},
  {"id":"kon-004","text":"Du sitzt heute Abend zu meinen Füßen, nicht neben mir.","deck":"kontrolle","intensitaet":3,"richtung":"an_sub","dauer_min":120,"tags":["position","protokoll"],"braucht_timer":false},
  {"id":"kon-005","text":"Kein Blickkontakt heute Abend ohne meine Erlaubnis.","deck":"kontrolle","intensitaet":4,"richtung":"an_sub","dauer_min":180,"tags":["blick","protokoll"],"braucht_timer":false},
  {"id":"kon-006","text":"Du meldest mir jede Stunde per Nachricht was du gerade machst.","deck":"kontrolle","intensitaet":3,"richtung":"an_sub","dauer_min":480,"tags":["meldung","kontrolle"],"braucht_timer":false},
  {"id":"kon-007","text":"Du bittest heute um jede Berührung. Auch die harmlosen.","deck":"kontrolle","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["erlaubnis","protokoll"],"braucht_timer":false},
  {"id":"kon-008","text":"Ich entscheide heute alles. Was du isst, was du anziehst, wann du schläfst.","deck":"kontrolle","intensitaet":4,"richtung":"an_sub","dauer_min":null,"tags":["totalkontrolle","tag"],"braucht_timer":false},
  {"id":"kon-009","text":"Du bedankst dich heute für alles was ich für dich tue. Laut und ausdrücklich.","deck":"kontrolle","intensitaet":2,"richtung":"an_sub","dauer_min":null,"tags":["dankbarkeit"],"braucht_timer":false},
  {"id":"kon-010","text":"Handy gehört heute mir. Ich gebe es dir wenn ich will.","deck":"kontrolle","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["besitz","entzug"],"braucht_timer":false},
  {"id":"kon-011","text":"Du gehst heute Abend erst ins Bett wenn ich es sage.","deck":"kontrolle","intensitaet":3,"richtung":"an_sub","dauer_min":null,"tags":["schlaf","kontrolle"],"braucht_timer":false},
  {"id":"kon-012","text":"Du kniest dich hin wenn ich den Raum betrete. Den ganzen Abend.","deck":"kontrolle","intensitaet":4,"richtung":"an_sub","dauer_min":180,"tags":["knien","protokoll"],"braucht_timer":false}
]
```

---

## Deck: SINNE

```json
[
  {"id":"sin-001","text":"Augen verbunden. Du errätst was ich dir auf die Haut lege. Bei jedem Fehler mache ich weiter.","deck":"sinne","intensitaet":4,"richtung":"an_sub","dauer_min":25,"tags":["augenbinde","raten"],"braucht_timer":false},
  {"id":"sin-002","text":"Ohrstöpsel rein, Augenbinde auf. Nur Berührung, sonst nichts.","deck":"sinne","intensitaet":4,"richtung":"an_sub","dauer_min":30,"tags":["sensorisch","deprivation"],"braucht_timer":false},
  {"id":"sin-003","text":"Heiß und kalt im Wechsel. Ich sage nicht vorher was kommt.","deck":"sinne","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["temperatur"],"braucht_timer":false},
  {"id":"sin-004","text":"Feder, Seide, Leder, Eis. Du sagst mir was dir am besten gefällt — und das bekommst du dann nicht.","deck":"sinne","intensitaet":4,"richtung":"an_sub","dauer_min":25,"tags":["materialien","teasing"],"braucht_timer":false},
  {"id":"sin-005","text":"Kein Ton während der ganzen Session. Kein einziger. Wenn du einen machst, fangen wir von vorne an.","deck":"sinne","intensitaet":4,"richtung":"an_sub","dauer_min":30,"tags":["stille","disziplin"],"braucht_timer":false},
  {"id":"sin-006","text":"Du darfst mich nur riechen und hören. Nicht sehen, nicht anfassen.","deck":"sinne","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["geruch","deprivation"],"braucht_timer":false},
  {"id":"sin-007","text":"Ich füttere dich mit verbundenen Augen. Du errätst jedes Mal was es ist.","deck":"sinne","intensitaet":2,"richtung":"an_sub","dauer_min":20,"tags":["essen","raten"],"braucht_timer":false},
  {"id":"sin-008","text":"Nur Fingernägel. Über den ganzen Körper. Zwanzig Minuten.","deck":"sinne","intensitaet":3,"richtung":"an_sub","dauer_min":20,"tags":["kratzen","haut"],"braucht_timer":true}
]
```

---

## Deck: WORTE

```json
[
  {"id":"wor-001","text":"Sag mir laut was du willst. Bettel darum. Wenn es nicht überzeugend ist, passiert nichts.","deck":"worte","intensitaet":4,"richtung":"an_sub","dauer_min":10,"tags":["betteln","dirtytalk"],"braucht_timer":false},
  {"id":"wor-002","text":"Beschreib mir während wir es machen genau was du fühlst. Nicht aufhören zu reden.","deck":"worte","intensitaet":4,"richtung":"an_sub","dauer_min":20,"tags":["beschreiben"],"braucht_timer":false},
  {"id":"wor-003","text":"Du erzählst mir eine Fantasie von dir. Komplett. Ohne auszulassen.","deck":"worte","intensitaet":3,"richtung":"an_sub","dauer_min":15,"tags":["fantasie","offenheit"],"braucht_timer":false},
  {"id":"wor-004","text":"Ich sage dir was ich mit dir machen werde, und du antwortest bei jedem Punkt mit Ja.","deck":"worte","intensitaet":4,"richtung":"an_domme","dauer_min":10,"tags":["ansage","zustimmung"],"braucht_timer":false},
  {"id":"wor-005","text":"Nur ein Wort erlaubt heute Abend: mein Name. Sonst nichts.","deck":"worte","intensitaet":4,"richtung":"an_sub","dauer_min":30,"tags":["einschraenkung","name"],"braucht_timer":false},
  {"id":"wor-006","text":"Du zählst laut mit. Jede Bewegung. Bis hundert.","deck":"worte","intensitaet":4,"richtung":"an_sub","dauer_min":15,"tags":["zaehlen"],"braucht_timer":false},
  {"id":"wor-007","text":"Wir sagen uns abwechselnd was wir am anderen am geilsten finden. Immer expliziter.","deck":"worte","intensitaet":3,"richtung":"beide","dauer_min":15,"tags":["kompliment","eskalation"],"braucht_timer":false},
  {"id":"wor-008","text":"Du fragst vor jedem Schritt um Erlaubnis. Laut. Ich sage manchmal nein.","deck":"worte","intensitaet":4,"richtung":"an_sub","dauer_min":25,"tags":["erlaubnis","protokoll"],"braucht_timer":false},
  {"id":"wor-009","text":"Ich lese dir vor, während du machst was da steht.","deck":"worte","intensitaet":4,"richtung":"an_domme","dauer_min":20,"tags":["lesen","umsetzen"],"braucht_timer":false},
  {"id":"wor-010","text":"Sag mir zehn Dinge die du an mir magst — und bei jedem küsst du die Stelle.","deck":"worte","intensitaet":2,"richtung":"an_sub","dauer_min":15,"tags":["kompliment","kuessen"],"braucht_timer":false}
]
```

---

## Deck-Metadaten für die App

```json
{
  "decks": [
    {"key":"soft","name":"Sanft","farbe":"#c9a227","icon":"🕯️","beschreibung":"Vorspiel, Berührung, langsamer Aufbau"},
    {"key":"spicy","name":"Heiß","farbe":"#d9534f","icon":"🔥","beschreibung":"Deutlich sexuell, direkt"},
    {"key":"hardcore","name":"Intensiv","farbe":"#8b0000","icon":"⛓️","beschreibung":"Kein Zurückhalten"},
    {"key":"oral","name":"Oral","farbe":"#e07a5f","icon":"👅","beschreibung":"Nur mit dem Mund"},
    {"key":"haende","name":"Hände","farbe":"#e8a87c","icon":"✋","beschreibung":"Finger und Hände"},
    {"key":"toys","name":"Toys","farbe":"#9b59b6","icon":"🪄","beschreibung":"Mit Spielzeug"},
    {"key":"public","name":"Draußen","farbe":"#3d8168","icon":"🌙","beschreibung":"Halböffentlich, risikoreich"},
    {"key":"bestrafung","name":"Strafe","farbe":"#4a4a4a","icon":"⚖️","beschreibung":"Konsequenzen"},
    {"key":"verwoehnen","name":"Belohnung","farbe":"#f4a261","icon":"🎁","beschreibung":"Für dich"},
    {"key":"romantik","name":"Romantik","farbe":"#e5989b","icon":"🌹","beschreibung":"Nähe und Intimität"},
    {"key":"training","name":"Training","farbe":"#457b9d","icon":"📈","beschreibung":"Ausdauer und Steigerung"},
    {"key":"distanz","name":"Distanz","farbe":"#6d597a","icon":"📱","beschreibung":"Wenn ihr getrennt seid"},
    {"key":"kontrolle","name":"Kontrolle","farbe":"#2b2d42","icon":"🔒","beschreibung":"Dynamik im Alltag"},
    {"key":"sinne","name":"Sinne","farbe":"#8d99ae","icon":"🪶","beschreibung":"Sensorisches Spiel"},
    {"key":"worte","name":"Worte","farbe":"#bc6c25","icon":"💬","beschreibung":"Sprache und Stimme"}
  ]
}
```
