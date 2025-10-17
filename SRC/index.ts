import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// função de criação de pedidos
export async function criarPedido(clienteId: number, itens: { produto_id: number, quantidade: number }[]) {
    //busca de produtos
    const { data: produtos } = await supabase
        .from('produtos')
        .select('*')
        .in('id', itens.map(item => item.produto_id));

    //criar pedidos
    const { data: pedido } = await supabase
        .from('pedidos')
        .insert({ cliente_id: clienteId })
        .single();

    if (!pedido) {
        throw new Error('Falha ao criar pedido');
    }

    //inserir itens no pedido
    const itensInsert = itens.map(i => ({
        pedido_id: pedido.id,
        produto_id: i.produto_id,
        quantidade: i.quantidade,
        preco_unitario: produtos?.find(p => p.id === i.produto_id)?.preco ?? 0
    }));
    //inserir itens no banco
    await supabase.from('itens_pedido').insert(itensInsert);

    // Calcula total via SQL
    await supabase.rpc('calcular_total_pedido', { p_pedido_id: pedido.id });

    console.log('Pedido criado com ID ${pedido.id}')
    return pedido;
}