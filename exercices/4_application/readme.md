# Container starten
In dieser Übung bauen und starten wir verschiedene Container, die über ein Netzwerk miteinander kommunizieren können.

## Ein Docker Netzwerk erstellen
Ein neues Netzwerk mit dem Namen my-network erstellen:

`docker network create my-network`

Prüfen ob das Netzwerk erstellt wurde:

`docker network ls`

## Datenbank
### Die Datenbank starten
```
docker run -d \
    --name db \
    --network my-network \
    -e POSTGRES_PASSWORD=foobarbaz \
    -v pgdata:/var/lib/postgresql/data \
    -p 5432:5432 \
    postgres:15.1-alpine
```

## Node API
### Den Node API Container bauen
`docker build -t api-node ./api-node/`

### Den Node API Container starten
```
docker run -d \
  --name api-node \
  --network my-network \
  -e DATABASE_URL=postgres://postgres:foobarbaz@db:5432/postgres \
  -p 3000:3000 \
  api-node
```

## Golang API
### Den Golang API Container bauen
`docker build -t api-golang ./api-golang`

### Den Golang API Container starten
```
docker run -d \
  --name api-golang \
  --network my-network \
  -e DATABASE_URL=postgres://postgres:foobarbaz@db:5432/postgres \
  -p 8080:8080 \
  api-golang
```

## Vite/Nginx
### Den Vite/Nginx Client bauen
`docker build -t client-react-nginx ./client-react`

### Den Vite/Nginx Client starten
```
docker run -d \
	--name client-react-nginx \
    --network my-network \
	-p 80:8080 \
	client-react-nginx
```

## Aufräumen
Alle Container stoppen:

`docker stop db api-node api-golang client-react-nginx`

Alle Container entfernen:

`docker rm db api-node api-golang client-react-nginx`

Das Netzwerk entfernen:

`docker network rm my-network`

Ein vollständiges Aufräumen des Systems ist möglich mit:

`docker system pune -a`