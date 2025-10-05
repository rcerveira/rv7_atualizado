<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1aSGfBgyK8ceJkgXxqCzaYqGNOVgKX0CR

## Run Locally

**Prerequisites:**  Node.js

1. Instale dependências:
   `npm install`
2. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env.local` ou crie `.env.development.local`
   - Defina:
     - `VITE_GEMINI_API_KEY=` (obrigatório para recursos de IA)
     - `VITE_SUPABASE_URL=` e `VITE_SUPABASE_ANON_KEY=` (opcionais; sem elas a aplicação usa dados locais/mock)
3. Rode o app em desenvolvimento:
   `npm run dev`
4. (Opcional) Build e Preview de produção:
   - `npm run build`
   - `npm run preview`

## Variáveis de Ambiente (Vite)
- `VITE_GEMINI_API_KEY`: chave da API do Google Gemini usada pelos componentes de IA (AISummary, AICandidateAnalysis, AINetworkInsights).
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`: habilitam o cliente Supabase. Se ausentes, o app utiliza dados de exemplo (mock) localmente.

## Deploy na Vercel
1. Crie um novo projeto na Vercel apontando para este repositório.
2. Configure as variáveis no painel da Vercel:
   - `VITE_GEMINI_API_KEY`
   - (opcional) `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. Build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Observação de roteamento:
   - A aplicação usa `HashRouter` (URLs com `#/`), adequado para hosting estático sem rewrites adicionais.

## Autenticação (Supabase vs DEMO)

A aplicação suporta dois modos de autenticação:
- Supabase (recomendado em produção)
- DEMO (dados locais, sem persistência remota)

A detecção é automática com base nas variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).

### Configuração do Supabase

1) Crie o arquivo `.env.local` a partir do exemplo:
   cp .env.local.example .env.local

2) Preencha as variáveis:
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=chave-anon-publica

3) (Opcional, IA)
   VITE_GEMINI_API_KEY=sua-api-key

4) Rode a aplicação:
   npm run dev

Quando configurado, a tela de login usará Supabase Auth (email/senha) e o banner mostrará:
- “Conectado ao Supabase”
- Host do projeto
- E-mail e papel do usuário
- “RLS ativo”

### Usuários e papéis (RLS)

Para que as permissões funcionem, os usuários autenticados precisam estar mapeados nas tabelas:
- public.system_users (franqueadora) — papel FRANCHISOR
- public.franchise_users (franquia) — papel FRANCHISEE

O mapeamento recomendado é via coluna `auth_user_id` (uuid do Supabase Auth). Consulte `supabase/schema.sql` (seção “FASE 2 (SEGURO)”) para políticas RLS.

Dica de migração (após criar os usuários em Authentication > Users), atualize `auth_user_id`:
  UPDATE public.system_users su
    SET auth_user_id = au.id
  FROM auth.users au
  WHERE au.email = su.email;

  UPDATE public.franchise_users fu
    SET auth_user_id = au.id
  FROM auth.users au
  WHERE au.email = fu.email;

Caso `auth_user_id` ainda não esteja preenchido, a aplicação faz um fallback por e-mail (temporário).

### Modo DEMO (sempre disponível)

Mesmo com Supabase configurado, o modo DEMO permanece disponível na tela de login:
- Franqueadora: admin@rv7.com / password123
- Franqueado: franqueado.sp@rv7.com / password123

No modo DEMO, os dados são locais (sem escrita remota). Em falhas remotas, a aplicação exibe toasts de erro e mantém o estado da UI com fallback local.

## Banner de Status de Conexão

O componente `BannerStatusConexao` (usado no Dashboard e Workspace) indica:
- Supabase vs DEMO
- Host do projeto Supabase
- E-mail e papel do usuário autenticado
- “RLS ativo” quando remoto habilitado

## Troubleshooting (Auth)

- Login falha com Supabase:
  - Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
  - Confirme que o usuário existe em Authentication > Users.
  - Confirme o mapeamento na tabela `system_users` ou `franchise_users` (`auth_user_id` ou e-mail).

- RLS bloqueando escritas:
  - Revise as políticas no arquivo `supabase/schema.sql` (seção Fase 2 Seguro).
  - Garanta que o usuário esteja associado à franquia correta.

- Sem variáveis do Supabase:
  - A aplicação opera em modo DEMO automaticamente.
