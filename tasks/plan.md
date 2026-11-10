# Plan: Consolidate the CMS upgrade

## Goal
Bring the admin and Supabase backed content features from the upgrade checkout into this GitHub linked repository as the canonical local project version.

## Work slices
1. Integrate the existing admin login, protected routes, events and artworks CRUD, and the expanded public content components.
2. Integrate the newer CRUD screens for exhibition information, event posts, and urban interventions, with their database and storage migrations.
3. Keep only source, migration, test, and relevant feature documentation; exclude environment credentials and generated browser/build output.
4. Update setup instructions and review the integrated diff for security and configuration gaps.

## Acceptance checks
- The main repository contains the admin routes and all CMS screens from the upgrade.
- Supabase migrations define every table and public/admin access policy used by those screens.
- Local secrets remain untracked; setup requirements are documented.
- Build and static checks run where the available environment allows.

## Known constraints
- The upgrade's `.env.local` contains Supabase project values and will not be copied into version control.
- Applying migrations to the hosted Supabase project and publishing to GitHub are outside this local integration.
