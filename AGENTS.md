# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 15 dashboard app (single service, no monorepo). See `README.md` for stack and structure overview.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` |
| Build | `npm run build` |

### Supabase (optional)

The app scaffolds Supabase auth but currently uses only mock data (`data/dashboard.ts`). The middleware in `middleware.ts` calls `isSupabaseConfigured()` and gracefully skips auth when env vars are empty. You can run the full dashboard without Supabase credentials.

To configure Supabase (if needed): copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Notes

- The `main` branch contains only a README; actual code lives on feature branches. Check out `cursor/next-dashboard-f671` for the source.
- No automated test suite exists yet — validation relies on `npm run lint` and `npm run build`.
- TypeScript strict mode is enabled (`tsconfig.json`).
- Tailwind CSS v4 is used via `@tailwindcss/postcss` (not the older `tailwind.config.js` approach).
