-- RV7 Gerenciador de Franquias - Supabase Schema (Fase 1 - Read-only)
-- Objetivo: criar tabelas principais para leitura pela aplicação. RLS habilitado com SELECT público.
-- Observação: Escrita (INSERT/UPDATE/DELETE) ficará para a Fase 2 com políticas por papel/franquia.

-- =========================
-- EXTENSÕES (opcional)
-- =========================
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- TABELAS CORE
-- =========================
CREATE TABLE IF NOT EXISTS public.franchises (
  id                BIGSERIAL PRIMARY KEY,
  name              TEXT NOT NULL,
  location          TEXT,
  cnpj              TEXT,
  corporate_name    TEXT,
  inauguration_date DATE,
  owner_name        TEXT,
  owner_email       TEXT,
  owner_phone       TEXT,
  allowed_product_ids BIGINT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.system_users (
  id     BIGSERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  email  TEXT UNIQUE NOT NULL,
  role   TEXT NOT NULL -- ADMIN | MANAGER | ...
);

CREATE TABLE IF NOT EXISTS public.franchise_users (
  id           BIGSERIAL PRIMARY KEY,
  franchise_id BIGINT NOT NULL REFERENCES public.franchises (id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  role         TEXT NOT NULL -- OWNER | SALESPERSON | ...
);

CREATE TABLE IF NOT EXISTS public.products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

-- Configurações globais da Franqueadora (1 linha)
CREATE TABLE IF NOT EXISTS public.franchisor_settings (
  franchisor_name                    TEXT,
  logo_url                           TEXT,
  primary_color                      TEXT,
  secondary_color                    TEXT,
  royalty_percentage                 NUMERIC,
  marketing_fee_percentage           NUMERIC,
  default_software_fee               NUMERIC,
  default_sales_commission_percentage NUMERIC,
  initial_franchise_fee              NUMERIC,
  contact_name                       TEXT,
  contact_email                      TEXT,
  contact_phone                      TEXT
);

-- =========================
-- CRM / OPERACIONAL
-- =========================
CREATE TABLE IF NOT EXISTS public.clients (
  id            BIGSERIAL PRIMARY KEY,
  franchise_id  BIGINT NOT NULL REFERENCES public.franchises (id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  type          TEXT NOT NULL, -- PESSOA_FISICA | PESSOA_JURIDICA
  cpf           TEXT,
  cnpj          TEXT,
  razao_social  TEXT,
  cep           TEXT,
  logradouro    TEXT,
  numero        TEXT,
  complemento   TEXT,
  bairro        TEXT,
  cidade        TEXT,
  estado        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leads (
  id                  BIGSERIAL PRIMARY KEY,
  franchise_id        BIGINT NOT NULL REFERENCES public.franchises (id) ON DELETE CASCADE,
  client_id           BIGINT REFERENCES public.clients (id) ON DELETE SET NULL,
  service_of_interest TEXT,
  status              TEXT NOT NULL, -- NEW | CONTACTED | NEGOTIATING | WON | LOST
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  source              TEXT,
  negotiated_value    NUMERIC,
  salesperson_id      BIGINT
);

CREATE TABLE IF NOT EXISTS public.lead_notes (
  id         BIGSERIAL PRIMARY KEY,
  lead_id    BIGINT NOT NULL REFERENCES public.leads (id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  author     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id           BIGSERIAL PRIMARY KEY,
  franchise_id BIGINT NOT NULL REFERENCES public.franchises (id) ON DELETE CASCADE,
  lead_id      BIGINT REFERENCES public.leads (id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  due_date     DATE,
  completed    BOOLEAN NOT NULL DEFAULT FALSE
);

-- =========================
-- FINANCEIRO
-- =========================
CREATE TABLE IF NOT EXISTS public.transactions (
  id           BIGSERIAL PRIMARY KEY,
  franchise_id BIGINT NOT NULL, -- 0 para franqueadora (sem FK)
  description  TEXT NOT NULL,
  amount       NUMERIC NOT NULL,
  type         TEXT NOT NULL,   -- INCOME | EXPENSE
  category     TEXT NOT NULL,   -- ROYALTIES | OPERATIONAL_EXPENSE | SALES_COMMISSION | ...
  date         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id           BIGSERIAL PRIMARY KEY,
  franchise_id BIGINT NOT NULL,
  client_name  TEXT NOT NULL,
  amount       NUMERIC NOT NULL,
  due_date     DATE NOT NULL,
  status       TEXT NOT NULL   -- PAID | SENT | PENDING | OVERDUE...
);

-- =========================
-- VENDAS / CONTRATOS
-- =========================
CREATE TABLE IF NOT EXISTS public.sales (
  id             BIGSERIAL PRIMARY KEY,
  franchise_id   BIGINT NOT NULL,
  client_id      BIGINT REFERENCES public.clients (id) ON DELETE SET NULL,
  lead_id        BIGINT REFERENCES public.leads (id) ON DELETE SET NULL,
  salesperson_id BIGINT,
  sale_date      TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_amount   NUMERIC NOT NULL,
  payment_method TEXT,
  installments   INT,
  status         TEXT NOT NULL -- PENDING_PAYMENT | PAID | CANCELLED...
);

CREATE TABLE IF NOT EXISTS public.sale_items (
  id           BIGSERIAL PRIMARY KEY,
  sale_id      BIGINT NOT NULL REFERENCES public.sales (id) ON DELETE CASCADE,
  product_id   BIGINT REFERENCES public.products (id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  value        NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contract_templates (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  product_id BIGINT REFERENCES public.products (id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.contracts (
  id           BIGSERIAL PRIMARY KEY,
  sale_id      BIGINT NOT NULL REFERENCES public.sales (id) ON DELETE CASCADE,
  template_id  BIGINT REFERENCES public.contract_templates (id) ON DELETE SET NULL,
  status       TEXT NOT NULL, -- DRAFT | SIGNED | CANCELLED...
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  signed_at    TIMESTAMPTZ,
  content      TEXT NOT NULL
);

-- =========================
-- RLS (Row Level Security)
-- =========================
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisor_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (anon) para Fase 1 (apenas SELECT)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'franchises' AND policyname = 'franchises_read_all') THEN
    CREATE POLICY franchises_read_all ON public.franchises FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_users' AND policyname = 'system_users_read_all') THEN
    CREATE POLICY system_users_read_all ON public.system_users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'franchise_users' AND policyname = 'franchise_users_read_all') THEN
    CREATE POLICY franchise_users_read_all ON public.franchise_users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'products_read_all') THEN
    CREATE POLICY products_read_all ON public.products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'franchisor_settings' AND policyname = 'franchisor_settings_read_all') THEN
    CREATE POLICY franchisor_settings_read_all ON public.franchisor_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'clients_read_all') THEN
    CREATE POLICY clients_read_all ON public.clients FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'leads_read_all') THEN
    CREATE POLICY leads_read_all ON public.leads FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lead_notes' AND policyname = 'lead_notes_read_all') THEN
    CREATE POLICY lead_notes_read_all ON public.lead_notes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'tasks_read_all') THEN
    CREATE POLICY tasks_read_all ON public.tasks FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'transactions_read_all') THEN
    CREATE POLICY transactions_read_all ON public.transactions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'invoices_read_all') THEN
    CREATE POLICY invoices_read_all ON public.invoices FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sales' AND policyname = 'sales_read_all') THEN
    CREATE POLICY sales_read_all ON public.sales FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sale_items' AND policyname = 'sale_items_read_all') THEN
    CREATE POLICY sale_items_read_all ON public.sale_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contract_templates' AND policyname = 'contract_templates_read_all') THEN
    CREATE POLICY contract_templates_read_all ON public.contract_templates FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contracts' AND policyname = 'contracts_read_all') THEN
    CREATE POLICY contracts_read_all ON public.contracts FOR SELECT USING (true);
  END IF;
END$$;

-- Nota: Sem políticas de INSERT/UPDATE/DELETE para papel anon nesta fase.
-- Quando migrarmos Auth, criaremos políticas de escrita com base nos papéis e claims (franchise_id).
