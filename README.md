# Docker-Schulung

Dieses Repository enthaelt die Unterlagen und Praxisaufgaben fuer eine Docker-Schulung. Ziel ist es, die wichtigsten Docker-Grundlagen nicht nur theoretisch zu erklaeren, sondern direkt in kleinen, nachvollziehbaren Uebungen anzuwenden. Der Schwerpunkt liegt auf einem praxisnahen Einstieg in Images, Container, Dockerfiles, Persistenz, Netzwerke und Docker Compose.

## Ziel des Repos

Das Repo dient als gemeinsame Grundlage fuer eine Fortbildung oder Schulung zu Docker. Es kombiniert:

- Praesentationsmaterial fuer die Vermittlung der Konzepte
- praktische Uebungen fuer das direkte Ausprobieren
- kleine Beispielprojekte fuer realistische Compose- und Container-Setups

## Aufbau

### `presentation/`

Enthaelt die Schulungsfolien und zugehoerige Assets. Die Praesentation ist mit Quarto aufgebaut und behandelt die fachlichen Grundlagen, typische Docker-Workflows und Best Practices.

Wichtige Dateien:

- `presentation/docker.qmd`: Hauptdatei der Praesentation
- `presentation/_quarto.yml`: Quarto-Konfiguration
- `presentation/images/`: verwendete Bilder und Grafiken

### `exercises/`

Enthaelt die praktischen Aufgaben zur Schulung. Die Uebungen bauen inhaltlich aufeinander auf und decken verschiedene Themenbereiche ab, zum Beispiel:

- erster Einstieg mit `hello-world`
- eigene Images und Dockerfiles
- Datenpersistenz mit Volumes
- Netzwerke zwischen Containern
- Multi-Container-Anwendungen mit Docker Compose
- weiterfuehrende Beispielprojekte

## Hinweis

Die einzelnen Aufgaben enthalten jeweils eigene `readme.md`-Dateien mit den konkreten Schritten und Befehlen fuer die jeweilige Uebung.
