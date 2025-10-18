// Tipagens das tabelas
export type Pedido = {
    id: number;
    cliente_id: number;
    criado_em: string;
};

export type Produto = {
    id: number;
    nome: string;
    preco: number;
};

export type ItemPedido = {
    pedido_id: number;
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
};