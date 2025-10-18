import express from 'express';
import dotenv from 'dotenv';
import  { exportRouter }  from './edge/exportCsv';
import { emailRouter } from './services/sendEmails';
import { criarPedido } from './services/pedidos';

dotenv.config();

const app = express();
app.use(express.json());

// Rotas
app.use(exportRouter);
app.use(emailRouter);

app.listen(3000, () => console.log('Server running on port 3000'));

// Exemplo de uso
async function main() {
  const pedido = await criarPedido('UUID_DO_CLIENTE_TESTE', [
    { produto_id: 'UUID_PRODUTO_1', quantidade: 2 },
    { produto_id: 'UUID_PRODUTO_2', quantidade: 1 },
  ]);

  if (pedido) console.log("Pedido criado:", pedido);
}

main();