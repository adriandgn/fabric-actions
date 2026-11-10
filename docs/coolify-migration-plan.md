# Migration to Coolify and PostgreSQL

## Agreed scope

The existing admin manages events, artworks, urban interventions, exhibition information, and event posts. Other site sections stay outside the administration scope. Initial content and bundled images must be recovered from the static site at the pre-CMS `origin/main` revision. The seed must be repeatable without overwriting later edits.

The deployment uses private PostgreSQL and a persistent image volume on the existing Hetzner VPS. `fabric-actions.therapy-berlin.com` is canonical; `fabric-actions.art` redirects to it. Backups are deferred. Brevo remains in use through a small server-side endpoint.

## Implementation slices

1. Inventory the static revision and map its fields and files to the existing admin sections, preserving dates, text, ordering, and images without inventing missing values.
2. Upgrade the frontend toolchain and dependencies in compatible groups; repair the inherited test setup and establish a passing baseline.
3. Introduce a server-side API with PostgreSQL migrations and an idempotent seed. Keep public read endpoints separate from protected writes.
4. Replace Supabase login with one server-side environment password and an expiring secure HTTP-only session. Protect writes and uploads with authorization, request-origin checks, and rate limits.
5. Move uploads to a persistent volume, validate file type and size, use generated filenames, and preserve access across container replacement. Keep a storage interface for a future object-store implementation.
6. Replace Supabase calls in the existing public and admin screens, and move the Brevo API key and subscription request to the server.
7. Add Docker and Coolify configuration, health checks, environment documentation, and canonical-domain routing. Keep PostgreSQL inaccessible from the public network.

## Verification gates

- Unit and integration checks cover access control, failed logins, input validation, CRUD, seed reruns, uploads, and newsletter error handling.
- Run application and API integration against a real disposable PostgreSQL database, including migrations from an empty database.
- Exercise the public site and each admin section in a browser, including login, edits, image uploads, logout, and unauthorized requests.
- Recreate application containers and confirm database records and uploaded images persist. Check canonical-domain redirect and deployment health in a staging environment.
- Compare seeded content and images against the static revision. Validate the production build, types, lint, and dependency audit; document any unresolved issues.

## Operational constraints

Without backups, the seed restores only the original committed content. Subsequent edits and uploads can be lost if the database, volume, or VPS is lost. Do not deploy or change DNS until the deployment configuration and test results are ready for review.
