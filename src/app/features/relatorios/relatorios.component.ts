import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RelatoriosApiService } from '@data/datasources';
import { AuthService, NotificationService } from '@core/services';
import { LoadingSpinnerComponent } from '@shared/components';

@Component({
    selector: 'app-relatorios',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
    template: `
    <div class="relatorios-page">
      <div class="page-header">
        <h1>Relatórios</h1>
        <p>Exporte suas movimentações financeiras</p>
      </div>

      <div class="filters-card">
        <h2>Filtros do Relatório</h2>
        <div class="filters-grid">
          <div class="filter-group">
            <label>Data Início</label>
            <input type="date" [(ngModel)]="filters.inicio" />
          </div>
          <div class="filter-group">
            <label>Data Fim</label>
            <input type="date" [(ngModel)]="filters.fim" />
          </div>
          <div class="filter-group">
            <label>Moeda</label>
            <select [(ngModel)]="filters.moeda">
              <option value="">Todas</option>
              <option value="BRL">BRL - Real</option>
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>
      </div>

      <div class="reports-grid">
        <!-- PDF Report -->
        <div class="report-card">
          <div class="report-icon pdf">📄</div>
          <div class="report-info">
            <h3>Relatório PDF</h3>
            <p>Documento formatado com todas as transações e resumo do período.</p>
          </div>
          <button 
            class="btn-download pdf"
            (click)="downloadPdf()"
            [disabled]="isLoadingPdf"
          >
            <span *ngIf="!isLoadingPdf">⬇ Download PDF</span>
            <span *ngIf="isLoadingPdf" class="spinner"></span>
          </button>
        </div>

        <!-- Excel Report -->
        <div class="report-card">
          <div class="report-icon excel">📊</div>
          <div class="report-info">
            <h3>Planilha Excel</h3>
            <p>Dados completos em formato de planilha para análise personalizada.</p>
          </div>
          <button 
            class="btn-download excel"
            (click)="downloadExcel()"
            [disabled]="isLoadingExcel"
          >
            <span *ngIf="!isLoadingExcel">⬇ Download Excel</span>
            <span *ngIf="isLoadingExcel" class="spinner"></span>
          </button>
        </div>
      </div>

      <div class="info-card">
        <h3>ℹ️ Informações</h3>
        <ul>
          <li>Os relatórios incluem todas as transações do período selecionado</li>
          <li>O PDF inclui gráficos e resumo visual das despesas</li>
          <li>A planilha Excel permite filtros e análises adicionais</li>
          <li>Se nenhuma data for selecionada, serão exportadas todas as transações</li>
        </ul>
      </div>
    </div>
  `,
    styles: [`
    .relatorios-page {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
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

    .filters-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filters-card h2 {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px 0;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 640px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-group label {
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
    }

    .filter-group input,
    .filter-group select {
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    @media (max-width: 640px) {
      .reports-grid {
        grid-template-columns: 1fr;
      }
    }

    .report-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .report-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .report-info h3 {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .report-info p {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

    .btn-download {
      width: 100%;
      padding: 14px;
      margin-top: 20px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-download.pdf {
      background: #dc2626;
      color: #ffffff;
    }

    .btn-download.pdf:hover:not(:disabled) {
      background: #b91c1c;
    }

    .btn-download.excel {
      background: #059669;
      color: #ffffff;
    }

    .btn-download.excel:hover:not(:disabled) {
      background: #047857;
    }

    .btn-download:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .info-card {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 20px;
    }

    .info-card h3 {
      font-size: 14px;
      font-weight: 600;
      color: #1e40af;
      margin: 0 0 12px 0;
    }

    .info-card ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-card li {
      font-size: 13px;
      color: #1e40af;
      margin-bottom: 6px;
      line-height: 1.5;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class RelatoriosComponent implements OnInit {
    filters = {
        inicio: '',
        fim: '',
        moeda: ''
    };

    isLoadingPdf = false;
    isLoadingExcel = false;

    constructor(
        private relatoriosApi: RelatoriosApiService,
        private authService: AuthService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        // Set default date range (last 30 days)
        const fim = new Date();
        const inicio = new Date();
        inicio.setDate(inicio.getDate() - 30);

        this.filters.inicio = inicio.toISOString().split('T')[0];
        this.filters.fim = fim.toISOString().split('T')[0];
    }

    downloadPdf(): void {
        const user = this.authService.currentUser;
        if (!user) return;

        this.isLoadingPdf = true;

        this.relatoriosApi.downloadPdf(
            user.id,
            this.filters.inicio || undefined,
            this.filters.fim || undefined,
            this.filters.moeda || undefined
        ).subscribe({
            next: (blob) => {
                this.downloadFile(blob, 'transacoes.pdf');
                this.notificationService.success('PDF gerado com sucesso!');
                this.isLoadingPdf = false;
            },
            error: () => {
                this.isLoadingPdf = false;
            }
        });
    }

    downloadExcel(): void {
        const user = this.authService.currentUser;
        if (!user) return;

        this.isLoadingExcel = true;

        this.relatoriosApi.downloadExcel(
            user.id,
            this.filters.inicio || undefined,
            this.filters.fim || undefined,
            this.filters.moeda || undefined
        ).subscribe({
            next: (blob) => {
                this.downloadFile(blob, 'transacoes.xlsx');
                this.notificationService.success('Excel gerado com sucesso!');
                this.isLoadingExcel = false;
            },
            error: () => {
                this.isLoadingExcel = false;
            }
        });
    }

    private downloadFile(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
