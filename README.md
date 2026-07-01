# SS Veículos

Site institucional e catálogo online da **SS Veículos** — revenda de seminovos e novos em Cacoal-RO, há mais de 22 anos no mercado.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Estilo:** Tailwind CSS v4
- **Banco / Auth / Storage:** Supabase (PostgreSQL + RLS + Storage)
- **Tipografia:** Bebas Neue (display) · Barlow Condensed · Barlow
- **Deploy:** Vercel (serverless)

## Rotas

| Rota | Descrição |
|---|---|
| `/` | Home — banner, destaques, métricas, serviços, parceiros |
| `/estoque` | Listagem de veículos para venda com filtros |
| `/estoque/[slug]` | Página interna do veículo |
| `/locadora` | Listagem de veículos para locação |
| `/locadora/[slug]` | Página interna — locação |
| `/financiamento` | Bancos parceiros + simulador visual |
| `/servicos` | Despachante + avaliação para troca |
| `/sobre` | Institucional |
| `/contato` | Formulário + Google Maps |
| `/admin` | Painel CMS (protegido — Supabase Auth) |

## Desenvolvimento

```bash
npm install
npm run dev
```

Crie `.env.local` com:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Build

```bash
npm run build
npm run start
```
