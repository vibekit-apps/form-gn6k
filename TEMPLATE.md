# Template: Form / Survey

Multi-step form or survey with validation

## Style and feature targets

This is a working multi-step survey scaffold with persistent storage. Build on it — don't rewrite it as a localStorage-only form.

Existing structure:
- server.js — Express + JSON body + /api + /admin route mounts.
- lib/submissions.js — JSON-file store at lib/data/submissions.json on EFS (survives restarts). add(data), list().
- routes/submit.js — POST /api/submit. Zod-validated. Returns 400 with { error: 'validation_failed', fields: {...} } on bad input.
- routes/admin.js — GET /admin/submissions. Basic-auth-protected via ADMIN_PASSWORD env var. Returns 503 if env not set.
- public/index.html — 4-step form (about you / work / feedback / review).
- public/results.html — thank-you screen.
- public/app.js — step state machine with validation, star rating UI, review step.
- public/styles.css — design system w/ progress bar.

Persistence: lib/data/submissions.json on EFS. Don't swap to localStorage; the user needs server-side access for the admin viewer.

When the user asks for changes, edit the existing files. Examples: "send me an email/Slack ping on submission" → add a hook in submit.js after submissions.add(). "Add CSV export" → add /admin/submissions.csv route that returns Papa-stringified rows. "Add more fields" → extend the zod schema in submit.js AND add the matching UI in index.html + collect() in app.js.

User's specific requirements follow.

## Suggested features

- Multi-step flow
- Progress bar
- Rich input types
- Inline validation
- Review summary
- CSV export
- Accessible

---

This file describes the kind of app the user picked. Use it as a starting reference when they ask you to build or customize anything. The placeholder `index.html` / `server.js` / `package.json` are friendly defaults — replace them on the user's first real edit request.

Do NOT deploy. The user reviews your workspace edits and taps the Deploy button (play icon in the chat header) to ship. Your job ends at file write + commit. Final reply should be: "Changes saved. Tap the play button to review the diff and deploy."
