# Einen einfachen Webserver starten

`docker build -t simple-webserver .`

`docker run -d -p 80:80 --name simple-webserver simple-webserver`