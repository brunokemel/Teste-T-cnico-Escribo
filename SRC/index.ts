import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Pedido } from './Types/types';

dotenv.config();

console.log('URL do Supabase:', process.env.SUPABASE_URL);

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ==========================
// Função de criação de pedidos
// ==========================
export async function criarPedido(clienteId: number, itens: { produto_id: number, quantidade: number }[]) {
    // Busca de produtos
    const { data: produtos } = await supabase
        .from('produtos')
        .select('*')
        .in('id', itens.map(item => item.produto_id));

    // Cria pedido
    const { data: pedido } = (await supabase
        .from('pedidos')
        .insert({ cliente_id: clienteId })
        .single()) as { data: Pedido | null };

    if (!pedido) {
        throw new Error('Falha ao criar pedido');
    }

    // Inserir itens do pedido
    const itensInsert = itens.map(i => ({
        pedido_id: pedido.id,
        produto_id: i.produto_id,
        quantidade: i.quantidade,
        preco_unitario: produtos?.find(p => p.id === i.produto_id)?.preco ?? 0
    }));

    await supabase.from('itens_pedido').insert(itensInsert);

    // Calcula total via SQL
    await supabase.rpc('calcular_total_pedido', { p_pedido_id: pedido.id });

    console.log(`Pedido criado com ID ${pedido.id}`);
    return pedido;
}


// Função simples para buscar notificações
export async function buscarNotificacoes() {
    const { data: notificacoes, error } = await supabase
        .from('notificacoes')
        .select('*')
        .order('criado_em', { ascending: false });

    if (error) {
        console.error('Erro ao buscar notificações:', error);
        return [];
    }

    return notificacoes;
}

// ==========================
// Exemplo de uso rápido
// ==========================
async function main() {
    try {
        // Criar pedido de exemplo
        const pedido = await criarPedido(1, [
            { produto_id: 1, quantidade: 2 },
            { produto_id: 2, quantidade: 1 }
        ]);

        console.log('Pedido criado:', pedido);

        // Buscar notificações recentes
        const notificacoes = await buscarNotificacoes();
        console.log('Notificações recentes:', notificacoes);
    } catch (err) {
        console.error(err);
    }
}

main();