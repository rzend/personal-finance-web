export enum TipoTransacao {
    DEPOSITO = 'DEPOSITO',
    RETIRADA = 'RETIRADA',
    TRANSFERENCIA = 'TRANSFERENCIA',
    DESPESA = 'DESPESA',
    RECEITA = 'RECEITA'
}

export const TipoTransacaoLabels: Record<TipoTransacao, string> = {
    [TipoTransacao.DEPOSITO]: 'Depósito',
    [TipoTransacao.RETIRADA]: 'Retirada',
    [TipoTransacao.TRANSFERENCIA]: 'Transferência',
    [TipoTransacao.DESPESA]: 'Despesa',
    [TipoTransacao.RECEITA]: 'Receita'
};

export const TipoTransacaoIcons: Record<TipoTransacao, string> = {
    [TipoTransacao.DEPOSITO]: '💰',
    [TipoTransacao.RETIRADA]: '💸',
    [TipoTransacao.TRANSFERENCIA]: '🔄',
    [TipoTransacao.DESPESA]: '📉',
    [TipoTransacao.RECEITA]: '📈'
};

export function isTipoReceita(tipo: TipoTransacao): boolean {
    return tipo === TipoTransacao.DEPOSITO || tipo === TipoTransacao.RECEITA;
}

export function isTipoDespesa(tipo: TipoTransacao): boolean {
    return tipo === TipoTransacao.RETIRADA || tipo === TipoTransacao.DESPESA;
}
