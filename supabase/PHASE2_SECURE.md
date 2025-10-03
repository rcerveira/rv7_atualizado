# Fase 2 (Seguro) — Supabase Auth + RLS forte + CRUD base

Este guia descreve os passos para ativar a segurança forte (RLS) e preparar o ambiente para CRUD real de Clients, Leads (+ Lead Notes) e Tasks.

## 1) Aplicar schema atualizado

No Supabase SQL Editor do seu projeto:

1. Abra e execute o conteúdo de `supabase/schema.sql` (atualizado nesta fase).
   - O arquivo adiciona:
     - Colunas `auth_user_id` em `system_users` e `franchise_users`.
     - Funções `fn_is_franchisor(uid uuid)` e `fn_user_franchise_id(uid uuid)`.
     - Políticas RLS de SELECT/INSERT/UPDATE/DELETE para `clients`, `leads`, `lead_notes` e `tasks`.
     - Remove as políticas de SELECT público destas tabelas (mantendo as permissivas apenas para as tabelas Core da Fase 1).

Observação: RLS só terá efeito no acesso via API (postgrest/JS client). No SQL Editor você vê tudo (por padrão como role privilegiada).

## 2) Vincular usuários do Supabase Auth aos perfis (auth_user_id)

Como você já criou os usuários no Supabase Auth:
- admin@rv7.com (senha: password123) — Franqueadora
- franqueado.sp@rv7.com (senha: password123) — Franqueado (franchise_id = 1)

Execute o SQL abaixo para popular `auth_user_id` nas tabelas de perfil. Ajuste os e-mails caso necessário.

```sql
-- Franqueadora (system_users): vincula por e-mail
UPDATE public.system_users su
SET auth_user_id = au.id
FROM auth.users au
WHERE au.email = 'admin@rv7.com'
  AND su.email = 'admin@rv7.com';

-- Franqueado (franchise_users): vincula por e-mail
UPDATE public.franchise_users fu
SET auth_user_id = au.id
FROM auth.users au
WHERE au.email = 'franqueado.sp@rv7.com'
  AND fu.email = 'franqueado.sp@rv7.com';
```

Dica (mapeamento em massa por e-mail):
```sql
-- System users (todos)
UPDATE public.system_users su
SET auth_user_id = au.id
FROM auth.users au
WHERE su.email = au.email;

-- Franchise users (todos)
UPDATE public.franchise_users fu
SET auth_user_id = au.id
FROM auth.users au
WHERE fu.email = au.email;
```

Valide:
```sql
SELECT id, name, email, auth_user_id FROM public.system_users;
SELECT id, franchise_id, name, email, auth_user_id FROM public.franchise_users;
```

## 3) Variáveis de ambiente do App

Certifique-se de configurar (local e Vercel):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Reinicie o app após definir as variáveis.

## 4) Fluxo de autenticação no App

- Quando `VITE_SUPABASE_*` está definido, o AuthContext usa Supabase Auth:
  - `login(email, password)` chama `supabase.auth.signInWithPassword`.
  - Ao autenticar, o App resolve o perfil:
    - Se `system_users.auth_user_id = auth.uid()` => `role = FRANCHISOR`.
    - Se `franchise_users.auth_user_id = auth.uid()` => `role = FRANCHISEE` (com `franchiseId`).
  - Fallback por e-mail existe para facilitar até todos os `auth_user_id` estarem preenchidos.
- Quando não há credenciais, a aplicação mantém o modo DEMO (mock) com `password123`.

## 5) CRUD disponível no services/dataService.ts

Novas funções (usadas em futuras etapas de integração com a UI):
- Clients:
  - `createClient(client)`
  - `updateClientRecord(client)`
  - `deleteClientRecord(clientId)`
- Leads:
  - `createLead(lead)`
  - `updateLeadRecord(lead)`
  - `deleteLeadRecord(leadId)`
  - `createLeadNote(note)`
- Tasks:
  - `createTask(task)`
  - `updateTaskRecord(task)`
  - `deleteTaskRecord(taskId)`

Todas respeitam RLS: 
- Usuário franqueadora (system_users) tem acesso total.
- Usuário franqueado acessa somente registros com `franchise_id = fn_user_franchise_id(auth.uid())`.

Quando o Supabase não está habilitado, estas funções retornam fallback/mock (para DX).

## 6) Testes recomendados

1. Faça login no App como:
   - `admin@rv7.com / password123` (FRANCHISOR)
   - `franqueado.sp@rv7.com / password123` (FRANCHISEE)
2. Exercite as operações de criação/edição/remoção (em PRs seguintes a UI será conectada aos métodos).
3. Verifique no Supabase (Tabela Editor) os dados inseridos.
4. Para sanity check de RLS no REST:
   - Use a aba: Project Settings > API > “Try it out” para chamadas com `anon` key autenticada via JWT do usuário (ou teste via app usando o client JS).

## 7) Próximos passos (PRs seguintes)

- Conectar os handlers do `DataContext` às funções do `dataService` para Clients, Leads(+notes) e Tasks (UI otimista + rollback).
- Adicionar toasts/UX de erro/sucesso.
- Completar migração de leitura para Supabase nos demais domínios.
- Endurecer RLS também nos domínios adicionais (financeiro, contratos, etc.).
- (Opcional) Edge Functions para lógicas mais complexas.
