# Static content inventory for the PostgreSQL seed

Source: the pre-CMS revision `72019b4`, available as the current local `origin/main` reference. The local reference was inspected; no live Supabase data was consulted.

## Admin-managed content

- **Urban interventions:** four records in `src/components/UrbanInterventions.tsx`, ordered as shown in that component. Their images are the four numbered JPEGs in `public/img`.
- **Studio pieces:** five records in `src/components/Studiopieces.tsx`, ordered as shown in that component. Their images are `public/img/studio-1.png` through `studio-4.png` and `studio-5.jpg`. The existing `date` field contains descriptions and dimensions, not calendar dates; preserve the text as written.
- **Exhibition information:** `src/components/Hero.tsx` contains the latest exhibition label, next exhibition label, date/time text, and venue/address. These are display strings, not sufficient evidence to invent structured dates.
- **Events:** `src/components/ExhibitionInfo.tsx` contains one next-exhibition label and two latest-exhibition labels. It does not contain complete dates for all three. Preserve their labels and display grouping without guessing dates.
- **Event post:** `src/components/ArtistsList.tsx` renders the `ABOUT THE EVENT` section with the title `SOFT LANDING - RARE FASHION WEEK EVENT` and several paragraphs, including an Instagram link and line breaks. Preserve the visible content and link when converting it into editable content.

## Outside the agreed admin scope

The general project description, location and transport details, footer, and legal pages remain in their existing components for this migration. The logo and fonts remain bundled static assets.

## Baseline findings

- The inherited Vitest run on the existing checkout reports 20 failures and 10 passes. Several suites reference mock exports that do not exist; the urban-intervention suite also references undefined mocks. These tests need replacement or repair as their corresponding Supabase integration is migrated.
- The current newsletter calls Brevo directly from the browser with a Vite environment variable. Move the request and key to the server while preserving the existing subscription behavior.
- The local Docker CLI is installed, but no Docker daemon was available when checked. A real PostgreSQL/container integration run therefore requires an available daemon or another isolated PostgreSQL instance.
