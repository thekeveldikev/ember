/* ==========================================================================
   47c-handbuch.js — Das Handbuch.

   Alles, was diese App kann, von A bis Z: in Kategorien sortiert, von den
   einfachen Dingen zu den feineren, jeder Eintrag mit einem Beispiel zum
   Anfassen. Durchsuchbar, damit man nicht blättern muss.

   Zwei Fassungen, je nachdem, wer liest: Wer führt, liest von seinen
   Möglichkeiten; wer folgt, von seinen. Im Modus „Auf Augenhöhe" liest
   jeder die Führenden-Fassung, weil dort beide alles dürfen.

   Darunter die Fragen und Antworten — vom Banalen („Wo sind meine
   Nachrichten hin?") bis zum Heiklen („Was, wenn ich nicht mehr will?").

   Gedacht für einen ruhigen Moment auf dem Sofa, nicht fürs Nachschlagen
   in der Not. Deshalb der Ton: freundlich, klar, ohne Fachwörter.
   ========================================================================== */

/* Ein Eintrag: { t: Titel, s: Text (sie/führend), e: Text (er/folgend),
   b: Beispiel — gilt für beide, wenn nicht bs/be gesetzt sind }.
   Fehlt s oder e, gilt der jeweils andere Text für beide.            */

const HANDBUCH = [
  {
    gruppe: 'Zum Anfangen',
    bild: 'kerze',
    wort: 'Die fünf Dinge, die man am ersten Tag braucht.',
    eintraege: [
      {
        t: 'Die fünf Reiter unten',
        s: 'Heim ist eure Startseite, Chat euer privater Nachrichtenraum, Spiel die Spielhalle, Auftrag die Liste der offenen Dinge, Ich deine Schaltzentrale. Mehr Ebenen gibt es nicht — alles andere hängt darunter.',
        b: 'Verlaufen? Einmal auf Heim tippen, und du stehst wieder am Anfang.',
      },
      {
        t: 'Das kleine Fragezeichen',
        s: 'Unten rechts auf jeder Seite schwebt ein ?. Es erklärt genau die Seite, auf der du gerade stehst — mit einem Beispiel. Wenn es stört: Ich → Die App → Der Hilfe-Knopf.',
        b: 'Du stehst in der Regie und weißt nicht, was das ist? Tipp aufs ?, und es steht da.',
      },
      {
        t: 'Die Ampel',
        s: 'Grün, Gelb, Rot — dein Zustand, jederzeit änderbar, oben rechts auf dem Heim oder ganz oben auf der Ich-Seite. Sie wirkt sofort und überall: Bei Gelb fällt das Härteste aus allen Vorschlägen, bei Rot bleibt nur noch das Ruhige. Und bei Rot berechnet die App nie ein Bußgeld.',
        e: 'Grün, Gelb, Rot — dein Zustand, jederzeit änderbar. Du musst das nicht begründen und niemanden fragen. Bei Gelb wird alles sanfter, bei Rot hält die App an. Keine Strafe, keine Zinsen, keine Regel greift dann.',
        b: 'Schlechter Tag? Ampel auf Gelb. Die App merkt es sofort — ohne dass jemand ein Wort sagen muss.',
      },
      {
        t: 'Der Notausgang',
        s: 'Der kleine Punkt oben rechts, auf jeder Seite. Ein Griff, und alles hält an: Der Bildschirm wird ruhig, laufende Uhren stoppen, nichts pocht mehr.',
        b: 'Er liegt über allem — auch über einem Vollbild-Befehl. Genau dafür ist er da.',
      },
      {
        t: 'Die Tarnung',
        s: 'Drei schnelle Tipps auf eine freie Stelle — irgendwo in der App —, und aus EMBER wird eine ganz gewöhnliche Notizen-App. Mit echten Notizen, die man lesen, schreiben und durchsuchen kann. Drei Tipps auf die Notizliste holen alles zurück.',
        b: 'Jemand setzt sich neben dich? Drei Tipps. Auf dem Bildschirm steht dann „Einkauf: Milch, Kaffee".',
      },
    ],
  },

  {
    gruppe: 'Kleine Kniffe',
    bild: 'hand',
    wort: 'Gesten und Abkürzungen, die man sonst nie entdeckt.',
    eintraege: [
      {
        t: 'Lange drücken',
        s: 'Fast jede Karte in dieser App kann mehr, wenn du sie gedrückt hältst: Ein Deck-Fach öffnet die Verwaltung, ein Laden-Artikel Preis und Angebot, ein Los die Wegnehmen-Frage, eine Regel die Bearbeitung.',
        e: 'Halte Dinge gedrückt — oft steckt mehr dahinter. Im Laden startest du damit ein Sparziel.',
        bs: 'Halt einen Artikel im Laden gedrückt: Preis ändern, ausverkauft stellen, 24-Stunden-Angebot.',
        be: 'Halt einen Artikel im Laden gedrückt und wähl „Sparen" — der Balken auf dem Heim gehört dann diesem Ziel.',
      },
      {
        t: 'Von links nach rechts wischen',
        s: 'Auf jeder Unterseite bringt dich ein Wisch von der linken Kante nach rechts zurück — die Seite folgt dem Finger. Die fünf Hauptseiten haben bewusst kein Zurück.',
        b: 'Schneller als jeder Knopf, und man muss nicht hinsehen.',
      },
      {
        t: 'Dreimal tippen',
        s: 'Drei schnelle Tipps auf eine freie Stelle tarnen die App — von überall, auch am PIN-Schloss. Drei Tipps auf die Notizliste holen sie zurück. Knöpfe und Schreibfelder zählen nicht mit, damit nichts versehentlich zuschnappt.',
        b: 'Üb das einmal in Ruhe. Im Ernstfall willst du nicht überlegen müssen.',
      },
      {
        t: 'Halten statt tippen beim Knopf',
        s: 'Den großen Knopf antippen öffnet das Blatt mit Worten und Frist. Ihn zu HALTEN schickt sofort — ohne ein einziges Wort, dafür mit einem Ring, der sich füllt.',
        e: 'Deinen Bitte-Knopf tippst du an. Was daraus wird, entscheidet sie.',
        b: 'Der stille Weg ist oft der wirksamere.',
      },
      {
        t: 'Doppelt tippen im Chat',
        s: 'Auf eine Nachricht doppelt tippen setzt ein Herz — und nimmt es beim nächsten Doppeltipp wieder weg.',
        b: 'Antworten, ohne zu schreiben.',
      },
      {
        t: 'Der Schnellzugriff',
        s: 'Ganz oben auf der Ich-Seite liegen vier runde Knöpfe: Aktualisieren, Tarnen, Abschließen und Farbwelt. Kein Scrollen nötig.',
        b: 'Nach jeder neuen Fassung: einmal auf Aktualisieren, fertig.',
      },
    ],
  },

  {
    gruppe: 'Jeden Tag',
    bild: 'sanduhr',
    wort: 'Was die App von selbst tut — und was ihr täglich habt.',
    eintraege: [
      {
        t: 'Das Heim',
        s: 'Alles Heutige steht hier untereinander: eine Nachricht, die du hinterlegen kannst, seine und deine Tagesaufgabe, die Frage des Tages, sein Münzstand, der große Knopf und unten der Glückskeks.',
        e: 'Alles, was heute zählt, von oben nach unten. Alles antippbar.',
        bs: 'Tipp ganz oben auf „Etwas für heute hinterlegen" und leg ein Foto hin — er sieht es beim ersten Öffnen.',
        be: 'Ganz oben steht, was sie dir hinterlassen hat. Der Rest ist deiner: Aufgabe, Frage, Münzen, Knopf.',
      },
      {
        t: 'Die Tagesaufgabe',
        s: 'Jeden Tag zieht die App für jeden von euch eine Aufgabe — gestaffelt nach seiner Stufe. Du siehst seine mit und kannst sie tauschen oder wegnehmen. Erledigtes zählt auf die Serie und bringt ihm Münzen.',
        e: 'Jeden Tag eine Aufgabe, passend zu deiner Stufe. Erledigt melden, sie bestätigt — dann zählt sie für deine Serie und deine Münzen.',
        b: 'Sieben Tage am Stück geschafft? Die App bucht von selbst einen Bonus.',
      },
      {
        t: 'Die Frage des Tages',
        s: 'Eine ehrliche Frage, jeden Tag eine andere, für euch beide dieselbe. Erst wenn beide geantwortet haben, seht ihr die Antwort des anderen.',
        b: '„Was hat dich heute an mir überrascht?" — du schreibst, er schreibt, dann klappt es auf.',
      },
      {
        t: 'Der Glückskeks',
        s: 'Unten auf dem Heim liegt ein Keks. Einmal am Tag lässt er sich knacken — mit Bruch, Krümeln und einem Zettel darin. Eigene Sprüche legst du unter Verwaltung → Anlegen ins Glas.',
        b: 'Leg ihm zehn eigene Zettel hinein — er weiß nie, ob heute deiner kommt oder einer aus dem Vorrat.',
      },
      {
        t: 'Die Serie',
        s: 'Was ihr täglich schafft, zählt die App mit. Serien gibt es für Tagesaufgaben und für jedes Ritual — sichtbar für beide, und sie bringen ihm Boni ab drei, sieben, vierzehn und dreißig Tagen.',
        e: 'Dranbleiben zahlt sich aus: drei Tage, sieben, vierzehn, dreißig — jede Marke bringt etwas, die letzte ein Siegel.',
        b: 'Ein ausgefallener Tag reißt sie ab. Im Laden gibt es dafür einen „Streak-Schutz".',
      },
      {
        t: 'Der große Knopf',
        s: 'Antippen öffnet ein Blatt: Worte dazu, eine Frist, dann senden. Gedrückt halten schickt sofort — ohne ein Wort, dafür mit einem Ring, der sich schließt. Sein Bildschirm gehört dir, sobald es ankommt.',
        e: 'Dein Knopf heißt „Bitte". Du fragst, sie antwortet — mit Ja, Nein oder „Ja, aber …". Wann, entscheidet sie.',
        bs: 'Halten, bis der Ring voll ist: Bei ihm füllt sich der Bildschirm, ohne dass ein Wort fällt.',
        be: 'Du darfst immer fragen. Ein Nein ist kein Weltuntergang — es gehört dazu.',
      },
    ],
  },

  {
    gruppe: 'Reden',
    bild: 'plausch',
    wort: 'Chat, Sprachnachrichten, Signale, eigene Wörter.',
    eintraege: [
      {
        t: 'Der Chat',
        s: 'Verschlüsselt, nur ihr zwei. Text, Fotos, Sprachnachrichten. Über den Sanduhr-Knopf gibst du einer Nachricht ein Ablaufdatum — dann verschwindet sie von selbst.',
        b: 'Ein Foto mit „1 Stunde" schicken: Danach ist es fort, auf beiden Geräten.',
      },
      {
        t: 'Im Gespräch suchen',
        s: 'Oben im Chat sitzt eine kleine Lupe. Ein Tipp öffnet ein Suchfeld, und die Liste zeigt nur noch, was zum Wort passt — mit der Zahl der Treffer darüber. Noch ein Tipp auf die Lupe, und alles ist wieder da.',
        b: 'Ihr sucht den Satz von letztem Monat? „Wochenende" eintippen statt zehn Minuten scrollen.',
      },
      {
        t: 'Sprachnachrichten',
        s: 'Das Mikrofon gedrückt halten und sprechen. Während der Aufnahme siehst du den Pegel wandern — man hört, dass jemand da ist.',
        b: 'Manches sagt eine Stimme in fünf Sekunden besser als drei Absätze Text.',
      },
      {
        t: 'Die Schnellwahl',
        s: 'Über dem Schreibfeld liegen kurze Wendungen, die ihr oft braucht. Ein Tipp genügt.',
        b: '„good boy" ist einen Daumen entfernt — nicht drei.',
      },
      {
        t: 'Signale',
        s: 'Eigene Codewörter mit fester Bedeutung. Ein Wort im Chat, und beide wissen, was gemeint ist, ohne dass es dasteht.',
        b: '„Leuchtturm" heißt bei euch: Ich denke an dich, sag nichts weiter.',
      },
      {
        t: 'Unsere Wörter',
        s: 'Euer privates Wörterbuch für alles, was nur zwischen euch etwas bedeutet. Jeder darf anlegen und ergänzen.',
        b: '„Der Ort" = euer Platz am Fluss. Wer neu dazukommt, versteht kein Wort — und das ist der Sinn.',
      },
    ],
  },

  {
    gruppe: 'Spielen',
    bild: 'wuerfel',
    wort: 'Karten, Räder, Lose, Quiz, Baukasten, Regie, Timer.',
    eintraege: [
      {
        t: 'Die Decks',
        s: 'Kartenstapel zum Ziehen: fertige aus dem Vorrat und eure eigenen. Eine gezogene Karte lässt sich direkt als Auftrag geben.',
        e: 'Kartenstapel zum Ziehen. Was du annimmst, liegt danach bei deinen Aufträgen.',
        b: 'Tipp auf ein Fach — die Karte dreht sich um, und erst dann liest du sie.',
      },
      {
        t: 'Die Räder',
        s: 'Glücksräder mit euren Feldern. Drehen, das Feld unterm Zeiger gilt. Mehrere Räder hintereinander ergeben zusammen eine Ansage.',
        b: 'Rad eins sagt „Massage", Rad zwei „zehn Minuten", Rad drei „Augen verbunden".',
      },
      {
        t: 'Der Baukasten',
        s: 'Ein Würfel für ganze Szenen: Ort, Stimmung, Handlung und mehr werden kombiniert. Einzelne Teile lassen sich festhalten und der Rest neu würfeln.',
        b: '„Badezimmer · langsam · Augenbinde" — der Ort passt nicht? Nur den neu würfeln.',
      },
      {
        t: 'Wahrheit oder Pflicht',
        s: 'Drei Stufen, mehrere Modi, gefüttert aus dem Vorrat und euren eigenen Karten. Eigene zählen doppelt, weil sie euren Ton treffen.',
        b: 'Stufe 1 ist ein Aufwärmen, Stufe 3 ist keins mehr.',
      },
      {
        t: 'Die Lose',
        s: 'Rubbellose zum Freikratzen. Es gibt Seltenheiten von Grau bis Rotgold, Nieten, Gutscheine fürs Portemonnaie — und Blindlose: Er rubbelt zuerst, dann schreibst du in sechzig Sekunden, was gilt.',
        e: 'Ein Los pro Tag ist geschenkt. Mit dem Finger freirubbeln — nicht jedes ist ein Gewinn.',
        b: 'Gutscheine wandern ins Portemonnaie und warten dort, bis du sie einlöst.',
      },
      {
        t: 'Das Quiz',
        s: 'Beide beantworten dieselben Fragen — einmal über sich, einmal ratend über den anderen. Am Ende zeigt die App, wie gut ihr euch kennt.',
        b: 'Erschreckend oft liegt man beim Lieblingsessen daneben.',
      },
      {
        t: 'Die Regie',
        s: 'Ein Skript führt euch Schritt für Schritt durch eine Szene, mit Uhr und Ton beim Wechsel. Du siehst alle Schritte, er bekommt immer nur den nächsten. Es gibt auch den Modus „nur du siehst die Anweisungen" — dann sagst du sie an.',
        e: 'Sie startet ein Skript, und das Handy führt euch durch den Abend. Du siehst immer nur den nächsten Schritt.',
        b: 'Zwanzig Minuten, acht Schritte, und niemand muss zwischendurch überlegen.',
      },
      {
        t: 'Überrasch mich',
        s: 'Unten im Spiel: Die App entscheidet selbst, was jetzt dran ist — eine Karte, ein Rad, ein Szenario, ein Timer oder ein Münzwurf. Der halbe Reiz liegt darin, den Daumen einmal nicht entscheiden zu lassen.',
        b: 'Wenn ihr beide keine Lust habt zu wählen: einmal tippen, und es steht.',
      },
      {
        t: 'Der Timer',
        s: 'Eine Uhr mit fester oder zufälliger Dauer. Der Blind-Timer zeigt die Restzeit nicht — nur, dass er läuft.',
        b: 'Zwischen drei und zwanzig Minuten, und keiner weiß, wann es klingelt.',
      },
    ],
  },

  {
    gruppe: 'Führen',
    bild: 'kette',
    wort: 'Aufträge, Regeln, Strafen, Sperren, Fotos.',
    nurFuehrend: true,
    eintraege: [
      {
        t: 'Aufträge',
        s: 'Was er tun soll — mit Frist, wenn du willst, und in einem Rhythmus: täglich, wöchentlich oder einmalig. Er meldet erledigt, du bestätigst. Erst dann zählt es.',
        b: '„Schick mir vor dem Mittag ein Foto deiner Hände." Frist 12 Uhr, einmalig.',
      },
      {
        t: 'Regeln',
        s: 'Was dauerhaft gilt, bis du es wegnimmst. Änderst du eine, bekommt er nur „Etwas hat sich geändert" — nachsehen muss er selbst.',
        b: '„Du fragst, bevor du das Haus verlässt." Steht, bis du sie streichst.',
      },
      {
        t: 'Ausstehendes',
        s: 'Strafen, die warten. Er sieht nur die Anzahl, nie den Inhalt. Du öffnest einzeln, wann du magst.',
        b: 'Drei offene Punkte auf seinem Bildschirm sind manchmal wirksamer als drei ausgesprochene Sätze.',
      },
      {
        t: 'Die Sperre',
        s: 'Nichts ohne deine Erlaubnis. Auf beiden Heim-Seiten steht ein Siegel mit laufender Zeit. Er kann bitten — du gewährst, lehnst ab, oder lehnst ab und verlängerst.',
        b: 'Ablehnen und um zwei Tage verlängern: Die App macht das in einem Zug.',
      },
      {
        t: 'Der Foto-Auftrag',
        s: 'Ein Auftrag mit laufender Uhr auf seinem Heim. Kommt nichts, wandert er von selbst ins Ausstehende.',
        b: 'Dreißig Minuten, und die Uhr tickt sichtbar. Das reicht meistens.',
      },
    ],
  },

  {
    gruppe: 'Wachsen',
    bild: 'pfeilauf',
    wort: 'Stufen, Werte, Auszeichnungen, Pfade, Bosse.',
    eintraege: [
      {
        t: 'Stufen und Punkte',
        s: 'Alles Erledigte zahlt automatisch ein. Aus Punkten werden Stufen, aus Stufen Ränge. Sechs Werte zeigen, wo er stark ist und wo nicht.',
        e: 'Alles, was du erledigst, zahlt hier von selbst ein. Deine Stufe steigt, deine sechs Werte wachsen unterschiedlich schnell.',
        b: 'Eine neue Stufe bringt ein Siegel — die seltene Währung für die großen Dinge.',
      },
      {
        t: 'Auszeichnungen',
        s: 'Du legst sie an und verleihst sie, wann du willst. Kein Automatismus — genau das macht sie wertvoll.',
        e: 'Was sie dir verliehen hat, steht hier. Für immer.',
        b: '„Für die Nacht im Regen" — eine Zeile, die in zehn Jahren noch etwas bedeutet.',
      },
      {
        t: 'Pfade',
        s: 'Ein Stufenplan, den du baust. Er sieht immer nur die nächste Stufe, nie das Ziel. Stufen dürfen verborgen bleiben, bis sie erreicht sind.',
        e: 'Stufenpläne, die sie gebaut hat. Du siehst die nächste Stufe — mehr nicht.',
        b: 'Pfad „Geduld", fünf Stufen. Die fünfte kennt nur sie.',
      },
      {
        t: 'Bosse',
        s: 'Eine größere Prüfung mit Belohnung. Anlegen, ankündigen, gemeinsam bestehen.',
        b: 'Eine Woche ohne, dann der Boss. Wer ihn besiegt, bekommt ein Siegel.',
      },
    ],
  },

  {
    gruppe: 'Der Laden',
    bild: 'muenze',
    wort: 'Münzen verdienen und ausgeben, Preise, Bußgelder, Abos.',
    nurMitLaden: true,
    eintraege: [
      {
        t: 'Münzen und Siegel',
        s: 'Münzen (●) verdient er mit Aufgaben und Aufträgen, dazu kommt sonntags um 20 Uhr sein Gehalt. Siegel (✦) gibt es nur für Meilensteine und nie zu kaufen.',
        e: 'Münzen (●) verdienst du mit allem, was du erledigst; sonntags um 20 Uhr kommt dein Gehalt. Siegel (✦) gibt es nur für große Schritte — und nur die zahlen „Das Große".',
        b: 'Ein Siegel lässt sich in fünfzig Münzen einschmelzen. Der Weg zurück existiert nicht.',
      },
      {
        t: 'Kaufen und Einlösen',
        s: 'Ein Kauf verschwindet nicht: Er liegt als offener Kauf bei ihm, bis er ihn dir vorlegt. Den Moment wählst du.',
        e: 'Gekauftes liegt erst bei dir. Zum Einlösen legst du es ihr vor — wann es gilt, entscheidet sie.',
        b: 'Er kauft „Zehn Minuten Kuscheln" für 3 ● und legt es abends vor. Du sagst: jetzt.',
      },
      {
        t: 'Deine Hebel',
        s: 'Unten im Laden: geben und nehmen, Bußgeld aus dem Katalog, Sonderabgabe ohne Begründung, Gehalt einstellen, Münzen versiegeln (er sieht sie, erreicht sie nicht) — und den Laden schließen.',
        e: 'Sie stellt Gehalt und Preise ein, verhängt Bußgelder, kann Münzen versiegeln. Der Katalog zeigt dir jeden Preis im Voraus.',
        bs: 'Halt einen Artikel gedrückt: Preis ändern, ausverkauft stellen oder ein 24-Stunden-Angebot starten.',
        be: 'Halt einen Artikel gedrückt, um darauf zu sparen — der Balken auf dem Heim gehört dann diesem Ziel.',
      },
      {
        t: 'Was von selbst läuft',
        s: 'Sonntags 20 Uhr Gehalt, auf Schulden zehn Prozent Zinsen. Am Monatsersten fünf Prozent Schwund auf ungenutzte Münzen ab zwanzig — Erspartes ist sicher — und die Abo-Abbuchung. Unbezahlbares wird wortlos gekündigt.',
        b: 'Bei Rot rechnet die App gar nichts: keine Bußgelder, keine Zinsen. Nie.',
      },
      {
        t: 'Abos und Schwarzmarkt',
        s: 'Abos sind Dauer-Freiheiten gegen monatliche Münzen; du schaltest frei und kündigst. Über „Leise fragen" kann er nach etwas fragen, das es im Laden nicht gibt — du nennst einen Preis. Oder nicht.',
        e: 'Fang mit höchstens zwei Abos an. Und wenn du etwas willst, das es nicht gibt: „Leise fragen".',
        b: 'Der Laden ist abschaltbar (Verwaltung → Bausteine). Alle Stände bleiben liegen.',
      },
    ],
  },

  {
    gruppe: 'Nähe',
    bild: 'herz',
    wort: 'Wünsche, Grenzen, Körper, Vertrag, Danach, Reparatur.',
    eintraege: [
      {
        t: 'Wünsche',
        s: 'Jeder trägt für sich ein, was er sich wünscht. Sichtbar wird nur, was BEIDE eingetragen haben — der Rest bleibt geheim, auch voreinander.',
        b: 'Keiner muss sich als Erster offenbaren. Genau das ist der Trick.',
      },
      {
        t: 'Grenzen',
        s: 'Was geht, was nicht, was vielleicht. Änderungen bleiben als Verlauf sichtbar — man sieht, wie sich etwas entwickelt hat.',
        b: '„Fotos: vielleicht — nur ohne Gesicht." Steht da, ohne dass es jemand aussprechen muss.',
      },
      {
        t: 'Die Körperkarte',
        s: 'Sechzehn Zonen, vier Stufen: Liebe ich, mag ich, neutral, bitte nicht. Jeder pflegt seine eigene und sieht die des anderen.',
        b: 'Nacken auf „Liebe ich", Füße auf „Bitte nicht" — und ihr müsst nie wieder raten.',
      },
      {
        t: 'Der Vertrag',
        s: 'Eure Abmachung, schwarz auf weiß, von beiden mit dem Finger unterschrieben. Ändern geht jederzeit — dann wird neu unterschrieben, und die alte Fassung bleibt lesbar.',
        b: 'Zwei Unterschriften, und die App macht ein kleines Fest daraus.',
      },
      {
        t: 'Danach',
        s: 'Nach einer Session schreibt jeder für sich, wie es war. Erst wenn beide fertig sind, klappt die App beides auf — so färbt keiner den anderen.',
        b: 'Die ehrlichste Minute des Abends, und sie kostet nichts.',
      },
      {
        t: 'Reparatur',
        s: 'Nach einem Streit: drei ruhige Schritte, die beide nacheinander freigeben müssen. Keine Punkte, keine Strafen, kein Spiel.',
        b: 'Hier zählt nichts und wird nichts berechnet. Es geht nur um euch.',
      },
    ],
  },

  {
    gruppe: 'Spannung',
    bild: 'funke',
    wort: 'Uhren, Verborgenes, Krümel, Impulse, Wenn—Dann.',
    eintraege: [
      {
        t: 'Countdown und Verborgenes',
        s: 'Eine Uhr, die er ablaufen sieht, ohne zu wissen, worauf. Oder etwas Verborgenes mit Enthüllungsdatum.',
        e: 'Manchmal siehst du nur, DASS etwas kommt. Das ist Absicht.',
        b: 'Freitag 20 Uhr, Inhalt verborgen. Die Vorfreude macht die halbe Arbeit.',
      },
      {
        t: 'Krümel',
        s: 'Kleine Hinweise, die sich über den Tag verteilen und zu ihren Zeiten auftauchen.',
        b: 'Drei Krümel morgens gestreut — einer taucht um elf auf, einer um drei, einer abends.',
      },
      {
        t: 'Impulse',
        s: 'Ein Topf, aus dem die App zu zufälligen Zeiten etwas zieht. Du füllst ihn, den Rest macht der Zufall.',
        b: 'Weder du noch er wisst, wann der nächste kommt.',
      },
      {
        t: 'Wenn — Dann',
        s: 'Regeln, die von selbst feuern: WENN etwas passiert, DANN tut die App etwas. Auch wenn ihr gerade gar nicht in der App seid.',
        e: 'Regeln, die sie gebaut hat und die von selbst greifen. Ob welche laufen, siehst du hier.',
        b: 'WENN er die Tagesaufgabe verpasst, DANN kostet es abends 2 ● — jedes Mal, ohne Diskussion.',
      },
    ],
  },

  {
    gruppe: 'Sammeln und Erinnern',
    bild: 'brief',
    wort: 'Buch, Tresor, Regal, Rituale, private Notizen.',
    eintraege: [
      {
        t: 'Das Buch',
        s: 'Euer gemeinsames Tagebuch mit Flammen als Bewertung. Oben die Wärmekarte: ein Feld je Tag, je heißer desto heller — eure Geschichte auf einen Blick.',
        b: 'Drei Zeilen nach dem Abend reichen. In einem Jahr sind sie unbezahlbar.',
      },
      {
        t: 'Der Tresor',
        s: 'Dein Bilder-Safe. Du lädst hoch und gibst einzeln frei, was er sehen darf — und nimmst es genauso wieder zurück.',
        e: 'Was sie für dich freigegeben hat. Was du hier siehst, hat sie bewusst geöffnet.',
        b: 'Freigeben heißt nicht verschenken. Zurücknehmen geht jederzeit.',
      },
      {
        t: 'Das Regal',
        s: 'Was an Spielzeug wirklich da ist. Die Decks und der Baukasten richten sich danach — was fehlt, wird nie vorgeschlagen.',
        b: 'Ohne Augenbinde im Regal taucht auch keine Karte damit auf.',
      },
      {
        t: 'Rituale',
        s: 'Was regelmäßig wiederkehrt, mit Serie fürs Dranbleiben. Daneben Countdowns auf besondere Tage.',
        b: '„Guten-Morgen-Nachricht vor 9 Uhr" — und die Serie zählt stolz mit.',
      },
      {
        t: 'Nur für dich',
        s: 'Private Notizen, die dieses Gerät nie verlassen. Nicht in der Ablage, nirgends — auch der andere kann sie nicht lesen.',
        b: 'Für Gedanken, die noch reifen müssen. Oder für immer bleiben, wo sie sind.',
      },
    ],
  },

  {
    gruppe: 'Wenn es schwierig wird',
    bild: 'waage',
    wort: 'Bremsen, Pausen, Nein sagen — und was danach kommt.',
    eintraege: [
      {
        t: 'Anhalten, sofort',
        s: 'Der Notausgang oben rechts liegt über allem — auch über einem Vollbild-Befehl und einer laufenden Regie. Ein Griff, und alles hält an: keine Uhren, kein Pochen, kein Ton.',
        e: 'Der Punkt oben rechts gehört dir. Du musst ihn nicht begründen, nicht ankündigen und niemanden fragen.',
        b: 'Er ist immer da, auf jeder Seite, in jedem Modus. Auch mitten im Vollbild.',
      },
      {
        t: 'Was Rot wirklich bewirkt',
        s: 'Rot ist kein Stimmungssymbol, sondern greift technisch durch: keine Bußgelder, keine Zinsen, keine harten Vorschläge, kein Pulsieren. Und es bleibt, bis ihr es zurücknehmt.',
        e: 'Rot heißt: Die App hört auf, etwas von dir zu wollen. Es kostet nichts, es zählt nichts, es bricht keine Serie.',
        b: 'Ampel umstellen dauert zwei Sekunden. Ein schlechter Abend dauert länger.',
      },
      {
        t: 'Nein sagen ist eingebaut',
        s: 'Er kann jede Bitte zurückziehen, jede Aufgabe unerledigt lassen und jederzeit die Ampel stellen. Die App bestraft nichts davon von selbst — nur du könntest das, und auch das ist eine Entscheidung.',
        e: 'Du darfst Nein sagen. Immer. Die App rechnet dir daraus keinen Nachteil.',
        b: 'Im Laden gibt es sogar ein „aufgespartes Nein" zu kaufen — aber gebraucht wird es nicht.',
      },
      {
        t: 'Eine Pause einlegen',
        s: 'Muss nichts Großes sein: Bausteine abschalten (Verwaltung → Bausteine), den Laden schließen oder in den Modus „Auf Augenhöhe" gehen. Alles bleibt liegen, wo es ist, und wartet.',
        e: 'Wenn dir alles zu viel wird, sag es. Die App kann fast vollständig ruhen, ohne dass etwas verloren geht.',
        b: 'Zwei Wochen Pause, dann alles wieder an — es ist exakt so, wie ihr es verlassen habt.',
      },
      {
        t: 'Nach einem Streit',
        s: 'Die Reparatur (Ich → Für uns) führt euch durch drei ruhige Schritte, die beide freigeben müssen. Dort zählt nichts, wird nichts berechnet, geht keine Serie kaputt.',
        b: 'Kein Spiel, keine Punkte. Nur der Weg zurück zueinander.',
      },
      {
        t: 'Grenzen verschieben sich',
        s: 'Was ihr in Grenzen und Körperkarte eintragt, ist kein Vertrag für die Ewigkeit. Änderungen bleiben als Verlauf sichtbar — man sieht, wie sich etwas entwickelt hat, ohne darüber reden zu müssen.',
        b: 'Ein „bitte nicht" darf später ein „vielleicht" werden. Und umgekehrt.',
      },
    ],
  },

  {
    gruppe: 'Sicherheit und Vertrauen',
    bild: 'auge',
    wort: 'Wer was sehen kann — und wer ganz sicher nicht.',
    eintraege: [
      {
        t: 'Was verschlüsselt ist',
        s: 'Alles, was ihr schreibt, wird auf eurem Gerät verschlüsselt und erst dann gespeichert. Wer die Datenbank öffnete, sähe Buchstabensalat. Der Schlüssel liegt nur auf euren beiden Geräten.',
        b: 'Auch Bilder, Sprachnachrichten und Tagebucheinträge — nichts liegt offen.',
      },
      {
        t: 'Was auf dem Gerät bleibt',
        s: '„Nur für dich" verlässt dieses Handy nie. Ebenso die Tarn-Notizen, deine Farbwelt, dein App-Symbol und die Klapp-Zustände. Diese Dinge kennt nicht einmal die Ablage.',
        b: 'Auf zwei Geräten können also verschiedene Farbwelten laufen — das ist Absicht.',
      },
      {
        t: 'Die PIN',
        s: 'Mit PIN liegt der Schlüssel nur verschlossen auf dem Gerät: Wer das Handy findet, kommt an nichts. Ohne PIN liegt er offen — dann reicht ein Griff. Die Schließzeit sperrt zusätzlich nach Pausen.',
        b: 'Ab dem fünften Fehlversuch wartet die App immer länger. Raten lohnt sich nicht.',
      },
      {
        t: 'Der Kopplungscode',
        s: 'Er enthält euren Schlüssel — er ist der Hausschlüssel. Nur direkt von Gerät zu Gerät geben (AirDrop), niemals per Chat, Mail oder Cloud. Ein Code, der einmal durch einen Chat lief, ist verbrannt.',
        b: 'Ein neues Gerät kommt damit in euren Raum. Genau deshalb darf ihn sonst niemand haben.',
      },
      {
        t: 'Wer sonst noch mitliest',
        s: 'Niemand. Es gibt kein Nutzerkonto, keine Werbung, keine Auswertung. Die Hinweise laufen über einen kleinen eigenen Boten, der nur ein verschlüsseltes Päckchen weiterreicht und nichts davon lesen kann.',
        b: 'Auch der Bote sieht nur: „Für dieses Gerät, dieses Päckchen." Mehr nicht.',
      },
      {
        t: 'Der Notfall-Zettel',
        s: 'Unter Sicherheit steht „Für den Notfall". Dort steht in klaren Worten, was zu tun ist, wenn ein Gerät ausfällt — und was ihr JETZT tun solltet, damit nie beide ausfallen: den Kopplungscode einmal in einen Passwortmanager legen.',
        b: 'Beide Geräte weg und kein Code weggelegt? Dann ist der Raum weg. Das ist der Preis dafür, dass sonst niemand mitlesen kann.',
      },
      {
        t: 'Wenn ein Gerät verloren geht',
        s: 'Mit PIN: Der Finder sieht nichts. Eure Inhalte sind nicht weg — sie liegen in eurer Ablage, und ein neues Gerät kommt mit dem Kopplungscode wieder hinein. Über „Diesen Raum vom Gerät nehmen" räumt ihr ein Gerät ab, ohne dem anderen etwas zu nehmen.',
        b: 'Vorsorge in zwei Sekunden: eine PIN setzen.',
      },
    ],
  },

  {
    gruppe: 'Einstellen',
    bild: 'schloss',
    wort: 'Modus, Bausteine, Aussehen, Sicherheit, Räume.',
    eintraege: [
      {
        t: 'Wie ihr spielt',
        s: 'Drei Weisen: „Sie führt", „Auf Augenhöhe" (niemand führt, beide haben denselben Knopf) und „Er führt". Wechseln geht nur, wenn beide zustimmen — einer schlägt vor, der andere bestätigt auf dem eigenen Gerät.',
        b: 'Ihr → Einstellungen → Wie ihr spielt. Nichts geht dabei verloren: Alles Angelegte bleibt liegen.',
      },
      {
        t: 'Die Bausteine',
        s: 'Ganze Bereiche einzeln an- und ausschalten: Laden, Tagesaufgaben, Frage des Tages, Glückskeks, Wenn—Dann. Abschalten heißt ruhen — alle Stände bleiben, wo sie sind.',
        e: 'Was die App anbietet, entscheidet sie unter Verwaltung → Bausteine.',
        b: 'Zu viel auf einmal? Schalte drei Bausteine aus und in zwei Wochen wieder an.',
      },
      {
        t: 'Der Vorrat',
        s: 'Hunderte fertige Karten, Räder, Szenarien und Skripte — mit einer Obergrenze für die Intensität, die du setzt. Was darüber liegt, existiert für die App schlicht nicht.',
        b: 'Obergrenze 3 einstellen: Alles Härtere taucht nirgendwo mehr auf.',
      },
      {
        t: 'Was zuletzt dazukam',
        s: 'Diese App ändert sich oft. Nach jeder neuen Fassung zeigt sie einmal, was dazugekommen ist — und unter Die App lässt sich das jederzeit nachlesen.',
        b: 'Wenn plötzlich etwas anders aussieht: erst dort nachsehen, dann rätseln.',
      },
      {
        t: 'Aussehen',
        s: 'Fünf Farbwelten (Glut, Rosé, Gold, Jade, Mitternacht), ein wählbares App-Symbol — auch harmlose, die nach Notizen, Rechner oder Wetter aussehen — und die Nachtabsenkung, die die App abends wärmer und dunkler macht.',
        b: 'iOS friert das Symbol beim Hinzufügen ein: einmal vom Home-Bildschirm nehmen und neu hinzufügen.',
      },
      {
        t: 'Sicherheit',
        s: 'Eine PIN sperrt die App (dann liegt der Schlüssel nur verschlossen auf dem Gerät), eine Schließzeit sperrt sie nach Pausen von selbst, und die Tarnung verwandelt sie in Notizen.',
        b: 'Ohne PIN kann jeder, der dein Handy in die Hand bekommt, alles lesen. Mit PIN niemand.',
      },
      {
        t: 'Räume',
        s: 'Ein Raum ist eine eigene Welt: eigener Schlüssel, eigene Ablage, eigene PIN. Zum Proben — oder für euch.',
        b: 'Der Proberaum bleibt Probe. Ins „Wir" gehört nur, was wirklich euch gehört.',
      },
      {
        t: 'Hinweise',
        s: 'Damit etwas ankommt, während die App zu ist, braucht es zwei Dinge: Die App muss auf dem Home-Bildschirm liegen (nicht im Browser laufen), und die Hinweise müssen erlaubt sein.',
        b: 'Ich → Hinweise → einschalten. Ohne das bleibt es still.',
      },
    ],
  },
];

/* --- Die Fragen ----------------------------------------------------------- */

const FAQ = [
  {
    gruppe: 'Erste Fragen',
    fragen: [
      {
        f: 'Sieht das jemand außer uns?',
        a: 'Nein. Alles, was ihr schreibt, wird auf eurem Gerät verschlüsselt und erst dann gespeichert. Wer die Datenbank öffnete, sähe Buchstabensalat. Der Schlüssel liegt nur auf euren beiden Geräten — nirgendwo sonst, auch nicht bei mir.',
      },
      {
        f: 'Was, wenn ich mein Handy verliere?',
        a: 'Mit PIN: Wer es findet, sieht nichts. Ohne PIN sieht er alles — deshalb lohnt die PIN. Deine Inhalte sind nicht weg: Sie liegen in eurer gemeinsamen Ablage, und ein neues Gerät kommt mit dem Kopplungscode wieder hinein.',
      },
      {
        f: 'Warum kommen keine Hinweise an?',
        a: 'Fast immer einer von zwei Gründen: Die App läuft im Browser statt vom Home-Bildschirm (iOS erlaubt Hinweise nur der installierten App), oder die Erlaubnis fehlt. Beides regelt sich unter Ich → Hinweise.',
      },
      {
        f: 'Muss ich alles benutzen?',
        a: 'Auf keinen Fall. Fangt mit dem Chat, dem Knopf und der Tagesaufgabe an. Alles andere kann unter Verwaltung → Bausteine ruhen, bis ihr Lust darauf habt.',
      },
      {
        f: 'Kostet das etwas?',
        a: 'Nein. Die App gehört euch, läuft auf euren Geräten und speichert in eurer eigenen Ablage. Es gibt keine Konten, keine Werbung, niemanden, der mitliest.',
      },
    ],
  },
  {
    gruppe: 'Wenn etwas klemmt',
    fragen: [
      {
        f: 'Etwas Geschriebenes ist nicht angekommen.',
        a: 'Die App speichert auch ohne Netz und schickt später von selbst nach. Wenn ihr weit auseinander wart, hilft es, beide Apps einmal zu öffnen. Beim nächsten Öffnen geht die Warteschlange raus.',
      },
      {
        f: 'Die App sieht plötzlich anders aus.',
        a: 'Wahrscheinlich hat sich die Stimmung geändert (abends wird sie wärmer und dunkler) oder jemand hat die Farbwelt gewechselt. Beides steht unter Ich → Die App.',
      },
      {
        f: 'Ich sehe die Notizen-App statt EMBER.',
        a: 'Das ist die Tarnung — drei schnelle Tipps auf die Notizliste holen alles zurück. Sie bleibt auch nach einem Neustart aktiv, damit niemand versehentlich enttarnt.',
      },
      {
        f: 'Etwas hängt oder wirkt eingefroren.',
        a: 'Die App einmal schließen und neu öffnen. Hilft das nicht: Ich → Die App → Nach einer neuen Fassung sehen. Unter „Letzte Fehler" steht, was schiefging.',
      },
      {
        f: 'Wir sehen unterschiedliche Dinge.',
        a: 'Meistens hat ein Gerät eine ältere Fassung. Beide aktualisieren (Ich → Aktualisieren), dann stimmt es wieder. Prüft auch, ob ihr im selben Raum seid — der Name steht unter dem EMBER-Schriftzug.',
      },
    ],
  },
  {
    gruppe: 'Über uns zwei',
    fragen: [
      {
        f: 'Was, wenn Kevin etwas nicht will?',
        a: 'Dann sagt er es — im Gespräch, über seine Ampel oder über den Notausgang. Die App nimmt Gelb und Rot ernst: Bei Gelb fällt das Härteste weg, bei Rot hält alles an, und es wird nie ein Bußgeld berechnet. Keine Erklärung nötig.',
      },
      {
        f: 'Was, wenn Gioia gerade keine Lust hat zu führen?',
        a: 'Dann ruht es. Es gibt keine Pflicht, den Knopf zu drücken, keinen Zähler, der sie erinnert. Wenn es länger nicht passt, gibt es „Auf Augenhöhe" — dort führt niemand, und alles Angelegte bleibt für später liegen.',
      },
      {
        f: 'Kann einer den Modus heimlich umstellen?',
        a: 'Nein. Ein Wechsel muss vorgeschlagen und auf dem anderen Gerät bestätigt werden. Bis dahin ändert sich gar nichts — und der Vorschlag ist auf beiden Seiten sichtbar.',
      },
      {
        f: 'Was passiert bei einem Streit?',
        a: 'Dafür gibt es die Reparatur (Ich → Für uns). Drei ruhige Schritte, die beide freigeben müssen. Dort zählt nichts, wird nichts berechnet und geht keine Serie kaputt.',
      },
      {
        f: 'Wird das mit der Zeit langweilig?',
        a: 'Dagegen ist einiges eingebaut: Der Vorrat hat mehr Karten, als ihr in Monaten zieht, der Baukasten würfelt über eine Milliarde Kombinationen, und die Pfade und Bosse wachsen mit. Und was langweilig wird, schaltet ihr einfach aus.',
      },
      {
        f: 'Was, wenn wir aufhören wollen?',
        a: 'Dann hört ihr auf. „Alles auf Anfang" leert den gemeinsamen Bestand, und „Diesen Raum vom Gerät nehmen" löscht ihn vom Handy. Die App gehört euch — auch die Entscheidung, sie wegzulegen.',
      },
    ],
  },
  {
    gruppe: 'Für den Anfang',
    fragen: [
      {
        f: 'Womit fangen wir am besten an?',
        a: 'Mit dreien: Schreibt euch im Chat. Drückt einmal den großen Knopf. Und macht die Tagesaufgabe. Alles andere darf wochenlang unentdeckt bleiben — die App wird nicht ungeduldig.',
      },
      {
        f: 'Wie viel Zeit kostet das am Tag?',
        a: 'So viel ihr wollt. Zwei Minuten reichen: Aufgabe ansehen, Frage des Tages beantworten, Keks knacken. Mehr geht immer, muss aber nie.',
      },
      {
        f: 'Was, wenn wir etwas kaputt machen?',
        a: 'Könnt ihr praktisch nicht. Gelöschtes ist gelöscht, aber alles andere lässt sich ändern, abschalten oder zurücksetzen. Und „Alles auf Anfang" räumt notfalls den ganzen gemeinsamen Bestand weg, ohne die Einrichtung anzufassen.',
      },
      {
        f: 'Müssen wir uns an das halten, was die App sagt?',
        a: 'Nein. Die App macht Vorschläge und führt Buch — sie hat keine Macht, die ihr ihr nicht gebt. Jede Karte darf weggelegt, jeder Auftrag zurückgezogen, jede Regel gestrichen werden.',
      },
      {
        f: 'Kann Gioia sehen, wenn Kevin die App öffnet?',
        a: 'Nicht direkt. Sie sieht, was er tut: erledigte Aufgaben, gesendete Nachrichten, gestellte Bitten. Es gibt keine „zuletzt online"-Anzeige und keinen Lesestatus — das war Absicht.',
      },
    ],
  },
  {
    gruppe: 'Genauer nachgefragt',
    fragen: [
      {
        f: 'Was ist der Unterschied zwischen Auftrag, Regel und Ritual?',
        a: 'Ein Auftrag ist einmalig oder wiederkehrend und wird abgehakt. Eine Regel gilt dauerhaft im Hintergrund und wird nicht abgehakt. Ein Ritual ist etwas Freiwilliges, das eine Serie aufbaut.',
      },
      {
        f: 'Wofür gibt es Münzen — und wofür Siegel?',
        a: 'Münzen fließen: verdient, ausgegeben, verzinst, geschwunden. Siegel sind selten und stehen still: nur für Meilensteine, nie käuflich, sie verfallen nie. Nur sie zahlen „Das Große".',
      },
      {
        f: 'Warum sehe ich seine Aufgabe, er meine aber nicht?',
        a: 'Weil das Gefälle Teil des Spiels ist: Wer führt, sieht mehr. Im Modus „Auf Augenhöhe" sehen beide dasselbe.',
      },
      {
        f: 'Wie funktioniert das mit den Räumen genau?',
        a: 'Jeder Raum ist eine eigene Welt mit eigenem Schlüssel und eigener Ablage. Der Wechsel startet die App neu. Ein Raum, den ihr vom Gerät nehmt, bleibt in der Ablage bestehen und kommt mit dem Kopplungscode wieder.',
      },
      {
        f: 'Was ist der Vorrat und woher kommt er?',
        a: 'Eine Sammlung fertiger Inhalte, die mitgeliefert wird, damit die App nicht leer startet. Ihr könnt die Intensität deckeln oder alles abschalten. Eure eigenen Einträge liegen daneben und werden immer bevorzugt.',
      },
      {
        f: 'Was heißt „der Wächter" und warum brauche ich das nicht zu wissen?',
        a: 'Manches muss genau einmal passieren — der Zahltag etwa. Damit das nicht auf beiden Geräten doppelt läuft, rechnet immer dasselbe Gerät. Ihr merkt davon nichts; es steht hier nur der Vollständigkeit halber.',
      },
      {
        f: 'Was passiert, wenn wir den Modus wechseln — verlieren wir etwas?',
        a: 'Nichts. Aufträge, Regeln, Buch, Münzen, Pfade, Auszeichnungen: alles bleibt liegen. Im Modus „Auf Augenhöhe" ruhen nur die Bereiche, die ohne Gefälle sinnlos wären — sie sind nach einem Rückwechsel unverändert da.',
      },
      {
        f: 'Warum sehen wir manchmal unterschiedliche Zeiten?',
        a: 'Alle Uhren rechnen aus derselben Startzeit in der Ablage, damit beide Geräte im Takt bleiben. Weicht die Uhrzeit eines Handys stark ab, kann es um ein paar Sekunden verschoben wirken — die Reihenfolge stimmt trotzdem immer.',
      },
      {
        f: 'Funktioniert die App ohne Internet?',
        a: 'Fast vollständig. Sie speichert, was ihr tut, und schickt es beim nächsten Netz von selbst nach. Nur Echtzeit — sehen, was der andere gerade tut — braucht eine Verbindung. Sehr Altes aus der Warteschlange (über einen Tag) wird verworfen, damit nichts Längst-Gelöschtes zurückkehrt.',
      },
      {
        f: 'Warum steht mein Name manchmal als „Sie" oder „Er" da?',
        a: 'Dann kennt das Gerät die Namen noch nicht — meist kurz nach der Einrichtung oder bei einem Raumwechsel. Unter Verwaltung → Namen lässt sich das jederzeit setzen.',
      },
    ],
  },
];

/* --- Die Seite ------------------------------------------------------------- */

/* Was für die eigene Sicht gilt: Führende lesen s, Folgende e, und wo
   nur eins von beiden dasteht, gilt es für alle. */
function _hbText(e) {
  const fuehrend = istDomme();
  const haupt = fuehrend ? (e.s || e.e) : (e.e || e.s);
  const beispiel = fuehrend ? (e.bs || e.b) : (e.be || e.b);
  return { haupt, beispiel };
}

function _hbPasst(gruppe) {
  if (gruppe.nurFuehrend && !gefaelleAn()) return false;
  if (gruppe.nurMitLaden && typeof ladenAn === 'function' && !ladenAn()) return false;
  return true;
}

SEITEN.handbuch = function (seite) {
  seite.append(kopfzeile('Das Handbuch',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '14px', lineHeight: '1.55' } },
    'Alles, was diese App kann — in Ruhe erklärt, mit Beispielen. ' +
    'Such nach einem Wort oder blättere durch die Kapitel. Ganz unten stehen die Fragen und Antworten.'));

  const suche = el('input', {
    class: 'feld', type: 'search', placeholder: 'Suchen … (z. B. Ampel, Münzen, Tarnung)',
    autocapitalize: 'off', autocorrect: 'off',
    oninput: () => zeichnen(suche.value.trim()),
  });
  seite.append(suche);

  const platz = el('div', { style: { marginTop: '14px' } });
  seite.append(platz);

  function zeichnen(wort = '') {
    platz.innerHTML = '';
    const suchWort = wort.toLowerCase();

    if (suchWort.length >= 2) {
      /* Suche: quer über Handbuch UND Fragen, ohne Kapitel-Umweg. */
      const treffer = [];
      HANDBUCH.filter(_hbPasst).forEach((g) => {
        g.eintraege.forEach((e) => {
          const { haupt, beispiel } = _hbText(e);
          const heuhaufen = (e.t + ' ' + haupt + ' ' + (beispiel || '') + ' ' + g.gruppe).toLowerCase();
          if (heuhaufen.includes(suchWort)) treffer.push({ art: 'eintrag', g, e });
        });
      });
      FAQ.forEach((g) => {
        g.fragen.forEach((q) => {
          if ((q.f + ' ' + q.a).toLowerCase().includes(suchWort)) treffer.push({ art: 'frage', g, q });
        });
      });

      if (!treffer.length) {
        platz.append(leerlauf('Nichts gefunden',
          'Versuch ein anderes Wort — oder blättere durch die Kapitel, wenn du das Suchfeld leerst.'));
        return;
      }

      platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } },
        treffer.length + (treffer.length === 1 ? ' Fund' : ' Funde')));
      treffer.slice(0, 40).forEach((t) => {
        platz.append(t.art === 'eintrag'
          ? _hbKarte(t.e, t.g.gruppe)
          : _faqKarte(t.q, t.g.gruppe));
      });
      return;
    }

    /* Ohne Suche: die Kapitel als Klappen, jedes mit seinen Einträgen. */
    HANDBUCH.filter(_hbPasst).forEach((g) => {
      platz.append(klappGruppe('hb-' + g.gruppe, g.bild, g.gruppe, g.wort,
        ...g.eintraege.map((e) => _hbKarte(e))));
    });

    platz.append(el('div', { class: 'trenner' }));
    platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Fragen und Antworten'));
    FAQ.forEach((g) => {
      platz.append(klappGruppe('faq-' + g.gruppe, 'plausch', g.gruppe, g.fragen.length + ' Fragen',
        ...g.fragen.map((q) => _faqKarte(q))));
    });

    platz.append(el('p', { class: 'still klein mitte', style: { padding: '20px 0 10px', lineHeight: '1.6' } },
      'Etwas fehlt hier? Dann fehlt es wirklich — schreibt es auf, und es kommt hinein.'));
  }

  zeichnen();
};

function _hbKarte(e, gruppenName) {
  const { haupt, beispiel } = _hbText(e);
  return el('div', { class: 'karte', style: { marginTop: '9px', padding: '13px 15px' } },
    gruppenName ? el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, gruppenName) : null,
    el('div', { class: 'zier', style: { fontSize: '16.5px', marginBottom: '5px' } }, e.t),
    el('p', { class: 'leise klein', style: { lineHeight: '1.6' } }, haupt),
    beispiel ? el('div', {
      style: {
        marginTop: '10px', padding: '9px 12px', borderRadius: 'var(--rund-klein)',
        background: 'var(--grund2)', borderLeft: '3px solid var(--glut)',
      },
    },
      el('p', { class: 'winzig still', style: { marginBottom: '2px' } }, 'Zum Beispiel'),
      el('p', { class: 'leise klein', style: { lineHeight: '1.5' } }, beispiel)
    ) : null
  );
}

function _faqKarte(q, gruppenName) {
  return el('div', { class: 'karte', style: { marginTop: '9px', padding: '13px 15px' } },
    gruppenName ? el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, gruppenName) : null,
    el('div', { style: { fontWeight: '600', marginBottom: '5px', lineHeight: '1.4' } }, q.f),
    el('p', { class: 'leise klein', style: { lineHeight: '1.6' } }, q.a)
  );
}
