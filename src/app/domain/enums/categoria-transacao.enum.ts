export enum CategoriaTransacao {
    ALIMENTACAO = 'ALIMENTACAO',
    MORADIA = 'MORADIA',
    TRANSPORTE = 'TRANSPORTE',
    LAZER = 'LAZER',
    SAUDE = 'SAUDE',
    EDUCACAO = 'EDUCACAO',
    VESTUARIO = 'VESTUARIO',
    SERVICOS = 'SERVICOS',
    INVESTIMENTOS = 'INVESTIMENTOS',
    OUTROS = 'OUTROS'
}

export const CategoriaTransacaoLabels: Record<CategoriaTransacao, string> = {
    [CategoriaTransacao.ALIMENTACAO]: 'Alimentação',
    [CategoriaTransacao.MORADIA]: 'Moradia',
    [CategoriaTransacao.TRANSPORTE]: 'Transporte',
    [CategoriaTransacao.LAZER]: 'Lazer',
    [CategoriaTransacao.SAUDE]: 'Saúde',
    [CategoriaTransacao.EDUCACAO]: 'Educação',
    [CategoriaTransacao.VESTUARIO]: 'Vestuário',
    [CategoriaTransacao.SERVICOS]: 'Serviços',
    [CategoriaTransacao.INVESTIMENTOS]: 'Investimentos',
    [CategoriaTransacao.OUTROS]: 'Outros'
};

export const CategoriaTransacaoIcons: Record<CategoriaTransacao, string> = {
    [CategoriaTransacao.ALIMENTACAO]: '🍔',
    [CategoriaTransacao.MORADIA]: '🏠',
    [CategoriaTransacao.TRANSPORTE]: '🚗',
    [CategoriaTransacao.LAZER]: '🎬',
    [CategoriaTransacao.SAUDE]: '⚕️',
    [CategoriaTransacao.EDUCACAO]: '📚',
    [CategoriaTransacao.VESTUARIO]: '👕',
    [CategoriaTransacao.SERVICOS]: '🔧',
    [CategoriaTransacao.INVESTIMENTOS]: '📈',
    [CategoriaTransacao.OUTROS]: '❓'
};

export const CategoriaTransacaoColors: Record<CategoriaTransacao, string> = {
    [CategoriaTransacao.ALIMENTACAO]: '#FF9800',
    [CategoriaTransacao.MORADIA]: '#2196F3',
    [CategoriaTransacao.TRANSPORTE]: '#9C27B0',
    [CategoriaTransacao.LAZER]: '#E91E63',
    [CategoriaTransacao.SAUDE]: '#4CAF50',
    [CategoriaTransacao.EDUCACAO]: '#3F51B5',
    [CategoriaTransacao.VESTUARIO]: '#00BCD4',
    [CategoriaTransacao.SERVICOS]: '#FFC107',
    [CategoriaTransacao.INVESTIMENTOS]: '#009688',
    [CategoriaTransacao.OUTROS]: '#607D8B'
};
