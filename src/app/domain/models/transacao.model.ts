import { TipoTransacao, CategoriaTransacao } from '../enums';

export interface Transacao {
    id: number;
    usuarioId: number;
    tipo: TipoTransacao;
    valorOriginal: number;
    moedaOriginal: string;
    valorConvertido?: number;
    moedaConvertida?: string;
    taxaCambioAplicada?: number;
    categoria: CategoriaTransacao;
    data: string;
    descricao?: string;
}

export interface TransacaoCriacao {
    usuarioId: number;
    tipo: TipoTransacao;
    valor: number;
    moeda: string;
    categoria: CategoriaTransacao;
    descricao?: string;
}

export interface TransacaoFiltros {
    usuarioId?: number;
    inicio?: string;
    fim?: string;
    categoria?: CategoriaTransacao;
    moeda?: string;
}

export interface TransacaoPage {
    content: Transacao[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
