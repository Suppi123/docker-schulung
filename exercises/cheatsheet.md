# Docker Cheatsheet

## Docker Run
Offizielle Dokumentation: https://docs.docker.com/engine/reference/run/

`docker run OPTIONS`

```
  -d                 Run container in detached mode (in the background)
  --entrypoint       Override the default ENTRYPOINT of the image
  --env, -e          Set environment variables in the container
  --env-file         Read environment variables from a file
  --init             Run an init inside the container to handle signal processing and zombie reaping
  --interactive, -i  Keep STDIN open even if not attached
  --mount, --volume, -v
                     Attach a filesystem mount or bind mount to the container
  --name             Assign a name to the container
  --network, --net   Connect a container to a network
  --platform         Set the platform (e.g., linux/amd64) for the container
  --publish, -p      Publish a container’s port(s) to the host
  --restart          Set restart policy (e.g., no, always, on-failure)
  --rm               Automatically remove the container when it exits
  --tty, -t          Allocate a pseudo-TTY
```

## Docker Compose
Offizielle Dokumentation: https://docs.docker.com/reference/cli/docker/compose/

`docker compose OPTIONS`
```
  up             Create and start containers (`docker compose up` startet Services)
  down           Stop and remove containers, networks, images, and volumes
  build          Build or rebuild services
  start          Start existing stopped services
  stop           Stop running services
  restart        Restart services
  logs           View output from containers
  ps             List containers
  exec           Execute a command in a running container
  run            Run a one-off command in a new container
  config         Validate and view the compose file
  pull           Pull service images
  push           Push service images
  rm             Remove stopped service containers
  top            Display the running processes of services
  events         Receive real-time events from containers
  version        Show Docker Compose version information
```

## Docker CLI
Offizielle Dokumentation: https://docs.docker.com/reference/cli/docker/
### Images
`docker image COMMAND`:

```
  build       Build an image from a Dockerfile (`docker build` is the same as `docker image build`)
  history     Show the history of an image
  import      Import the contents from a tarball to create a filesystem image
  inspect     Display detailed information on one or more images
  load        Load an image from a tar archive or STDIN
  ls          List images
  prune       Remove unused images
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rm          Remove one or more images
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
```

### Containers
`docker container COMMAND`:

```
  attach      Attach local standard input, output, and error streams to a running container
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  inspect     Display detailed information on one or more containers
  kill        Kill one or more running containers
  logs        Fetch the logs of a container
  ls          List containers
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  prune       Remove all stopped containers
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  run         Run a command in a new container
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  wait        Block until one or more containers stop, then print their exit codes
```

### Volumes
`docker volume COMMAND`:
```
  create      Create a volume
  inspect     Display detailed information on one or more volumes
  ls          List volumes
  prune       Remove all unused local volumes
  rm          Remove one or more volumes
```

### Networks
`docker network COMMAND`:
```
  connect     Connect a container to a network
  create      Create a network
  disconnect  Disconnect a container from a network
  inspect     Display detailed information on one or more networks
  ls          List networks
  prune       Remove all unused networks
  rm          Remove one or more networks
```