# Dash-ZaTrack

Projeto completo de dashboard premium com Next.js 15, TypeScript, Tailwind CSS v4, App Router e componentes no padrao shadcn/ui.

## Stack

- Next.js 15 com App Router
- TypeScript em modo strict
- Tailwind CSS v4 com tokens globais
- shadcn/ui + Radix primitives
- Supabase-ready com `@supabase/ssr`
- Recharts
- Lucide Icons

## Identidade visual

- Background: `#0F0F0F`
- Cards: `#202020`
- Primary: `#5DD62C`

## Estrutura

```txt
app/                    Rotas, layout global e pagina inicial
components/dashboard/   Modulos visuais do dashboard
components/ui/          Primitivos shadcn/ui
data/                   Dados mockados e configuracoes da UI
lib/supabase/           Clientes Supabase para browser, server e middleware
lib/utils.ts            Helpers compartilhados
types/                  Declaracoes globais
```

## Supabase

Copie `.env.example` para `.env.local` e configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Helpers disponiveis:

- `lib/supabase/client.ts` para Client Components
- `lib/supabase/server.ts` para Server Components e Server Actions
- `lib/supabase/middleware.ts` para refresh de sessao via middleware

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` para visualizar o dashboard.

## Validacao

```bash
npm run lint
npm run build
```
