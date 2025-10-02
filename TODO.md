# Plano de Migração: React Router + Supabase + Deploy Vercel + Git

Este plano rastreia o progresso das mudanças aprovadas.

## Itens

1. Dependências e Infra
   - [x] Adicionar react-router-dom ao projeto (package.json) e instalar dependências
   - [x] Criar branch git: blackboxai/router-supabase-vercel
   - [x] Criar index.css vazio para evitar 404 no Vercel

2. Roteamento (migrar do HashRouter custom para react-router-dom/HashRouter)
   - [x] App.tsx: remover RouterContext/HashRouterProvider/useHashRouter e usar HashRouter/Routes
   - [x] AuthGate.tsx: substituir useHashRouter por useLocation
   - [x] FranchisorDashboard.tsx: substituir useHashRouter por useLocation/useNavigate
   - [x] FranchiseWorkspace.tsx: substituir useHashRouter por useLocation/useNavigate/useParams
   - [x] FranchisorFinancials.tsx: substituir useHashRouter por useLocation
   - [x] FranchiseeFinancials.tsx: substituir useHashRouter por useLocation
   - [x] FranchiseeLeadCRM.tsx: substituir useHashRouter por useLocation

3. Supabase (ativação do cliente, migração faseada)
   - [x] utils/supabaseClient.ts: criar cliente via import.meta.env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY), exportar areSupabaseCredentialsSet dinâmico e supabase (ou null se ausente)
   - [ ] (Fase posterior) Criar services/supabase/* por domínio e migrar DataContext gradualmente

4. IA (fallback opcional)
   - [ ] Verificar componentes AISummary, AICandidateAnalysis, AINetworkInsights para evitar quebra caso GEMINI_API_KEY ausente (opcional nesta etapa)

5. Build e Deploy
   - [ ] Executar build local (npm run build) e validar sem erros
   - [ ] Configurar Vercel com variáveis: GEMINI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
   - [ ] Deploy

6. Git
   - [ ] Adicionar remote: git@github.com:rcerveira/rv7_atualizado.git
   - [ ] Commitar e push da branch blackboxai/router-supabase-vercel

## Notas
- Manteremos HashRouter do react-router-dom para facilitar deploy estático sem rewrites na Vercel.
- Nesta primeira fase, os handlers do DataContext continuam usando initialData (mock) até migração gradual para Supabase.
