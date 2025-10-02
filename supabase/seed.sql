-- RV7 Gerenciador de Franquias - Seed de dados (Fase 1 - Read-only)
-- Execute no SQL Editor do Supabase após aplicar o schema.sql

BEGIN;

-- =========================
-- PRODUCTS
-- =========================
INSERT INTO public.products (id, name, description, is_active) VALUES
  (1, 'Consórcio de Imóveis', 'Cartas de crédito para aquisição de imóveis residenciais e comerciais.', TRUE),
  (2, 'Consórcio de Automóveis', 'Planos para compra de carros, motos e outros veículos.', TRUE),
  (3, 'Recuperação de Crédito (Limpa Nome)', 'Serviços de renegociação de dívidas e limpeza de nome.', TRUE),
  (4, 'Seguro de Vida', 'Apólices de seguro de vida individual e familiar.', FALSE)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- FRANCHISES
-- =========================
INSERT INTO public.franchises (id, name, location, cnpj, corporate_name, inauguration_date, owner_name, owner_email, owner_phone, allowed_product_ids) VALUES
  (1, 'RV7 SP', 'São Paulo/SP', '11.111.111/0001-11', 'RV7 CONSULTORIA SP LTDA', '2023-01-15', 'CARLOS SILVA', 'franqueado.sp@rv7.com', '(11) 99999-1111', ARRAY[1,2,3]),
  (2, 'RV7 RJ', 'Rio de Janeiro/RJ', '22.222.222/0001-22', 'RV7 SOLUCOES FINANCEIRAS RJ ME', '2023-03-20', 'MARIA OLIVEIRA', 'franqueado.rj@rv7.com', '(21) 99999-2222', ARRAY[1,3]),
  (3, 'RV7 MG', 'Belo Horizonte/MG', '33.333.333/0001-33', 'RV7 MG SERVICOS FINANCEIROS EIRELI', '2023-05-10', 'JOÃO PEREIRA', 'franqueado.mg@rv7.com', '(31) 99999-3333', ARRAY[1,2,3])
ON CONFLICT (id) DO NOTHING;

-- =========================
-- SYSTEM USERS (FRANQUEADORA)
-- =========================
INSERT INTO public.system_users (id, name, email, role) VALUES
  (1, 'ADMINISTRADOR', 'admin@rv7.com', 'ADMIN'),
  (2, 'GERENTE DE REDE', 'gerente@rv7.com', 'MANAGER')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- FRANCHISE USERS
-- =========================
INSERT INTO public.franchise_users (id, franchise_id, name, email, role) VALUES
  (1, 1, 'CARLOS SILVA', 'franqueado.sp@rv7.com', 'OWNER'),
  (2, 1, 'FERNANDA LIMA', 'vendedor.sp@rv7.com', 'SALESPERSON'),
  (3, 2, 'MARIA OLIVEIRA', 'franqueado.rj@rv7.com', 'OWNER'),
  (4, 3, 'JOÃO PEREIRA', 'franqueado.mg@rv7.com', 'OWNER')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- FRANCHISOR SETTINGS (1 LINHA)
-- =========================
DELETE FROM public.franchisor_settings;
INSERT INTO public.franchisor_settings (
  franchisor_name, logo_url, primary_color, secondary_color, royalty_percentage, marketing_fee_percentage,
  default_software_fee, default_sales_commission_percentage, initial_franchise_fee, contact_name, contact_email, contact_phone
) VALUES (
  'RV7',
  '',
  '#1E3A8A',
  '#10B981',
  5,
  2,
  250,
  10,
  25000,
  'JOÃO SILVA (SUPORTE)',
  'suporte@rv7.com',
  '(11) 98765-4321'
);

-- =========================
-- CLIENTS
-- =========================
INSERT INTO public.clients (
  id, franchise_id, name, phone, email, type, cpf, cnpj, razao_social, cep, logradouro, numero, complemento, bairro, cidade, estado, created_at
) VALUES
  (1, 1, 'EMPRESA ABC LTDA', '(11) 98888-1234', 'contato@empresaabc.com', 'PESSOA_JURIDICA', NULL, '44.444.444/0001-44', 'ABC COMERCIO E SERVICOS LTDA', '01311-000', 'AVENIDA PAULISTA', '1000', 'ANDAR 10', 'BELA VISTA', 'SÃO PAULO', 'SP', '2024-05-10T10:00:00Z'),
  (2, 1, 'ANA SOUZA', '(11) 97777-5678', 'ana.souza@email.com', 'PESSOA_FISICA', '111.222.333-44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-06-15T14:20:00Z'),
  (3, 2, 'PEDRO COSTA', '(21) 96666-8765', 'pedro.costa@email.com', 'PESSOA_FISICA', '222.333.444-55', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-06-01T09:00:00Z'),
  (4, 3, 'CONSTRUTORA HORIZONTE', '(31) 95555-4321', 'financeiro@construtorahorizonte.com', 'PESSOA_JURIDICA', NULL, '55.555.555/0001-55', 'HORIZONTE EMPREENDIMENTOS IMOBILIARIOS LTDA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-01T11:00:00Z'),
  (5, 1, 'MARCOS ROCHA', '(11) 94444-1122', 'marcos.rocha@email.com', 'PESSOA_FISICA', '333.444.555-66', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05T16:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- LEADS
-- =========================
INSERT INTO public.leads (
  id, franchise_id, client_id, service_of_interest, status, created_at, source, negotiated_value, salesperson_id
) VALUES
  (1, 1, 1, 'Recuperação de Crédito (Limpa Nome)', 'NEGOTIATING', '2024-07-10T10:00:00Z', 'Indicação', 15000, 1),
  (2, 1, 2, 'Consórcio de Automóveis', 'WON', '2024-06-15T14:21:00Z', 'Instagram', 80000, 2),
  (3, 2, 3, 'Consórcio de Imóveis', 'CONTACTED', '2024-07-12T09:05:00Z', 'Site', 300000, NULL),
  (4, 3, 4, 'Consórcio de Imóveis', 'NEW', '2024-07-20T11:00:00Z', 'Feira de Imóveis', NULL, NULL),
  (5, 1, 5, 'Consórcio de Imóveis', 'LOST', '2024-07-05T16:05:00Z', 'Google Ads', 120000, NULL)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- LEAD NOTES
-- =========================
INSERT INTO public.lead_notes (id, lead_id, text, author, created_at) VALUES
  (1, 1, 'Primeira reunião realizada. Cliente demonstrou grande interesse em renegociar dívidas com fornecedores. Enviada proposta de serviço.', 'Carlos Silva', '2024-07-11T15:00:00Z'),
  (2, 2, 'Venda concluída com sucesso! Cliente adquiriu carta de R$ 80.000,00.', 'Fernanda Lima', '2024-06-20T18:00:00Z'),
  (3, 3, 'Feito primeiro contato por telefone. Cliente pediu para retornar na próxima semana com simulações de cartas de R$ 300.000.', 'Maria Oliveira', '2024-07-12T10:30:00Z'),
  (4, 1, 'Cliente solicitou ajuste na proposta. Agendada nova conversa para amanhã.', 'Carlos Silva', '2024-07-18T17:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- TASKS
-- =========================
INSERT INTO public.tasks (id, franchise_id, lead_id, title, due_date, completed) VALUES
  (1, 1, 1, 'Enviar nova proposta para Empresa ABC', '2024-07-19', FALSE),
  (2, 2, 3, 'Preparar simulações para Pedro Costa', '2024-07-18', FALSE),
  (3, 1, 2, 'Realizar pós-venda com Ana Souza', '2024-07-01', TRUE),
  (4, 1, NULL, 'Organizar documentos do mês', current_date - 2, FALSE)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- TRANSACTIONS
-- =========================
INSERT INTO public.transactions (id, franchise_id, description, amount, type, category, date) VALUES
  (1, 0, 'Recebimento Royalties RV7 SP', 7500, 'INCOME', 'ROYALTIES', '2024-07-05T10:00:00Z'),
  (2, 0, 'Pagamento Fornecedor Software', 2500, 'EXPENSE', 'OPERATIONAL_EXPENSE', '2024-07-08T11:00:00Z'),
  (3, 1, 'Comissão Venda Consórcio - Ana Souza', 8000, 'INCOME', 'SALES_COMMISSION', '2024-06-22T10:00:00Z'),
  (4, 1, 'Aluguel Escritório', 3500, 'EXPENSE', 'OPERATIONAL_EXPENSE', '2024-07-05T09:00:00Z'),
  (10, 1, 'Comissão Rec. Crédito', 5000, 'INCOME', 'SALES_COMMISSION', '2024-07-10T09:00:00Z'),
  (5, 2, 'Comissão Venda Consórcio - Pedro Costa', 12000, 'INCOME', 'SALES_COMMISSION', '2024-06-07T10:00:00Z'),
  (6, 2, 'Pagamento Royalties', 5000, 'EXPENSE', 'ROYALTIES', '2024-07-06T09:00:00Z'),
  (7, 3, 'Adiantamento Construtora Horizonte', 20000, 'INCOME', 'SALES_COMMISSION', '2024-07-03T10:00:00Z'),
  (8, 3, 'Despesas Marketing Local', 2000, 'EXPENSE', 'MARKETING_EXPENSE', '2024-07-01T09:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- INVOICES
-- =========================
INSERT INTO public.invoices (id, franchise_id, client_name, amount, due_date, status) VALUES
  (1, 1, 'Royalties - RV7 SP', 7500, '2024-07-05', 'PAID'),
  (2, 2, 'Royalties - RV7 RJ', 5000, '2024-07-05', 'PAID'),
  (3, 3, 'Royalties - RV7 MG', 6000, '2024-08-05', 'SENT')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- SALES & SALE ITEMS
-- =========================
INSERT INTO public.sales (id, franchise_id, client_id, lead_id, salesperson_id, sale_date, total_amount, payment_method, installments, status) VALUES
  (1, 1, 2, 2, 2, '2024-06-20T18:00:00Z', 8000, 'À Vista', 1, 'PAID')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sale_items (id, sale_id, product_id, product_name, value) VALUES
  (1, 1, 2, 'Consórcio de Automóveis', 8000)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- CONTRACT TEMPLATES
-- =========================
INSERT INTO public.contract_templates (id, title, product_id, body, is_active) VALUES
  (1, 'Contrato Padrão - Consórcio de Automóveis', 2,
   'CONTRATO DE ADESÃO A GRUPO DE CONSÓRCIO

CONTRATANTE: {{CLIENT_NAME}}, portador do documento {{CLIENT_CPF_CNPJ}}, residente em {{CLIENT_ADDRESS}}.

OBJETO: Aquisição de uma carta de crédito para automóveis, conforme detalhes da venda:
{{SALE_ITEMS}}

VALOR TOTAL: {{SALE_TOTAL}}

DATA: {{SALE_DATE}}

________________________
Assinatura do Contratante', TRUE)
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Dicas:
-- - Se executar múltiplas vezes, os ON CONFLICT evitam duplicações por id.
-- - Ajuste datas caso necessário.
