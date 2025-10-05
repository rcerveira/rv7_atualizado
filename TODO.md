# Plano de Migração: React Router + Supabase + Deploy Vercel + Git

Este plano rastreia o progresso das mudanças aprovadas.

## Itens

1. Dependências e Infra
   - [x] Adicionar react-router-dom ao projeto (package.json) e instalar dependências
   - [x] Criar branch git: blackboxai/router-supabase-vercel
   - [x] Criar index.css vazio para evitar 404 no Vercel
   - [x] Remover define process.env.* legado do vite.config.ts
   - [x] Adicionar .env.example com VITE_GEMINI_API_KEY e VITE_SUPABASE_*

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
   - [x] Ajustar AISummary, AICandidateAnalysis, AINetworkInsights para usar VITE_GEMINI_API_KEY e exibir fallback quando ausente

5. Build e Deploy
   - [x] Executar build local (npm run build) e validar sem erros
   - [ ] Configurar Vercel com variáveis: VITE_GEMINI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
   - [ ] Deploy

6. Git
   - [ ] Adicionar remote: git@github.com:rcerveira/rv7_atualizado.git
   - [ ] Commitar e push da branch blackboxai/router-supabase-vercel

## Notas
- Manteremos HashRouter do react-router-dom para facilitar deploy estático sem rewrites na Vercel.
- Nesta primeira fase, os handlers do DataContext continuam usando initialData (mock) até migração gradual para Supabase.

7. Fase 2 - Secure (Validações e UX)
   - [x] Banner de Status de Conexão: mostrar Supabase vs DEMO com hostname do projeto quando disponível
       - [x] components/BannerStatusConexao.tsx criado
       - [x] Integrado em FranchisorDashboard e FranchiseWorkspace
   - [x] Corrigir warning de chave única "Dots2" (Recharts)
       - [x] components/PerformanceChart.tsx: adicionar key nos dots custom (renderDot)
   - [x] Feedback de erro via toasts nas operações remotas
       - [x] components/ToastProvider.tsx criado
       - [x] App.tsx: envolver a aplicação com <ToastProvider>
       - [x] contexts/DataContext.tsx: usar useToast() para notificar falhas remotas (create/update clients/leads/notes/tasks/status)

8. Fase A - DEMO Override (Auth)
   - [x] AuthContext.tsx: introduzir supabaseActive (areSupabaseCredentialsSet && supabase && !forceDemoAuth) e aviso via toast quando override ativo
   - [x] LoginPage.tsx: adicionar controles "Forçar DEMO" e "Usar Supabase" (localStorage.forceDemoAuth)
   - [x] BannerStatusConexao.tsx: refletir "Modo DEMO (forçado)" quando override está ligado
   - [x] Garantir preservação do login DEMO mesmo com Supabase configurado

9. Fase B - Dados (prioridade: Leads)
   - [x] services/dataService.ts: fetchLeads usando Supabase (fallback para mock)
   - [x] services/dataService.ts: fetchLeadNotes usando Supabase (fallback para mock)
   - [x] services/dataService.ts: fetchClients usando Supabase (usado nas telas de detalhe de Lead)
   - [ ] Introduzir @tanstack/react-query (QueryClient, hooks por domínio) — etapa posterior
   - [ ] Migrar DataContext para consumir hooks por domínio gradualmente
