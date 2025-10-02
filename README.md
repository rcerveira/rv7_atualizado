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
