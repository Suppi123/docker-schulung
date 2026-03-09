# Übung 8: Foto-Management-Stack – Lösung (PhotoPrism + FileBrowser + Nginx)

In dieser Bonusübung bauen wir einen praxisnahen Multi-Container-Stack aus drei Services.  
Das Setup zeigt anhand eines konkreten Anwendungsfalls, **wann Named Volumes sinnvoll sind und wann Bind Mounts die bessere Wahl darstellen** – und kombiniert beides im selben Projekt.  
Zusätzlich demonstriert es Netzwerk-Isolation: zwei getrennte interne Netzwerke verhindern, dass PhotoPrism und FileBrowser direkt miteinander kommunizieren können.

---

## Architektur

```
Host-System
    │
    └── Port 8080
           │
      ┌────▼─────┐
      │  nginx   │  ← einziger nach außen erreichbarer Service
      └──┬────┬──┘
         │    │
  Netzwerk    Netzwerk
  „photos"    „files"
         │    │
    ┌────▼┐  ┌▼──────────┐
    │Photo│  │FileBrowser│
    │Prism│  │:80        │
    │:2342│  └────┬──────┘
    └──┬──┘       │
       │  Bind    │  Bind
       │  Mount   │  Mount
       └────┬─────┘
            │
     ./photos/  (Host-Verzeichnis)
```

PhotoPrism und FileBrowser sind in **getrennten Netzwerken** – sie können sich gegenseitig nicht erreichen, obwohl sie dasselbe Bind-Mount-Verzeichnis teilen.

| URL                          | Service       |
|------------------------------|---------------|
| http://localhost:8080/photos/ | PhotoPrism   |
| http://localhost:8080/files/  | FileBrowser  |

---

## Volumes vs. Bind Mounts in diesem Setup

Dieses Setup nutzt **beide Arten der Datenpersistenz bewusst** für unterschiedliche Zwecke:

### Bind Mount: `./photos`

Das Verzeichnis `photos/` auf dem Host wird in **beide** Container eingebunden:

- → `/photoprism/originals` in PhotoPrism
- → `/srv` in FileBrowser

**Warum Bind Mount?**

- Die Foto-Dateien sollen vom Host aus direkt zugänglich bleiben (Backup, rsync, eigene Tools)
- Beide Anwendungen sollen auf **denselben Datenbestand** zugreifen
- Der Benutzer möchte wissen und kontrollieren, wo seine Dateien liegen
- Dateien, die über FileBrowser hochgeladen werden, erscheinen sofort in PhotoPrism (nach einem Index-Scan)

### Named Volume: `photoprism_storage`

PhotoPrisms interne Daten (SQLite-Datenbank, Thumbnails, Gesichtserkennung, Cache) liegen in einem Named Volume.

**Warum Named Volume?**

- Diese Daten sind **Anwendungsinterna** – der Benutzer greift nie direkt darauf zu
- Docker verwaltet Speicherort und Berechtigungen automatisch
- Beim `docker compose down` bleiben die Daten erhalten; der Index muss nicht neu aufgebaut werden
- Der konkrete Speicherort auf dem Host ist irrelevant

### Named Volume: `filebrowser_data`

FileBrowsers SQLite-Datenbank (Benutzer, Einstellungen) liegt ebenfalls in einem Named Volume – aus denselben Gründen wie bei PhotoPrism.

---

## Netzwerk-Isolation

Nur nginx hat ein Port-Mapping (`8080:80`) und ist damit vom Host erreichbar.  
PhotoPrism und FileBrowser sind **ausschließlich im internen Docker-Netzwerk** erreichbar –  
von außen nicht direkt ansprechbar, auch wenn sie intern auf ihren Ports lauschen.

---

## Setup

### 1. Foto-Verzeichnis anlegen

```bash
mkdir photos
```

Das Verzeichnis wird von beiden Anwendungen als Bind Mount verwendet.

### 2. Stack starten

```bash
docker compose up -d
```

PhotoPrism braucht beim ersten Start etwas Zeit (~30–60 Sekunden), um seine Datenbank zu initialisieren.

### 3. Logs beobachten

```bash
docker compose logs -f
```

Sobald PhotoPrism `"http server running"` meldet, ist es bereit.

### 4. Im Browser öffnen

| Anwendung    | URL                            | Zugangsdaten        |
|--------------|--------------------------------|---------------------|
| PhotoPrism   | http://localhost:8080/photos/  | admin / insecure    |
| FileBrowser  | http://localhost:8080/files/   | admin / insecure    |

---

## Erkundungsaufgaben

### Aufgabe 1: Datei-Synchronisation beobachten

1. Lade über **FileBrowser** (`/files/`) ein Foto hoch
2. Wechsle zu **PhotoPrism** (`/photos/`)
3. Starte einen Index-Scan: *Library → Index*
4. Das Foto sollte nun in PhotoPrism erscheinen

Beide Anwendungen greifen auf dasselbe `photos/`-Verzeichnis zu – dank Bind Mount.

### Aufgabe 2: Bind Mount vom Host aus verifizieren

```bash
# Datei direkt auf dem Host im Verzeichnis ablegen
cp /irgendein/foto.jpg ./photos/

# In PhotoPrism nach einem Index-Scan sichtbar
# In FileBrowser sofort im Browser sichtbar
```

### Aufgabe 3: Named Volume inspizieren

```bash
# Wo liegt das Named Volume auf dem Host?
docker volume inspect 8_bonus_loesung_photoprism_storage

# Inhalt des Volumes (als root) ansehen
docker run --rm -v 8_bonus_loesung_photoprism_storage:/data alpine ls -la /data
```

Vergleiche: Bei einem Bind Mount weißt du genau wo die Daten liegen.  
Bei einem Named Volume verwaltet Docker den Speicherort – `docker volume inspect` verrät ihn.

### Aufgabe 4: Port-Isolation prüfen

```bash
# PhotoPrism ist von außen NICHT direkt erreichbar (kein Port-Mapping):
curl http://localhost:2342   # → Connection refused

# Nur über nginx erreichbar:
curl http://localhost:8080/photos/   # → funktioniert
```

### Aufgabe 5: Netzwerk-Isolation prüfen

PhotoPrism und FileBrowser sind in getrennten Netzwerken und können sich gegenseitig nicht erreichen:

```bash
# Shell in PhotoPrism-Container öffnen
docker compose exec photoprism sh

# Versuch, FileBrowser direkt anzusprechen → schlägt fehl
wget -q --spider http://filebrowser   # → Name or service not known
exit
```

```bash
# Zum Vergleich: nginx kann beide Services erreichen
docker compose exec nginx sh
wget -q --spider http://photoprism:2342   # → funktioniert (nginx ist im „photos"-Netz)
wget -q --spider http://filebrowser       # → funktioniert (nginx ist im „files"-Netz)
exit
```

### Aufgabe 6: Nginx als Router verstehen

Schau dir `nginx/nginx.conf` an und beantworte:
- Warum hat `proxy_pass http://photoprism:2342` keinen trailing slash?
- Warum wird WebSocket-Support nur für PhotoPrism, nicht für FileBrowser benötigt?
- Was passiert, wenn du `http://localhost:8080/` (ohne Pfad) aufrufst?

---

## Aufräumen

```bash
# Stack stoppen und Container + Netzwerke entfernen
docker compose down

# Auch Named Volumes löschen (Achtung: Index-Daten gehen verloren)
docker compose down -v

# Foto-Verzeichnis manuell löschen (liegt auf dem Host, wird nie automatisch gelöscht)
rm -rf ./photos
```

> **Wichtig:** `docker compose down -v` löscht Named Volumes – also den PhotoPrism-Index  
> und die FileBrowser-Datenbank. Das `photos/`-Verzeichnis (Bind Mount) bleibt erhalten,  
> weil es sich auf dem Host befindet und Docker darüber keine Kontrolle hat.

---

## Was dieses Setup lehrt

| Konzept | Wo zu sehen |
|---------|-------------|
| Bind Mount für geteilte Nutzerdaten | `./photos` in zwei Containern gleichzeitig |
| Named Volume für App-interne Daten | `photoprism_storage`, `filebrowser_data` |
| Service-Isolation via Port-Mapping | Nur nginx hat `ports:` definiert |
| Netzwerk-Isolation (Least Privilege) | `photos`- und `files`-Netzwerk trennen die Backends |
| nginx als Hub in zwei Netzwerken | nginx in `photos` + `files`, Backends je nur in einem |
| Pfad-basiertes Routing mit nginx | `/photos/` vs. `/files/` |
| Subpath-Konfiguration in Apps | `PHOTOPRISM_SITE_URL`, `FB_BASEURL` |
