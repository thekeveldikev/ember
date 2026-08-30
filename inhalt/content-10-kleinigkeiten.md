# EMBER — Content-Datei 10: Kleinigkeiten & Erweiterungen

Sammlung von Features, die bisher gefehlt haben. Sortiert nach Aufwand und Wirkung. Vieles davon ist in einer halben Stunde gebaut und macht die App trotzdem spürbar besser.

---

## 1. Praktisches, das bisher fehlt

### Toy-Inventar
Liste aller Toys mit Kategorie, Anschaffungsdatum, Material und Pflegehinweisen. Warum das mehr ist als eine Liste: Die App kann daraus filtern. Wenn eine Karte oder ein Rad-Ergebnis ein Toy verlangt, das ihr nicht habt, wird es aussortiert. Außerdem Pflege-Erinnerungen (Batterien, Reinigung, Materialverträglichkeit bei Gleitmittel).

```json
{
  "felder":["name","kategorie","material","gekauft_am","letzte_reinigung","batterien","notizen","favorit","aktiv"],
  "kategorien":["Vibrator","Dildo","Plug","Fessel","Impact","Augenbinde","Halsband","Strapon","Ring","Klammern","Sonstiges"],
  "material_warnungen":{
    "silikon":"Kein Silikon-Gleitmittel verwenden",
    "glas":"Auf Risse prüfen vor jeder Benutzung",
    "leder":"Nicht mit Wasser reinigen, Lederpflege verwenden",
    "metall":"Temperaturwechsel möglich — vorher testen"
  }
}
```

### Einkaufsliste mit Voting
Wunschliste für Anschaffungen. Beide können Items hinzufügen, beide voten mit Ja/Nein/Vielleicht. Bei zwei Ja: Item wandert in "Kaufen". Gioia hat Vetorecht und Endentscheidung. Mit Preisfeld und optionalem Link.

### Vorrats-Check
Simple Erinnerung: Gleitmittel, Kondome, Batterien, Reinigungstücher. Mit Mengenangabe und Warnung bei Unterschreitung. Klingt unromantisch, verhindert aber genau die Situation, in der die Stimmung an einer leeren Flasche scheitert.

### Timer-Bibliothek
Voreingestellte Timer für wiederkehrende Situationen: 5/10/15/20/30/45/60 Minuten, plus benannte Presets ("Aufwärmen", "Edging-Pause", "Warten"). Ein Tap statt jedes Mal einstellen. Mit Vollbild-Countdown und optionalem Vibrationsalarm.

### Sanduhr / Zufalls-Timer
Ein Timer, dessen Laufzeit ihr nicht kennt. Zwischen X und Y Minuten, zufällig gewählt. Ihr seht nur, dass er läuft. Nutzbar für alles, wo Ungewissheit besser ist als Planbarkeit.

---

## 2. Kommunikation & Verständigung

### Eigenes Glossar
Ein Wörterbuch eurer Begriffe. Jedes Paar entwickelt eigene Wörter, Abkürzungen und Codes — hier stehen sie mit Definition. Praktisch, wenn eine Regel oder Karte einen eurer Begriffe benutzt: Antippen zeigt die Erklärung.

```json
{
  "beispiel_eintraege":[
    {"begriff":"[euer Wort]","bedeutung":"[was es heißt]","kategorie":"Anrede"},
    {"begriff":"[euer Wort]","bedeutung":"[was es heißt]","kategorie":"Signal"},
    {"begriff":"[euer Wort]","bedeutung":"[was es heißt]","kategorie":"Handlung"}
  ],
  "kategorien":["Anrede","Signal","Handlung","Zustand","Regel","Insider"]
}
```

### Anonyme Frage-Box
Eine Box, in die beide Fragen einwerfen können, ohne dass klar ist, wann sie beantwortet werden. Die App zieht zu zufälligen Zeitpunkten eine Frage und stellt sie beiden. Der Abstand zwischen Einwurf und Beantwortung nimmt der Frage die Schärfe — man traut sich, mehr zu fragen.

### Zwei Wahrheiten, eine Lüge
Kleines Spiel: Einer schreibt drei Aussagen über sich, der andere errät die Lüge. Punkte für richtige Tipps. Funktioniert überraschend gut, um Neues übereinander zu erfahren, auch nach Jahren.

### Der Reparatur-Modus
Für nach einem Streit oder wenn etwas schiefgelaufen ist. Ein eigener, sehr ruhig gestalteter Bereich mit strukturiertem Ablauf:
1. Beide schreiben getrennt auf, was passiert ist — aus ihrer Sicht
2. Beide lesen die Version des anderen
3. Beide schreiben, was sie gebraucht hätten
4. Gemeinsam: Was machen wir beim nächsten Mal anders

Nichts davon wird bewertet oder gepunktet. Es ist nur eine Struktur, die verhindert, dass man sich im Kreis dreht.

### Check-in-Fragen des Tages
Eine Frage pro Tag, die nichts mit Sex zu tun hat. "Was hat dich heute gestresst?", "Was hat dich heute gefreut?", "Was brauchst du gerade von mir?" Beide antworten, dann werden die Antworten sichtbar. Hält die Beziehung neben der Dynamik am Laufen.

---

## 3. Körper & Selbstkenntnis

### Body-Map
Eine Körpersilhouette, auf der man Zonen markieren kann. Vier Kategorien: *Liebe ich*, *Mag ich*, *Neutral*, *Bitte nicht*. Beide füllen sie separat aus. Danach kann man die des anderen ansehen. Extrem nützlich, weil viele Menschen so etwas nie explizit besprechen.

Erweiterung: Zonen können mit Notizen versehen werden ("nur wenn ich schon warm bin", "nicht mit den Fingernägeln").

### Reaktions-Notizen
Ein Feld, in dem man festhält, was funktioniert hat. Nicht als Bewertung, sondern als Nachschlagewerk. "Als du X gemacht hast, war das genau richtig." Über Zeit wird das zu einer Gebrauchsanweisung füreinander, die keiner sich merken müsste.

### Zyklus-Berücksichtigung
Falls relevant: Optionale Zyklus-Eingabe, die Vorschläge und Intensität anpasst. Die App macht dann keine hochintensiven Vorschläge in Phasen, in denen sie erfahrungsgemäß nicht passen — und umgekehrt. Rein optional, komplett abschaltbar, und die Daten bleiben lokal.

### Energielevel-Historie
Neben der Ampel: ein einfacher täglicher Energie-Wert (1–5). Über Wochen zeigt sich ein Muster — wann seid ihr beide gleichzeitig auf einem hohen Level? Das ist die Antwort auf "wir finden nie Zeit".

---

## 4. Sicherheit & Diskretion

### Blackout-Modus
Der Panik-Button war schon geplant, aber es geht weiter: Ein Modus, in dem die App auf dem Homescreen als etwas anderes erscheint. Anderes Icon, anderer Name ("Notizen", "Wetter", "Rechner"). Erst nach Eingabe eines Codes wird die echte App sichtbar.

### Gast-Modus
Wenn jemand euer Handy in die Hand nimmt: Ein Wisch nach unten mit drei Fingern schaltet in eine harmlose Ansicht. Sieht aus wie eine gewöhnliche Notiz-App mit unverfänglichen Inhalten. Zurück nur mit Code.

### Auto-Lock
Die App sperrt sich nach X Minuten Inaktivität selbst. Beim Wiederöffnen: PIN oder Biometrie.

### Screenshot-Warnung
Wenn ein Screenshot gemacht wird (soweit im Browser erkennbar), bekommt der andere eine Benachrichtigung. Nicht als Misstrauen — sondern damit beide wissen, was von den geteilten Inhalten wo existiert.

### Foto-Verfall
Fotos im Tresor können ein Verfallsdatum bekommen. Nach Ablauf werden sie automatisch gelöscht. Reduziert das Risiko, dass sich über Jahre ein Archiv ansammelt, das niemand mehr überblickt.

### Notfall-Löschung
Ein Code, der bei Eingabe alle sensiblen Daten löscht. Muss zweimal bestätigt werden. Für den unwahrscheinlichen, aber denkbaren Fall.

---

## 5. Erinnerung & Rückblick

### Jahresrückblick ("Wrapped")
Einmal jährlich: eine visuell aufbereitete Zusammenfassung. Anzahl Sessions, häufigste Kategorien, längste Streak, meistgenutztes Deck, bestbewertete Session, neue Dinge ausprobiert, Level-Fortschritt. Als teilbare (nur untereinander) Bilderserie.

### PDF-Jahrbuch
Export als PDF: Session-Logs, Highlights, Fotos (optional), Meilensteine. Etwas, das man tatsächlich zusammen durchblättern kann. Passwortgeschützt.

### Zeitkapsel
Nachrichten an euch selbst in der Zukunft. Beide schreiben etwas, das erst in einem Jahr geöffnet wird. "Was hoffe ich, dass wir bis dahin ausprobiert haben." Automatische Erinnerung beim Öffnen.

### Erste-Male-Chronik
Eine automatisch geführte Liste aller Dinge, die ihr zum ersten Mal gemacht habt, mit Datum. Wird gefüllt, wenn ein Bucket-List-Item abgehakt oder eine Karte zum ersten Mal gezogen wird.

### Statistik-Fun-Facts
Kleine, spielerische Auswertungen. "Ihr habt dieses Jahr 47 Stunden miteinander verbracht — das sind zwei ganze Tage." "Kevins längste Wartezeit: 4 Tage, 6 Stunden." "Am häufigsten gezogene Karte: [X], 12 Mal."

---

## 6. Kleine Spiele

### Wette
Einer stellt eine Behauptung auf, beide setzen etwas ein (Karma-Punkte, ein Los, einen Gutschein). Nach Auflösung geht der Einsatz an den Gewinner. Funktioniert für alles — von "ich wette, du hältst keine 20 Minuten durch" bis "ich wette, es regnet morgen".

### Auktion
Gioia stellt etwas zur Versteigerung (einen Wunsch, ein Privileg, einen freien Abend). Kevin bietet mit Karma-Punkten. Nur er bietet — es ist keine echte Auktion, sondern ein Test, wie viel ihm etwas wert ist. Sie kann einen Mindestpreis setzen und trotzdem ablehnen.

### Das Duell
Ein Wettbewerb mit klarer Aufgabe und klarem Einsatz. Wer schafft es länger? Wer erträgt mehr? Wer bringt den anderen schneller dahin? Der Verlierer bekommt die vereinbarte Konsequenz.

### Kompatibilitäts-Quiz
Beide beantworten dieselben Fragen über ihre Vorlieben. Die App zeigt Übereinstimmungen und Unterschiede. Anders als Blind-Matching geht es hier um Kalibrierung: Wo denkt ihr, ihr wüsstet, was der andere will — und liegt falsch?

### Memory-Spiel
Klassisches Memory, aber die Kartenpaare sind eure eigenen Fotos oder Begriffe. Wer gewinnt, darf sich etwas aussuchen.

### Der Würfelbecher
Physische Würfel-Simulation mit anpassbaren Seiten. Ein Würfel für Körperteile, einer für Aktionen, einer für Dauer. Schneller als das große Glücksrad, für zwischendurch.

---

## 7. Atmosphäre & Präsentation

### Playlist-Verknüpfung
Playlists pro Stimmung, verknüpft mit Links zu Spotify/Apple Music. Die App schlägt basierend auf gewählter Karte oder Regie die passende Playlist vor. Zusätzlich: Songs als Signal — "wenn ich dir diesen Song schicke, weißt du Bescheid."

### Ambient-Modus
Wenn das Handy während einer Session daneben liegt: Statt normalem Interface ein sehr dunkler Bildschirm mit langsam pulsierendem Licht. Zeigt nur die wichtigsten Infos (Timer, aktueller Schritt). Stört nicht, blendet nicht.

### Themes
Mehrere visuelle Themes: Standard (Schwarz/Rotgold), Nacht (noch dunkler, warme Töne), Sanft (gedämpft, für ruhige Tage), Sommer (heller), plus Season-Themes. Automatischer Wechsel nach Uhrzeit möglich.

### Sound-Design
Sehr sparsam, aber wirkungsvoll: ein leiser Ton beim Kartenziehen, ein anderer beim Rad, ein dritter bei Level-Up. Alles abschaltbar. Macht die App haptischer.

### Haptik-Muster
Definierte Vibrations-Muster für verschiedene Ereignisse. Kevin lernt mit der Zeit, allein am Muster zu erkennen, was passiert ist — Befehl, Nachricht, Belohnung, Strafe. Ohne aufs Display zu schauen.

```json
{
  "muster":[
    {"key":"nachricht","pattern":[100]},
    {"key":"befehl","pattern":[200,100,200]},
    {"key":"pulse","pattern":[50,50,50]},
    {"key":"belohnung","pattern":[100,50,100,50,300]},
    {"key":"strafe","pattern":[400]},
    {"key":"level_up","pattern":[80,40,80,40,80,40,250]},
    {"key":"timer_ende","pattern":[300,150,300]}
  ]
}
```

---

## 8. Technische Kleinigkeiten mit großer Wirkung

### Widget
Homescreen-Widget mit nur dem Button. Ein Tap, ohne die App zu öffnen. Alternativ ein Widget, das nur die Ampelfarbe des Partners zeigt.

### Shortcuts / Schnellaktionen
Long-Press aufs App-Icon: direkte Aktionen ohne Umweg — "Button drücken", "Ampel wechseln", "Los rubbeln", "Safeword".

### NFC-Tags
Kleine NFC-Sticker, die man in der Wohnung verteilt. Antippen mit dem Handy löst eine hinterlegte Aktion aus. Ein Tag am Bett, einer an der Wohnungstür, einer im Bad. Gioia definiert, was jeder Tag macht.

### QR-Codes für versteckte Nachrichten
Gioia erstellt in der App eine Nachricht, bekommt einen QR-Code, druckt ihn aus (oder schreibt ihn ab) und versteckt ihn irgendwo. Kevin findet ihn, scannt, bekommt die Nachricht. Physisch und digital verbunden.

### Apple Watch / Wear OS
Minimale Companion-App: Ampel wechseln, Pulse senden, Befehle empfangen. Vibration am Handgelenk ist unauffälliger und direkter als am Handy.

### Offline-Modus
Alle Kartendecks, Räder und Skripte sind offline verfügbar. Nur Sync und Chat brauchen Verbindung. Wichtig für Urlaub, Zug, schlechten Empfang.

### Reise-Modus
Ein Schalter, der die App an Urlaubssituationen anpasst: mehr Hotel- und Draußen-Karten, weniger Wohnungs-spezifische, Lautstärke-Hinweise bei dünnen Wänden, angepasste Packliste.

### Packliste
Automatisch generiert aus geplanten Aktivitäten. Wenn ihr für den Urlaub bestimmte Karten oder Szenarien vormerkt, sagt die App, was mit muss.

---

## 9. Für die Dynamik

### Ranglisten-Titel
Statt nur Levelzahlen: benannte Ränge, die Gioia definiert. Der aktuelle Titel erscheint überall in Kevins Interface. Ändert sich mit dem Level.

### Der Vertrag mit Ablaufdatum
Der Vertrag war geplant — Erweiterung: Er läuft nach einer festgelegten Zeit ab (z.B. 6 Monate) und muss aktiv erneuert werden. Das erzwingt ein regelmäßiges bewusstes Ja von beiden Seiten und verhindert, dass Vereinbarungen aus Gewohnheit weiterlaufen.

### Protokoll-Stufen
Verschiedene Intensitätsstufen der Dynamik, umschaltbar: *Aus* (normale Beziehung), *Leicht* (kleine Regeln), *Standard*, *Streng* (volles Protokoll). Ein Schalter statt jedes Mal alles einzeln.

### Der Wunschzettel mit Preisen
Kevin kann Wünsche eintragen, Gioia setzt einen "Preis" in Karma-Punkten. Er sieht, was was kostet, und kann darauf hinarbeiten. Macht das Karma-System greifbar.

### Ungefragte Beobachtungen
Ein Feld, in dem Gioia Beobachtungen notiert, die Kevin nicht sieht. Was ihr aufgefallen ist, was sie ändern will, was sie sich für später merkt. Reine Domme-Notizen. Nützlich, weil man vergisst, was einem im Moment aufgefallen ist.

### Der Countdown zum Ende
Bei laufenden Denial-Perioden: ein prominenter Countdown, den Kevin sieht. Gioia kann ihn jederzeit verlängern — er sieht nur, dass die Zahl größer geworden ist, nicht warum.

---

## 10. Ganz kleine Dinge

- **Doppel-Tap zum Herzen** auf jede Nachricht, jede Karte, jeden Log-Eintrag
- **Favoriten-Stern** auf alles, was man wiederfinden will
- **Globale Suche** über Notizen, Logs, Chats, Karten
- **Papierkorb** mit 30 Tagen Aufbewahrung — nichts ist sofort weg
- **Dunkle Statusleiste**, damit die App auch auf Screenshots unauffällig bleibt
- **Zufälliger Öffnungs-Bildschirm** — mal Home, mal Chat, mal eine Karte. Kleine Überraschung
- **Swipe-Gesten** für alles: nach rechts erledigt, nach links löschen, nach oben Favorit
- **Zwei-Finger-Tap** irgendwo in der App öffnet direkt das Safeword-Menü
- **Ladebildschirm-Zitate** aus eurem eigenen Fortune-Cookie-Pool
- **Konfetti bei Meilensteinen** — banal, funktioniert trotzdem
- **Zähler auf dem App-Icon** für ungelesene Befehle
- **Letzte-Aktivität-Anzeige** ("zuletzt aktiv vor 3 Min") — optional abschaltbar
- **Tippt gerade…**-Anzeige im Chat
- **Zitieren und Antworten** auf einzelne Chat-Nachrichten
- **Sprachnachrichten-Geschwindigkeit** 1x/1.5x/2x
- **Bildschirmhelligkeit automatisch runter** im Ambient-Modus
- **Duplizieren-Funktion** für Karten, Regeln und Skripte — schneller als neu erstellen
- **Vorlagen** für häufig genutzte Aufgaben-Typen
- **Stapel-Aktionen** — mehrere Aufgaben auf einmal abhaken oder verschieben
- **Sortierung nach allem** — Datum, Intensität, Bewertung, Häufigkeit
- **Zufalls-Button** in jeder Liste: zeigt einen zufälligen Eintrag
- **"Überrasch mich"-Modus** — die App wählt selbst ein Feature und startet es

---

## Priorisierung

Wenn du entscheiden musst, was zuerst kommt — meine Reihenfolge:

**Hoher Nutzen, wenig Aufwand:**
Timer-Bibliothek, Haptik-Muster, Glossar, Body-Map, Auto-Lock, Favoriten und Suche, Swipe-Gesten, Check-in-Fragen

**Hoher Nutzen, mehr Aufwand:**
Reparatur-Modus, Toy-Inventar mit Filter-Anbindung, Blackout-Modus, Jahresrückblick, Ambient-Modus

**Nice-to-have:**
NFC-Tags, QR-Codes, Watch-App, PDF-Jahrbuch, Auktion, Memory

**Erst wenn die Basis steht:**
Alles mit externen Abhängigkeiten (Spotify, Widgets, Wearables)
