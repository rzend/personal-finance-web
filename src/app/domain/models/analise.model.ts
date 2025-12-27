import { CategoriaTransacao } from '../enums';

export interface AnaliseDespesas {
    usuarioId: number;
    periodo: string;
    moedaPadrao: string;
    totalGeral: number;
    ticketMedio: number;
    quantidadeTransacoes: number;
    resumoPorCategoria: ResumoCategoria[];
    totalPorMes: Record<string, number>;

    // Ticket médio por tipo
    ticketMedioPorTipoTransacao: Record<string, number>;

    // Investimentos
    totalInvestimentos: number;
    quantidadeInvestimentos: number;
    ticketMedioInvestimentos: number;
    investimentosPorMes: Record<string, number>;
}

export interface ResumoCategoria {
    categoria: CategoriaTransacao;
    total: number;
    percentual: number;
    quantidade: number;
    ticketMedio: number;
}

export interface DashboardMetricas {
    saldo: number;
    totalReceitas: number;
    totalDespesas: number;
    moeda: string;
}
