class CaixaDaLanchonete {

    /* 
    | codigo    | descrição                   | valor   |
    |-----------|-----------------------------|---------|
    | cafe      | Café                        | R$ 3,00 |
    | chantily  | Chantily (extra do Café)    | R$ 1,50 |
    | suco      | Suco Natural                | R$ 6,20 |
    | sanduiche | Sanduíche                   | R$ 6,50 |
    | queijo    | Queijo (extra do Sanduíche) | R$ 2,00 |
    | salgado   | Salgado                     | R$ 7,25 |
    | combo1    | 1 Suco e 1 Sanduíche        | R$ 9,50 |
    | combo2    | 1 Café e 1 Sanduíche        | R$ 7,50 |
    */

    produtos = [
        {codigo: 'cafe', preco: 3.00, tipo: 'principal'},
        {codigo: 'chantily', preco: 1.50, tipo: 'extra cafe'},
        {codigo: 'suco', preco: 6.20, tipo: 'principal'},
        {codigo: 'sanduiche', preco: 6.50, tipo: 'principal'},
        {codigo: 'queijo', preco: 2.00, tipo: 'extra sanduiche'},
        {codigo: 'salgado', preco: 7.25, tipo: 'principal'},
        {codigo: 'combo1', preco: 9.50, tipo: 'combo'},
        {codigo: 'combo2', preco: 7.50, tipo: 'combo'}
    ]

    calcularValorDaCompra(metodoDePagamento, itens) {
        if (!this.metodoPagamentoValido(metodoDePagamento)) {
            return 'Forma de pagamento inválida!';
        }
        
        if (itens.length == 0) {
            return 'Não há itens no carrinho de compra!';
        }

        let carrinho;

        try {
            carrinho = itens.map((item) => {
                const detalhesItem = item.split(',');
                const codigo = detalhesItem[0];
                const qtde = Number(detalhesItem[1]);

                if (!this.codigoItemValido(codigo)) throw 'Item inválido!';
                if (qtde == 0) throw 'Quantidade inválida!';

                return {codigo: codigo, qtde: qtde};
            });
        } catch (err) {
            return err;
        }

        let total;

        try {
            
            total = carrinho.reduce((acc, item) => {
                if (!this.ehItemPrincipal(item.codigo))
                    if (!this.principalEstaNoCarrinho(carrinho, item.codigo))
                        throw 'Item extra não pode ser pedido sem o principal';

                return acc + (item.qtde * this.obterValorProduto(item.codigo));
            }, 0);

        } catch(err) {
            return err;
        }
        
        let valorFinal;

        if (metodoDePagamento == 'dinheiro')
            valorFinal = total * (1 - 0.05);
        else if (metodoDePagamento == 'credito')
            valorFinal = total * (1 + 0.03);
        else
            valorFinal = total;

        valorFinal = valorFinal.toFixed(2);
        const saida = `R$ ${valorFinal}`.replace('.', ',');

        return saida;
    }

    metodoPagamentoValido(metodoDePagamento) {
        switch(metodoDePagamento) {
            case 'dinheiro':
            case 'debito':
            case 'credito':
                return true;
            default:
                return false;
        }
    }

    codigoItemValido(codigoItem) {
        return this.produtos.filter((x) => x.codigo == codigoItem).length != 0;
    }

    ehItemPrincipal(item) {
        const principal = this.produtos.reduce((acc, produto) => {
            if (produto.codigo == item) {
                if (!produto.tipo.includes('extra')) acc++;
            }
            return acc;
        }, 0);

        if (principal) return true;
        return false;
    }

    principalEstaNoCarrinho(carrinho, extra) {
        const principal = this.produtos.reduce((acc, item) => {
            if (item.codigo == extra) {
                let itemPrincipal;
                if (item.tipo.includes('extra')) {
                    itemPrincipal = item.tipo.split(' ')[1];
                    acc = itemPrincipal;
                }
            }
            return acc;
        }, '');

        const estaNoCarrinho = carrinho.reduce((acc, item) => {
            if (item.codigo == principal) acc++;
            return acc;
        }, 0)

        if (estaNoCarrinho != 0)
            return true;

        return false;
    }

    obterValorProduto(produto) {
        const valor = this.produtos.reduce((acc, item) => {
            if (item.codigo == produto) acc = item.preco;
            return acc;
        }, 0);

        return valor;
    }
}

export { CaixaDaLanchonete };
