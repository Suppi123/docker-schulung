# Presentation

Die Schulungsfolien basieren auf [Quarto](https://quarto.org/) mit dem `revealjs`-Format und werden als selbst-enthaltene HTML-Datei gerendert.

## Lokale Vorschau (ohne Docker)

Voraussetzung: [Quarto](https://quarto.org/docs/get-started/) ist lokal installiert.

```bash
# Präsentation rendern und im Browser öffnen
quarto preview docker.qmd
```

Die Folien werden unter `http://localhost:<port>` live im Browser gezeigt und bei Änderungen automatisch neu geladen.

Zum einmaligen Rendern ohne Live-Vorschau:

```bash
quarto render
# Ausgabe landet in _output/
```

## Serving mit Docker Compose

Die Präsentation lässt sich als Container betreiben. Das Setup verwendet ein **Multi-Stage-Build**:

1. **Build-Stage** – Quarto rendert `docker.qmd` zu einer selbst-enthaltenen HTML-Datei (`_output/`)
2. **Serve-Stage** – [Caddy](https://caddyserver.com/) liefert die statischen Dateien aus und übernimmt automatisch TLS via Let's Encrypt

### Voraussetzungen

- Docker & Docker Compose
- Eine öffentlich erreichbare Domain, die auf den Server zeigt (für automatisches HTTPS)
- Ports 80 und 443 müssen offen sein

### Setup

**1. `.env`-Datei anlegen**

```bash
cp .env.example .env
```

Die `.env` enthält eine Variable:

```env
DOMAIN=slides.example.com
```

`DOMAIN` auf die eigene Domain setzen, unter der die Präsentation erreichbar sein soll.

**2. Container bauen und starten**

```bash
docker compose up -d
```

Beim ersten Start:
- Quarto rendert die Folien im Build-Container
- Caddy holt automatisch ein TLS-Zertifikat für die angegebene Domain
- Die Präsentation ist anschließend unter `https://<DOMAIN>` erreichbar

**3. Logs prüfen**

```bash
docker compose logs -f
```

### Dateien im Überblick

| Datei | Beschreibung |
|---|---|
| `docker.qmd` | Hauptdatei der Präsentation (Quarto Markdown) |
| `_quarto.yml` | Quarto-Projektkonfiguration (revealjs, Output-Verzeichnis) |
| `Dockerfile` | Multi-Stage-Build: Quarto → Caddy |
| `Caddyfile` | Caddy-Konfiguration (statischer Dateiserver mit gzip/zstd) |
| `docker-compose.yml` | Compose-Setup mit Volumes für Caddy-Zertifikate |
| `.env.example` | Vorlage für die `.env`-Datei |

### Hinweise

- Die Caddy-Zertifikatsdaten werden in einem named Volume (`caddy_data`) persistiert, damit bei einem Neustart kein neues Zertifikat angefordert werden muss.
- Für lokale Tests ohne echte Domain kann `DOMAIN=localhost` gesetzt werden – Caddy liefert dann über HTTP aus.
- Das `.dockerignore` stellt sicher, dass bereits gerenderter Output (`_output/`) nicht in den Build-Kontext kopiert wird.
