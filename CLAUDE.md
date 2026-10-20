# cv-web

Repo context lives in `AGENTS.md` and `README.md`.

## Context Protocol (run FIRST, before answering any issue)

1. Load repo-local context: this file + `AGENTS.md` + `README.md`.
2. For deploy/infra/k8s topics load ops-brain vault `~/Documents/ops-brain/`:
   - `AGENTS.md` (canonical agent rules), `personal-infra/_context.md`, `personal-infra/clusters/khtz.md` (this app runs on the khtz k3s cluster via `../infra` GitOps repo)
3. Reply only after context loaded; say which notes you used. New durable facts → propose ops-brain note update.
4. NEVER start the vevsdesign dev server while working in this repo.

## Execution Policy — zero approvals for read-only

- Read-only diagnostics run IMMEDIATELY, never ask: kubectl get|describe|logs|events|top, curl/dig, docker ps|logs, git status|log|diff, file reads, greps. Chain them fast.
- Approval required BEFORE any state change: cluster mutations (apply/patch/delete/scale/restart — and only via `../infra` GitOps repo), deploys, secrets, git push. Present exact command/diff, wait for explicit yes.

## Rules

- Do what has been asked; nothing more, nothing less.
- Prefer editing existing files; don't create docs unless asked.
- Never commit secrets or `.env` files.
- Run `npm run build` before committing code changes.
