# FABRIC[ACTIONS]

Ephemeral fabrications against permanent waste - A series of urban interventions using found textiles to reclaim public space.

## 🎨 About the Project

FABRIC[ACTIONS] is a non-wearable art exhibition that transforms textile waste into powerful statements about labor, resistance, and sustainability. The project features a series of urban interventions across Berlin, challenging perceptions of public space and material value.

## 🌟 Main Themes

- **Work and Alienation**
- **Textile Resistance**
- **Political Materiality**
- **Domestic Performance**
- **Economies of Care**

## 🚀 Getting Started

### Prerequisites

- Node.js 24 LTS and npm
- PostgreSQL or Docker Compose
- Chromium and PostgreSQL server tools for the optional local integration checks

### Installation

Install dependencies with `npm ci`. For local development, start PostgreSQL and provide the following server-side variables in an ignored file such as `.env.server`:

```dotenv
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=fabric_actions
PGUSER=fabric
PGPASSWORD=your-local-database-password
ADMIN_PASSWORD=your-local-admin-password
SESSION_SECRET=a-random-secret-at-least-32-characters-long
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
UPLOAD_DIR=/absolute/path/to/a/local/uploads-directory
BREVO_API_KEY=
BREVO_LIST_ID=
```

Use a unique random admin password of at least 16 characters and a random session secret of at least 32 characters. Set both Brevo values to enable newsletter subscriptions. The former Brevo key was exposed to the browser and must be revoked and replaced before deployment.

Start the API and the Vite frontend in separate terminals:

```sh
node --env-file=.env.server --import tsx --watch server/index.ts
npm run dev
```

Open [http://localhost:8080](http://localhost:8080); the admin login is at `/admin/login`. The API applies pending SQL migrations at startup and seeds the original static content once. Later restarts preserve edits and deletions.

### Content administration

The protected admin panel manages events, artworks, exhibition information, event posts, and urban interventions. The Node API reads and writes PostgreSQL and stores new images in `UPLOAD_DIR`. Seed images remain bundled in `public/img`.

### Coolify deployment

1. Create a Docker Compose application from this repository and select `compose.yaml`. Configure `POSTGRES_PASSWORD`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `BREVO_API_KEY`, and `BREVO_LIST_ID` in Coolify; `.env.example` lists the expected variables. Never commit real values. The application requires the database password, admin password and session secret at startup; Brevo values must be supplied together.
2. Assign `fabric-actions.therapy-berlin.com` and `fabric-actions.art` to the `app` service on port 3000, configure DNS to point to the VPS, and enable HTTPS for both domains. The application redirects the latter domain to the former. Keep `ALLOWED_ORIGINS` set to the canonical HTTPS origin.
3. Deploy and check `/api/health`, the public site, admin login and a test image upload. The database is not published on a host port. PostgreSQL and uploads use separate persistent Docker volumes.

The seed reconstructs only the content originally committed to the repository. No backups are configured: subsequent admin edits and uploads can be lost if the database, volumes, or server are lost. Do not delete the persistent volumes when redeploying.

### Verification

```sh
npm run typecheck
npm run lint
npm test -- --run
npm run test:server
npm run test:integration
npm run test:e2e
npm run test:compose
```

The integration and browser scripts create disposable local PostgreSQL clusters; they require `initdb`, `pg_ctl`, `createdb`, and `psql` on the PATH. The browser script also requires Playwright Chromium. `test:compose` builds an isolated Docker project, runs the browser flow, restarts its containers, and removes only that test project's volumes afterward. The browser tests block third-party network requests.

## 🛠️ Built With

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Content and session storage
- [Express](https://expressjs.com/) - Application API
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Therapy Recycle & Exorcise
- Cultural Threads Berlin
- All participating artists and contributors
