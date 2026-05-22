# Form / Survey Starter

A 4-step survey form with progress bar, zod-validated submissions, JSON-file persistence on EFS, and a password-guarded admin viewer.

## What's inside

```
form/
  server.js                  # express + /api/submit + /admin
  lib/submissions.js         # JSON file store at lib/data/submissions.json
  routes/submit.js           # POST /api/submit (zod-validated)
  routes/admin.js            # GET /admin/submissions (Basic auth, ADMIN_PASSWORD)
  public/index.html          # 4-step form (about you, work, feedback, review)
  public/results.html        # thank-you screen
  public/app.js              # step state machine, validation, submit
  public/styles.css          # design
```

## Start it locally

```bash
npm install
npm start
```

Open http://localhost:3000.

## Persistence

Submissions land in `lib/data/submissions.json` on the container's EFS-backed workspace — they survive restarts.

## Admin viewer

Set `ADMIN_PASSWORD` as an env var (VibeKit `/env`). Then hit `/admin/submissions` with HTTP Basic auth — any username, the password you set. Returns JSON. Browser will prompt for credentials.

## Ask the agent

- "Add a Slack webhook so I get pinged when someone submits."
- "Build an HTML admin page that renders the submissions in a table."
- "Add CSV export to the admin endpoint."
