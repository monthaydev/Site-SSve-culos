-- ============================================================
-- SS Veículos — Setup COMPLETO do banco (rode tudo de uma vez)
-- Cole este script inteiro no SQL Editor do Supabase e execute.
-- É idempotente: pode rodar de novo sem dar erro.
--
-- Depois de rodar, falta 1 passo manual — veja o final do arquivo.
-- ============================================================

-- ------------------------------------------------------------
-- Tabela principal de veículos (venda e/ou locação)
-- ------------------------------------------------------------
create table if not exists public.veiculos (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  marca          text not null,
  modelo         text not null,
  versao         text not null,
  ano_fab        int not null,
  ano_mod        int not null,
  km             int not null default 0,
  preco          int,                          -- preço de venda (opcional: pode ser só locação)
  preco_anterior int,
  para_venda     boolean not null default true,  -- aparece em /estoque
  para_locacao   boolean not null default false, -- aparece em /locadora
  preco_diaria   int,                          -- valor da diária (locação)
  preco_mensal   int,                          -- valor mensal (locação)
  combustivel    text not null check (combustivel in ('Flex','Gasolina','Diesel','Elétrico','Híbrido')),
  cambio         text not null check (cambio in ('Manual','Automático','CVT','Automatizado')),
  cor            text not null,
  portas         int not null default 0,
  categoria      text not null check (categoria in ('Carro','Caminhão','Utilitário','Van')),
  condicao       text not null check (condicao in ('Novo','Seminovo','Usado')),
  badge          text check (badge in ('destaque','novo','oferta','reservado')),
  fotos          text[] not null default '{}',
  opcionais      text[] not null default '{}',
  descricao      text not null default '',
  ativo          boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Atualiza updated_at automaticamente
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists veiculos_updated_at on public.veiculos;
create trigger veiculos_updated_at
  before update on public.veiculos
  for each row execute procedure public.set_updated_at();

-- ------------------------------------------------------------
-- Índices das listagens públicas (venda / locação)
-- ------------------------------------------------------------
create index if not exists veiculos_para_venda_idx   on public.veiculos (para_venda)   where ativo = true;
create index if not exists veiculos_para_locacao_idx on public.veiculos (para_locacao) where ativo = true;

-- ------------------------------------------------------------
-- Tabela: marcas (usada nos dropdowns do admin e filtros do site)
-- ------------------------------------------------------------
create table if not exists public.marcas (
  id         uuid primary key default gen_random_uuid(),
  nome       text unique not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: cores (usada nos dropdowns do admin e filtros do site)
-- ------------------------------------------------------------
create table if not exists public.cores (
  id         uuid primary key default gen_random_uuid(),
  nome       text unique not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: vendedores (equipe comercial, exibida em /contato)
-- ------------------------------------------------------------
create table if not exists public.vendedores (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  whatsapp   text not null, -- somente dígitos, com DDI+DDD. Ex: 5569999528051
  ativo      boolean not null default true,
  ordem      int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Trava de segurança: lista de admins
--
-- Login continua sendo feito normalmente em /admin/login. Isso aqui
-- decide quem, depois de autenticado no projeto, tem permissão de
-- admin de verdade — em vez de liberar escrita pra qualquer usuário
-- autenticado (o que incluiria alguém que se cadastrasse direto pela
-- API pública do Supabase, por fora do site).
-- ============================================================
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- RLS ativado e SEM nenhuma policy: ninguém acessa esta tabela
-- via site/API (nem para ler). Só editável pelo SQL Editor.
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- ============================================================
-- RLS — veiculos
-- ============================================================
alter table public.veiculos enable row level security;

drop policy if exists "Leitura pública de veículos ativos" on public.veiculos;
create policy "Leitura pública de veículos ativos"
  on public.veiculos for select
  using (ativo = true);

drop policy if exists "Admin pode tudo" on public.veiculos;
create policy "Admin pode tudo"
  on public.veiculos for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- RLS — marcas
-- ============================================================
alter table public.marcas enable row level security;

drop policy if exists "marcas_select_public" on public.marcas;
create policy "marcas_select_public" on public.marcas for select using (true);

drop policy if exists "marcas_insert_auth" on public.marcas;
create policy "marcas_insert_auth" on public.marcas for insert with check (public.is_admin());

drop policy if exists "marcas_update_auth" on public.marcas;
create policy "marcas_update_auth" on public.marcas for update using (public.is_admin());

drop policy if exists "marcas_delete_auth" on public.marcas;
create policy "marcas_delete_auth" on public.marcas for delete using (public.is_admin());

-- ============================================================
-- RLS — cores
-- ============================================================
alter table public.cores enable row level security;

drop policy if exists "cores_select_public" on public.cores;
create policy "cores_select_public" on public.cores for select using (true);

drop policy if exists "cores_insert_auth" on public.cores;
create policy "cores_insert_auth" on public.cores for insert with check (public.is_admin());

drop policy if exists "cores_update_auth" on public.cores;
create policy "cores_update_auth" on public.cores for update using (public.is_admin());

drop policy if exists "cores_delete_auth" on public.cores;
create policy "cores_delete_auth" on public.cores for delete using (public.is_admin());

-- ============================================================
-- RLS — vendedores
-- ============================================================
alter table public.vendedores enable row level security;

drop policy if exists "vendedores_select_public" on public.vendedores;
create policy "vendedores_select_public" on public.vendedores for select using (true);

drop policy if exists "vendedores_insert_auth" on public.vendedores;
create policy "vendedores_insert_auth" on public.vendedores for insert with check (public.is_admin());

drop policy if exists "vendedores_update_auth" on public.vendedores;
create policy "vendedores_update_auth" on public.vendedores for update using (public.is_admin());

drop policy if exists "vendedores_delete_auth" on public.vendedores;
create policy "vendedores_delete_auth" on public.vendedores for delete using (public.is_admin());

-- ============================================================
-- Storage — bucket para fotos dos veículos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('veiculos', 'veiculos', true)
on conflict (id) do nothing;

drop policy if exists "Fotos públicas" on storage.objects;
create policy "Fotos públicas"
  on storage.objects for select
  using (bucket_id = 'veiculos');

drop policy if exists "Admin faz upload" on storage.objects;
create policy "Admin faz upload"
  on storage.objects for insert
  with check (bucket_id = 'veiculos' and public.is_admin());

drop policy if exists "Admin deleta fotos" on storage.objects;
create policy "Admin deleta fotos"
  on storage.objects for delete
  using (bucket_id = 'veiculos' and public.is_admin());

-- ------------------------------------------------------------
-- Seed: marcas populares no Brasil (edite/complete pelo admin depois)
-- ------------------------------------------------------------
insert into public.marcas (nome) values
  ('Chevrolet'), ('Fiat'), ('Ford'), ('Honda'), ('Hyundai'),
  ('Jeep'), ('Kia'), ('Mercedes-Benz'), ('Mitsubishi'), ('Nissan'),
  ('Peugeot'), ('Renault'), ('Subaru'), ('Toyota'), ('Volkswagen'),
  ('Volvo'), ('BMW'), ('Audi'), ('Caoa Chery'), ('BYD')
on conflict (nome) do nothing;

-- ------------------------------------------------------------
-- Seed: cores comuns (edite/complete pelo admin depois)
-- ------------------------------------------------------------
insert into public.cores (nome) values
  ('Branco'), ('Preto'), ('Prata'), ('Cinza'), ('Vermelho'),
  ('Azul'), ('Verde'), ('Amarelo'), ('Laranja'), ('Marrom'),
  ('Bege'), ('Dourado'), ('Vinho'), ('Grafite'), ('Champagne'),
  ('Branco Perolizado'), ('Preto Fosco'), ('Azul Metálico'), ('Cinza Escuro'), ('Bronze')
on conflict (nome) do nothing;

-- ------------------------------------------------------------
-- Seed: equipe atual (editável pelo admin depois em /admin/vendedores)
-- ------------------------------------------------------------
insert into public.vendedores (nome, whatsapp, ordem) values
  ('Jhonin',    '5569999528051', 1),
  ('Gabriel',   '5569992783444', 2),
  ('Claudemir', '5569999910051', 3),
  ('Reinan',    '5569992097833', 4),
  ('Mateus',    '5569981382705', 5)
on conflict do nothing;

-- ============================================================
-- PASSO MANUAL — fazer 1 vez por projeto, depois de rodar este script:
--
-- 1. No painel do Supabase: Authentication → Users → "Add user".
--    Crie com o e-mail e senha que serão usados para logar em
--    /admin/login. Não existe cadastro público no site — o usuário
--    admin é sempre criado manualmente aqui.
--
-- 2. Copie o "User UID" que aparece na lista de usuários.
--
-- 3. Rode o INSERT abaixo (trocando os valores):
--
--    insert into public.admins (user_id, email)
--    values ('COLE-O-UID-AQUI', 'email-do-admin@exemplo.com');
--
-- Pronto: só esse usuário (e quem mais você inserir aqui, repetindo
-- o passo 3 com outro UID) consegue criar/editar/excluir veículos,
-- marcas, cores, vendedores e fotos.
-- ============================================================
