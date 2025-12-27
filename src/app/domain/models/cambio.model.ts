export interface Moeda {
    simbolo: string;
    nome: string;
    tipoMoeda: string;
}

export interface TaxaCambio {
    moedaOrigem: string;
    moedaDestino: string;
    taxa: number;
    obtidaEm: string;
}

export interface CalculoCambioRequest {
    valor: number;
    moedaOrigem: string;
    moedaDestino: string;
    margem: number;
}

export interface ConversaoResultado {
    valorOriginal: number;
    moedaOrigem: string;
    valorConvertido: number;
    moedaDestino: string;
    taxa: number;
    margemAplicada: number;
    custoTotal: number;
}
