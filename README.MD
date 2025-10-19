# Projeto E-commerce Node.js + Supabase

## Descrição
Projeto de exemplo de e-commerce utilizando Node.js, TypeScript e Supabase.  
Inclui gerenciamento de clientes, produtos, pedidos e itens de pedidos, com Row-Level Security (RLS) aplicada para garantir que apenas usuários autorizados acessem e modifiquem seus próprios dados.

---

## Funcionalidades
- Criação, leitura e gerenciamento de clientes e produtos.
- Criação de pedidos e itens de pedidos relacionados.
- Cálculo automático do total do pedido via função RPC (`calcular_total_pedido`).
- Notificações de novos pedidos via endpoint de email.
- Segurança reforçada com RLS: inserts e selects restritos a usuários autenticados (`owner_id = auth.uid()`).

---

## Tecnologias
- Node.js + TypeScript
- Supabase (PostgreSQL)
- Express.js para APIs
- Dotenv para variáveis de ambiente

---

## Setup

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
Instale dependências:

bash
Copiar código
npm install
Crie um arquivo .env na raiz com as variáveis:

ini
Copiar código
SUPABASE_URL=<sua-url>
SUPABASE_SERVICE_ROLE_KEY=<sua-service-role-key>
Inicialize dados de teste:

bash
Copiar código
npx ts-node src/index.ts
Certifique-se de que as tabelas (clientes, produtos, pedidos, itens_pedido) existem e que RLS está configurada corretamente para inserts e selects.

Row-Level Security (RLS)
Tabelas protegidas: clientes, produtos, pedidos, itens_pedido.

Políticas criadas para FOR INSERT e FOR SELECT usando owner_id = (SELECT auth.uid())::uuid.

Scripts idempotentes usando DROP POLICY IF EXISTS.

Recomenda-se criar índice em owner_id para performance.

Para rollback, use DROP POLICY e ALTER TABLE ... DISABLE ROW LEVEL SECURITY.