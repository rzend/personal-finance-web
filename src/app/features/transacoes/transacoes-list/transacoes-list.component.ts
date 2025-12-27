import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransacoesApiService } from '@data/datasources';
import { AuthService } from '@core/services';
import { TransactionCardComponent, LoadingSpinnerComponent } from '@shared/components';
import { Transacao, TransacaoFiltros } from '@domain/models';
import { CategoriaTransacao, CategoriaTransacaoLabels } from '@domain/enums';

@Component({
  selector: 'app-transacoes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TransactionCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="transacoes-page">
      <div class="page-header">
        <div>
          <h1>Transações</h1>
          <p>Gerencie suas movimentações financeiras</p>
        </div>
        <button class="btn-primary" routerLink="/transacoes/nova">
          + Nova Transação
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-card">
        <div class="filters-row">
          <div class="filter-group">
            <label>Data Início</label>
            <input 
              type="date" 
              [(ngModel)]="filtros.inicio"
              (change)="loadTransacoes()"
            />
          </div>
          <div class="filter-group">
            <label>Data Fim</label>
            <input 
              type="date" 
              [(ngModel)]="filtros.fim"
              (change)="loadTransacoes()"
            />
          </div>
          <div class="filter-group">
            <label>Categoria</label>
            <select [(ngModel)]="filtros.categoria" (change)="loadTransacoes()">
              <option [ngValue]="null">Todas</option>
              <option *ngFor="let cat of categorias" [ngValue]="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          <button class="btn-clear" (click)="clearFilters()">Limpar</button>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="transactions-container">
        <app-loading-spinner *ngIf="isLoading" text="Carregando transações..."></app-loading-spinner>
        
        <ng-container *ngIf="!isLoading">
          <div class="transactions-list" *ngIf="transacoes.length > 0">
            <app-transaction-card 
              *ngFor="let t of transacoes"
              [transacao]="t"
              (click)="viewTransaction(t)"
              (edit)="onEdit($event)"
              (delete)="onDelete($event)"
              class="clickable"
            ></app-transaction-card>
          </div>
          
          <div class="empty-state" *ngIf="transacoes.length === 0">
            <div class="empty-icon">📝</div>
            <h3>Nenhuma transação encontrada</h3>
            <p>Comece registrando sua primeira transação</p>
            <button class="btn-primary" routerLink="/transacoes/nova">
              Criar transação
            </button>
          </div>

          <!-- Pagination -->
          <div class="pagination" *ngIf="totalPages > 1">
            <button 
              class="page-btn" 
              [disabled]="currentPage === 0"
              (click)="goToPage(currentPage - 1)"
            >
              ← Anterior
            </button>
            <span class="page-info">
              Página {{ currentPage + 1 }} de {{ totalPages }}
            </span>
            <button 
              class="page-btn" 
              [disabled]="currentPage >= totalPages - 1"
              (click)="goToPage(currentPage + 1)"
            >
              Próxima →
            </button>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .transacoes-page {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
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

    .btn-primary {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      background: #4f46e5;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      background: #4338ca;
    }

    .filters-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-group label {
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
    }

    .filter-group input,
    .filter-group select {
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      min-width: 160px;
    }

    .btn-clear {
      padding: 10px 16px;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #6b7280;
    }

    .btn-clear:hover {
      background: #e5e7eb;
    }

    .transactions-container {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .transactions-list .clickable {
      cursor: pointer;
    }

    .transactions-list .clickable:hover {
      transform: translateX(4px);
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 18px;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: #6b7280;
      margin: 0 0 24px 0;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .page-btn {
      padding: 8px 16px;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 14px;
      color: #6b7280;
    }
  `]
})
export class TransacoesListComponent implements OnInit {
  transacoes: Transacao[] = [];
  isLoading = true;

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  filtros: TransacaoFiltros = {};

  categorias = Object.values(CategoriaTransacao).map(cat => ({
    value: cat,
    label: CategoriaTransacaoLabels[cat]
  }));

  constructor(
    private transacoesApi: TransacoesApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.filtros.usuarioId = user.id;
      this.loadTransacoes();
    }
  }

  loadTransacoes(): void {
    this.isLoading = true;

    this.transacoesApi.listar(this.filtros, this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.transacoes = page.content;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadTransacoes();
  }

  clearFilters(): void {
    const userId = this.filtros.usuarioId;
    this.filtros = { usuarioId: userId };
    this.currentPage = 0;
    this.loadTransacoes();
  }

  viewTransaction(transacao: Transacao): void {
    console.log('View transaction:', transacao);
  }

  onEdit(transacao: Transacao): void {
    this.router.navigate(['/transacoes/editar', transacao.id]);
  }

  onDelete(transacao: Transacao): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.isLoading = true;
      this.transacoesApi.excluir(transacao.id).subscribe({
        next: () => {
          this.loadTransacoes();
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
          this.isLoading = false;
        }
      });
    }
  }
}
