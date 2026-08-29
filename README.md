# EMBER

Ein privater Begleiter für zwei.

Dieses Repository enthält den Programmcode — sonst nichts. Keine Zugangs-
daten, keine Schlüssel, keine Namen, keine Inhalte. Wer es findet, findet
eine leere App.

**Einrichten:** [EINRICHTEN.md](EINRICHTEN.md)

---

## Bauart

Dieselbe wie bei [VANI](https://thekeveldikev.github.io/vani/): ein
gemeinsamer globaler Skriptraum, keine Module, kein Framework. Der Bau
kopiert `src/` zu einer einzigen `index.html` zusammen; esbuild schrumpft
nur Syntax und Leerraum und lässt die Namen stehen. Die lesbaren
Quelldateien bleiben die Wahrheit.

```
src/00-head.html + <style>src/10-style.css</style> + src/05-shell.html
  + <script> alle src/*.js in fester Reihenfolge </script>   ->   index.html
```

```bash
npm install
npm start      # http://localhost:5173
npm run build  # index.html, sw.js, manifest.json
npm test       # prüft die Push-Verschlüsselung gegen RFC 8291
```

Eine neue Fassung: `npm run fassung && npm run build && git push`.
Anders als bei VANI steht die Nummer nur an **einer** Stelle
(`package.json`); Dienst, Anzeigeblatt und App bekommen sie beim Bau.

## Aufbau

| Datei | Wofür |
|---|---|
| `20-core.js` | `el()`, Meldungen, Blätter, Vibration, Aktualisierung |
| `21-krypto.js` | AES-256-GCM, PIN-Schrank, Kopplungscode |
| `22-firebase.js` | Ablage über REST und EventSource, ohne SDK |
| `23-push.js` | Web Push nach Standard, ohne FCM |
| `24-daten.js` | Verschlüsseln beim Hinausgehen, Spiegel fürs Offline |
| `30`, `31` | Einrichtung, PIN, Weg hinein |
| `40-huelle.js` | Fußleiste, Seitenwechsel, gemeinsame Bausteine |
| `41`, `42` | Heim, der Knopf |
| `43`, `43b` | Plausch, Stimme, Ablauf, Signale |
| `44`–`44e` | Decks, Rad, Baukasten, Wahrheit oder Pflicht, Lose |
| `45`, `46` | Aufträge und Regeln, das Buch |
| `47` | Ich und die Verwaltung |
| `48`, `48b` | Wachsen (Stufen, Werte, Karma, Ehren), Pfade |
| `49`, `49b` | Wünsche mit blindem Abgleich, Grenzenkarte |
| `50`–`52` | Ampel, Notausgang, Tarnung |
| `53` | Uhr, Verborgenes, Krümel, Impulse |
| `54`–`56` | Tresor, Vertrag und Danach, Rituale |
| `90-start.js` | Der Anfang |

`push/worker.js` ist der Bote (Cloudflare). `werkzeug/` baut, erzeugt
Schlüssel und Sinnbilder und bringt den Gesprächsverlauf auf ein anderes
Gerät. `test/rahmen.mjs` lädt die echten Quelldateien in einen eigenen
Skriptraum — die Prüfungen laufen gegen den Code, nicht gegen einen Nachbau.

## Wie das Vertrauliche vertraulich bleibt

- **AES-256-GCM auf dem Gerät.** In Firebase liegen nur Brocken wie
  `{"g":"k7Fx…"}` — kein Text, kein Name, kein Zeitstempel. Die Ordnung
  ergibt sich aus den Kennungen, die mit der Zeit in Basis 36 beginnen.
- **Der Schlüssel entsteht beim Einrichten** und wandert nur über den
  Kopplungscode, den ihr euch von Hand gebt. Er steht in keinem Quelltext.
- **Die PIN schließt den Schlüssel ein** (PBKDF2, 260 000 Runden). Ohne sie
  liegt auf dem Gerät nur ein verschlossener Schlüssel.
- **Der Pfad in der Ablage** ist aus dem Schlüssel abgeleitet (SHA-256,
  128 Bit) und dadurch nicht zu erraten. Die Regeln in
  `firebase-regeln.json` sind die zweite Linie dahinter.
- **Push trägt keinen Inhalt** — nur eine Art und einen nichtssagenden Satz.
  Auf dem Sperrbildschirm steht nie, worum es geht.
- **Keine fremden Server** außer Firebase und dem eigenen Boten. Die
  Schriften liegen hier im Repository, nicht bei Google.

## Der Notausgang

Der Punkt oben rechts ist auf jeder Seite erreichbar — auch mitten im
Vollbild-Befehl, auch im Ruheschirm. **Rot hält alles an:** offene Befehle
verschwinden, Uhren stoppen, die App wird warm und leise. Das ist die
Bedingung dafür, dass der Rest überhaupt sein darf.
