# ARSA deployment repository

This is the generated public deployment package, not the research/source project.
Read [the publishing runbook](docs/PUBLISHING.md) before app updates.

If the separate source project is unavailable, ask for it before regenerating data.
Do not invent scientific data or silently edit only generated chunks.

GitHub: https://github.com/andoberg/arsa_app ; production branch: main.
Cloudflare Worker: arsa-app ; live: https://arsa-app.andoberg.workers.dev/ .
Every push to main triggers a public production build and deployment.
Run npm test and npx cf deploy --dry-run before an authorized release.
Never commit credentials, raw source articles, node_modules or build caches.
Model development is frozen. Preserve the literature-first behavior and the
exploratory minimum AlphaMissense score without inferred phenotype classes.
