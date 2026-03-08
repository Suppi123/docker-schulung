# Übung 8: Foto-Management-Stack (PhotoPrism + FileBrowser + Nginx)

Baue einen Multi-Container-Stack aus drei Services:

- **PhotoPrism** – Foto-Management-Anwendung mit Web-UI
- **FileBrowser** – webbasierter Dateimanager
- **Nginx** – einziger Service mit Port-Mapping zum Host; routet Anfragen an die anderen Services

Beide Anwendungen sollen dasselbe Verzeichnis für Fotos verwenden.  
Nginx ist bereits fertig konfiguriert – du musst nur die `docker-compose.yml` vervollständigen.

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
       └────┬─────┘
            │
     ./photos/  (gemeinsames Verzeichnis)
```

| URL                          | Service      |
|------------------------------|--------------|
| http://localhost:8080/photos/ | PhotoPrism  |
| http://localhost:8080/files/  | FileBrowser |

---

## Aufgaben

### 1. Foto-Verzeichnis anlegen

```bash
mkdir photos
```

### 2. `docker-compose.yml` vervollständigen

Ersetze alle `?` in der `docker-compose.yml`. Orientiere dich an folgenden Fragen:

#### Port
- Welcher Service soll auf Port `8080` des Hosts erreichbar sein?

#### depends_on
- nginx sollte erst starten, wenn beide Anwendungen bereit sind. Welche Services sind das?

#### Volumes – die zentrale Frage dieser Übung

Für jeden Volume-Eintrag musst du entscheiden: **Bind Mount** oder **Named Volume**?

| Frage | Antwort |
|-------|---------|
| Soll der Benutzer direkt auf die Daten zugreifen können (z. B. Fotos per Dateimanager oder `cp`)? | → Bind Mount |
| Sind es App-interne Daten, die Docker einfach irgendwo sicher ablegen soll (Index, Cache, Datenbank)? | → Named Volume |
| Sollen dieselben Dateien in **zwei verschiedenen Containern** sichtbar sein? | → Bind Mount auf dasselbe Host-Verzeichnis |

**Bind Mount Syntax:**
```yaml
- ./mein-verzeichnis:/pfad/im/container
```

**Named Volume Syntax:**
```yaml
- mein-volume:/pfad/im/container
```
Named Volumes müssen am Ende der Compose-Datei unter `volumes:` deklariert werden.

#### Netzwerke

Es gibt zwei getrennte Netzwerke: `photos` und `files`.

- Welcher Service muss in **beiden** Netzwerken sein, damit das Routing funktioniert?
- Warum ist es sinnvoll, dass PhotoPrism und FileBrowser **nicht im selben Netzwerk** sind?

#### Subpath-Konfiguration
Schau dir `nginx/nginx.conf` an. Nginx erwartet:
- PhotoPrism unter dem Pfad `/photos/`
- FileBrowser unter dem Pfad `/files/`

Beide Anwendungen müssen wissen, unter welchem Pfad sie erreichbar sind:
- `PHOTOPRISM_SITE_URL` – vollständige URL inkl. Pfad (z. B. `http://localhost:8080/photos/`)
- `--baseURL` – FileBrowser erhält den Pfad als Command-Flag (z. B. `"--baseURL", "/files"`)

### 3. Stack starten

```bash
docker compose up -d
```

PhotoPrism braucht beim ersten Start ~30–60 Sekunden. Logs beobachten:

```bash
docker compose logs -f
```

### 4. Ergebnis prüfen

| Anwendung   | URL                            | Zugangsdaten      |
|-------------|--------------------------------|-------------------|
| PhotoPrism  | http://localhost:8080/photos/  | admin / insecure  |
| FileBrowser | http://localhost:8080/files/   | admin / insecure  |

Teste: Lade über FileBrowser ein Foto hoch. Starte in PhotoPrism einen Index-Scan  
(*Library → Index*). Das Foto sollte erscheinen – beide Container greifen auf dasselbe Verzeichnis zu.

---

## Nützliche Befehle

```bash
# Logs anzeigen
docker compose logs -f

# Stack stoppen
docker compose stop

# Alles entfernen (Container + Netzwerke)
docker compose down

# Auch Named Volumes löschen
docker compose down -v
```
