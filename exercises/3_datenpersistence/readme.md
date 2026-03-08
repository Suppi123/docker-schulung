# Datenpersistenz

## Anwendungen im Container installieren

Einen Ubuntu-Container starten und `ping` installieren:

```
docker run --interactive --tty --rm ubuntu:22.04

ping google.com -c 1 # Schlägt fehl: `bash: ping: command not found`

apt update
apt install iputils-ping --yes

ping google.com -c 1 # Funktioniert jetzt!
exit
```

Einen neuen Container starten und `ping` erneut aufrufen:

```
docker run -it --rm ubuntu:22.04
ping google.com -c 1 # Schlägt wieder fehl 🤔
```

## Ausgaben von Anwendungen persistieren

Eine Datei im Container anlegen:

```
docker run -it --rm ubuntu:22.04

mkdir my-data
echo "Hello from the container!" > /my-data/hello.txt

cat my-data/hello.txt
exit
```

Einen neuen Container starten und prüfen, ob die Datei noch vorhanden ist:

```
docker run -it --rm ubuntu:22.04

cat my-data/hello.txt # Fehler: `cat: my-data/hello.txt: No such file or directory`
```

### Volume Mounts

Ein benanntes Volume erstellen:

`docker volume create my-volume`

Einen Container starten und das Volume einbinden:

```
docker run -it --rm -v my-volume:/my-data ubuntu:22.04

echo "Hello from the container!" > /my-data/hello.txt
cat my-data/hello.txt
exit
```

Einen neuen Container starten und dasselbe Volume einbinden – diesmal mit der `--mount`-Syntax:

```
docker run -it --rm --mount source=my-volume,destination=/my-data/ ubuntu:22.04
cat my-data/hello.txt # Diesmal erfolgreich!
exit
```

### Bind Mounts

Einen Container starten und ein Verzeichnis vom Host-System einbinden:

```
# Lange Schreibweise mit --mount
docker run -it --rm --mount type=bind,source="${PWD}"/my-data,destination=/my-data ubuntu:22.04

# Kurze Schreibweise mit -v (bewirkt dasselbe)
docker run -it --rm -v ${PWD}/my-data:/my-data ubuntu:22.04

echo "Hello from the container!" > /my-data/hello.txt

# Die Datei ist jetzt auch auf dem Host-System sichtbar
cat my-data/hello.txt
exit
```
