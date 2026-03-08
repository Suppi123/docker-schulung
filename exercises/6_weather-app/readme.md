# Übung 6: Wetter-App mit Docker Compose

In dieser Übung bauen wir eine Wetter-App aus zwei Containern: einem Python-Backend (API-Proxy) und einem Frontend (HTML/JavaScript mit Nginx).

## Architektur

- **Backend**: Python/Flask-App, die die [Open-Meteo](https://open-meteo.com/)-API aufruft (kein API-Key nötig)
- **Frontend**: Statische HTML/JS-Seite, serviert von Nginx, die das Backend über einen Proxy aufruft

## Aufgaben

### 1. Backend-Container bauen

Erstelle ein `Dockerfile` im Ordner `backend/`, das:

- Ein Python-Image als Basis nutzt
- Die Abhängigkeiten aus `requirements.txt` installiert (`pip install --no-cache-dir -r requirements.txt`)
- Die Anwendung `app.py` kopiert
- Port 5000 exponiert

### 2. Frontend-Container bauen

Erstelle ein `Dockerfile` im Ordner `frontend/`, das:

- Ein Nginx-Alpine-Image als Basis nutzt
- Die statischen Dateien (`index.html`, `style.css`, `app.js`) und die Nginx-Konfiguration kopiert
- Port 80 exponiert

### 3. Docker Compose konfigurieren

Erstelle eine `docker-compose.yml`, die:

- Beide Services (`frontend` und `backend`) definiert
- Ein gemeinsames Netzwerk nutzt
- Den Frontend-Port 8080 auf dem Host exponiert
- Sicherstellt, dass das Frontend erst startet, wenn das Backend bereit ist (`depends_on`)

**Hinweis:** Die Nginx-Konfiguration im Frontend leitet Anfragen unter `/api/` an den Backend-Container weiter.

## Lösung ausführen

```bash
# Container bauen
docker compose build

# Anwendung starten
docker compose up -d

# Im Browser öffnen: http://localhost:8080
```

## Nützliche Befehle

```bash
# Logs anzeigen
docker compose logs -f

# Container stoppen
docker compose stop

# Alles entfernen
docker compose down
```
