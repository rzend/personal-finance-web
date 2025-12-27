import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnaliseApiService } from '@data/datasources';
import { AuthService } from '@core/services';
import { MetricCardComponent, LoadingSpinnerComponent } from '@shared/components';
import { AnaliseDespesas } from '@domain/models';
import { CategoriaTransacaoColors, CategoriaTransacaoLabels, CategoriaTransacaoIcons, CategoriaTransacao, TipoTransacao, TipoTransacaoLabels } from '@domain/enums';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart } from 'chart.js';
import { registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analises',
  standalone: true,
  imports: [CommonModule, FormsModule, MetricCardComponent, LoadingSpinnerComponent, NgChartsModule],
  template: `
    <div class="analises-page">
      <div class="page-header">
        <div>
          <h1>Análises</h1>
          <p>Acompanhe seus gastos e identifique padrões</p>
        </div>
        <div class="period-selector">
          <select [(ngModel)]="selectedPeriod" (change)="loadAnalise()">
            <option value="30">Últimos 30 dias</option>
            <option value="60">Últimos 60 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="180">Últimos 6 meses</option>
            <option value="365">Último ano</option>
          </select>
        </div>
      </div>

      <app-loading-spinner *ngIf="isLoading" text="Carregando análises..."></app-loading-spinner>

      <ng-container *ngIf="!isLoading && analise">
        <!-- Investimentos (Moved to Top) -->
        <div class="section-card investments-card" *ngIf="analise.totalInvestimentos > 0">
          <h2>Investimentos</h2>
          <div class="investments-grid">
             <div class="investment-metric">
                <span class="label">Total Investido</span>
                <span class="value">{{ analise.totalInvestimentos | currency:'BRL' }}</span>
                <span class="sublabel">{{ analise.quantidadeInvestimentos }} aportes</span>
             </div>
             <div class="investment-metric">
                <span class="label">Ticket Médio</span>
                <span class="value">{{ analise.ticketMedioInvestimentos | currency:'BRL' }}</span>
                <span class="sublabel">por aporte</span>
             </div>
          </div>
        </div>

        <!-- Metrics -->
        <div class="metrics-grid">
          <!-- Column 1: Scalar Metrics -->
          <div class="metrics-column">
            <app-metric-card
              icon="💸"
              iconBgColor="#FEF2F2"
              [value]="analise.totalGeral"
              label="Total de Despesas"
              [sublabel]="analise.periodo"
              valueColor="#EF4444"
            ></app-metric-card>

            <app-metric-card
              icon="📊"
              iconBgColor="#FFF7ED"
              [value]="analise.quantidadeTransacoes"
              prefix=""
              label="Transações"
              sublabel="No período"
            ></app-metric-card>
          </div>
          
          <!-- Column 2: Ticket Chart -->
          <div class="metric-card chart-card">
             <div class="chart-header">
                <span class="chart-icon">🧾</span>
                <span class="chart-label">Ticket Médio por Tipo</span>
             </div>
             <div class="chart-container">
                <canvas baseChart
                    [data]="pieChartData"
                    [options]="pieChartOptions"
                    [type]="pieChartType">
                </canvas>
             </div>
          </div>

          <!-- Column 3: Category Chart -->
          <div class="metric-card chart-card">
             <div class="chart-header">
                <span class="chart-icon">🍩</span>
                <span class="chart-label">Despesas por Categoria</span>
             </div>
             <div class="chart-container">
                <canvas baseChart
                    [data]="categoryPieChartData"
                    [options]="categoryPieChartOptions"
                    [type]="pieChartType">
                </canvas>
             </div>
          </div>
        </div>


        


        <!-- Category Details -->
        <div class="section-card">
          <h2>Despesas por Categoria</h2>
          
          <div class="category-grid" *ngIf="analise.resumoPorCategoria.length > 0">
            <div 
              class="category-card" 
              *ngFor="let cat of analise.resumoPorCategoria"
            >
              <div 
                class="category-icon" 
                [style.background]="getCategoryBgColor(cat.categoria)"
              >
                {{ getCategoryIcon(cat.categoria) }}
              </div>
              <div class="category-info">
                <span class="category-name">{{ getCategoryLabel(cat.categoria) }}</span>
                <span class="category-count">{{ cat.quantidade }} transações</span>
              </div>
              <div class="category-values">
                <span class="category-total">{{ cat.total | currency:'BRL' }}</span>
                <div class="category-details-right">
                    <span class="category-ticket-medio" title="Ticket Médio">TM: {{ cat.ticketMedio | currency:'BRL' }}</span>
                    <span 
                      class="category-percent" 
                      [style.color]="getCategoryColor(cat.categoria)"
                    >
                      {{ cat.percentual | number:'1.0-0' }}%
                    </span>
                </div>
              </div>
              <div class="category-bar-container">
                <div 
                  class="category-bar" 
                  [style.width.%]="cat.percentual"
                  [style.background]="getCategoryColor(cat.categoria)"
                ></div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="analise.resumoPorCategoria.length === 0">
            <p>Nenhuma despesa registrada no período</p>
          </div>
        </div>

        <!-- Monthly Evolution -->
        <div class="section-card" *ngIf="monthlyData.length > 0">
          <h2>Evolução Mensal</h2>
          <div class="monthly-chart">
            <div 
              class="month-bar" 
              *ngFor="let month of monthlyData"
              [title]="month.label + ': ' + (month.value | currency:'BRL')"
            >
              <div 
                class="bar-fill" 
                [style.height.%]="month.percentage"
              ></div>
              <div class="month-label">{{ month.shortLabel }}</div>
              <div class="month-value">{{ month.value | currency:'BRL':'symbol':'1.0-0' }}</div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .analises-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .page-header p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .period-selector select {
      padding: 10px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      background: #ffffff;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .metrics-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }

    .section-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-card h2 {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 20px 0;
    }

    .category-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-card {
      display: grid;
      grid-template-columns: 48px 1fr auto;
      grid-template-rows: auto auto;
      gap: 4px 16px;
      align-items: center;
    }

    .category-icon {
      grid-row: span 2;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }

    .category-info {
      display: flex;
      flex-direction: column;
    }

    .category-name {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .category-count {
      font-size: 12px;
      color: #6b7280;
    }

    .category-values {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .category-total {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
    }

    .category-percent {
      font-size: 12px;
      font-weight: 600;
    }

    .category-bar-container {
      grid-column: 2 / -1;
      height: 6px;
      background: #f3f4f6;
      border-radius: 3px;
      overflow: hidden;
    }

    .category-bar {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    .monthly-chart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 200px;
      padding-top: 20px;
      gap: 12px;
    }

    .month-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .bar-fill {
      width: 100%;
      max-width: 40px;
      background: linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%);
      border-radius: 6px 6px 0 0;
      transition: height 0.5s ease;
      margin-top: auto;
    }

    .month-label {
      font-size: 12px;
      color: #6b7280;
      margin-top: 8px;
    }

    .month-value {
      font-size: 11px;
      font-weight: 600;
      color: #374151;
      margin-top: 4px;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #6b7280;
    }

    /* Custom Metric Card Styles to match app-metric-card */
    .metric-card.chart-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      height: 100%; /* Ensure it fills grid cell */
      min-height: 200px;
    }

    .chart-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .chart-icon {
        width: 32px;
        height: 32px;
        background: #EEF2FF;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
    }

    .chart-label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
    }

    .chart-container {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }


    .investments-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .investment-metric {
      display: flex;
      flex-direction: column;
      padding: 16px;
      background: #F0F9FF;
      border-radius: 12px;
      border: 1px solid #BAE6FD;
    }

    .investment-metric .label {
      font-size: 14px;
      color: #0369A1;
      margin-bottom: 4px;
    }

    .investment-metric .value {
      font-size: 24px;
      font-weight: 700;
      color: #0C4A6E;
    }

    .investment-metric .sublabel {
      font-size: 12px;
      color: #0369A1;
      opacity: 0.8;
    }

    .category-details-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .category-ticket-medio {
        font-size: 11px;
        color: #6b7280;
        background: #f3f4f6;
        padding: 2px 6px;
        border-radius: 4px;
    }
  `]
})
export class AnalisesComponent implements OnInit {
  analise: AnaliseDespesas | null = null;
  isLoading = true;
  selectedPeriod = '30';

  monthlyData: Array<{
    label: string;
    shortLabel: string;
    value: number;
    percentage: number;
  }> = [];

  // Pie Chart Config
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
          font: { size: 10 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return ` TM: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  public pieChartType: ChartType = 'pie';

  // Category Chart Config
  public categoryPieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hide legend to save space
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return ` ${context.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };
  public categoryPieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  constructor(
    private analiseApi: AnaliseApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAnalise();
  }

  loadAnalise(): void {
    const user = this.authService.currentUser;
    if (!user) return;

    this.isLoading = true;
    const days = parseInt(this.selectedPeriod, 10);
    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - days);

    this.analiseApi.analisarDespesas(
      user.id,
      inicio.toISOString(),
      fim.toISOString()
    ).subscribe({
      next: (analise) => {
        this.analise = analise;
        this.processMonthlyData(analise.totalPorMes);
        this.processTicketMedioChart(analise.ticketMedioPorTipoTransacao);
        this.processCategoryChart(analise.resumoPorCategoria);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
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

  private processTicketMedioChart(ticketMedioMap: Record<string, number>): void {
    if (!ticketMedioMap) {
      this.pieChartData = { labels: [], datasets: [{ data: [] }] };
      return;
    }

    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];

    Object.entries(ticketMedioMap).forEach(([tipo, valor]) => {
      // Assuming tipo matches TipoTransacao keys
      const label = TipoTransacaoLabels[tipo as TipoTransacao] || tipo;
      labels.push(label);
      data.push(valor);

      // Assign colors based on type
      if (tipo === 'DESPESA') backgroundColor.push('#EF4444'); // Red
      else if (tipo === 'RETIRADA') backgroundColor.push('#F59E0B'); // Orange
      else if (tipo === 'TRANSFERENCIA') backgroundColor.push('#3B82F6'); // Blue
      else backgroundColor.push('#9CA3AF'); // Gray
    });

    this.pieChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: backgroundColor,
        hoverBorderColor: '#ffffff'
      }]
    };
  }

  private processCategoryChart(resumoPorCategoria: Array<any>): void {
    if (!resumoPorCategoria || resumoPorCategoria.length === 0) {
      this.categoryPieChartData = { labels: [], datasets: [{ data: [] }] };
      return;
    }

    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];

    // Sort by total desc
    const sorted = [...resumoPorCategoria].sort((a, b) => b.total - a.total);

    sorted.forEach(cat => {
      labels.push(this.getCategoryLabel(cat.categoria));
      data.push(cat.total);
      backgroundColor.push(this.getCategoryColor(cat.categoria));
    });

    this.categoryPieChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: backgroundColor,
        hoverBorderColor: '#ffffff'
      }]
    };
  }

  getCategoryLabel(cat: CategoriaTransacao): string {
    return CategoriaTransacaoLabels[cat] || 'Outros';
  }

  getCategoryIcon(cat: CategoriaTransacao): string {
    return CategoriaTransacaoIcons[cat] || '❓';
  }

  getCategoryColor(cat: CategoriaTransacao): string {
    return CategoriaTransacaoColors[cat] || '#607D8B';
  }

  getCategoryBgColor(cat: CategoriaTransacao): string {
    return `${this.getCategoryColor(cat)}20`;
  }
}
