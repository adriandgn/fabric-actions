# FABRIC[ACTIONS]

Ephemeral fabrications against permanent waste - A series of urban interventions using found textiles to reclaim public space.

## 🎨 About the Project

FABRIC[ACTIONS] is a non-wearable art exhibition that transforms textile waste into powerful statements about labor, resistance, and sustainability. The project features a series of urban interventions across Berlin, challenging perceptions of public space and material value.

## 🗓️ Exhibition Details

- **Date**: June 3-7, 2025
- **Time**: 13:00 - 19:00
- **Location**: PLATTE·Berlin, Memhardstraße 8, 10178 Berlin
- **Free Entry**

## 🌟 Main Themes

- **Work and Alienation**
- **Textile Resistance**
- **Political Materiality**
- **Domestic Performance**
- **Economies of Care**

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- A Supabase project for the admin panel and editable content

### Installation

1. Install dependencies from the repository root:
   ```sh
   npm ci
   ```

2. Create a local environment file and set the Supabase project URL and publishable (anon) key:
   ```sh
   cp .env.example .env.local
   ```

3. Apply the SQL migrations in `supabase/migrations` to the Supabase project. Create or invite an account in Supabase Auth, then add that user's email to the CMS admin allowlist from the Supabase SQL Editor:
   ```sql
   INSERT INTO public.cms_admins (user_id)
   SELECT id FROM auth.users WHERE email = 'admin@example.com'
   ON CONFLICT (user_id) DO NOTHING;
   ```
   Keep public account registration disabled. Database policies only let users listed in `cms_admins` modify site content.

4. Start the development server:
   ```sh
   npm run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) to view the site. The admin login is at `/admin/login`.

Keep `.env.local` private. Only the Supabase URL and publishable/anon key belong in the frontend; never use a service-role key here.

### Content administration

The protected admin panel manages events, artworks, exhibition information, event posts, and urban interventions. Public pages read editable content from Supabase. Image uploads use the `artwork_images` and `urban_intervention_images` Storage buckets, created by the migrations.

## 🛠️ Built With

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Therapy Recycle & Exorcise
- Cultural Threads Berlin
- All participating artists and contributors
