import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CategoriaTransacao,
  CategoriaTransacaoIcons,
  CategoriaTransacaoLabels,
  CategoriaTransacaoColors
} from '@domain/enums';
import {
  TipoTransacao,
  isTipoDespesa
} from '@domain/enums';
import { Transacao } from '@domain/models';

@Component({
  selector: 'app-transaction-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transaction-card">
      <div class="transaction-icon" [style.background]="getCategoryBgColor()">
        {{ getCategoryIcon() }}
      </div>
      <div class="transaction-info">
        <div class="transaction-category">{{ getCategoryLabel() }}</div>
        <div class="transaction-description">{{ transacao.descricao || 'Sem descrição' }}</div>
        <div class="transaction-date">{{ formatDate(transacao.data) }}</div>
      </div>
      <div class="transaction-amount" [class.expense]="isExpense()" [class.income]="!isExpense()">
        {{ isExpense() ? '-' : '+' }}{{ formatCurrency(transacao.valorOriginal) }}
      </div>
      <div class="transaction-actions">
        <button class="action-btn edit" (click)="onEdit($event)" title="Editar">
          ✎
        </button>
        <button class="action-btn delete" (click)="onDelete($event)" title="Excluir">
          🗑
        </button>
      </div>
    </div>
  `,
  styles: [`
    .transaction-card {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
    }

    .transaction-card:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border-color: #d1d5db;
    }

    .transaction-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .transaction-info {
      flex: 1;
      margin-left: 14px;
      min-width: 0;
    }

    .transaction-category {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 2px;
    }

    .transaction-description {
      font-size: 13px;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .transaction-date {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 2px;
    }

    .transaction-amount {
      font-size: 16px;
      font-weight: 700;
      font-family: 'Inter', -apple-system, sans-serif;
      flex-shrink: 0;
      margin-left: 12px;
    }

    .transaction-amount.expense {
      color: #ef4444;
    }

    .transaction-amount.income {
      color: #10b981;
    }

    .transaction-actions {
      display: flex;
      gap: 8px;
      margin-left: 16px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .transaction-card:hover .transaction-actions {
      opacity: 1;
    }

    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background-color: #f3f4f6;
    }

    .action-btn.edit {
      color: #6366f1;
    }

    .action-btn.delete {
      color: #ef4444;
    }
  `]
})
export class TransactionCardComponent {
  @Input() transacao!: Transacao;
  @Output() edit = new EventEmitter<Transacao>();
  @Output() delete = new EventEmitter<Transacao>();

  getCategoryIcon(): string {
    return CategoriaTransacaoIcons[this.transacao.categoria] || '❓';
  }

  getCategoryLabel(): string {
    return CategoriaTransacaoLabels[this.transacao.categoria] || 'Outros';
  }

  getCategoryBgColor(): string {
    const color = CategoriaTransacaoColors[this.transacao.categoria] || '#607D8B';
    return `${color}20`; // 20% opacity
  }

  isExpense(): boolean {
    return isTipoDespesa(this.transacao.tipo);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this.transacao.moedaOriginal || 'BRL'
    }).format(value);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.transacao);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.transacao);
  }
}
