For any Gitea interaction (Actions runs, job logs, PRs, issues, etc.) use the `tea` CLI rather than curl or WebFetch.

**Why:** Direct HTTP to gitea.cusack-ruth.name 404s/needs manual auth; `tea` is already configured with a login for `gitea.cusack-ruth.name` (user `bruth`, default login).

**How to apply:** The git remote is `synology1.local` so tea CANNOT auto-detect — always pass `--repo bruth/homelab-monitoring --login gitea.cusack-ruth.name`. Useful commands: `tea actions runs list`, `tea actions runs view <run-id>`, `tea actions runs logs <run-id> [--job <id>]`. See `mem:homelab-cicd-topology`.