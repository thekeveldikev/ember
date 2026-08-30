# EMBER — Content-Datei 05: Fortune Cookies

## Konzept

Ein kurzer Spruch pro Tag, beim ersten Öffnen der App. Kurz, treffend, nie mehr als zwei Sätze.

Die App wählt aus einem Pool, der nach **Empfänger** und **Stimmung** gefiltert wird.

## Format

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Eindeutig |
| `text` | string | Der Spruch |
| `kategorie` | string | Siehe unten |
| `fuer` | string | `sub` \| `domme` \| `beide` |
| `intensitaet` | int 1–5 | |
| `tageszeit` | string | `morgen` \| `abend` \| `egal` |

**Kategorien:** `romantisch`, `dreckig`, `dominant`, `submissiv`, `teasing`, `warm`, `frech`, `nachdenklich`, `motivation`, `wildcard`

---

## Kategorie: ROMANTISCH

```json
[
  {"id":"fc-r001","text":"Heute ist wieder so ein Tag, an dem du sie ansiehst und nicht glauben kannst, dass sie deine ist.","kategorie":"romantisch","fuer":"sub","intensitaet":1,"tageszeit":"morgen"},
  {"id":"fc-r002","text":"Sag ihr heute etwas, das du sonst nur denkst.","kategorie":"romantisch","fuer":"beide","intensitaet":1,"tageszeit":"egal"},
  {"id":"fc-r003","text":"Die besten Nächte fangen mit einem Blick an, der zu lange dauert.","kategorie":"romantisch","fuer":"beide","intensitaet":2,"tageszeit":"abend"},
  {"id":"fc-r004","text":"Jemand denkt gerade an dich. Und nicht auf die harmlose Art.","kategorie":"romantisch","fuer":"beide","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-r005","text":"Manche Menschen sucht man ein Leben lang. Ihr habt schon gefunden.","kategorie":"romantisch","fuer":"beide","intensitaet":1,"tageszeit":"egal"},
  {"id":"fc-r006","text":"Küss sie heute, bevor du irgendetwas sagst.","kategorie":"romantisch","fuer":"sub","intensitaet":1,"tageszeit":"morgen"},
  {"id":"fc-r007","text":"Zwischen euch ist mehr los als die meisten je erleben werden.","kategorie":"romantisch","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-r008","text":"Der Moment, in dem sie lacht und du vergisst was du sagen wolltest — den hast du heute noch vor dir.","kategorie":"romantisch","fuer":"sub","intensitaet":1,"tageszeit":"morgen"},
  {"id":"fc-r009","text":"Was ihr habt, kann man sich nicht ausdenken.","kategorie":"romantisch","fuer":"beide","intensitaet":1,"tageszeit":"egal"},
  {"id":"fc-r010","text":"Heute Abend: keine Ablenkung. Nur ihr zwei.","kategorie":"romantisch","fuer":"beide","intensitaet":1,"tageszeit":"abend"},
  {"id":"fc-r011","text":"Du hast jemanden gefunden, der dich kennt und trotzdem bleibt. Das ist selten.","kategorie":"romantisch","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-r012","text":"Berühr sie heute einmal ohne Grund. Nur weil du kannst.","kategorie":"romantisch","fuer":"sub","intensitaet":1,"tageszeit":"egal"}
]
```

---

## Kategorie: DRECKIG

```json
[
  {"id":"fc-d001","text":"Sie denkt heute schon den ganzen Morgen an gestern Abend. Und du auch.","kategorie":"dreckig","fuer":"sub","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-d002","text":"Es gibt Tage, an denen Reden überbewertet ist.","kategorie":"dreckig","fuer":"beide","intensitaet":3,"tageszeit":"abend"},
  {"id":"fc-d003","text":"Heute Abend wird nichts diskutiert.","kategorie":"dreckig","fuer":"sub","intensitaet":4,"tageszeit":"abend"},
  {"id":"fc-d004","text":"Du hast heute etwas gut. Frag sie, ob sie es dir gibt.","kategorie":"dreckig","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-d005","text":"Der Abstand zwischen 'nur kurz' und 'zwei Stunden später' war noch nie so klein.","kategorie":"dreckig","fuer":"beide","intensitaet":3,"tageszeit":"abend"},
  {"id":"fc-d006","text":"Manche Dinge macht man nicht, weil man muss. Sondern weil sie es sagt.","kategorie":"dreckig","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-d007","text":"Heute wäre ein guter Tag, um sie sprachlos zu machen.","kategorie":"dreckig","fuer":"sub","intensitaet":4,"tageszeit":"abend"},
  {"id":"fc-d008","text":"Du wirst heute Abend nicht viel zu sagen haben. Und das ist auch gut so.","kategorie":"dreckig","fuer":"sub","intensitaet":4,"tageszeit":"abend"},
  {"id":"fc-d009","text":"Es gibt einen Grund, warum du diese App öffnest, bevor du deine Mails checkst.","kategorie":"dreckig","fuer":"beide","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-d010","text":"Sie hat schon entschieden. Du erfährst es später.","kategorie":"dreckig","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-d011","text":"Halt heute Abend nicht so viel aus wie du denkst. Sie wird es merken.","kategorie":"dreckig","fuer":"sub","intensitaet":4,"tageszeit":"abend"},
  {"id":"fc-d012","text":"Zwischen Küche und Schlafzimmer liegt heute mehr als ein Flur.","kategorie":"dreckig","fuer":"beide","intensitaet":3,"tageszeit":"abend"},
  {"id":"fc-d013","text":"Du hast dich heute Morgen angezogen. Sie plant, das rückgängig zu machen.","kategorie":"dreckig","fuer":"sub","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-d014","text":"Es ist noch nicht mal Mittag und du denkst schon wieder daran.","kategorie":"dreckig","fuer":"beide","intensitaet":3,"tageszeit":"tag"},
  {"id":"fc-d015","text":"Manche Sachen sagt man nicht laut. Man macht sie einfach.","kategorie":"dreckig","fuer":"beide","intensitaet":4,"tageszeit":"egal"}
]
```

---

## Kategorie: DOMINANT (an Kevin, aus ihrer Position)

```json
[
  {"id":"fc-do001","text":"Sie entscheidet heute. Wie immer.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-do002","text":"Du bist gut darin, zu warten. Übe das heute nochmal.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-do003","text":"Erst fragen. Immer erst fragen.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-do004","text":"Sie hat heute Morgen schon an dich gedacht. Du wirst gleich merken, in welchem Zusammenhang.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-do005","text":"Was du heute willst, ist nicht die Frage.","kategorie":"dominant","fuer":"sub","intensitaet":5,"tageszeit":"egal"},
  {"id":"fc-do006","text":"Sie merkt es, wenn du nicht ganz bei der Sache bist. Sie merkt alles.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-do007","text":"Es gibt zwei Möglichkeiten heute: ihre und die falsche.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-do008","text":"Du hast heute keine Entscheidungen zu treffen. Entspann dich.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-do009","text":"Sie hat sich etwas überlegt. Du wirst es rechtzeitig erfahren.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-do010","text":"Gehorsam ist keine Schwäche. Es ist eine Entscheidung, die du jeden Tag neu triffst.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-do011","text":"Heute ist ein guter Tag, um sie stolz zu machen.","kategorie":"dominant","fuer":"sub","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-do012","text":"Du wirst heute mindestens einmal 'Ja' sagen, wenn du lieber 'Aber' sagen würdest.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-do013","text":"Sie hat die Regeln nicht ohne Grund gemacht.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-do014","text":"Was in der Queue steht, bleibt in der Queue. Bis sie es rausholt.","kategorie":"dominant","fuer":"sub","intensitaet":5,"tageszeit":"egal"},
  {"id":"fc-do015","text":"Du fragst dich, was heute passiert. Genau das ist der Punkt.","kategorie":"dominant","fuer":"sub","intensitaet":4,"tageszeit":"morgen"}
]
```

---

## Kategorie: SUBMISSIV (Erinnerungen an die Rolle)

```json
[
  {"id":"fc-s001","text":"Dienen ist eine Kunst. Du wirst jeden Tag besser.","kategorie":"submissiv","fuer":"sub","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-s002","text":"Das Beste an Hingabe: Du musst nichts entscheiden.","kategorie":"submissiv","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-s003","text":"Du hast dich für das hier entschieden. Erinnere dich heute daran, warum.","kategorie":"submissiv","fuer":"sub","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-s004","text":"Sie zu bekommen was sie braucht — das ist dein Job. Und du machst ihn gern.","kategorie":"submissiv","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-s005","text":"Der schwierigste Teil ist nicht das Machen. Es ist das Warten.","kategorie":"submissiv","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-s006","text":"Du bist nicht weniger, weil du kniest. Du bist genau da wo du sein willst.","kategorie":"submissiv","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-s007","text":"Heute: fragen, nicht nehmen.","kategorie":"submissiv","fuer":"sub","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-s008","text":"Ein 'Danke' zur richtigen Zeit ist mehr wert als tausend Worte.","kategorie":"submissiv","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-s009","text":"Sie merkt sich, wie du dich verhältst, wenn du denkst dass es niemand sieht.","kategorie":"submissiv","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-s010","text":"Kontrolle abgeben ist nicht Kontrollverlust. Es ist Vertrauen.","kategorie":"submissiv","fuer":"sub","intensitaet":3,"tageszeit":"egal"}
]
```

---

## Kategorie: TEASING

```json
[
  {"id":"fc-t001","text":"Nicht heute. Vielleicht morgen. Vielleicht auch nicht.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-t002","text":"Es steht schon fest. Du erfährst es nur noch nicht.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-t003","text":"Du wirst heute mindestens dreimal denken 'jetzt gleich' — und dich zweimal irren.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-t004","text":"Warten macht alles besser. Sagt sie zumindest.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-t005","text":"Wenn du glaubst, du weißt was heute passiert, liegst du falsch.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-t006","text":"Heute wird angefangen. Ob auch aufgehört wird, ist eine andere Frage.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"abend"},
  {"id":"fc-t007","text":"Etwas ist geplant. Mehr sagt sie nicht.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-t008","text":"Du bist nervös. Das ist beabsichtigt.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-t009","text":"Kurz davor ist auch ein Ort, an dem man länger bleiben kann.","kategorie":"teasing","fuer":"sub","intensitaet":5,"tageszeit":"egal"},
  {"id":"fc-t010","text":"Sie hat heute Morgen gelächelt, als sie an heute Abend gedacht hat. Viel Spaß beim Rätseln.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-t011","text":"Frag ruhig. Die Antwort wird dir nicht gefallen.","kategorie":"teasing","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-t012","text":"Manchmal ist das Beste am Abend, dass er noch nicht angefangen hat.","kategorie":"teasing","fuer":"beide","intensitaet":3,"tageszeit":"tag"}
]
```

---

## Kategorie: WARM

```json
[
  {"id":"fc-w001","text":"Egal was heute läuft: Am Ende des Tages seid ihr zwei.","kategorie":"warm","fuer":"beide","intensitaet":1,"tageszeit":"morgen"},
  {"id":"fc-w002","text":"Frag sie heute, wie es ihr wirklich geht. Und hör dann zu.","kategorie":"warm","fuer":"sub","intensitaet":1,"tageszeit":"abend"},
  {"id":"fc-w003","text":"Nähe ist nicht nur das Laute. Manchmal reicht eine Hand.","kategorie":"warm","fuer":"beide","intensitaet":1,"tageszeit":"egal"},
  {"id":"fc-w004","text":"Ihr müsst heute nichts beweisen. Auch das ist erlaubt.","kategorie":"warm","fuer":"beide","intensitaet":1,"tageszeit":"egal"},
  {"id":"fc-w005","text":"Die stillen Abende zählen genauso wie die lauten.","kategorie":"warm","fuer":"beide","intensitaet":1,"tageszeit":"abend"},
  {"id":"fc-w006","text":"Wenn es heute zu viel wird, sagt es euch. Dafür habt ihr die Worte.","kategorie":"warm","fuer":"beide","intensitaet":1,"tageszeit":"egal"},
  {"id":"fc-w007","text":"Vertrauen ist die Basis. Alles andere kommt danach.","kategorie":"warm","fuer":"beide","intensitaet":1,"tageszeit":"egal"},
  {"id":"fc-w008","text":"Sag ihr heute einmal Danke. Für irgendwas. Sie weiß schon wofür.","kategorie":"warm","fuer":"sub","intensitaet":1,"tageszeit":"abend"},
  {"id":"fc-w009","text":"Die Beziehung ist das Fundament. Das Spiel ist nur das schöne Zimmer obendrauf.","kategorie":"warm","fuer":"beide","intensitaet":1,"tageszeit":"egal"},
  {"id":"fc-w010","text":"Heute darf auch einfach mal alles normal sein.","kategorie":"warm","fuer":"beide","intensitaet":1,"tageszeit":"egal"}
]
```

---

## Kategorie: FRECH

```json
[
  {"id":"fc-f001","text":"Du hast heute schon dreimal aufs Handy geschaut, ob sie geschrieben hat. Wir zählen mit.","kategorie":"frech","fuer":"sub","intensitaet":2,"tageszeit":"tag"},
  {"id":"fc-f002","text":"Diese App weiß mehr über euch als eure Freunde.","kategorie":"frech","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-f003","text":"Erinnerung: Ihr habt eine Bucket-List. Ihr habt sie seit drei Wochen nicht angerührt.","kategorie":"frech","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-f004","text":"Der Button funktioniert übrigens auch tagsüber.","kategorie":"frech","fuer":"beide","intensitaet":3,"tageszeit":"tag"},
  {"id":"fc-f005","text":"Es gibt Menschen, die benutzen ihr Handy für Nachrichten und Kalender. Süß.","kategorie":"frech","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-f006","text":"Falls du dich fragst: Ja, sie hat es gesehen. Nein, sie antwortet noch nicht.","kategorie":"frech","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-f007","text":"Du bist nicht der Erste, der glaubt, er könnte durchhalten.","kategorie":"frech","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-f008","text":"Statistisch gesehen wird heute jemand betteln. Wetten, wer?","kategorie":"frech","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-f009","text":"Deine Streak sieht gut aus. Wäre schade drum.","kategorie":"frech","fuer":"sub","intensitaet":2,"tageszeit":"morgen"},
  {"id":"fc-f010","text":"Es ist noch Platz auf der Wunschliste. Nur so als Hinweis.","kategorie":"frech","fuer":"beide","intensitaet":2,"tageszeit":"egal"}
]
```

---

## Kategorie: NACHDENKLICH

```json
[
  {"id":"fc-n001","text":"Was ihr macht, funktioniert nur, weil ihr beide es wollt. Das ist keine Kleinigkeit.","kategorie":"nachdenklich","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-n002","text":"Grenzen verschieben sich. Sie verschwinden nicht.","kategorie":"nachdenklich","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-n003","text":"Kontrolle geben ist mehr Arbeit als Kontrolle nehmen. Beide wissen das.","kategorie":"nachdenklich","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-n004","text":"Das Spiel funktioniert nur, solange ihr auch außerhalb davon redet.","kategorie":"nachdenklich","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-n005","text":"Es gibt einen Unterschied zwischen 'Ich kann nicht' und 'Ich will gerade nicht'. Beides ist okay.","kategorie":"nachdenklich","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-n006","text":"Ihr habt euch das ausgesucht. Und ihr könnt es jeden Tag neu aussuchen.","kategorie":"nachdenklich","fuer":"beide","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-n007","text":"Wer führt, trägt auch die Verantwortung. Das ist der Deal.","kategorie":"nachdenklich","fuer":"domme","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-n008","text":"Das Beste an Regeln: Man kann sie ändern, wenn sie nicht mehr passen.","kategorie":"nachdenklich","fuer":"beide","intensitaet":2,"tageszeit":"egal"}
]
```

---

## Kategorie: MOTIVATION (fürs Training)

```json
[
  {"id":"fc-m001","text":"Fortschritt ist unbequem. Das ist der ganze Punkt.","kategorie":"motivation","fuer":"sub","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-m002","text":"Vor drei Monaten hättest du das nicht geschafft. Denk mal drüber nach.","kategorie":"motivation","fuer":"sub","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-m003","text":"Die Zahl steigt. Nicht von allein.","kategorie":"motivation","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-m004","text":"Heute ist ein guter Tag, um dein Limit neu zu definieren.","kategorie":"motivation","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-m005","text":"Ausdauer ist Übungssache. Und du übst gern.","kategorie":"motivation","fuer":"sub","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-m006","text":"Sie hat das Ziel erhöht, weil du das alte erreicht hast. Nimm es als Kompliment.","kategorie":"motivation","fuer":"sub","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-m007","text":"Ein Level ist nur eine Zahl. Aber sie stimmt.","kategorie":"motivation","fuer":"sub","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-m008","text":"Der nächste Rang ist näher als du denkst.","kategorie":"motivation","fuer":"sub","intensitaet":3,"tageszeit":"morgen"}
]
```

---

## Kategorie: WILDCARD

```json
[
  {"id":"fc-x001","text":"Zieh heute eine Karte. Irgendeine. Macht sie.","kategorie":"wildcard","fuer":"beide","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-x002","text":"Dreht heute einmal am Rad. Was rauskommt, wird gemacht.","kategorie":"wildcard","fuer":"beide","intensitaet":4,"tageszeit":"abend"},
  {"id":"fc-x003","text":"Heute übernimmt der Zufall. Münze werfen: Kopf heißt ihre Idee, Zahl heißt seine.","kategorie":"wildcard","fuer":"beide","intensitaet":3,"tageszeit":"abend"},
  {"id":"fc-x004","text":"Neue Regel für heute. Sie denkt sich eine aus, jetzt sofort.","kategorie":"wildcard","fuer":"domme","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-x005","text":"Schaut euch heute an, was ihr vor einem Jahr gemacht habt. Und macht es nochmal.","kategorie":"wildcard","fuer":"beide","intensitaet":3,"tageszeit":"abend"},
  {"id":"fc-x006","text":"Ein Punkt geht heute an denjenigen, der zuerst nachgibt.","kategorie":"wildcard","fuer":"beide","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-x007","text":"Heute keine Regeln. Ausnahmsweise. Nutzt es.","kategorie":"wildcard","fuer":"beide","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-x008","text":"Der erste von euch, der heute den Button drückt, darf sich etwas wünschen.","kategorie":"wildcard","fuer":"beide","intensitaet":3,"tageszeit":"morgen"}
]
```

---

## Kategorie: FÜR SIE (an Gioia)

```json
[
  {"id":"fc-g001","text":"Er wartet. Ob du ihn warten lässt, ist deine Entscheidung.","kategorie":"dominant","fuer":"domme","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-g002","text":"Du hast heute die Wahl zwischen nett und interessant.","kategorie":"teasing","fuer":"domme","intensitaet":4,"tageszeit":"morgen"},
  {"id":"fc-g003","text":"Er hat sich in letzter Zeit angestrengt. Vielleicht merkt er es, wenn du es merkst.","kategorie":"warm","fuer":"domme","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-g004","text":"Die Queue hat noch Platz.","kategorie":"dominant","fuer":"domme","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-g005","text":"Manchmal ist die stärkste Ansage die, die man nicht ausspricht.","kategorie":"dominant","fuer":"domme","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-g006","text":"Du weißt genau, was er heute braucht. Ob er es bekommt, ist eine andere Sache.","kategorie":"teasing","fuer":"domme","intensitaet":4,"tageszeit":"egal"},
  {"id":"fc-g007","text":"Heute wäre ein guter Tag, um ihn zu überraschen. Positiv oder anders — deine Wahl.","kategorie":"wildcard","fuer":"domme","intensitaet":3,"tageszeit":"morgen"},
  {"id":"fc-g008","text":"Führen heißt auch: merken, wann er an der Grenze ist.","kategorie":"nachdenklich","fuer":"domme","intensitaet":2,"tageszeit":"egal"},
  {"id":"fc-g009","text":"Er hat sein Ziel diese Woche geschafft. Was jetzt kommt, entscheidest du.","kategorie":"motivation","fuer":"domme","intensitaet":3,"tageszeit":"egal"},
  {"id":"fc-g010","text":"Du musst heute nichts planen. Spontan ist auch eine Ansage.","kategorie":"dominant","fuer":"domme","intensitaet":3,"tageszeit":"morgen"}
]
```

---

## Auswahl-Logik

```json
{
  "auswahl": {
    "haeufigkeit": "Einmal pro Tag, beim ersten App-Öffnen",
    "empfaenger_filter": "Sub bekommt fuer='sub' oder 'beide'; Domme bekommt fuer='domme' oder 'beide'",
    "tageszeit_gewichtung": {
      "vor_11_uhr": "tageszeit='morgen' oder 'egal' bevorzugen (Gewicht 3:1)",
      "11_bis_18": "tageszeit='tag' oder 'egal'",
      "nach_18_uhr": "tageszeit='abend' oder 'egal' bevorzugen (Gewicht 3:1)"
    },
    "ampel_filter": {
      "rot": "nur kategorie 'warm' oder 'nachdenklich', max intensitaet 1",
      "gelb": "max intensitaet 3, kategorie 'dreckig' und 'hardcore-teasing' ausschließen",
      "gruen": "alle"
    },
    "kategorie_rotation": "Nicht zweimal hintereinander dieselbe Kategorie",
    "wiederholungssperre": "Ein Spruch frühestens nach 60 Tagen erneut",
    "eigene_sprueche": "Von Domme oder Sub selbst geschriebene Sprüche haben doppelte Gewichtung im Pool"
  }
}
```

---

## Implementierungs-Hinweise

1. **Darstellung:** Elegant, minimal. Serif-Font, zentriert, viel Weißraum. Kurze Fade-in-Animation. Antippen zum Wegwischen.
2. **Eigene Sprüche:** Beide können welche hinzufügen. Sie landen im Pool und bekommen ein kleines Marker-Icon, damit man sieht dass er von der anderen Person kommt.
3. **Sammlung:** Alle bisherigen Sprüche in einem Archiv. Favoriten markierbar. Favoriten kommen häufiger.
4. **Sonderfall Jahrestag/Geburtstag:** An eingetragenen besonderen Tagen wird ein spezieller Spruch aus einem separaten Pool gezogen, der von Domme vorher befüllt werden kann.
5. **Timing:** Der Spruch des Tages wird um Mitternacht neu gewürfelt, aber erst beim ersten Öffnen angezeigt.
