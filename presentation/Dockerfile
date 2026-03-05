# Stage 1: Build Quarto documents
FROM ghcr.io/quarto-dev/quarto:latest AS builder
WORKDIR /build

# Copy Quarto source files (excluding build output via .dockerignore)
COPY . .

# Render to HTML (output goes to _output/)
RUN quarto render

# Stage 2: Serve with Caddy
FROM caddy:2-alpine
WORKDIR /srv

# Copy built HTML and assets from builder
COPY --from=builder /build/_output /srv/

# Caddyfile: serve static files, fallback to main presentation for /
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
