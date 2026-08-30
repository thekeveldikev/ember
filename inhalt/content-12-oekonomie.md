# EMBER — Content-Datei 12: Die Ökonomie

## Grundidee

Ein Punktesystem, das nur zählt, ist ein Tacho ohne Straße. Damit Karma etwas bedeutet, muss man es **ausgeben** können — und zwar für Dinge, die Kevin wirklich will, zu Preisen, die Gioia kontrolliert.

Der eigentliche Reiz liegt nicht im Kaufen. Er liegt darin, dass Gioia die gesamte Volkswirtschaft steuert: Sie bestimmt Einkommen, Preise, Verfügbarkeit, Strafen und Zinsen. Sie kann jederzeit einen Artikel verteuern, das Gehalt kürzen oder eine Sonderabgabe erheben. Kevin arbeitet in einem System, dessen Regeln sich ändern können, während er spart.

---

# TEIL 1: Die Währungen

## Zwei Währungen

| Währung | Symbol | Herkunft | Charakter |
|---|---|---|---|
| **Karma** | ● | Täglich verdient | Fließend, verfällt, wird ausgegeben |
| **Siegel** | ✦ | Selten, aus Meilensteinen | Wertbeständig, nicht verfallbar, für Großes |

**Wechselkurs:** 1 Siegel = 50 Karma. Der Tausch geht nur in eine Richtung — Siegel zu Karma, nie zurück. Man kann sich Siegel nicht erarbeiten, indem man Karma hortet.

```json
{
  "waehrungen": [
    {
      "key":"karma",
      "name":"Karma",
      "symbol":"●",
      "farbe":"#c9a227",
      "verfaellt":true,
      "verfall_rate":"5% pro Monat auf ungenutztes Guthaben",
      "kann_negativ":true,
      "min":-30,
      "max":null
    },
    {
      "key":"siegel",
      "name":"Siegel",
      "symbol":"✦",
      "farbe":"#c4785a",
      "verfaellt":false,
      "kann_negativ":false,
      "min":0,
      "max":null,
      "wechselkurs_zu_karma":50,
      "rueckwechsel":false
    }
  ]
}
```

---

# TEIL 2: Einkommen

## Das Grundgehalt

Kevin bekommt jeden Sonntag ein festes Wocheneinkommen. Das ist die Basis — alles andere kommt obendrauf.

```json
{
  "grundgehalt": {
    "betrag":10,
    "waehrung":"karma",
    "auszahlung":"Sonntag 20:00",
    "bedingung":"Wird nur ausgezahlt, wenn die Woche nicht komplett verpasst wurde",
    "kuerzbar":true,
    "kuerzung_hinweis":"Gioia kann das Gehalt kürzen oder streichen. Kevin sieht nur den ausgezahlten Betrag, nicht den Grund.",
    "erhoehung":"Bei Level-Ups steigt das Grundgehalt um 1 pro 5 Level"
  }
}
```

## Verdienstquellen

```json
{
  "einnahmen": [
    {"key":"task_taeglich","name":"Tägliche Aufgabe erledigt","betrag":1,"waehrung":"karma","limit_pro_tag":3},
    {"key":"task_woche","name":"Wochenaufgabe erledigt","betrag":3,"waehrung":"karma","limit_pro_woche":3},
    {"key":"task_spezial","name":"Spezialauftrag erledigt","betrag":5,"waehrung":"karma","limit_pro_woche":2},
    {"key":"challenge","name":"Tägliche Challenge erfüllt","betrag":2,"waehrung":"karma","limit_pro_tag":1},
    {"key":"challenge_stufe4plus","name":"Challenge Stufe 4 oder 5","betrag":4,"waehrung":"karma","limit_pro_tag":1},
    {"key":"streak_3","name":"3 Tage Streak","betrag":2,"waehrung":"karma","einmalig_pro_streak":true},
    {"key":"streak_7","name":"7 Tage Streak","betrag":6,"waehrung":"karma","einmalig_pro_streak":true},
    {"key":"streak_14","name":"14 Tage Streak","betrag":15,"waehrung":"karma","einmalig_pro_streak":true},
    {"key":"streak_30","name":"30 Tage Streak","betrag":1,"waehrung":"siegel","einmalig_pro_streak":true},
    {"key":"session_gut","name":"Session mit 4+ Flammen bewertet","betrag":3,"waehrung":"karma","limit_pro_tag":1},
    {"key":"initiative","name":"Eigeninitiative — er fängt an","betrag":2,"waehrung":"karma","limit_pro_woche":3,"vergabe":"manuell durch Gioia"},
    {"key":"trainingsziel","name":"Wochenziel im Training erreicht","betrag":8,"waehrung":"karma","limit_pro_woche":1},
    {"key":"level_up","name":"Level-Up","betrag":1,"waehrung":"siegel","limit":null},
    {"key":"bossfight","name":"Boss-Fight bestanden","betrag":2,"waehrung":"siegel","limit":null},
    {"key":"achievement","name":"Achievement freigeschaltet","betrag":5,"waehrung":"karma","limit":null},
    {"key":"bucketlist","name":"Bucket-List-Item abgehakt","betrag":1,"waehrung":"siegel","limit":null},
    {"key":"lob","name":"Sonderlob von Gioia","betrag":"frei","waehrung":"beide","vergabe":"manuell"},
    {"key":"ehrlichkeit","name":"Etwas Unangenehmes von selbst zugegeben","betrag":5,"waehrung":"karma","vergabe":"manuell"},
    {"key":"aftercare","name":"Nach einer Session gut gekümmert","betrag":2,"waehrung":"karma","vergabe":"manuell"},
    {"key":"veto_ungenutzt","name":"Ungenutztes Veto am Monatsende","betrag":5,"waehrung":"karma","limit_pro_monat":2}
  ]
}
```

**Realistisches Wocheneinkommen:** 20–35 Karma bei guter Woche. 10–15 bei durchschnittlicher. 0 bei schlechter.

---

# TEIL 3: Der Bußgeldkatalog

Feste Preise für Vergehen. Der Katalog hängt sichtbar in der App — Kevin weiß immer, was ihn was kostet.

```json
{
  "bussgelder": [
    {"vergehen":"Aufgabe nicht erledigt","betrag":-2,"kategorie":"pflicht"},
    {"vergehen":"Aufgabe zu spät erledigt","betrag":-1,"kategorie":"pflicht"},
    {"vergehen":"Challenge ausgelassen","betrag":-2,"kategorie":"pflicht"},
    {"vergehen":"Stehende Regel gebrochen","betrag":-5,"kategorie":"regel"},
    {"vergehen":"Regel gebrochen und nicht selbst gemeldet","betrag":-10,"kategorie":"regel"},
    {"vergehen":"Nachricht über eine Stunde ignoriert","betrag":-1,"kategorie":"aufmerksamkeit"},
    {"vergehen":"Sofort-Befehl nicht innerhalb des Timers","betrag":-4,"kategorie":"gehorsam"},
    {"vergehen":"Ohne Erlaubnis gekommen","betrag":-15,"kategorie":"schwer"},
    {"vergehen":"Ohne Erlaubnis angefasst","betrag":-8,"kategorie":"schwer"},
    {"vergehen":"Bei Wahrheit oder Pflicht gepasst","betrag":-1,"kategorie":"spiel"},
    {"vergehen":"Widerworte ohne Verhandlungs-Antrag","betrag":-3,"kategorie":"protokoll"},
    {"vergehen":"Falsche Anrede","betrag":-1,"kategorie":"protokoll"},
    {"vergehen":"Streak gebrochen","betrag":-5,"kategorie":"leistung"},
    {"vergehen":"Trainingsziel verfehlt","betrag":-6,"kategorie":"leistung"},
    {"vergehen":"Gelogen","betrag":-20,"kategorie":"schwerst"},
    {"vergehen":"Sonderabgabe","betrag":"frei","kategorie":"willkuer","hinweis":"Gioia kann jederzeit eine Abgabe erheben, ohne Begründung"}
  ],
  "regeln": {
    "kein_bussgeld_bei":"Ampel Rot, Safeword, Krank-Modus",
    "verdopplung":"Wiederholtes gleiches Vergehen innerhalb von 7 Tagen kostet doppelt",
    "erlass":"Gioia kann jedes Bußgeld erlassen — muss aber nicht sagen, dass sie es getan hat"
  }
}
```

---

# TEIL 4: Der Laden

Das Sortiment ist in Abteilungen gegliedert. Jede Abteilung hat ein eigenes Preisniveau.

## Abteilung: Kleinigkeiten (2–8 ●)

```json
[
  {"id":"shop-k01","artikel":"Ein Kuss, jetzt sofort","preis":2,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":4},
  {"id":"shop-k02","artikel":"Eine Umarmung, so lange du willst","preis":2,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":4},
  {"id":"shop-k03","artikel":"Zehn Minuten Kuscheln","preis":3,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":12},
  {"id":"shop-k04","artikel":"Eine ehrliche Antwort auf eine Frage","preis":5,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":24},
  {"id":"shop-k05","artikel":"Ein Kompliment, das du dir aussuchst","preis":3,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":24},
  {"id":"shop-k06","artikel":"Ein Foto von mir","preis":6,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":48},
  {"id":"shop-k07","artikel":"Eine Sprachnachricht von mir","preis":4,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":24},
  {"id":"shop-k08","artikel":"Ich sage dir, was ich gerade denke","preis":4,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":12},
  {"id":"shop-k09","artikel":"Du darfst deinen Kopf in meinen Schoß legen","preis":3,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":12},
  {"id":"shop-k10","artikel":"Blickkontakt-Erlaubnis für einen Abend","preis":5,"waehrung":"karma","kategorie":"kleinigkeiten","vorrat":null,"cooldown_h":48}
]
```

## Abteilung: Körper (8–25 ●)

```json
[
  {"id":"shop-b01","artikel":"Zwanzig Minuten Massage","preis":8,"waehrung":"karma","kategorie":"koerper","vorrat":null,"cooldown_h":72},
  {"id":"shop-b02","artikel":"Ganzkörpermassage mit Öl, 45 Minuten","preis":18,"waehrung":"karma","kategorie":"koerper","vorrat":2,"cooldown_h":168},
  {"id":"shop-b03","artikel":"Du darfst mich zehn Minuten überall anfassen","preis":10,"waehrung":"karma","kategorie":"koerper","vorrat":null,"cooldown_h":48},
  {"id":"shop-b04","artikel":"Ich ziehe an, was du dir wünschst","preis":12,"waehrung":"karma","kategorie":"koerper","vorrat":null,"cooldown_h":168},
  {"id":"shop-b05","artikel":"Ein Bad, das ich dir einlasse — inklusive Bedienung","preis":15,"waehrung":"karma","kategorie":"koerper","vorrat":null,"cooldown_h":168},
  {"id":"shop-b06","artikel":"Ich wasche dir die Haare","preis":6,"waehrung":"karma","kategorie":"koerper","vorrat":null,"cooldown_h":72},
  {"id":"shop-b07","artikel":"Du darfst neben mir einschlafen, ohne Regeln","preis":5,"waehrung":"karma","kategorie":"koerper","vorrat":null,"cooldown_h":24},
  {"id":"shop-b08","artikel":"Oral, ohne Gegenleistung","preis":25,"waehrung":"karma","kategorie":"koerper","vorrat":1,"cooldown_h":336}
]
```

## Abteilung: Privilegien (15–50 ●)

```json
[
  {"id":"shop-p01","artikel":"Ein Wunsch beim nächsten Mal","preis":15,"waehrung":"karma","kategorie":"privilegien","vorrat":null,"cooldown_h":168},
  {"id":"shop-p02","artikel":"Du bestimmst die Position","preis":12,"waehrung":"karma","kategorie":"privilegien","vorrat":null,"cooldown_h":72},
  {"id":"shop-p03","artikel":"Du darfst kommen, wann du willst — einmal","preis":30,"waehrung":"karma","kategorie":"privilegien","vorrat":1,"cooldown_h":336},
  {"id":"shop-p04","artikel":"Eine Regel für 24 Stunden aussetzen","preis":30,"waehrung":"karma","kategorie":"privilegien","vorrat":null,"cooldown_h":336},
  {"id":"shop-p05","artikel":"Ein Abend ohne Protokoll","preis":25,"waehrung":"karma","kategorie":"privilegien","vorrat":null,"cooldown_h":168},
  {"id":"shop-p06","artikel":"Du darfst mich einmal um etwas bitten, ohne zu betteln","preis":10,"waehrung":"karma","kategorie":"privilegien","vorrat":null,"cooldown_h":72},
  {"id":"shop-p07","artikel":"Ein zusätzliches Veto für diesen Monat","preis":35,"waehrung":"karma","kategorie":"privilegien","vorrat":1,"cooldown_h":720},
  {"id":"shop-p08","artikel":"Du darfst dir das Deck aussuchen","preis":8,"waehrung":"karma","kategorie":"privilegien","vorrat":null,"cooldown_h":48},
  {"id":"shop-p09","artikel":"Ein Abend, an dem du bestimmst","preis":50,"waehrung":"karma","kategorie":"privilegien","vorrat":1,"cooldown_h":720},
  {"id":"shop-p10","artikel":"Einmal Nein sagen dürfen, ohne Konsequenz","preis":20,"waehrung":"karma","kategorie":"privilegien","vorrat":2,"cooldown_h":336}
]
```

## Abteilung: Erlass (10–40 ●)

```json
[
  {"id":"shop-e01","artikel":"Ein Bußgeld rückgängig machen","preis":10,"waehrung":"karma","kategorie":"erlass","vorrat":null,"cooldown_h":72},
  {"id":"shop-e02","artikel":"Eine Strafe aus der Queue streichen","preis":20,"waehrung":"karma","kategorie":"erlass","vorrat":null,"cooldown_h":168},
  {"id":"shop-e03","artikel":"Die gesamte Strafen-Queue leeren","preis":60,"waehrung":"karma","kategorie":"erlass","vorrat":1,"cooldown_h":720},
  {"id":"shop-e04","artikel":"Eine verpasste Aufgabe nachreichen dürfen","preis":6,"waehrung":"karma","kategorie":"erlass","vorrat":null,"cooldown_h":48},
  {"id":"shop-e05","artikel":"Streak-Schutz — ein Tag darf ausfallen","preis":25,"waehrung":"karma","kategorie":"erlass","vorrat":1,"cooldown_h":336},
  {"id":"shop-e06","artikel":"Eine laufende Denial-Periode um einen Tag verkürzen","preis":40,"waehrung":"karma","kategorie":"erlass","vorrat":1,"cooldown_h":336}
]
```

## Abteilung: Große Dinge (nur Siegel ✦)

```json
[
  {"id":"shop-g01","artikel":"Ein Wochenende nach deinen Regeln","preis":6,"waehrung":"siegel","kategorie":"gross","vorrat":1,"cooldown_h":2160},
  {"id":"shop-g02","artikel":"Eine Fantasie von deiner Liste wird umgesetzt","preis":4,"waehrung":"siegel","kategorie":"gross","vorrat":null,"cooldown_h":720},
  {"id":"shop-g03","artikel":"Ein Bucket-List-Item deiner Wahl, in den nächsten 30 Tagen","preis":3,"waehrung":"siegel","kategorie":"gross","vorrat":null,"cooldown_h":720},
  {"id":"shop-g04","artikel":"Rollentausch für einen ganzen Tag","preis":8,"waehrung":"siegel","kategorie":"gross","vorrat":1,"cooldown_h":4320},
  {"id":"shop-g05","artikel":"Ein Kurzurlaub, zwei Nächte","preis":10,"waehrung":"siegel","kategorie":"gross","vorrat":1,"cooldown_h":8640},
  {"id":"shop-g06","artikel":"Eine neue Regel, die du festlegst — gültig einen Monat","preis":5,"waehrung":"siegel","kategorie":"gross","vorrat":1,"cooldown_h":2160},
  {"id":"shop-g07","artikel":"Eine bestehende Regel dauerhaft streichen","preis":7,"waehrung":"siegel","kategorie":"gross","vorrat":1,"cooldown_h":4320}
]
```

## Abteilung: Glücksspiel

```json
[
  {"id":"shop-x01","artikel":"Ein Rubbellos, Standardserie","preis":10,"waehrung":"karma","kategorie":"gluecksspiel","vorrat":null,"cooldown_h":24},
  {"id":"shop-x02","artikel":"Ein Rubbellos, garantiert mindestens Silber","preis":25,"waehrung":"karma","kategorie":"gluecksspiel","vorrat":null,"cooldown_h":168},
  {"id":"shop-x03","artikel":"Blindkauf klein — du weißt nicht, was du bekommst","preis":8,"waehrung":"karma","kategorie":"gluecksspiel","vorrat":null,"cooldown_h":24},
  {"id":"shop-x04","artikel":"Blindkauf mittel","preis":20,"waehrung":"karma","kategorie":"gluecksspiel","vorrat":null,"cooldown_h":72},
  {"id":"shop-x05","artikel":"Blindkauf groß","preis":45,"waehrung":"karma","kategorie":"gluecksspiel","vorrat":null,"cooldown_h":336},
  {"id":"shop-x06","artikel":"Verdopplung: Setze 20 Karma. Münzwurf. Kopf = 40, Zahl = 0","preis":20,"waehrung":"karma","kategorie":"gluecksspiel","vorrat":null,"cooldown_h":48},
  {"id":"shop-x07","artikel":"Das Rad des Schicksals — irgendetwas passiert","preis":15,"waehrung":"karma","kategorie":"gluecksspiel","vorrat":null,"cooldown_h":72}
]
```

---

# TEIL 5: Preismechaniken

## Dynamische Preise

Gioia hat mehrere Hebel, ohne dass Kevin die Logik durchschaut:

```json
{
  "preismechaniken": [
    {
      "key":"manuelle_anpassung",
      "name":"Preis ändern",
      "beschreibung":"Sie setzt einen neuen Preis. Kevin sieht nur den neuen Wert, keine Historie."
    },
    {
      "key":"nachfrage",
      "name":"Nachfragepreis",
      "beschreibung":"Automatisch: Jeder Kauf erhöht den Preis des Artikels um 10%. Der Preis fällt pro Woche ohne Kauf um 5% zurück.",
      "optional":true
    },
    {
      "key":"sonderangebot",
      "name":"Rabatt",
      "beschreibung":"Zeitlich begrenzt, mit sichtbarem Countdown. Erzeugt Kaufdruck.",
      "parameter":["artikel","rabatt_prozent","dauer_h"]
    },
    {
      "key":"ausverkauft",
      "name":"Nicht verfügbar",
      "beschreibung":"Artikel bleibt sichtbar, ist aber nicht kaufbar. Optional mit Datum, wann er zurückkommt — oder ohne."
    },
    {
      "key":"limitiert",
      "name":"Limitierte Auflage",
      "beschreibung":"Nur X Stück im Monat verfügbar. Zähler sichtbar."
    },
    {
      "key":"cooldown",
      "name":"Sperrfrist",
      "beschreibung":"Nach einem Kauf ist derselbe Artikel für X Stunden gesperrt."
    },
    {
      "key":"neuheit",
      "name":"Neu im Sortiment",
      "beschreibung":"Neue Artikel sind in der ersten Woche 20% teurer."
    },
    {
      "key":"personalisiert",
      "name":"Persönlicher Preis",
      "beschreibung":"Gioia kann für einen einzelnen Artikel einen Sonderpreis setzen, der nur für einen Tag gilt und nur Kevin angezeigt wird."
    }
  ]
}
```

## Das Sparziel

```json
{
  "sparziel": {
    "funktion":"Kevin markiert einen Artikel als Sparziel",
    "anzeige":"Fortschrittsbalken auf dem Home-Screen, permanent sichtbar",
    "berechnung":"Zeigt geschätzte Wochen bis zum Ziel, basierend auf durchschnittlichem Einkommen",
    "preiserhoehung":{
      "erlaubt":true,
      "anzeige_fuer_sub":"Der Balken springt zurück. Keine Meldung, keine Begründung.",
      "haeufigkeit_empfehlung":"Sparsam einsetzen — einmal ist grausam, dreimal ist Frustration"
    },
    "vorreservierung":{
      "beschreibung":"Kevin kann Karma auf ein Sparziel festlegen. Festgelegtes Karma verfällt nicht durch Inflation, kann aber auch nicht anders ausgegeben werden.",
      "freigabe":"Nur mit Verlust von 20% des festgelegten Betrags"
    }
  }
}
```

---

# TEIL 6: Inflation und Verfall

```json
{
  "geldwertverfall": {
    "rate":"5% pro Monat, gerundet auf ganze Punkte",
    "zeitpunkt":"Am Ersten des Monats, 00:00",
    "betrifft":"Nur freies Karma, nicht auf Sparziele festgelegtes",
    "mindestbetrag":"Erst ab 20 Karma Guthaben — kleine Beträge bleiben unangetastet",
    "benachrichtigung":"Kevin bekommt am 25. eine Warnung: 'Monatsende. Dein Guthaben verliert an Wert.'",
    "zweck":"Verhindert Horten. Zwingt zu Entscheidungen. Macht Ausgeben zur Normalität statt zur Ausnahme."
  },
  "sonderabgaben": {
    "beschreibung":"Gioia kann einmalige Abgaben erheben",
    "beispiele":[
      {"name":"Luxussteuer","betrag":"10% des Guthabens","anlass":"Wenn er zu lange nichts ausgibt"},
      {"name":"Strafabgabe","betrag":"frei wählbar","anlass":"Nach einem schweren Vergehen"},
      {"name":"Feiertagsabgabe","betrag":5,"anlass":"An willkürlich gewählten Tagen"},
      {"name":"Verwaltungsgebühr","betrag":2,"anlass":"Bei jedem Verhandlungs-Antrag"}
    ]
  }
}
```

---

# TEIL 7: Schulden

Kevin kann ins Minus. Das ist kein Fehler im System, sondern eine bewusste Option.

```json
{
  "kredit": {
    "dispolimit":-30,
    "beschreibung":"Kevin kann bis -30 Karma gehen, ohne zu fragen",
    "sonderkredit":{
      "beschreibung":"Über -30 hinaus nur mit Gioias ausdrücklicher Zustimmung",
      "max":-100,
      "antrag":"Formaler Antrag mit Begründung nötig"
    },
    "zinsen":{
      "satz":"10% pro Woche auf den Minusbetrag",
      "berechnung":"Sonntags, zusammen mit dem Grundgehalt",
      "beispiel":"-20 Karma werden nach einer Woche zu -22, nach zwei zu -24,2"
    },
    "tilgung":"Jedes eingehende Karma tilgt zuerst die Schulden, bevor Guthaben entsteht"
  },
  "schuldenstufen": [
    {
      "von":-1,"bis":-10,
      "name":"Leicht im Minus",
      "konsequenzen":["Keine Käufe möglich außer Erlass-Artikel"]
    },
    {
      "von":-11,"bis":-20,
      "name":"Verschuldet",
      "konsequenzen":["Keine Käufe","Kein Rubbellos","Tägliche Erinnerung an den Stand"]
    },
    {
      "von":-21,"bis":-30,
      "name":"Tief im Minus",
      "konsequenzen":["Alle Käufe gesperrt","Automatische Regel aktiviert: kein Orgasmus bis zum Ausgleich","Grundgehalt wird komplett zur Tilgung verwendet"]
    },
    {
      "von":-31,"bis":null,
      "name":"Zahlungsunfähig",
      "konsequenzen":["Gioia entscheidet über die Konsequenzen","Möglichkeit: Schuldenerlass gegen Gegenleistung","Möglichkeit: Verlängertes Protokoll bis zur Tilgung"]
    }
  ],
  "schuldenerlass": {
    "beschreibung":"Gioia kann Schulden erlassen — komplett oder teilweise",
    "gegenleistung_optional":"Sie kann eine Gegenleistung verlangen, die nichts mit Karma zu tun hat",
    "beispiele":["Eine Woche verschärftes Protokoll","Ein Boss-Fight","Eine Aufgabe, die er noch nie gemacht hat"]
  }
}
```

---

# TEIL 8: Erweiterte Mechaniken

## Das Abonnement

Wiederkehrende Privilegien, die monatlich abgebucht werden. Wer nicht zahlen kann, verliert das Privileg.

```json
{
  "abos": [
    {"name":"Blickkontakt-Freiheit","kosten_monat":8,"beschreibung":"Kein Fragen vor Blickkontakt"},
    {"name":"Anrede-Erleichterung","kosten_monat":10,"beschreibung":"Vorname statt Titel im Alltag"},
    {"name":"Selbstbedienung","kosten_monat":20,"beschreibung":"Einmal wöchentlich ohne Erlaubnis"},
    {"name":"Schlafenszeit-Freiheit","kosten_monat":6,"beschreibung":"Er entscheidet, wann er ins Bett geht"},
    {"name":"Kleiderwahl","kosten_monat":5,"beschreibung":"Er sucht seine Kleidung selbst aus"},
    {"name":"Handy-Autonomie","kosten_monat":12,"beschreibung":"Kein Zugriff durch sie"}
  ],
  "mechanik": {
    "abbuchung":"Am Ersten des Monats",
    "bei_zahlungsunfaehigkeit":"Abo wird gekündigt, Privileg entfällt sofort",
    "kuendigung_durch_sub":"Jederzeit, keine Rückerstattung",
    "kuendigung_durch_domme":"Jederzeit, ohne Begründung, ohne Rückerstattung",
    "preiserhoehung":"Mit einer Woche Vorlauf — er sieht die Ankündigung"
  }
}
```

## Die Kaution

Für riskante Privilegien: Kevin hinterlegt Karma als Pfand. Hält er sich an die Bedingungen, bekommt er es zurück. Wenn nicht, ist es weg.

```json
{
  "kautionen": [
    {"privileg":"Ein Wochenende ohne Regeln","kaution":30,"bedingung":"Kein Vergehen während des Wochenendes","rueckgabe":"vollstaendig"},
    {"privileg":"Alleine ausgehen","kaution":15,"bedingung":"Stündliche Meldung","rueckgabe":"anteilig — pro verpasster Meldung 5 weniger"},
    {"privileg":"Zugriff auf den Foto-Tresor","kaution":20,"bedingung":"Keine Screenshots","rueckgabe":"vollstaendig"},
    {"privileg":"Selbst eine Karte ziehen dürfen","kaution":10,"bedingung":"Die Karte wird auch ausgeführt","rueckgabe":"vollstaendig"}
  ]
}
```

## Die Auktion

Gioia stellt etwas zur Versteigerung, das es im Laden nicht gibt.

```json
{
  "auktion": {
    "ablauf":[
      "Gioia stellt einen Artikel ein, mit Laufzeit und optionalem Mindestpreis",
      "Kevin sieht den Artikel und kann bieten",
      "Er kann mehrmals bieten, jedes Gebot überschreibt das vorherige",
      "Bei Ablauf: Sie entscheidet, ob sie zuschlägt — auch über dem Mindestpreis kann sie ablehnen",
      "Bei Zuschlag wird das Gebot abgebucht"
    ],
    "besonderheit":"Es gibt keinen zweiten Bieter. Der Preis ist reine Selbstauskunft darüber, wie viel es ihm wert ist.",
    "variante_blind":"Er bietet einmal, ohne zu wissen, was der Artikel ist. Nur die Kategorie ist bekannt.",
    "variante_countdown":"Der Preis fällt jede Stunde. Wer zu lange wartet, riskiert, dass sie den Artikel zurückzieht.",
    "beispiel_artikel":[
      "Eine Nacht, die du dir komplett ausdenkst",
      "Ich mache etwas, das ich noch nie gemacht habe",
      "Eine Regel deiner Wahl wird gestrichen",
      "Du darfst mir einen Befehl geben",
      "Ein Geheimnis von mir"
    ]
  }
}
```

## Der Schwarzmarkt

Dinge, die nicht im offiziellen Sortiment stehen. Kevin kann sie nicht sehen — er muss danach fragen.

```json
{
  "schwarzmarkt": {
    "zugang":"Kevin stellt eine formlose Anfrage: 'Kann ich X kaufen?'",
    "reaktion":"Gioia nennt einen Preis, lehnt ab, oder ignoriert die Anfrage",
    "preisgestaltung":"Völlig frei — sie kann absurde Preise nennen",
    "verhandlung":"Möglich, aber jeder Verhandlungsversuch kostet 2 Karma Gebühr",
    "zweck":"Bringt Bewegung ins System. Er lernt, was er sich traut zu fragen."
  }
}
```

## Die Investition

```json
{
  "investition": {
    "beschreibung":"Kevin legt Karma für eine bestimmte Zeit fest und bekommt mehr zurück — oder weniger",
    "optionen":[
      {"name":"Sicher","laufzeit_tage":30,"rendite":"+10%","risiko":"keines"},
      {"name":"Riskant","laufzeit_tage":14,"rendite":"+50% oder -50%","risiko":"Münzwurf am Ende"},
      {"name":"Leistungsgebunden","laufzeit_tage":30,"rendite":"+100% bei erreichten Wochenzielen, -100% bei verfehlten","risiko":"hängt von ihm ab"},
      {"name":"Ihre Entscheidung","laufzeit_tage":30,"rendite":"Zwischen -100% und +200%","risiko":"Gioia legt die Rendite am Ende fest"}
    ],
    "vorzeitige_aufloesung":"Möglich, kostet 30% des eingezahlten Betrags"
  }
}
```

## Das Sperrkonto

```json
{
  "sperrkonto": {
    "beschreibung":"Gioia kann Karma auf ein Sperrkonto verschieben. Kevin sieht den Betrag, kann aber nicht darauf zugreifen.",
    "freigabe":"Nur durch sie, zu einem Zeitpunkt ihrer Wahl",
    "anlaesse":[
      "Als Belohnung, die erst später wirksam wird",
      "Als Strafe — vorübergehende Entziehung von verdientem Guthaben",
      "Als Vorschuss auf etwas, das er noch nicht erreicht hat"
    ],
    "verfall":"Sperrkonto-Guthaben unterliegt keiner Inflation"
  }
}
```

## Das Geschenk

```json
{
  "geschenk": {
    "beschreibung":"Gioia kann Karma oder Siegel verschenken",
    "anonym_moeglich":"Sie kann ohne Angabe eines Grundes schenken — er sieht nur, dass das Guthaben gestiegen ist",
    "gegenrichtung":"Kevin kann Karma zurückgeben — als Geste, nicht als Zahlung. Sie sieht die Rückgabe und den optionalen Text dazu."
  }
}
```

---

# TEIL 9: Die Bilanz

Ein eigener Bereich mit vollständiger Transparenz über die Zahlen — aber nicht über die Gründe.

```json
{
  "bilanz_ansicht": {
    "fuer_sub":[
      "Aktueller Stand Karma und Siegel",
      "Bewegungen der letzten 30 Tage, chronologisch",
      "Einnahmen nach Quelle, aggregiert",
      "Ausgaben nach Kategorie, aggregiert",
      "Offene Schulden und Zinsen",
      "Laufende Abos und nächste Abbuchung",
      "Sparziel-Fortschritt",
      "Kommende Inflation"
    ],
    "nicht_sichtbar_fuer_sub":[
      "Warum ein Preis geändert wurde",
      "Ob ein Bußgeld erlassen wurde",
      "Preishistorie",
      "Was auf dem Schwarzmarkt verfügbar wäre"
    ],
    "fuer_domme_zusaetzlich":[
      "Vollständige Preishistorie",
      "Kaufverhalten: was kauft er, wann, wie oft",
      "Wie lange spart er im Schnitt",
      "Welche Artikel schaut er an, ohne zu kaufen",
      "Wie oft schaut er auf den Kontostand"
    ]
  }
}
```

Der letzte Punkt ist der interessanteste: Wenn Gioia sieht, dass Kevin einen bestimmten Artikel dreimal täglich anschaut, aber nie kauft, weiß sie mehr über ihn als jedes Gespräch verraten würde.

---

# TEIL 10: Balance und Sicherungen

## Kalibrierung

Die Zahlen oben sind ein Startpunkt. Prüft nach vier Wochen:

- **Zu leicht?** Er kauft ständig, hat immer Guthaben, spart nie → Preise um 30% erhöhen oder Grundgehalt kürzen
- **Zu schwer?** Er kann sich nie etwas leisten, gibt auf → Einnahmen erhöhen oder Kleinigkeiten billiger machen
- **Richtig:** Er kann sich Kleinigkeiten regelmäßig leisten, muss für Privilegien sparen, und Großes ist ein echtes Ziel

Faustregel: Etwa 60% des Einkommens sollte für Kleinigkeiten draufgehen können, 40% sparbar sein.

## Sicherungen

```json
{
  "sicherungen": [
    {"key":"kein_karma_bei_rot","beschreibung":"Bei Ampel Rot oder Safeword werden keine Bußgelder erhoben und keine Zinsen berechnet","fest":true},
    {"key":"krank_modus","beschreibung":"Im Krank-Modus: Grundgehalt läuft weiter, keine Bußgelder, keine Inflation","fest":true},
    {"key":"kein_kauf_von_grenzen","beschreibung":"Nichts, was auf der Grenzen-Map als Hard No steht, kann im Laden erscheinen — auch nicht auf dem Schwarzmarkt","fest":true},
    {"key":"schulden_kein_zwang","beschreibung":"Schulden können niemals zu Handlungen zwingen, die außerhalb des Vertrags liegen","fest":true},
    {"key":"reset","beschreibung":"Beide gemeinsam können die Ökonomie jederzeit auf null zurücksetzen","fest":true},
    {"key":"abschaltbar","beschreibung":"Das gesamte Ökonomie-System ist ein Modul, das man deaktivieren kann, ohne den Rest der App zu verlieren","fest":true}
  ]
}
```

---

# Implementierungs-Hinweise

1. **Transaktions-Log:** Jede Bewegung ist ein unveränderlicher Eintrag mit Zeitstempel, Betrag, Quelle und Saldo danach. Nie den Kontostand direkt ändern — immer über Transaktionen, damit die Bilanz stimmt.
2. **Atomare Käufe:** Kauf, Abbuchung und Freischaltung müssen in einer Transaktion passieren. Bei Firebase: Transaktion oder Cloud Function, sonst gibt es bei schlechter Verbindung Doppelbuchungen.
3. **Cooldowns:** Pro Artikel ein Zeitstempel des letzten Kaufs. Gesperrte Artikel bleiben sichtbar, mit Countdown.
4. **Preisänderungen:** Nur der aktuelle Preis wird Kevin angezeigt. Die Historie liegt in einer separaten Collection, nur für Gioia lesbar.
5. **Inflation:** Läuft als geplanter Job am Monatsersten. Falls die App nicht offen ist, wird er beim nächsten Öffnen nachgeholt — mit Prüfung, ob er für den Monat schon lief.
6. **Laden-Editor:** Gioia braucht eine einfache Oberfläche zum Anlegen und Ändern von Artikeln. Duplizieren-Funktion, damit ähnliche Artikel schnell entstehen.
7. **Anzeige:** Der Kontostand gehört prominent auf den Home-Screen. Bei Änderung: kurze Animation. Bei Bußgeld: rote Zahl, die nach unten wegfliegt.
8. **Erste Woche:** Startguthaben von 15 Karma, damit der Laden nicht von Anfang an frustrierend leer wirkt.
