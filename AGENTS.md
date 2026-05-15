# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 15 premium tracking dashboard (single service, no monorepo). See `README.md` for stack overview.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` |
| Build | `npm run build` |

### Architecture

- **Pages**: `/` (overview dashboard), `/tracking` (realtime events + campaigns)
- **State**: Zustand store at `stores/tracking-store.ts` for realtime event state
- **Data fetching**: TanStack Query provider wired in `app/layout.tsx` (ready for Supabase queries)
- **Animations**: Framer Motion used in client components (metrics-grid, tracking components)
- **Routing**: `typedRoutes: true` in `next.config.ts` — use the type guard pattern in `sidebar.tsx` when adding new page routes

### Supabase (optional)

The app scaffolds Supabase auth but currently uses only mock data. The middleware gracefully skips auth when env vars are empty. Copy `.env.example` to `.env.local` and fill in the values if needed.

### Notes

- No automated test suite — validation relies on `npm run lint` and `npm run build`.
- TypeScript strict mode is enabled.
- Tailwind CSS v4 via `@tailwindcss/postcss`.
- When adding new routes, update `pageRoutes` array in `components/dashboard/sidebar.tsx` for typed route support.
