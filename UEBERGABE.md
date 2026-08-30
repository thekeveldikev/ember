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

**V5 (0.6.0) — die zweite Vorrats-Welle plus zwei neue Maschinenräume:**
Wahrheit oder Pflicht zieht jetzt aus 159 Vorrat-Karten (Modi: Klassisch,
Ihre Wahl, Zufall, nur W/nur P; Passen kostet Karma und Ausstehendes,
dreimal beendet die Runde; sie kann Stufen überspringen). Die Lose wurden
ein echtes Losspiel: Tageslos (nur er), Seltenheiten 40/30/18/10/2 mit
farbigem Aufdeck-Glühen und Konfetti beim Jackpot, Typen sofort/
gutschein (Portemonnaie mit Einlöse-Bitte)/niete/falle (schreibt
Strafe)/zeitschloss/bedingt/wildcard/blind (sie schreibt in 60 s LIVE,
sein Blatt füllt sich von selbst) — plus Serienwahl und Präparieren.
NEU: die **Session-Regie** (63) — 10 zeitgesteuerte Skripte laufen
synchron über die Ablage auf beiden Geräten (Wake Lock, Pause/+30 s/
Überspringen nur bei ihr, Modus nur_domme lässt sein Gerät nur glühen),
eigene Skripte aus 18 Bausteinen. NEU: die **Wenn-Dann-Maschine** (64)
— Regeln WENN/UND/DANN mit 9 Auslösern, 7 Bedingungen, 11 Aktionen,
14 übersetzte Bibliotheks-Regeln; Zeit-Regeln prüft nur das Domme-Gerät
(sonst Doppelfeuer), Sicherungen fest verdrahtet (Rot/Notaus stoppt
alles, Nachtruhe 23–7, max. 5/Tag, Protokoll, er sieht nur die Anzahl).
Dazu die Kleinigkeiten (65): Timer-Bibliothek + Zufalls-Timer,
Glossar, Körperkarte (16 Zonen, 4 Stufen, Notizen), Reparatur-Modus
(3 Schritte, gegenseitig verriegelt), Toy-Regal (filtert das
Toys-Deck), Frage des Tages auf dem Heim.

Bugfixes derselben Runde: datenHorch liest beim Anmelden einmal frisch
vom Server (die Stammleitung schickt Schnappschüsse nur beim Öffnen —
spät registrierte Horcher sahen sonst Gelöschtes ewig weiter; DAS war
Veras Geister-Plausch). Warteschlangen-Aufträge älter als 24 h werden
verworfen statt Gelöschtes wiederzubeleben. zeigeSeite auf derselben
Seite ist jetzt ein stilles Auffrischen (kein Hereinrutschen, Scroll
bleibt). Tagesaufgabe/Frage des Tages als schmale Zeilen. Keks: Tipp
auf den gelesenen Zettel bringt den nächsten. „Wir" heißt „Chat".
Ich-Seite in Klartext erklärt. Vorrat-Texte in Wir-Stimme („wir beide"
statt „ihr beide" — wirStimme() im Generator).

**0.6.1 — die Sinnes-Runde plus ein Beinahe-Desaster:** Der schwerste
Fund: Der Raum-Schlüssel wurde erst am ENDE der PIN-Wahl gespeichert —
wer zwischen Kopplungscode und PIN die App wechselte (AirDrop!), verlor
den frisch eingerichteten Raum unwiederbringlich. Jetzt wird er sofort
nach der Einrichtung gesichert (beide Wege), und die drei
Einrichtungs-Blätter sind BLATT_FEST (kein Wegtippen über den Deckel).
Der komplette Weg für den echten Wir-Raum — Startpaket → Einrichten →
Kopplungscode → zweites Gerät → Rolle → PIN — wurde einmal Ende-zu-Ende
gegen die echte Ablage durchgespielt (Testpaar danach restlos gelöscht).

Sinnes-Overhaul: Ton-Engine mit gemeinsamem Begrenzer, Schimmer-
Arpeggio, Ratschen-Ton und einer echten Kratz-Spur (Dauerrauschen,
dessen Pegel an der Fingergeschwindigkeit hängt). Das Rad dreht jetzt
von Hand (rAF + easeOutCubic), damit jede Feldgrenze hörbar ratscht und
der Zeiger zuckt; dazu Goldrand (radial-mask mit closest-side — sonst
fingerdick!), stehendes Licht, glühendes Siegerfeld, Feder-Stopp. Lose:
wandernder Metallglanz bis zum ersten Kratzer, Kupferflocken am Finger,
Enthüllungs-Blitz + Glanzstreich, Jackpot mit Schimmer und doppeltem
Konfetti; getImageData nur noch alle 320 ms (Ruckler-Quelle). Keks:
lockendes Wiegen, Staubwolke, 15 Krümel in drei Tönen. Performance: Das
Korn verlor seinen mix-blend-mode (der GANZE Schirm wurde pro Frame
verrechnet — DAS Ruckeln auf dem iPhone 12), Backdrop-Blurs gedrosselt.
Boni: Herz per Doppeltipp im Chat (mit Flug-Animation), App-Icon-Badge
bei offenem Befehl, Konfetti bei Stufenaufstiegen, Vorhang-Zitat aus dem
harmlosen Keks-Pool, „Überrasch mich" im Spiel. Wir-Stimme jetzt
wirklich im Build (der Generator war vor der Regel gelaufen), inklusive
kuratierter Verb-Fälle.

**0.7.0 — die Feinschliff-Runde:** Das Heim zeichnet sich nicht mehr als
Ganzes neu — `heimAuffrischen('knopf'|'sperre'|'foto'|'aufgaben')`
erneuert nur die betroffene Ecke (der Keks daneben bleibt dasselbe
DOM-Element; das war das sichtbare „Zucken" nach jedem Knopfdruck).
Eigene Symbolsprache statt Emojis: 16 neue Strich-Sinnbilder (Decks,
Mikro, Sanduhr, Flamme …), glutPunkte() für Intensität, Stimmungs-
WÖRTER im Buch. Der 405-Push-Fehler war eine Boten-Adresse ohne
https:// (relativer fetch → GitHub Pages antwortet 405) — boteAdresse()
normalisiert überall, plus Selbstheilung beim Start in Gerät UND
Ablage. Ich-Seite in vier merkende Klappen (klappGruppe). Aufträge mit
Rhythmus-Auswahl (einmalig/täglich/wöchentlich — Abhaken legt sie
schlafen bis 5 Uhr des nächsten Tags bzw. +7 Tage) und Glimm-Punkt am
Auftrag-Reiter für das, was auf MICH wartet. Wisch-zurück von der
linken Kante (Seite folgt dem Finger). Herz-Doppeltipp schaltet um
(setzen/wegnehmen). Tagesaufgaben mit App-Bezug bekommen einen
„Dorthin"-Knopf (_aufgabeZiel, Stichwort-Erkennung). Keks-Beschnitt
behoben (SVG overflow: visible — die gebrochenen Hälften ragen über den
Zeichenrahmen). Chat-Schnellwahl ohne Emojis („good boy", „Komm her.",
„Jetzt."). Das nackte append(null) unter „Hinweise einschalten" zeigte
wörtlich „null" — anfuegen() ist Pflicht für bedingte Kinder.
Ton-Entsperrung beim allerersten Tipp (iOS-Autoplay); steht der
Klingelschalter auf lautlos, bleibt Web-Audio auf dem iPhone stumm —
Apples Regel. „Schokolade"-Karte (oral-012) auf Wunsch entfernt.

**0.7.1 — die adversariale Runde:** Die Prüfsuite wuchs von 21 auf 58
Prüfungen (test/kern.mjs, test/leitung.mjs, test/vorrat.mjs): kaputte
Zeitstempel, Bit-Kipper in GCM-Brocken, Müll-Kopplungscodes, der
Verteiler in allen Pfad-Lagen, das Sechs-Waisen-Wettrennen (EventSource
zählt im Prüfstand seine Geschöpfe), vergammelte Warteschlangen,
Seltenheits-Würfel, Filterketten, der Regie-Taktgeber mit Pause und
Versatz, 300 Szenarien ohne Platzhalter-Reste, Wir-Stimme als
Invariante. DABEI GEFUNDEN: eine echte Wettlauf-Lücke in datenHorch —
die langsamere Spiegel-Lieferung konnte die frische Server-Lieferung
ÜBERHOLEN und den Geist zurückbringen. Jede Lieferung trägt jetzt eine
Folgenummer, Veraltetes wird verworfen. Der Prüfstand bekam dafür einen
Mini-DOM (createElement mit Kinder-Gedächtnis, createTextNode) und den
EventSource-Zähler.

Dazu: CSP als Haustür (default-src 'none', nur die vier bekannten
Gegenstellen, keine Frames/Objekte/Formulare), PIN-Bremse, die den
Neustart überlebt (ab dem 5. Fehlversuch 30 s, verdoppelnd bis 15 min,
persistiert in Gerät), Blätter messen sich an --vvh statt 88vh (sonst
lagen Knöpfe unter der iOS-Tastatur). Audio: gemeinsame Echoschleife
(160 ms, tief gedämpft, 13 % beigemischt) macht aus Piepsern Raumklang;
neu „plopp" (Chat ein/aus) und „wusch" (Blätter); nach Rot schweigt
alles — D.ruhe gilt auch für Töne.

**0.7.2 — die zweite adversariale Welle (74 Prüfungen):** Neu ist die
STATIK-WACHE (test/statik.mjs): Sie liest den Quelltext selbst und
schlägt an bei toten zeigeSeite-Zielen, Wisch-Karten ins Leere,
Push-Arten ohne Hülle, puls()-Mustern ohne Definition, Tönen ohne
Klang, Decks ohne Sinnbild, Emojis außerhalb der Reaktions-Insel und
dem nackten append(?:null). test/raum.mjs deckt die Raum-Migration,
raumEntfernen und alleLoeschen ab (der Prüfstand hat dafür ein echtes
aufzählbares localStorage als Proxy bekommen). ZWEI FUNDE: (1) Die
Warteschlangen-Mischung kannte nur PUTs — ein offline Gelöschtes stand
nach dem Wiederverbinden kurz wieder da, bis die Schlange geleert war;
jetzt wenden wartende DELETEs sich auch auf die Mischung an. (2) Der
heimAuffrischen-Umbau ließ HORCHER zum Heim navigieren — ein
einlaufendes Knopf-Ereignis riss einen mitten aus dem Chat; Horcher
rufen jetzt mit nurWennDa=true und drängen sich nicht auf (im Browser
gegen die echte Ablage bewiesen). Audio-Stufe 3: Töne mit drei
Stellungen (an/leise/aus, Ich → Die App), nachts automatisch auf 60 %
gedämpft, neuer „gong" (Bronzeschlag mit Teiltönen) für Regie-Wechsel
und Timer-Enden. Härtung: Rahmenbrecher gegen iframe-Einbettung
(frame-ancestors geht auf Pages nicht), das Boten-Geheimnis ist ein
Passwortfeld.

**0.7.3 — die Tarnwand (77 Prüfungen):** Der größte Fund der dritten
Welle: Die Tarnung war eine KULISSE. Die Live-Horcher liefen weiter —
eine eintreffende Meldung („Sie hat geantwortet.") poppte ÜBER der
Notizliste auf, Töne klangen, ein Vollbild-Befehl hätte alles gesprengt,
und ein simples Neuladen warf die Tarnung ab und zeigte EMBER. Jetzt ist
sie eine WAND: istGetarnt() schaltet meldung, meldungMitTat, blatt,
puls, tonSpielen, zeigeSeite, befehlZeigen und denkAnDichZeigen stumm;
die Tarnung persistiert im Gerät und bootet ab dem ERSTEN Frame als
Notizliste (Tarnstil deckt auch Vorhang, Wortmarke und Zitat);
stimmungSetzen kann sie nicht mehr übermalen; beim Enttarnen kommt ein
liegengebliebener Befehl von selbst hoch. Alles im Browser gegen echte
Angriffe bewiesen und als Prüfung „in der Tarnung dringt nichts durch"
verewigt. Weitere Funde: Der Quiz-Shuffle war sort(random) — messbar
schief, die richtige Antwort stand zu oft an derselben Stelle; jetzt
mischen() (Fisher-Yates) mit Verteilungsprüfung über 3000 Läufe. Beim
Vertrag konnte die STALE Render-Kopie die zwischenzeitliche Unterschrift
des anderen überschreiben — vor dem Schreiben wird frisch gelesen; bei
beiden Unterschriften Konfetti und Schimmer. Der Tresor zeigt ihr jetzt
per Schloss-Marke, welche Kacheln für ihn noch zu sind. Statik-Wache
neu: die Pfad-Tippfehler-Wache (jeder gelesene Ablage-Pfad hat einen
Schreiber). Audio: eingehende Chat-Nachrichten ploppen AUFwärts,
gesendete abwärts. Wir-Stimme-Nachzügler in Grenzen und Ritualen.

**0.7.4 — Notausgang, Stimme, Bote (83 Prüfungen):** Der Fund mit
Gewicht: Das NOTAUSGANG-Blatt (Deckel z 700) öffnete sich HINTER dem
Vollbild-Befehl (800) und dem Regie-Läufer (750) — unsichtbar genau in
den Momenten, für die es existiert. Jetzt liegt es mit 890 über allem
außer den Meldungen; im Browser per elementFromPoint bewiesen. Die
Sprachaufnahme konnte bei Doppeltipp auf „Senden" DOPPELT verschicken
(abgeschlossen-Riegel), das Stop-Ereignis wurde erst nach dem Stop
abonniert (Ohr zuerst), zu kurze Aufnahmen verschwanden wortlos — und
sie hat jetzt eine LIVE-PEGELANZEIGE: ein AnalyserNode lauscht am
Strom (ohne ihn an die Lautsprecher zu legen), der rote Punkt atmet
mit der Stimme. Der BOTE wurde gehärtet und neu deployt: CORS nur noch
für thekeveldikev.github.io und localhost (statt *), Hüllen über
3,5 KB werden mit 413 abgewiesen; live verifiziert (fremde Origin
bekommt nicht ihre eigene zurück, ohne Geheimnis 401, echte Zustellung
danach ok). Neue Prüfungen: Maschinen-Sicherungen (aus/Rot/5-am-Tag,
nachts prüft der Test die Nachtruhe selbst), Regie-Schritte mit Dauer
null, Kopf-Wache (CSP/noindex/no-referrer/kein http://), jedes
gerufene Sinnbild ist gezeichnet, kein console.log/debugger/TODO,
alle versprochenen Dateien (Schriften, Icons, sw) liegen wirklich da.
Quiz-Antwort-Blatt ist BLATT_FEST (kein Deckel-Tipp verschluckt den
Weiter-Knopf mitten in der Runde).

**0.8.0 — Der Laden (Glut & Siegel, 94 Prüfungen):** Die Ökonomie aus
inhalt/content-12, übersetzt in Ember-Sprache statt Excel: Karma heißt
in der Anzeige „Glut" (●), Siegel (✦) gibt es nur für Meilensteine
(Stufe +1, Boss +2, 30-Tage-Serie +1), Kurs 50 ●, nur einschmelzbar,
nie zurück. src/66-laden.js trägt einen PUREN Rechenkern
(schuldenStufe, zinsenAuf, inflationAuf, ladenPreisVon,
ladenCooldownRest — einzeln geprüft) und den Buchungsfluss:
kontoBuchen schreibt nie den Stand allein, immer Stand + Zeile im
kontobuch mit Saldo. Verdienst-Hooks: Tagesaufgabe +2 (Stufe 4/5: +4,
Deckel 1/Tag), Auftrag +1 (Deckel 3/Tag), Serien 3/7/14/30. Automatik
(nur ihr Gerät): Sonntag-20-Uhr-Gehalt (kürzbar, wortlos) + 10 %
Wochenzins auf Schulden; Monatserster: 5 % Glutverlust auf freies
Guthaben ab 20 (Erspartes und Schulden nie) + Abo-Abbuchung (wer nicht
zahlen kann, verliert das Privileg sofort). Sechs Abteilungen mit
feinen Namen (Kleine Gesten / Haut & Hände / Freiheiten / Gnade / Das
Große ✦ / Das Risiko), 48 Artikel mit Sperrfristen, Ausverkauft und
24-h-Angeboten mit Countdown; das Risiko wirkt sofort (gekaufte Lose
landen bei den Losen, Verdopplung per Münze, Rad des Schicksals).
Sparziel per langem Druck (Balken auf dem Heim), Siegel-Schmelze,
Bußgeldkatalog für beide sichtbar, Wiederholung binnen 7 Tagen zählt
von selbst doppelt — und bei Rot wird NIE berechnet (fest). Ihre
Hebel: geben/nehmen, Bußgeld, Sonderabgabe, Gehalt, Versiegeln
(Sperrkonto), je Artikel Preis/Ausverkauft/Angebot, Laden schließen
(alles ruht, nichts geht verloren). Bewusst NICHT drin
(Balance-Warnung aus der Content-Datei): kein automatischer Eingriff
in die Dynamik bei Schulden — die App sperrt höchstens den Laden, nie
den Menschen. Frisch eröffnete Konten stempeln gehaltZuletzt und
glutMonat, sonst gäbe es rückwirkend Zahltag. meldung() und
meldungMitTat() sind halter-defensiv (Prüfstand-Fund). Neuer Klang
„muenze" (verdient klingt anders als bezahlt). Der ganze Kreislauf im
Browser verifiziert: eröffnen → kaufen → einlösen anfragen → sie löst
ein → Bußgeld — das Buch stimmt Zeile für Zeile mit Saldo.

**0.8.1 — Bausteine-Schalter und die Automatik unter Prüfung (98):**
Verwaltung → BAUSTEINE: Laden, Tagesaufgaben, Frage des Tages,
Glückskeks und Wenn—Dann sind einzeln abschaltbar — abschalten heißt
ruhen (einst/aufgaben, einst/frage, einst/keks, konto.an,
maschine/an), alle Stände bleiben. Guards sitzen in den Modulen
selbst. Laden-Funde derselben Runde: der Spar-Ausdruck war Unsinn
(`!konto.spar !== undefined` ist immer wahr), Sparen ist jetzt nur auf
Glut-Ware möglich (Siegel kann man nicht ansparen — auch die
Heim-Anzeige ignoriert Siegel-Sparziele aus Altdaten), zu teure
Artikel sagen jetzt WARUM nichts passiert („Noch nicht genug Glut.
Halt gedrückt, um darauf zu sparen."), und ein Kauf klingt nach
Münzen statt nach Strafe (still buchen, selbst klimpern). Neue
Prüfungen: der letzte fällige Sonntag (Sonntag, 20 Uhr, nie Zukunft,
höchstens eine Woche her), Zahltag zahlt einmal und verzinst
Schulden — und läuft NIE doppelt, der Monatswechsel nimmt Glutverlust
und bucht Abos ab oder kündigt Unbezahlbares, bei Rot Gehalt ja/Zins
nein. Statik: doppelt definierte SEITEN fallen jetzt auf. Audio:
Keks-Knack mit Zufallshöhe (kein Bruch klingt wie der andere).

**0.8.2 — der Laden ruht unsichtbar, die Klappen bekennen Farbe:**
Die Ökonomie ist jetzt WIRKLICH standardmäßig aus: Die Spiel-Kachel
„Der Laden" existiert nur, wenn er eröffnet ist — vorher gibt es ihn
schlicht nicht (der Weg hinein: Verwaltung → Bausteine; die
Ersteröffnung leitet zur Laden-Seite mit Startguthaben). klappGruppe
komplett neu: Sinnbild vorn, Zeilen-Zahl und Chevron im Kreis rechts
(dreht sich beim Öffnen, Rand und Kopf glühen), Inhalt mit
Einrück-Leitlinie — damit unterscheidet sich „klappt auf" endlich
sichtbar von „führt weiter" (nacktes ›). Neue Signatur:
klappGruppe(schluessel, bild, titel, unter, ...zeilen). Ich-Seite:
Räume/Sicherheit/Die App sind jetzt drei Klappen unter
„Einstellungen" statt drei langer Listen. Verwaltung: die 17
„Anlegen"-Zeilen liegen in vier thematischen Klappen (Aufträge &
Regeln, Spiel & Zufall, Wachsen & Ehren, Spannung & Kleines).
Einrichtungsweg für den Ernstfall verifiziert: Müll-Startpaket
explodiert nicht, gültiges füllt alle sechs Felder, leeres
„Einrichten" meckert freundlich und gibt den Knopf wieder frei,
Müll-Kopplungscode wird abgewiesen — alles im frischen Wegwerf-Raum
durchgespielt und restlos aufgeräumt. Takt-Audit: jedes setInterval
hat isConnected-Wache oder clearInterval-Weg. Doppel-Rollen-Sweep
über alle 31 Seiten × 2 Rollen ohne einen Fehler. Wichtig fürs
Debuggen: Der Dev-Server-Eindruck kann täuschen — der Service Worker
serviert notfalls die alte Fassung aus dem Cache, auch wenn gar kein
Server läuft.

**0.8.3 — die App erklärt sich selbst, die Rennwache (100):**
Klarheits-Runde. Der Laden hat jetzt ein rollen-spezifisches
Erklärblatt „Wie es funktioniert" (ladenErklaerung in 66-laden):
Er liest in einfachen Sätzen, wie er verdient, was Kaufen/Einlösen
bedeutet, was Zahltag/Zins/Monatsschwund tun und was fest versprochen
ist; sie liest ihre Hebel. Erreichbar aus dem Rand UND aus dem
Zu-Zustand. Abteilungs-Untertitel sind erklärend statt poetisch,
die Schuldenstufe sagt je Rolle in Klartext, was sie konkret
bedeutet, das Kaufblatt sagt VOR dem Kauf, was er auslöst, die
Bilanz erklärt ihre Pfeile. Fund: Die Heim-Kontozeile sagte auch
bei ihr „Deine Glut" — jetzt „Seine Glut"/„Er spart auf".
Seiten-Intros je Rolle auf Rad, Lose, Regie, Wachsen, Pfade,
Spannung; kryptische Leerlauf-Einzeiler (Nur-für-dich, Countdowns,
Glossar, Buch) erklären jetzt, was zu TUN ist. DER Bugfix der Runde:
„Timos Aufgabe" stand manchmal doppelt auf dem Heim — ein
Async-Render-Rennen (Seitenaufbau und Horcher räumen beide erst den
Platz und hängen dann beide an). Neues Kern-Werkzeug rennwache(platz)
in 20-core: Jeder Lauf zieht eine Nummer, nur der jüngste baut an.
Eingezogen in tagesaufgabeKarte, sperreKarte, fotoAuftragKarte,
tagesNachrichtLaden, checkinZeile, gluecksKeksLaden, heimKontoZeile.
Regressionstest test/rennen.mjs stellt das Rennen nach (zwei
gleichzeitige Läufe → genau eine Karte); im Browser mit sechs
parallelen Läufen bewiesen — null Duplikate.

**0.9.0 — der Hilfe-Knopf, die Masken, die Schieber (102):**
Große Bedienbarkeits-Runde. (1) HILFE (src/39-hilfe.js, NEU — auch in
werkzeug/build-web.mjs eingetragen): Auf jeder der 31 Seiten schwebt
ein ?-Knopf (hilfeKnopfAnbringen in zeigeSeite, CSS .hilfeknopf), der
die Seite je Rolle in einfachen Sätzen erklärt — was ist das, was
kann ich tun, wie hängt es zusammen. Abschaltbar (Gerät 'hilfeKnopf',
Schalter unter Die App); Statik-Wache erzwingt einen Eintrag je
Seite. (2) LADEN_WAS in 66-laden: jeder der 48 Artikel trägt einen
konkreten Was-passiert-Satz auf der Karte; Statik-Wache erzwingt
Vollständigkeit. (3) Schiebeschalter (.schieber + schalterZeile in
47-ich): Bausteine, Hilfe-Knopf und Zögern zeigen ihren Zustand als
echten An/Aus-Schieber. (4) Ich-Seite: Schnellzugriff-Reihe ganz oben
(Aktualisieren, Tarnen, Abschließen/PIN, Farbwelt) als runde
Symbol-Knöpfe; offene Klappen atmen unten (14px). (5) Farbwelten:
html[data-thema] rose/gold/jade/mitternacht überschreiben NUR die
Glut-Familie und stapeln sich mit der Stimmung; Gerät 'farbwelt',
Blatt mit Live-Wechsel. (6) App-Symbol wählbar (Gerät 'appSymbol'):
werkzeug/tarnicons-bauen.mjs zeichnet drei harmlose Tarn-PNGs
(Notiz/Rechner/Wetter — eigene, schlichte Zeichnungen) ohne
Abhängigkeiten (eigener PNG-Schreiber über zlib); appSymbolAnwenden
biegt den apple-touch-icon-Link um. iOS friert das Symbol beim
Hinzufügen ein — das Blatt sagt das ehrlich (entfernen, neu
hinzufügen). (7) Tarnung komplett neu: eine ECHTE Notizen-App im
System-Look (#f2f2f7, Systemschrift — h1 braucht ausdrücklich
fontFamily inherit, sonst verrät die Zierschrift die Maske!) mit
Suche, tippbaren Notizen, funktionierendem Editor (Gerät
'tarnNotizen', {text,wann}, erste Zeile = Titel, leere Notizen
verschwinden), Neu-Anlegen, Löschen, Anzahl-Fußzeile. Hinein: drei
schnelle Tipps auf freier Fläche IRGENDWO in der App (globaler
pointerdown-Horcher in 52-tarnung; Knöpfe/Felder/Blätter sind
ausgenommen, ~52px-Radius, 650ms-Fenster). Hinaus: drei Tipps auf
der Notizliste (nicht im Editor).

**0.9.1 — Münzen statt Glut, Farbwelten bis in den Knopf (102):**
(1) Die WÄHRUNG heißt in allen Nutzertexten jetzt „Münzen" (● bleibt,
Code-Bezeichner karma/konto bleiben!) — „Glut" war zu abstrakt. Die
Glut als Stimmung/Marke (Farbwelt „Glut", Wärmekarte, Wortmarke)
bleibt. „Glutverlust des Monats" heißt im Buch „Monatsschwund".
(2) Farbwelten färben jetzt ALLES: sämtliche hart verdrahteten
Kupfer-Töne (SEX-Knopf-Gradient, Fokus-Ringe, Zündung, Klapp-Ränder,
Rad-Segmente, Rubbel-Konfetti, Wärmekarte, Unterschrift-Stift,
Regie/Timer-Akzente) sind durch color-mix(...)-Mischungen aus den
Tokens ersetzt; für Canvas/SVG gibt es farbeVon(token) in 20-core
(liest den berechneten Wert; Prüfstand hat getComputedStyle-Stub).
Screenshot-Beweis: Heim in Mitternacht — Knopf, Wortmarke,
Lichtpunkte, alles blau. (3) HILFE_BEISPIEL in 39-hilfe: jede Seite
hat ein konkretes „Zum Beispiel"-Kärtchen im Hilfe-Blatt;
Statik-Wache erzwingt eins je Seite. (4) Laden-Kopf sagt konkret:
„Zahltag: Sonntag 20 Uhr — in X kommen +N ●". Merke fürs Testen am
PC: Läuft die Ablage-Marke ab, hagelt es kurz 401er, bis die
Selbstheilung greift — Seiten-Sweeps deshalb losgelöst laufen lassen
(window.__sweep-Muster), das 45s-Werkzeuglimit reißt sonst.

**0.9.2 — die gezeichnete Münze, die Begrüßung (102):**
(1) Das ● hat ein eigenes Sinnbild: 'muenze' im Zeichensatz (zwei
konzentrische Ringe im Strich-Stil, currentColor). muenzSinn(groesse)
in 66-laden liefert es mit -2px vertical-align; eingesetzt überall,
wo eine ZAHL steht (Heim-Kontozeile, Laden-Kopf, Artikelpreise,
Kaufblatt, Kaufkarten, Katalog, Bußgeld-Blatt, Bilanz, Sparziel,
Zahltag-Zeile, Konto-Funkeln, Geben/Nehmen-Wahl). In laufenden
SÄTZEN und in meldung()/frage()-Strings bleibt das schlichte ● —
Textknoten können kein SVG tragen. (2) appStarten zeigt beim
allerersten Öffnen eines Geräts eine Begrüßung (Gerät 'begruesst',
einmalig): drei nummerierte Einstiegspunkte, je Rolle anders
(?-Knopf, Verwaltung/Bausteine bzw. Heim-Aufbau, Hinweise
einschalten). Erscheint nach Update auch je einmal auf
Bestandsgeräten — gewollt. (3) farbweltAnwenden/appSymbolAnwenden
laufen jetzt im Boot VOR der Einrichtungs-/Schloss-Weiche — auch
das Schloss steht in der gewählten Farbwelt.

**0.9.3 — die Tastatur, die tote Marke, die Daumen (105):**
DER Fund am Tag der Einrichtung, per Screenshot gemeldet: Beim
Schreiben im Chat rutschte die ganze App nach oben aus dem Bild.
Ursache: iOS schiebt beim Öffnen der Tastatur das LAYOUT-Fenster
hoch, damit das Feld sichtbar wird — eine `position: fixed`-Hülle
wandert stur mit hinaus. `--vvh` maß nur die Höhe, nicht den
Versatz. Jetzt schreibt 90-start auch `--vvt` (visualViewport
.offsetTop, per resize UND scroll) und `--vvb` (Abstand Sichtkante
→ Layout-Boden); #huelle, .deckel und .befehl folgen mit
top/height, #meldungen und .hilfeknopf mit bottom: calc(var(--vvb)
+ …), der Notausgang mit top: calc(var(--vvt) + …). focusout zieht
zusätzlich window.scrollTo(0,0) nach (zweimal, iOS meldet
verzögert). Beim Tippen blendet body.tippt den Hilfe-Knopf aus, und
der Plausch zieht beim Fokus dreifach ans Listenende nach.

ZWEITER, größerer Fund (im Prüflauf zweimal erlebt): Eine
Ablage-Marke kann VOR ihrem Ablauf ungültig werden. Die App sah nur
auf die Uhr — und versuchte es danach bis zu 55 Minuten lang mit
demselben toten Ausweis, 401 für 401. Jetzt wirft _mitFrischerMarke
in 22-firebase bei 401/403 die Marke weg, holt einmal frisch und
wiederholt genau einmal; drei Regressionstests in test/leitung.mjs
(Lesen, Schreiben, und: bleibt die Ablage stur, wird der Fehler
ehrlich gemeldet). Der Prüfstand kann das nachstellen
(ablage.weistAbNoch / ablage.abgewiesen).

Drittens, Daumen-Maß: Über 30 kleine Textknöpfe („Zurück", „+ Neu",
„Serie wählen") waren nur 18px hoch. `button.winzig::after` mit
inset: -11px -8px vergrößert die Trefferfläche auf ~40px, ohne dass
sich am Layout ein Pixel bewegt. Waagerechter Überlauf: auf allen
31 Seiten × 2 Rollen im 375px-Fenster geprüft — keiner.

Merke: Ein Sweep, der 62 Seiten im 60ms-Takt durchhetzt, baut die
Horcher schneller auf und ab, als Firebase mag — das kann hängen,
ohne dass die App etwas hat. Im Zweifel datenLies + datenHorch
einzeln prüfen (beide antworteten in Millisekunden).

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
