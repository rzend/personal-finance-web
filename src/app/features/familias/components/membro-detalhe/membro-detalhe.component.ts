import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransacoesApiService } from 'src/app/data/datasources/transacoes-api.service';
import { AnaliseApiService } from 'src/app/data/datasources/analise-api.service';
import { UsuariosApiService } from 'src/app/data/datasources/usuarios-api.service';
import { Transacao, AnaliseDespesas } from '@domain/models';
import { CategoriaTransacao, CategoriaTransacaoColors, CategoriaTransacaoLabels, CategoriaTransacaoIcons, TipoTransacao } from '@domain/enums';

@Component({
    selector: 'app-membro-detalhe',
    templateUrl: './membro-detalhe.component.html',
    styleUrls: ['./membro-detalhe.component.css']
})
export class MembroDetalheComponent implements OnInit {
    usuarioId: number = 0;
    transacoes: Transacao[] = [];
    analise: AnaliseDespesas | null = null;
    loading = true;
    activeTab: 'transacoes' | 'analise' = 'transacoes';

    memberName: string = '';
    memberInitials: string = '';

    monthlyData: Array<{
        label: string;
        shortLabel: string;
        value: number;
        percentage: number;
    }> = [];

    constructor(
        private route: ActivatedRoute,
        private transacoesService: TransacoesApiService,
        private analiseService: AnaliseApiService,
        private usuariosService: UsuariosApiService
    ) { }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.usuarioId = +idParam;
            this.carregarDados();
        }
    }

    get totalDespesas(): number {
        return this.transacoes
            .filter(t => t.tipo === TipoTransacao.DESPESA || t.tipo === TipoTransacao.RETIRADA)
            .reduce((sum, t) => sum + t.valorOriginal, 0);
    }

    get totalReceitas(): number {
        return this.transacoes
            .filter(t => t.tipo === TipoTransacao.RECEITA || t.tipo === TipoTransacao.DEPOSITO)
            .reduce((sum, t) => sum + t.valorOriginal, 0);
    }

    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    carregarDados() {
        this.loading = true;

        // Buscar dados do usuário para exibir nome e avatar
        this.usuariosService.buscarPorId(this.usuarioId).subscribe({
            next: (usuario) => {
                this.memberName = usuario.nomeCompleto;
                this.memberInitials = this.getInitials(usuario.nomeCompleto);
            },
            error: () => {
                this.memberName = `Usuário #${this.usuarioId}`;
                this.memberInitials = 'U' + (this.usuarioId % 10);
            }
        });

        // Carregar transações
        this.transacoesService.listar({ usuarioId: this.usuarioId }).subscribe({
            next: (page) => {
                this.transacoes = page.content;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });

        // Carregar análise
        this.analiseService.analisarDespesas(this.usuarioId).subscribe({
            next: (data) => {
                this.analise = data;
                if (data.totalPorMes) {
                    this.processMonthlyData(data.totalPorMes);
                }
            }
        });
    }

    private processMonthlyData(totalPorMes: Record<string, number>): void {
        const entries = Object.entries(totalPorMes);
        const maxValue = Math.max(...entries.map(([_, v]) => v), 1);

        this.monthlyData = entries.slice(-6).map(([key, value]) => ({
            label: key,
            shortLabel: key.substring(0, 3),
            value,
            percentage: (value / maxValue) * 100
        }));
    }

    getCategoryLabel(cat: CategoriaTransacao | string): string {
        return CategoriaTransacaoLabels[cat as CategoriaTransacao] || cat || 'Outros';
    }

    getCategoryIcon(cat: CategoriaTransacao | string): string {
        return CategoriaTransacaoIcons[cat as CategoriaTransacao] || '❓';
    }

    getCategoryColor(cat: CategoriaTransacao | string): string {
        return CategoriaTransacaoColors[cat as CategoriaTransacao] || '#607D8B';
    }

    getCategoryBgColor(cat: CategoriaTransacao | string): string {
        return `${this.getCategoryColor(cat)}20`;
    }

    isDespesa(tipo: TipoTransacao): boolean {
        return tipo === TipoTransacao.DESPESA || tipo === TipoTransacao.RETIRADA;
    }

    isReceita(tipo: TipoTransacao): boolean {
        return tipo === TipoTransacao.RECEITA || tipo === TipoTransacao.DEPOSITO;
    }
}
