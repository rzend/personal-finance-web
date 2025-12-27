import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TransacoesApiService, CambioApiService } from '@data/datasources';
import { AuthService, NotificationService } from '@core/services';
import { TipoTransacao, TipoTransacaoLabels, CategoriaTransacao, CategoriaTransacaoLabels } from '@domain/enums';
import { Moeda } from '@domain/models';
import { LoadingSpinnerComponent } from '@shared/components';

@Component({
  selector: 'app-transacao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="form-page">
      <div class="page-header">
        <button class="btn-back" routerLink="/transacoes">← Voltar</button>
        <h1>{{ isEditing ? 'Editar Transação' : 'Nova Transação' }}</h1>
      </div>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Tipo -->
          <div class="form-section">
            <label class="section-label">Tipo de Transação</label>
            <div class="tipo-grid">
              <button 
                type="button"
                *ngFor="let tipo of tipos"
                class="tipo-btn"
                [class.active]="form.get('tipo')?.value === tipo.value"
                [class.receita]="isReceita(tipo.value)"
                [class.despesa]="isDespesa(tipo.value)"
                (click)="selectTipo(tipo.value)"
              >
                {{ tipo.label }}
              </button>
            </div>
          </div>

          <!-- Valor e Moeda -->
          <div class="form-row">
            <div class="form-group flex-2">
              <label class="form-label">Valor</label>
              <input
                type="number"
                class="form-input"
                formControlName="valor"
                placeholder="0.00"
                step="0.01"
                min="0.01"
              />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Moeda</label>
              <select class="form-select" formControlName="moeda">
                <option *ngFor="let m of moedas" [value]="m.simbolo">
                  {{ m.simbolo }} - {{ m.nome }}
                </option>
              </select>
            </div>
          </div>

          <!-- Categoria -->
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <select class="form-select" formControlName="categoria">
              <option [ngValue]="null" disabled>Selecione uma categoria</option>
              <option *ngFor="let cat of categorias" [ngValue]="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>

          <!-- Descrição -->
          <div class="form-group">
            <label class="form-label">Descrição (opcional)</label>
            <textarea
              class="form-textarea"
              formControlName="descricao"
              rows="3"
              placeholder="Adicione uma descrição..."
            ></textarea>
          </div>

          <!-- Submit -->
          <div class="form-actions">
            <button 
              type="button" 
              class="btn-secondary"
              routerLink="/transacoes"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="form.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Salvar Transação</span>
              <span *ngIf="isLoading" class="spinner"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-page {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .btn-back {
      background: none;
      border: none;
      color: #6b7280;
      font-size: 14px;
      cursor: pointer;
      margin-bottom: 12px;
      padding: 0;
    }

    .btn-back:hover {
      color: #4f46e5;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .form-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-section {
      margin-bottom: 24px;
    }

    .section-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 12px;
    }

    .tipo-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .tipo-btn {
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      background: #ffffff;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tipo-btn:hover {
      border-color: #d1d5db;
    }

    .tipo-btn.active.receita {
      border-color: #10b981;
      background: #ecfdf5;
      color: #059669;
    }

    .tipo-btn.active.despesa {
      border-color: #ef4444;
      background: #fef2f2;
      color: #dc2626;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .flex-1 {
      flex: 1;
    }

    .flex-2 {
      flex: 2;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 12px 16px;
      font-size: 15px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #4f46e5;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      background: #f3f4f6;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
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
      min-width: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
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
export class TransacaoFormComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  moedas: Moeda[] = [];

  tipos = Object.values(TipoTransacao).map(tipo => ({
    value: tipo,
    label: TipoTransacaoLabels[tipo]
  }));

  categorias = Object.values(CategoriaTransacao).map(cat => ({
    value: cat,
    label: CategoriaTransacaoLabels[cat]
  }));

  isEditing = false;
  transactionId?: number;

  constructor(
    private fb: FormBuilder,
    private transacoesApi: TransacoesApiService,
    private cambioApi: CambioApiService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tipo: [TipoTransacao.DESPESA, Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      moeda: ['BRL', Validators.required],
      categoria: [null, Validators.required],
      descricao: ['']
    });
  }

  ngOnInit(): void {
    this.loadMoedas();
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.transactionId = +id;
      this.loadTransaction(this.transactionId);
    }
  }

  private loadTransaction(id: number): void {
    this.isLoading = true;
    this.transacoesApi.buscarPorId(id).subscribe({
      next: (transacao) => {
        this.form.patchValue({
          tipo: transacao.tipo,
          valor: transacao.valorOriginal,
          moeda: transacao.moedaOriginal,
          categoria: transacao.categoria,
          descricao: transacao.descricao
        });
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erro ao carregar transação');
        this.router.navigate(['/transacoes']);
      }
    });
  }

  private loadMoedas(): void {
    this.cambioApi.listarMoedas().subscribe({
      next: (moedas) => {
        this.moedas = moedas;
      },
      error: () => {
        // Fallback to default currencies
        this.moedas = [
          { simbolo: 'BRL', nome: 'Real Brasileiro', tipoMoeda: 'FIAT' },
          { simbolo: 'USD', nome: 'Dólar Americano', tipoMoeda: 'FIAT' },
          { simbolo: 'EUR', nome: 'Euro', tipoMoeda: 'FIAT' }
        ];
      }
    });
  }

  selectTipo(tipo: TipoTransacao): void {
    this.form.patchValue({ tipo });
  }

  isReceita(tipo: TipoTransacao): boolean {
    return tipo === TipoTransacao.DEPOSITO || tipo === TipoTransacao.RECEITA;
  }

  isDespesa(tipo: TipoTransacao): boolean {
    return tipo === TipoTransacao.DESPESA || tipo === TipoTransacao.RETIRADA;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const user = this.authService.currentUser;
    if (!user) return;

    this.isLoading = true;
    const { tipo, valor, moeda, categoria, descricao } = this.form.value;

    const payload = {
      usuarioId: user.id,
      tipo,
      valor,
      moeda,
      categoria,
      descricao
    };

    const request = this.isEditing && this.transactionId
      ? this.transacoesApi.atualizar(this.transactionId, payload)
      : this.transacoesApi.criar(payload);

    request.subscribe({
      next: () => {
        this.notificationService.success(
          this.isEditing
            ? 'Transação atualizada com sucesso!'
            : 'Transação criada com sucesso!'
        );
        this.router.navigate(['/transacoes']);
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
