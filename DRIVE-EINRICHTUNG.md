# Google Drive einrichten

Damit sich Nutzer mit ihrem eigenen Google Drive verbinden können, braucht die App einmalig eine **Client-ID** von Google. Die legt nur der Betreiber der App an. Die Nutzer selbst müssen nichts einrichten, sie tippen nur auf „Mit Google Drive verbinden“.

Dauer: etwa 10 Minuten. Kosten: keine.

> Google benennt Menüpunkte in der Cloud Console gelegentlich um. Wenn ein Name nicht genau passt, hilft die Suchleiste oben in der Console.

## Voraussetzung: Die App ist online erreichbar

Die App muss unter einer festen `https://`-Adresse laufen, zum Beispiel über GitHub Pages:

1. Im Repository auf GitHub **Settings → Pages** öffnen.
2. Bei „Source“ **Deploy from a branch** wählen, Branch **main**, Ordner **/ (root)**, dann **Save**.
3. Nach ein bis zwei Minuten läuft die App unter `https://edgust.github.io/Digitales_Plattenregal/`.

## 1. Projekt anlegen

1. [console.cloud.google.com](https://console.cloud.google.com) öffnen und mit dem eigenen Google-Konto anmelden.
2. Oben links auf die Projektauswahl klicken, dann **Neues Projekt**.
3. Name: `Plattenregal`, dann **Erstellen**. Danach sicherstellen, dass dieses Projekt oben ausgewählt ist.

## 2. Google Drive API einschalten

1. Im Menü **APIs & Dienste → Bibliothek** öffnen.
2. Nach **Google Drive API** suchen, anklicken, dann **Aktivieren**.

## 3. Zustimmungsbildschirm einrichten

1. Im Menü **Google Auth Platform** öffnen (früher: „OAuth-Zustimmungsbildschirm“) und auf **Jetzt starten** klicken.
2. App-Name: `Plattenregal`, Support-E-Mail: die eigene Adresse.
3. Zielgruppe: **Extern**.
4. Kontaktdaten: die eigene E-Mail-Adresse. Den Richtlinien zustimmen und **Erstellen**.

## 4. Berechtigung festlegen

1. In der Google Auth Platform **Datenzugriff** öffnen.
2. **Bereiche hinzufügen oder entfernen**, dann nach `drive.file` suchen und den Bereich
   `https://www.googleapis.com/auth/drive.file` („Dateien in Google Drive, die mit dieser App verwendet werden“) anhaken.
3. **Aktualisieren**, dann **Speichern**.

Mit diesem Bereich sieht die App nur die Dateien, die sie selbst angelegt hat, nichts anderes im Drive.

## 5. Testnutzer eintragen

1. **Zielgruppe** öffnen.
2. Unter **Testnutzer** auf **Add users** klicken und die eigene Gmail-Adresse eintragen. Weitere Personen kann man hier ebenfalls eintragen, bis zu 100.

Solange die App im Testmodus ist, können sich nur diese Personen verbinden.

## 6. Client-ID erstellen

1. **Clients** öffnen, dann **Client erstellen**.
2. Anwendungstyp: **Webanwendung**, Name: `Plattenregal Web`.
3. Unter **Autorisierte JavaScript-Quellen** auf **URI hinzufügen** klicken und eintragen:
   `https://edgust.github.io`
   Wichtig: nur die Adresse ohne Pfad und ohne Schrägstrich am Ende.
4. Die **Weiterleitungs-URIs** bleiben leer.
5. **Erstellen**. Die angezeigte Client-ID sieht etwa so aus:
   `123456789012-abc123def456.apps.googleusercontent.com`

Bis die neue Client-ID überall funktioniert, können ein paar Minuten vergehen.

## 7. Client-ID in die App eintragen

In `index.html` diese Zeile suchen:

```js
const GOOGLE_CLIENT_ID = '';
```

und die Client-ID zwischen die Anführungszeichen setzen:

```js
const GOOGLE_CLIENT_ID = '123456789012-abc123def456.apps.googleusercontent.com';
```

Das geht direkt auf GitHub: Datei öffnen, auf den Stift klicken, ändern, **Commit changes**. Alternativ die Client-ID an Claude schicken.

Die Client-ID ist kein Geheimnis. Sie darf öffentlich im Code stehen.

Danach in der App die **Einstellungen** öffnen und **Mit Google Drive verbinden** antippen.

## 8. Für alle Nutzer freigeben (optional)

Im Testmodus können sich nur die eingetragenen Testnutzer verbinden. Damit jeder die App nutzen kann:

1. In **Branding** eintragen:
   - Startseite der App: `https://edgust.github.io/Digitales_Plattenregal/`
   - Link zur Datenschutzerklärung: `https://edgust.github.io/Digitales_Plattenregal/datenschutz.html`
   - Autorisierte Domain: `edgust.github.io`
2. Die Domain bei Google bestätigen: In der [Google Search Console](https://search.google.com/search-console) die Property `https://edgust.github.io/` mit der Methode „HTML-Datei“ hinzufügen. Die heruntergeladene Datei (`google….html`) in das Repository hochladen, sodass sie unter `https://edgust.github.io/` erreichbar ist.
   Das muss ein Repository namens `edgust.github.io` sein: Dateien aus `Digitales_Plattenregal` liegen unter `/Digitales_Plattenregal/` und zählen hierfür nicht.
3. In **Zielgruppe** auf **App veröffentlichen** klicken.

`drive.file` gilt bei Google als nicht sensibler Bereich. Deshalb ist keine aufwendige Sicherheitsprüfung nötig. Falls Google bei der Veröffentlichung trotzdem eine Überprüfung des Brandings verlangt, führt die Console durch die nötigen Schritte.

## Gut zu wissen

- **Jeder Nutzer hat sein eigenes Regal** im eigenen Google Drive. Der Betreiber sieht davon nichts.
- **Anmeldung:** Eine Google-Anmeldung gilt etwa eine Stunde. Danach zeigt die App oben neben der Plattenanzahl „Drive: anmelden“. Ein Tippen darauf genügt, meist ohne erneute Passworteingabe. Gespeichert wird immer sofort auf dem Gerät, abgeglichen wird beim nächsten Anmelden.
- **iPhone:** Startet die App vom Homescreen, kann das Google-Anmeldefenster hakeln. Dann die App einmal in Safari öffnen und dort verbinden.
- **Verbindung trennen** in den Einstellungen löscht nichts: Die Platten bleiben auf dem Gerät und in Google Drive.
