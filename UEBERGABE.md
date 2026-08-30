# Übergabe

Für den Fall, dass hier jemand Neues weiterbaut — ein anderes Gerät, eine
neue Sitzung, ein anderes Werkzeug. Was in diesem Dokument steht, steht
nirgendwo sonst: die Entscheidungen und die Gründe dahinter.

Der Code erklärt das *Was*. Hier steht das *Warum*.

---

## Stand

**Fassung 0.3.0.** Läuft, ist aber noch nirgends veröffentlicht und war noch
nie mit einer echten Ablage verbunden. Was geprüft ist und was nicht, steht
weiter unten.

38 Quelldateien, 230 KB ausgeliefert. 23 Seiten, 21 selbsttätige
Prüfungen, alle Seiten in beiden Rollen ohne eine Ausnahme in der Konsole.

**V1** (alles gebaut): Profilwahl mit PIN · der Knopf in beide Richtungen ·
Plausch · Aufträge, Regeln, Ausstehendes · Ampel · Notausgang · Decks ·
Buch mit Wärmekarte · Tarnung · Aktualisierung.

**V2** (dazugekommen):

| Bereich | Was drin ist |
|---|---|
| Spiel | Rad (mehrere hintereinander) · Baukasten · Wahrheit oder Pflicht mit drei Stufen · Rubbellose |
| Wachsen | Stufen und Ränge · sechs Werte · Karma mit Wunsch-Marken · Auszeichnungen · Pfade mit verborgenen Stufen |
| Spannung | Uhr · Verborgenes mit Countdown · Krümel über den Tag · Zufalls-Impulse |
| Nähe | Wünsche mit blindem Abgleich · Liste · Grenzenkarte mit Verlauf · Vertrag mit Unterschrift · Danach · Nur für dich |
| Plausch | Sprachnachrichten · Nachrichten mit Ablauf · geheime Signale |
| Sonstiges | Tresor · Rituale mit Serie · Countdowns · „An diesem Tag" |

**V3** (dazugekommen):

| Bereich | Was drin ist |
|---|---|
| Foto-Auftrag | Mit laufender Uhr auf seinem Heim; versäumt wandert von selbst in die Warteschlange (die Strafe legt nur das Domme-Gerät an, sonst gäbe es sie doppelt) |
| Die Sperre | Erlaubnis-Kontrolle mit Siegel auf beiden Heim-Seiten; er kann bitten, sie kann gewähren, ablehnen — oder ablehnen und verlängern |
| Boss | Eine Prüfung zur Zeit, Belohnung verhüllt bis zum Sieg, Scheitern wahlweise mit Folgen |
| Quiz | Fragen übereinander mit echtem Einsatz: verliert er, Warteschlange; verliert sie, Wunsch-Marke für ihn |
| Funken | Ein Topf eigener Sätze, ein Tipp schickt einen zufälligen; langer Druck füllt den Topf |
| Paar-Level | Wächst nebenbei durch abgehakte Aufträge, Buch-Einträge, Rituale, Siege, Quizrunden, beidseitiges Danach |

**Fürs iPhone (12 und 17 Pro Max) in dieser Runde:** Die sichtbare Höhe
wird über visualViewport als `--vvh` mitgeschrieben und die Hülle hängt
daran — damit liegt das Schreibfeld im Plausch ÜBER der Tastatur statt
darunter (iOS verkleinert das Layout bei Tastatur nicht von selbst;
`interactive-widget` gilt dort nicht). Der Plausch misst sich seither an
der Bühne statt an einer geratenen Zahl. Dazu: Doppeltipp-Zoom aus
(`touch-action: manipulation` am html), Safe-Areas auch links und rechts.

**Die teuerste Falle bisher — im Live-Betrieb gefunden:** `replace()` mit
einer Zeichenkette ersetzt nur den ERSTEN Treffer. Der Platzhalter
`__FASSUNG__` stand auch im Kommentar der Dienst-Vorlage — der Kommentar
bekam die Nummer, der Code behielt den Platzhalter, und der ausgelieferte
Dienst hieß in jeder Fassung gleich. Folge: Der ganze Aktualisierungsweg
über den Lagernamen war tot, und kein lokaler Test hat es gesehen, weil
keiner den GEBAUTEN sw.js las. Lehre: Nach jedem Deploy einmal das
Ausgelieferte selbst ansehen (`curl …/sw.js | grep VERSION`), nicht das
Lokale. Und zwei weitere Firebase-Lehren aus dem echten Einrichten: Die
Regelsprache der Echtzeit-Datenbank kennt kein numChildren() (nur
hasChild/val/exists und Verwandte), und Kommentare gehen dort nur als
echte //-Zeilen — ein "//"-SCHLÜSSEL ist ein ungültiger Pfadname.

**Fallen vom ersten echten Push-Tag:** Im Cloudflare-Dashboard greifen
Änderungen an Secrets erst nach einem ausdrücklichen Deploy — Löschen
ohne Deploy sieht gelöscht aus und ist es nicht. Verlässlicher ist
wrangler (`wrangler secret put NAME --name ember-bote`, Wert über die
Standardeingabe). Und: Apple beantwortet ein VAPID-JWT, dessen sub auf
eine .invalid-Adresse zeigt, mit 403 BadJwtToken — der ABSENDER muss
eine echte mailto-Adresse sein. Der Bote reicht seither bei Fehlschlag
den Grund des Zustelldienstes mit durch (`grund` in der Antwort).

**Neue Fallen aus dieser Runde:** Das rohe `append(null)` schreibt den
TEXT „null" in die Seite — bedingte Kinder immer über `el()` oder
`anfuegen()` aus 20-core anhängen. Und: `navigator.vibrate` gibt es auf
iOS schlicht nicht; alle `puls()`-Aufrufe sind dort wirkungslos, die
Rhythmen kommen nur über Push an. Das ist Apples Grenze, kein Fehler.

**V4 — der Vorrat (0.5.0):** Fünf Content-Dateien in `inhalt/` (241
Dare-Karten in 15 Decks, 12 Glücksräder mit 254 Segmenten plus 10
Kombinationen, ein Szenario-Generator mit 152 Bausteinen und 7
Satz-Templates, 115 Tagesaufgaben, 118 Kekssprüche) werden mit
`node werkzeug/vorrat-bauen.mjs` zu `src/15-vorrat.js` gebacken und
wandern mit in die index.html — offline komplett dabei, nichts muss
gesät werden, jeder Raum hat den Vorrat von allein. Sie steuert alles
unter **Verwaltung → Der Vorrat**: an/aus, Intensitäts-Obergrenze 1–5,
zusammen/getrennt. Die Ampel drückt zusätzlich (Gelb deckelt bei 3, Rot
bei 1 bzw. beim Ruhe-Pool). Eigene Einträge werden überall dazugemischt
und ersetzt nie etwas.

Dazu neu: der **Glückskeks** als echter Keks unten auf dem Heim (tippen
bricht ihn mit Krümeln und Knacken, der Zettel faltet sich beim zweiten
Tipp auf; eigene Sprüche per langem Druck, sie zählen doppelt und tragen
den Absender), die **Tagesaufgabe** für beide Rollen (seine nach Stufe
gestaffelt, mit Serie und Veto/Tauschen für sie; ihre aus dem eigenen
Topf), **Töne** aus purem WebAudio (Ich → Die App, je Gerät), der
**SEX-Knopf** (Tippen öffnet das Blatt mit Worten und Frist, Halten
schickt sofort — mit Ring, der sich in 0,85 s schließt) und das sanfte
Aufklappen nachgeladener Heim-Karten (`grid-template-rows: 0fr → 1fr`
— der einzige Weg, Höhe ohne Messen zu animieren).

**Was aus dem ursprünglichen Entwurf noch fehlt:** Seasons, gemeinsames
Schreiben, Playlist, KI-Anbindung, Voting.

---

## Was in der Bugjagd zutage kam

Sieben Fehler, alle vor der Veröffentlichung gefunden. Sie stehen hier,
weil dieselben Fallen beim Weiterbauen wieder aufgehen können:

1. **`datenAendern` enteignete den Eintrag.** Wer etwas ergänzte, wurde zum
   Absender — eine Reaktion auf seine Nachricht hätte sie auf ihre Seite
   springen lassen. Absender und Zeit werden jetzt durchgereicht (`huelle`).
2. **Ohne Netz Geschriebenes war unsichtbar.** `datenAnhaengen` schrieb am
   Spiegel vorbei. Jetzt geht es zuerst in den Spiegel, dann ins Netz.
3. **Und verschwand wieder, sobald die Verbindung kam** — der Serverstand
   überschrieb den Spiegel. `spiegelSammlungSetzen` legt das Wartende dazu.
4. **Gleichzeitiges kam in zufälliger Reihenfolge.** `kennung()` hatte nur
   Millisekunden und Zufall; zwei schnell getippte Nachrichten konnten
   tauschen. Jetzt mit Zähler und fester Länge.
5. **Der Horcher verlor Leitungen.** Zweimal auf denselben Pfad zu horchen
   ließ die alte Verbindung offen — bei jedem Seitenwechsel eine mehr.
6. **Der Notausgang blieb nach dem Abschließen stehen** und führte ins Leere.
7. **Die Tarnung stürzte ab**, wenn man sie aus dem verschlossenen Zustand
   verließ.

Dazu beim Ausprobieren: das Rad beschriftete seine Felder kopfüber (die
Wendung muss aus der **End**lage gerechnet werden, nicht aus der Anfangslage,
weil sich die Scheibe mehrere Umdrehungen weit dreht), und der blinde
Abgleich fand „Augenbinde" und „augenbinden" nicht.

**Der Prüfstand** (`test/rahmen.mjs`) lädt die echten Quelldateien in einen
eigenen Skriptraum und stellt eine Ablage im Arbeitsspeicher daneben. Damit
lassen sich Netzausfälle nachstellen, ohne etwas nachzubauen. Die ersten
drei Fehler oben waren zuerst als fehlschlagende Prüfung da und danach
behoben — nicht umgekehrt.

---

## Die vier Entscheidungen, die alles andere bestimmen

### 1. Kein Framework, eine Datei

Wie bei [VANI](https://github.com/thekeveldikev/vani): ein gemeinsamer
globaler Skriptraum, keine Module, keine Imports. Der Bau kettet `src/*.js`
in fester Reihenfolge aneinander; esbuild schrumpft nur Syntax und Leerraum
(`minifyIdentifiers: false`).

**Warum:** Dieselbe Bauart wie VANI heißt dasselbe Veröffentlichen, dasselbe
Aktualisieren, dieselben Handgriffe. Und eine App, die als eine Datei
ausgeliefert wird, hat keine Ladereihenfolge, die schiefgehen kann.

**Folge fürs Weiterbauen:** Ein neuer Bereich ist eine Datei in `src/` plus
ein Eintrag in `jsDateien` in `werkzeug/build-web.mjs`. Reihenfolge zählt —
Grundlagen vor ihren Benutzern, Neues ans Ende vor `90-start.js`. Alle
Funktionen sehen einander, es gibt keine Kapselung. Namen deshalb sprechend
wählen.

### 2. Kein Firebase-SDK

Die Echtzeit-Datenbank hat eine REST-Schnittstelle, und fürs Zuhören genügt
`EventSource` — das schickt von sich aus den richtigen `Accept`-Kopf, den
Firebase für den Ereignisstrom braucht. Der Ausweis reist als Abfrage mit,
weil `EventSource` keine Kopfzeilen setzen kann.

**Warum:** Ein halbes Megabyte fremder Code gespart. Die ganze App ist
205 KB — mit allem, was sie kann. Und es passt zur Bauart: Ein SDK bräuchte
einen Bundler und damit eine zweite Bauweise neben dieser.

**Fallstrick:** Läuft der Ausweis ab (eine Stunde), sind alle offenen
Leitungen tot, ohne dass jemand es meldet. `_horcherNeuAufbauen()` legt sie
nach jeder Erneuerung neu. Auch beim Zurückkommen aus dem Hintergrund.

### 3. Web Push statt Firebase Cloud Messaging

FCM kann nicht rein clientseitig senden — das Versenden verlangt immer einen
Server-Schlüssel. Deshalb der Netz-Standard und ein eigener kleiner Bote
(`push/worker.js`, Cloudflare).

Die Verschlüsselung der Last ist gegen die Zahlen aus **RFC 8291, Anhang A**
geprüft: `npm test`. Diese Prüfung muss grün bleiben — geht sie kaputt,
nimmt kein Zustelldienst der Welt die Sendungen mehr an, und man sieht es
nicht, weil das Scheitern still passiert.

**Der Push trägt nie Inhalt.** Nur eine Art, einen nichtssagenden Satz und
einen Vibrations-Rhythmus. Auf dem Sperrbildschirm steht nie, worum es geht;
was gemeint ist, holt die App aus der verschlüsselten Ablage. Das bitte so
lassen — es ist der Grund, warum das Handy auf dem Tisch liegen kann.

### 4. Verschlüsseln ist keine Schicht, die man auch weglassen kann

Alles geht durch `24-daten.js`. Was dort hindurchgeht, ist verschlüsselt,
bevor es das Gerät verlässt. In der Ablage liegen nur `{"g":"k7Fx…"}`.

Zwei Ausnahmen, beide unvermeidlich und beide harmlos: `push/<rolle>` (der
Bote muss den Briefkasten lesen) und `mitglieder/` (die Regeln müssen
Kennungen vergleichen).

**Deshalb gibt es kein Sortieren und kein Suchen in der Ablage.** Es liegt
dort nichts Lesbares, wonach man sortieren könnte. Die Reihenfolge kommt aus
den Kennungen: `kennung()` beginnt mit der Zeit in Basis 36, also ergibt das
schlichte Sortieren nach Kennung die zeitliche Ordnung. **Wer das ändert,
zerstört die Reihenfolge im ganzen Plausch.**

---

## Wo es Absicht ist, dass es unbequem wirkt

Diese Stellen sehen aus wie Versäumnisse. Sie sind keine.

| Was | Warum |
|---|---|
| Der Befehlsschirm hat keinen Weg hinaus außer „Jawohl" | Das ist der Punkt. Der Notausgang oben rechts bleibt trotzdem immer erreichbar — auch dort. |
| Er sieht bei Ausstehendem nur eine Zahl | Sie öffnet einzeln, wann sie will. |
| „Eine Regel hat sich geändert" sagt nicht, welche | Er soll nachsehen. |
| Im Zögern-Modus zeigt die App nicht, ob sie gelesen hat | Das Warten ist das Feature. |
| Keine vorgefertigten Karten, Regeln oder Sprüche | Fremde Vorschläge treffen nie den eigenen Ton. Alles ist selbst geschrieben. |
| Die PIN hat keine Wiederherstellung | Sonst wäre sie keine. Der Weg zurück führt über das andere Gerät. |

**Der Notausgang ist nicht verhandelbar.** `51-notaus.js` hängt an
`document.body` mit `z-index: 850` und liegt damit über allem — über dem
Befehl, über dem Ruheschirm. Sein Punkt ist hell und nicht rot, weil ein
roter Punkt auf dem tiefroten Befehlsschirm unsichtbar wäre. Genau dort wird
er gebraucht.

Rot hält wirklich alles an: offene Befehle verschwinden, Uhren stoppen, die
Stimmung wechselt. Wer hier etwas ändert, sollte wissen, dass der ganze Rest
der App auf dieser Zusage steht.

---

## Was geprüft ist — und was nicht

**Geprüft, selbsttätig** (`npm test`, 21 Prüfungen):

- Push-Verschlüsselung gegen RFC 8291, Anhang A — bitgenau
- In der Ablage steht kein lesbares Wort, kein offener Zeitstempel
- Ergänzen enteignet nicht: Absender und Zeit bleiben beim Urheber
- Ohne Netz Geschriebenes bleibt sichtbar, geht später vollständig raus,
  und lässt sich zwischendurch ändern
- Gleichzeitiges behält seine Reihenfolge; Kennungen sortieren zeitlich
- Falscher Schlüssel und beschädigte Brocken lassen die Liste leer, statt
  sie zu sprengen
- Der blinde Abgleich findet „Augenbinde"/„augenbinden" und trennt
  „nur ich"/„nur du"
- Die Serie zählt Lücken richtig; die Stufenschwellen wachsen stimmig

**Geprüft, von Hand im Browser:**

- Alle 22 Seiten zeichnen fehlerfrei, in beiden Rollen, ohne eine einzige
  Ausnahme in der Konsole
- Tarnung hinein und hinaus, Bedienbarkeit danach wieder da
- Rad, Stufenaufstieg, Karma, Auszeichnungen mit echten Daten
- Der Horcher legt bei toter Ablage nach vier Versuchen auf

**Nicht geprüft — hier ist beim ersten echten Lauf mit Fehlern zu rechnen:**

- **Noch nie mit einer echten Firebase-Ablage verbunden.** Alle Netzwege
  sind gegen erfundene Adressen und die Ablage im Arbeitsspeicher gelaufen.
  Die Regeln in `firebase-regeln.json` waren nie in Betrieb.
- **Der Bote ist nie wirklich gelaufen.** Die Verschlüsselung stimmt, der
  Weg durch Cloudflare bis zum Handy ist ungetestet.
- **Nichts auf einem echten iPhone.** Besonders offen: ob Push in der
  installierten App ankommt, ob `navigator.vibrate` dort etwas tut, und ob
  die Aufnahme (`MediaRecorder`) das Format liefert, das erwartet wird.
- **Zwei Geräte gleichzeitig** — der eigentliche Zweck — nie erlebt.
- Der Dienst konnte in der Vorschau nicht anspringen; das Aktualisieren ist
  vom VANI-Verfahren übernommen, aber hier nie durchgelaufen.
- Die **Bildmenge**: Tresor und Plausch legen Bilder als Text in die Ablage.
  Bei vielen Bildern wird das erste Laden lang. Wo die Schmerzgrenze liegt,
  weiß erst der Betrieb.

---

## Was als Nächstes ansteht

**Zuerst:** Veröffentlichen und einrichten ([EINRICHTEN.md](EINRICHTEN.md)),
dann die Liste oben abarbeiten. Vor allem, ob der Knopf wirklich auf dem
anderen Handy ankommt.

**Danach**, grob nach Aufwand:

*Klein:* Glücksrad · Münzwurf hat schon die Machart dafür · Rubbellose ·
Wahrheit oder Pflicht · Kompliment-Knopf

*Mittel:* Szenario-Baukasten · Sprachnachrichten (`MediaRecorder`, dann wie
Bilder behandeln) · Nachrichten mit Ablauf · geheime Aufträge mit Countdown ·
Teasing-Uhr · Zufalls-Impulse (braucht den Boten und eine geplante Weckung)

*Groß:* das ganze Aufstiegs-System mit Fähigkeitsbaum · Blindes Zuordnen von
Wünschen · Bildertresor mit Freischalten · Grenzenkarte · der Vertrag mit
Unterschrift · gemeinsames Schreiben

**Beim Bildertresor aufpassen:** Bilder gehen als Text in die Ablage.
`bildVerkleinern()` macht aus 4 MB etwa 200 KB. Der Spiegel lässt Bilder
absichtlich draußen (`spiegelPfadOk`), sonst ist der kleine Platz auf dem
Gerät sofort voll.

---

## Handgriffe

```bash
npm start            # Vorschau auf localhost:5173
npm run build        # index.html, sw.js, manifest.json
npm test             # die Push-Verschlüsselung
npm run fassung      # Nummer hochzählen, dann bauen und veröffentlichen

node werkzeug/vapid.mjs    # Schlüssel für den Boten
node werkzeug/icons.mjs    # Sinnbilder neu zeichnen
node werkzeug/umzug.mjs    # Gesprächsverlauf auf ein anderes Gerät
```

Die Fassung steht **nur** in `package.json`. Dienst, Anzeigeblatt und App
bekommen sie beim Bau. (Bei VANI steht sie an drei Stellen und kann
auseinanderlaufen — das war der eine Punkt, an dem hier bewusst abgewichen
wurde.)

`EMBER_DEBUG_BAU=1 npm run build` baut ohne Schrumpfen, wenn im Browser
etwas zu suchen ist.

---

## Der Ton

Deutsch, auch im Code — Bezeichner, Kommentare, alles. Kommentare erklären
*warum*, nicht *was*. Die Oberfläche spricht knapp und ohne Ausrufezeichen:
„Angekommen." statt „Deine Nachricht wurde erfolgreich gesendet!"

Im Repository steht nichts Persönliches. README und Anleitung sind
absichtlich zurückhaltend formuliert — das Repository ist öffentlich, und
wer es findet, soll eine leere App finden. **Bitte so lassen.**
