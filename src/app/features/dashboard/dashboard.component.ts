import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '@core/services';
import { TransacoesApiService, SaldoApiService, AnaliseApiService } from '@data/datasources';
import { MetricCardComponent, TransactionCardComponent, LoadingSpinnerComponent } from '@shared/components';
import { Transacao, AnaliseDespesas } from '@domain/models';
import { CategoriaTransacaoColors, CategoriaTransacaoLabels, CategoriaTransacao } from '@domain/enums';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MetricCardComponent,
    TransactionCardComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div>
          <h1>Olá, {{ userName }}! 👋</h1>
          <p>Aqui está o resumo das suas finanças</p>
        </div>
        <button class="btn-new-transaction" routerLink="/transacoes/nova">
          + Nova Transação
        </button>
      </div>

      <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" text="Carregando..."></app-loading-spinner>

      <ng-container *ngIf="!isLoading">
        <!-- Metrics Cards -->
        <div class="metrics-grid">
          <app-metric-card
            icon="💰"
            iconBgColor="#EEF2FF"
            [value]="saldo"
            label="Saldo Atual"
            sublabel="Atualizado agora"
            [valueColor]="saldo >= 0 ? '#10B981' : '#EF4444'"
          ></app-metric-card>
          
          <app-metric-card
            icon="📈"
            iconBgColor="#ECFDF5"
            [value]="totalReceitas"
            label="Receitas"
            sublabel="Este mês"
            valueColor="#10B981"
            [trend]="17"
          ></app-metric-card>
          
          <app-metric-card
            icon="📉"
            iconBgColor="#FEF2F2"
            [value]="totalDespesas"
            label="Despesas"
            sublabel="Este mês"
            valueColor="#EF4444"
            [trend]="-8"
          ></app-metric-card>
          
          <app-metric-card
            icon="📊"
            iconBgColor="#FFF7ED"
            [value]="ticketMedio"
            label="Ticket Médio"
            sublabel="{{ quantidadeTransacoes }} transações"
          ></app-metric-card>

          <app-metric-card
            icon="💎"
            iconBgColor="#F0F9FF"
            [value]="totalInvestimentos"
            label="Investimentos"
            sublabel="Total investido"
            valueColor="#0EA5E9"
          ></app-metric-card>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
          <!-- Recent Transactions -->
          <div class="card recent-transactions">
            <div class="card-header">
              <h2>Transações Recentes</h2>
              <a routerLink="/transacoes" class="view-all">Ver todas →</a>
            </div>
            <div class="transactions-list">
              <app-transaction-card 
                *ngFor="let transacao of recentTransactions"
                [transacao]="transacao"
              ></app-transaction-card>
              <div class="empty-state" *ngIf="recentTransactions.length === 0">
                <p>Nenhuma transação registrada</p>
                <button class="btn-primary" routerLink="/transacoes/nova">
                  Criar primeira transação
                </button>
              </div>
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="card category-breakdown">
            <div class="card-header">
              <h2>Despesas por Categoria</h2>
            </div>
            <div class="categories-list">
              <div 
                class="category-item" 
                *ngFor="let cat of categoryData"
              >
                <div class="category-info">
                  <span 
                    class="category-dot" 
                    [style.background]="cat.color"
                  ></span>
                  <span class="category-name">{{ cat.label }}</span>
                </div>
                <div class="category-values">
                  <span class="category-amount">{{ cat.total | currency:'BRL' }}</span>
                  <span class="category-percent">{{ cat.percentual | number:'1.0-0' }}%</span>
                </div>
                <div class="category-bar">
                  <div 
                    class="category-bar-fill" 
                    [style.width.%]="cat.percentual"
                    [style.background]="cat.color"
                  ></div>
                </div>
              </div>
              <div class="empty-state" *ngIf="categoryData.length === 0">
                <p>Nenhuma despesa registrada</p>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .dashboard-header p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .btn-new-transaction {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-new-transaction:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    @media (max-width: 1200px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .view-all {
      font-size: 14px;
      color: #4f46e5;
      font-weight: 500;
      text-decoration: none;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .category-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .category-name {
      font-size: 14px;
      color: #374151;
      flex: 1;
    }

    .category-values {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-amount {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .category-percent {
      font-size: 12px;
      color: #6b7280;
    }

    .category-bar {
      height: 6px;
      background: #f3f4f6;
      border-radius: 3px;
      overflow: hidden;
    }

    .category-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .empty-state {
      text-align: center;
      padding: 32px 16px;
      color: #6b7280;
    }

    .empty-state p {
      margin-bottom: 16px;
    }

    .btn-primary {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      background: #4f46e5;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName = '';
  isLoading = true;

  saldo = 0;
  totalReceitas = 0;
  totalDespesas = 0;
  ticketMedio = 0;
  quantidadeTransacoes = 0;

  // Investimentos
  totalInvestimentos = 0;
  ticketMedioInvestimentos = 0;

  recentTransactions: Transacao[] = [];
  categoryData: Array<{
    categoria: CategoriaTransacao;
    label: string;
    color: string;
    total: number;
    percentual: number;
    ticketMedio: number;
  }> = [];

  constructor(
    private authService: AuthService,
    private transacoesApi: TransacoesApiService,
    private saldoApi: SaldoApiService,
    private analiseApi: AnaliseApiService
  ) { }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    this.userName = user?.nomeCompleto?.split(' ')[0] || 'Usuário';

    if (user) {
      this.loadDashboardData(user.id);
    }
  }

  private loadDashboardData(usuarioId: number): void {
    this.isLoading = true;

    forkJoin({
      saldo: this.saldoApi.obterSaldo(usuarioId),
      transacoes: this.transacoesApi.listarRecentes(usuarioId, 5),
      analise: this.analiseApi.analisarDespesas(usuarioId)
    }).subscribe({
      next: ({ saldo, transacoes, analise }) => {
        this.saldo = saldo.saldo;
        this.recentTransactions = transacoes.content;
        this.processAnalise(analise);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private processAnalise(analise: AnaliseDespesas): void {
    this.totalDespesas = analise.totalGeral;
    this.ticketMedio = analise.ticketMedio;
    this.quantidadeTransacoes = analise.quantidadeTransacoes;

    this.totalInvestimentos = analise.totalInvestimentos;
    this.ticketMedioInvestimentos = analise.ticketMedioInvestimentos;

    // Calculate total receitas (simplified - would need separate API call in production)
    // Note: Investments are separate now, so we subtract both if we want "Net" or just display logical values
    // Assuming Saldo = Receitas - Despesas - Investimentos
    this.totalReceitas = this.saldo + this.totalDespesas + this.totalInvestimentos;

    // Process category data
    this.categoryData = analise.resumoPorCategoria.map(cat => ({
      categoria: cat.categoria,
      label: CategoriaTransacaoLabels[cat.categoria] || 'Outros',
      color: CategoriaTransacaoColors[cat.categoria] || '#607D8B',
      total: cat.total,
      percentual: cat.percentual,
      ticketMedio: cat.ticketMedio
    })).slice(0, 5); // Top 5 categories
  }
}
