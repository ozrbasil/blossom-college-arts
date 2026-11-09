# FINE ARTS 2026 — GitHub + Vercel + MongoDB

This project is split into separate frontend files and includes the API/backend files needed for shared admin updates.

## Project structure

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── api/
│   ├── data.js
│   └── img.js
├── lib/
│   ├── db.js
│   └── seed.json
├── package.json
├── .gitignore
└── README.md
```

## Important: GitHub Pages vs Vercel

**Use GitHub to store the code and Vercel to deploy it.** This project uses server API routes and MongoDB, so GitHub Pages alone will not support admin login, shared updates, or database photo storage.

## Deploy

1. Unzip this project.
2. Create a GitHub repository and upload/commit all files and folders in this project.
3. Sign in to [Vercel](https://vercel.com) with GitHub.
4. Add a new Vercel project and import this repository.
5. In Vercel → **Settings → Environment Variables**, add:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `ADMIN_PASSWORD` — a strong admin password
   - Optional: `MONGODB_DB` — database name (defaults to `fest`)
6. In MongoDB Atlas, configure Database Access for the database user and Network Access to allow Vercel connections. For this project's setup, the README previously recommended `0.0.0.0/0`; understand the security implications before enabling broad access.
7. Deploy (or redeploy after adding environment variables).
8. Open the deployed website. Tap the festival name in the top-left five times quickly to open admin login. Enter the `ADMIN_PASSWORD`, make changes, and press **Update site**.

## Security

- Do not put MongoDB credentials or admin passwords in frontend files, GitHub commits, or this README.
- Set secrets only in Vercel Environment Variables.
- Change any password that has previously been shared or committed.
- Keep `node_modules`, `.env`, and `.vercel` out of Git (covered by `.gitignore`).

## Troubleshooting

- **Server not ready:** check that `MONGODB_URI` is configured in Vercel and MongoDB Atlas permits connections.
- **Admin login fails:** verify `ADMIN_PASSWORD` in Vercel and redeploy after changing it.
- **Updates/photos not shared:** deploy through Vercel with the API files and MongoDB configured; a static GitHub Pages deployment cannot run these API routes.
