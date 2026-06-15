CI/CD topology for homelab-monitoring (and other repos):

- **Gitea server**: host `synology1.local`, ssh `bruth` (git over port 222). Docker Compose stack at `/volume1/docker/compose/gitea` (Synology; `docker` lives at `/usr/local/bin/docker` → ContainerManager). Services: `gitea` (image `ghcr.io/go-gitea/gitea`) + `gitea-postgres-1` (postgres:alpine). Data at `/volume1/docker/gitea` → container `/data`. Public URL `https://gitea.cusack-ruth.name` (internal port 3000).
- **nginx reverse proxy**: host `beelink`, ssh `bruth`. Fronts Gitea. (Logs reportedly under `/opt/authelia/logs/nginx` but that path was empty when checked.)
- **Gitea act_runner**: host `beelink-gti`, ssh `bruth`. Runs as rootful **podman** container `gitea-act-runner` (`act_runner daemon`, labels `[ubuntu-latest]`, capacity 1), logging to journald — view with `sudo podman logs gitea-act-runner`. Config at `/opt/gitea-act-runner/config.yaml`; mounts docker.sock; job containers are `node:20-bookworm`. NOT a systemd unit despite first impressions.

Gitea Actions log flow: live logs stream via `UpdateLog` into Postgres-backed `dbfs` (`dbfs_data`/`dbfs_meta`), then transfer to permanent storage at `/data/gitea/actions_log/<owner>/<repo>/<NN>/<taskid>.log.zst`. Task state lives in the `action_task` table (status: 1=success, 2=failure, 3=cancelled, 4=skipped, 6=running). See `mem:gitea-actions-finalize-500-bug`.

For interacting with Gitea (runs, logs, PRs), use the `tea` CLI — see `mem:use-tea-for-gitea`.