# EMBER einrichten

Einmal durcharbeiten, dann nie wieder. Rechne mit einer knappen Stunde.

Am Ende steht: eine App auf beiden Startbildschirmen, die aussieht wie eine
gewöhnliche Web-App, deren Inhalte niemand lesen kann außer euch beiden —
auch Google nicht, auch Cloudflare nicht, auch niemand, der das Repository
findet.

---

## Was wo liegt, und warum

| Ort | Was dort liegt | Was der Betreiber sieht |
|---|---|---|
| GitHub Pages | Der Programmcode | Den Code — der ist leer, es steht nichts über euch drin |
| Firebase | Eure Daten | Unlesbare Brocken. Kein Text, kein Name, kein Datum |
| Cloudflare | Der Bote für Hinweise | Nur „irgendwas ist passiert", nie was |
| Euer Handy | Der Schlüssel | Alles — deshalb die PIN |

Der Schlüssel entsteht beim Einrichten auf **einem** Gerät und wandert per
Kopplungscode auf das zweite. Er verlässt eure beiden Geräte sonst nie.

---

## 1 — Das Repository

```bash
cd ~/Desktop/App
git add -A
git commit -m "EMBER 0.1.0"
```

Dann auf GitHub ein neues, **leeres** Repository namens `ember` anlegen
(ohne README, ohne .gitignore — sonst gibt es beim ersten Push Ärger) und:

```bash
git remote add origin https://github.com/thekeveldikev/ember.git
git branch -M main
git push -u origin main
```

Danach im Repository: **Settings → Pages → Source: Deploy from a branch →
Branch: `main`, Ordner: `/ (root)` → Save.**

Nach ein bis zwei Minuten läuft die App unter:

    https://thekeveldikev.github.io/ember/

Sie zeigt jetzt „Zum ersten Mal hier?" — noch nicht antippen, erst die
nächsten beiden Schritte.

---

## 2 — Firebase (die Ablage)

1. [console.firebase.google.com](https://console.firebase.google.com) →
   **Projekt hinzufügen**. Namen frei wählen. Google Analytics **abwählen** —
   ihr wollt kein Tracking.

2. **Realtime Database** (nicht Firestore!) → **Datenbank erstellen** →
   Standort Europa (`europe-west1`) → **Im gesperrten Modus starten**.

3. Oben steht die Adresse der Datenbank, etwa
   `https://mein-projekt-default-rtdb.europe-west1.firebasedatabase.app`.
   **Aufschreiben.**

4. Reiter **Regeln** → alles ersetzen durch den Inhalt von
   [`firebase-regeln.json`](firebase-regeln.json) → **Veröffentlichen**.

5. **Authentication** → **Erste Schritte** → Reiter **Sign-in-Methode** →
   **Anonym** aktivieren.

6. **Projektübersicht** → Zahnrad → **Projekteinstellungen**:
   - **Projekt-ID** aufschreiben
   - Unten bei „Meine Apps" auf das **Web-Symbol `</>`**, Namen vergeben,
     registrieren. Im gezeigten Schnipsel den **`apiKey`** (beginnt mit
     `AIza…`) aufschreiben.

> **Ist der apiKey ein Geheimnis?** Nein, der ist immer öffentlich — er
> benennt nur das Projekt. Was schützt, sind die Regeln aus Schritt 4 und
> die Verschlüsselung auf dem Gerät.

Ihr habt jetzt drei Angaben: **Projekt-ID**, **apiKey**, **Datenbank-Adresse**.

---

## 3 — Der Bote (für Hinweise)

Ohne ihn läuft die ganze App — nur kommt nichts an, solange sie zu ist.
Der Knopf erreicht dich dann nur, wenn du EMBER gerade offen hast.

**Schlüssel erzeugen:**

```bash
node werkzeug/vapid.mjs
```

Die Ausgabe stehen lassen, sie wird gleich gebraucht.

**Worker anlegen:** [dash.cloudflare.com](https://dash.cloudflare.com) →
**Workers & Pages** → **Create** → **Start with Hello World** → Namen
`ember-bote` → **Deploy**. Dann **Edit code**, den ganzen Inhalt von
[`push/worker.js`](push/worker.js) hineinkopieren, **Deploy**.

**Geheimnisse hinterlegen:** Im Worker → **Settings** → **Variables and
Secrets** → viermal **Add**, jeweils als Typ **Secret** (nicht Text):

| Name | Wert |
|---|---|
| `VAPID_PRIVAT` | die ganze JSON-Zeile aus der Ausgabe |
| `VAPID_OEFFENTLICH` | der lange Schlüssel, beginnt mit `B` |
| `GEHEIMNIS` | die Zufallszeichen aus der Ausgabe |
| `ABSENDER` | `mailto:deine@adresse.de` |

Danach einmal **Deploy**, damit die Geheimnisse greifen.

Zum Prüfen die Worker-Adresse im Browser öffnen — es muss `{"da":true}`
erscheinen.

> Kostenlos bis 100 000 Anfragen am Tag. Ihr werdet bei etwa fünfzig landen.

---

## 4 — EMBER einrichten

**Auf ihrem Gerät** (dem, das führt):

1. `https://thekeveldikev.github.io/ember/` öffnen
2. **Teilen → Zum Home-Bildschirm.** Ab jetzt nur noch über das Symbol
   öffnen — ohne das gibt es auf dem iPhone keine Hinweise.
3. App öffnen → **Ich richte ein**
4. Namen eintragen, die drei Firebase-Angaben, die drei Boten-Angaben
5. **Einrichten** → der **Kopplungscode** erscheint → **Kopieren**
6. PIN setzen (empfohlen — siehe unten)

**Den Code aufs zweite Gerät bringen:** Signal, AirDrop, oder von Hand
abtippen. Danach die Nachricht **löschen**. Wer den Code hat, hat alles.

**Auf seinem Gerät:**

1. Dieselbe Adresse öffnen, **Zum Home-Bildschirm**
2. App öffnen → **Ich habe einen Code** → einfügen → **Verbinden**
3. Rolle wählen, PIN setzen

**Auf beiden:** *Ich* → **Hinweise einschalten** → erlauben. Dann
*Zustellung ausprobieren* — es muss klingeln.

Fertig. Drückt einmal den Knopf.

---

## Erst mal allein ausprobieren (mit einem iPad)

Die App lässt sich vollständig zu zweit testen, bevor die zweite Person
überhaupt davon weiß:

1. **iPhone** wie oben einrichten (du bist der Sub — deine echte Rolle).
2. **iPad**: dieselbe Adresse öffnen, zum Home-Bildschirm, **Ich habe
   einen Code**, den Kopplungscode einfügen — und als Rolle **sie** wählen.
3. Jetzt spielst du beide Seiten: iPhone ist deine Sicht, das iPad ihre.
   Der Knopf, der Plausch, die Sperre — alles läuft echt über die Ablage.
4. Falls du zwischendurch am iPhone ihre Sicht sehen willst:
   *Ich → Sichtwechsel.* Derselbe Weg führt zurück.

**Bevor du ihr die App gibst:** Auf dem iPad (oder wo immer gerade ihre
Rolle liegt) *Ich → Verwaltung → Alles auf Anfang* — das löscht den ganzen
Probelauf, behält aber Einrichtung und Schlüssel. Dann auf dem iPad *Ich →
Dieses Gerät leeren*, und ihr Gerät kommt mit dem Kopplungscode herein,
als wäre nichts gewesen.

---

## Neue Fassung veröffentlichen

Genau wie bei VANI — der Dienst trägt die Fassung in seinem Lagernamen,
deshalb räumt eine neue Fassung die alte von selbst weg.

```bash
npm run fassung        # zählt die Nummer hoch
npm run build          # baut index.html, sw.js, manifest.json
git add -A && git commit -m "…" && git push
```

Nach ein bis zwei Minuten meldet sich die App auf beiden Geräten von selbst:
*„Eine neue Fassung liegt bereit." → „Neu laden"*. Wer nicht warten will:
*Ich → Nach einer neuen Fassung sehen*.

**Das Symbol auf dem Startbildschirm bleibt dasselbe. Eure Daten bleiben.**

Zum Ausprobieren vor dem Veröffentlichen: `npm start` → `localhost:5173`.

---

## Die PIN

Freiwillig, aber sie ist echt und kein Vorhängeschloss aus Pappe:

- **Mit PIN** liegt auf dem Gerät nur ein *verschlossener* Schlüssel. Die PIN
  öffnet ihn (260 000 Runden PBKDF2). Ein gestohlenes Handy gibt nichts her.
- **Ohne PIN** liegt der Schlüssel offen. Wer das entsperrte Handy in die
  Hand bekommt, liest alles.

Es gibt keine Hintertür. **PIN vergessen heißt: dieses Gerät leeren und
mit dem Kopplungscode vom anderen Gerät zurückkommen.** Alles Gemeinsame
liegt in der Ablage und ist danach wieder da. Deshalb: den Kopplungscode
einmal an einem sicheren Ort ablegen — Passwortmanager, nicht Notiz-App.

---

## Wenn jemand mitschaut

- **Dreimal auf den EMBER-Schriftzug** → die App wird zu einer Notizliste.
  Dreimal auf „Notizen" → zurück.
- Auch über den **Punkt oben rechts** → *Jemand schaut mit*.
- Der Punkt oben rechts ist immer da, auf jeder Seite, auch mitten im
  Befehl: **Gelb** heißt langsamer, **Rot** hält alles an.

---

## Wenn etwas klemmt

| Was passiert | Woran es liegt |
|---|---|
| „Die Ablage nimmt uns nicht an" | Anonyme Anmeldung nicht aktiviert (Schritt 2.5), oder apiKey vertippt |
| „Der Schlüssel passt nicht" | Der Kopplungscode ist unvollständig — noch einmal ganz kopieren |
| Nichts kommt an, App zu | iPhone: nur die installierte App bekommt Hinweise. Über das Symbol öffnen, nicht über Safari |
| „Der Bote hat nicht angenommen" | `GEHEIMNIS` im Worker und in der App verschieden, oder nach dem Anlegen der Geheimnisse nicht neu bereitgestellt |
| Neues Gerät kommt nicht hinein | Sechs Mitgliedsplätze belegt — in der Firebase-Konsole unter `paare/…/mitglieder` alte löschen |
| Alles leer nach dem Öffnen | Kein Netz. Die App zeigt den letzten Stand und holt nach, sobald es geht |

---

## Was diese App nicht tut

Kein Analytics, keine Cookies, keine fremden Server außer den drei oben.
Die Schriften liegen im Repository, nicht bei Google. Beim Öffnen fragt
niemand nach, wer ihr seid.
