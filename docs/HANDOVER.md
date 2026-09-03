# Handover

## What A New Contractor Receives

- Astro static frontend.
- Structured editable content in `src/content/`.
- Decap CMS configuration in `public/admin/`.
- Preserved Vercel Functions backend in `api/`.
- Bitrix24 adapter stub and env names.
- Documentation for development, admin, deployment and architecture.
- Legacy static files retained for comparison and rollback.

## First Setup

```bash
npm install
npm run build
```

For local frontend work:

```bash
npm run dev
```

For backend work, use the existing Vercel project and configure environment variables from `.env.example`.

## Required Accesses

The company should own and provide:

- GitHub repository access;
- GitHub Pages settings;
- Vercel project access;
- Telegram bot token;
- Telegram CRM chat/admin access;
- Bitrix24 webhook or OAuth credentials when integration is approved;
- Yandex Metrika counter ID;
- domain/DNS access;
- Decap CMS authentication setup.

## Gate 3 Risks

- Decap CMS production authentication must be confirmed.
- GitHub Pages base path must match the final repository name.
- Bitrix24 field mapping needs real CRM pipeline details.
- Yandex Metrika goal names should be confirmed with marketing.
- Stationary service still needs owner-approved facts and real photos.
- Live form testing would create Telegram leads and should be approved before execution.

## Separate Confirmation Required

- Push to remote.
- Merge into main.
- Production deployment.
- Real Bitrix24 lead sending.
- Live Telegram form submission.
- Replacing or deleting legacy files.
