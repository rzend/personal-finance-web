import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CambioApiService } from '@data/datasources';
import { NotificationService } from '@core/services';
import { LoadingSpinnerComponent } from '@shared/components';
import { Moeda, ConversaoResultado } from '@domain/models';

@Component({
    selector: 'app-cambio',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
    template: `
    <div class="cambio-page">
      <div class="page-header">
        <h1>Conversor de Câmbio</h1>
        <p>Converta entre diferentes moedas em tempo real</p>
      </div>

      <div class="converter-card">
        <form [formGroup]="form" (ngSubmit)="calcular()">
          <div class="converter-row">
            <!-- From -->
            <div class="converter-col">
              <label>De</label>
              <select formControlName="moedaOrigem" class="currency-select">
                <option *ngFor="let m of moedas" [value]="m.simbolo">
                  {{ m.simbolo }} - {{ m.nome }}
                </option>
              </select>
              <input 
                type="number" 
                formControlName="valor"
                placeholder="0.00"
                step="0.01"
                class="amount-input"
              />
            </div>

            <!-- Swap Button -->
            <button type="button" class="swap-btn" (click)="swapCurrencies()">
              ⇄
            </button>

            <!-- To -->
            <div class="converter-col">
              <label>Para</label>
              <select formControlName="moedaDestino" class="currency-select">
                <option *ngFor="let m of moedas" [value]="m.simbolo">
                  {{ m.simbolo }} - {{ m.nome }}
                </option>
              </select>
              <div class="result-display" *ngIf="resultado">
                {{ resultado.valorConvertido | number:'1.2-2' }}
              </div>
              <div class="result-display placeholder" *ngIf="!resultado">
                0.00
              </div>
            </div>
          </div>

          <!-- Margin -->
          <div class="margin-row">
            <label>Margem/Spread (%)</label>
            <input 
              type="number" 
              formControlName="margem"
              placeholder="0"
              step="0.1"
              min="0"
              class="margin-input"
            />
          </div>

          <button 
            type="submit" 
            class="btn-convert"
            [disabled]="form.invalid || isLoading"
          >
            <span *ngIf="!isLoading">Converter</span>
            <span *ngIf="isLoading" class="spinner"></span>
          </button>
        </form>

        <!-- Result Details -->
        <div class="result-details" *ngIf="resultado">
          <h3>Detalhes da Conversão</h3>
          <div class="detail-row">
            <span class="detail-label">Taxa de Câmbio</span>
            <span class="detail-value">1 {{ resultado.moedaOrigem }} = {{ resultado.taxa | number:'1.4-4' }} {{ resultado.moedaDestino }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Valor Original</span>
            <span class="detail-value">{{ resultado.valorOriginal | number:'1.2-2' }} {{ resultado.moedaOrigem }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Valor Convertido</span>
            <span class="detail-value highlight">{{ resultado.valorConvertido | number:'1.2-2' }} {{ resultado.moedaDestino }}</span>
          </div>
          <div class="detail-row" *ngIf="resultado.margemAplicada > 0">
            <span class="detail-label">Margem Aplicada</span>
            <span class="detail-value">{{ resultado.margemAplicada | number:'1.2-2' }} {{ resultado.moedaDestino }}</span>
          </div>
          <div class="detail-row total" *ngIf="resultado.margemAplicada > 0">
            <span class="detail-label">Custo Total</span>
            <span class="detail-value">{{ resultado.custoTotal | number:'1.2-2' }} {{ resultado.moedaDestino }}</span>
          </div>
        </div>
      </div>

      <!-- Currencies List -->
      <div class="currencies-card">
        <h2>Moedas Suportadas</h2>
        <div class="currencies-grid">
          <div class="currency-item" *ngFor="let m of moedas">
            <span class="currency-symbol">{{ m.simbolo }}</span>
            <span class="currency-name">{{ m.nome }}</span>
            <span class="currency-type">{{ m.tipoMoeda }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .cambio-page {
      padding: 24px;
      max-width: 800px;
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

    .converter-card {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 24px;
      color: #ffffff;
    }

    .converter-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .converter-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .converter-col label {
      font-size: 12px;
      font-weight: 500;
      opacity: 0.8;
    }

    .currency-select {
      padding: 12px 16px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .currency-select option {
      color: #111827;
    }

    .amount-input {
      padding: 16px;
      border: none;
      border-radius: 10px;
      font-size: 24px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      text-align: center;
    }

    .amount-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .result-display {
      padding: 16px;
      border-radius: 10px;
      font-size: 24px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.2);
      text-align: center;
    }

    .result-display.placeholder {
      opacity: 0.5;
    }

    .swap-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
      margin-top: 24px;
    }

    .swap-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(180deg);
    }

    .margin-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .margin-row label {
      font-size: 14px;
      opacity: 0.9;
    }

    .margin-input {
      width: 100px;
      padding: 10px 14px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      text-align: center;
    }

    .btn-convert {
      width: 100%;
      padding: 14px;
      margin-top: 24px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      background: #ffffff;
      color: #4f46e5;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-convert:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-convert:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .result-details {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .result-details h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px 0;
      opacity: 0.9;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }

    .detail-label {
      opacity: 0.8;
    }

    .detail-value {
      font-weight: 500;
    }

    .detail-value.highlight {
      font-size: 16px;
      font-weight: 700;
    }

    .detail-row.total {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .currencies-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .currencies-card h2 {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 20px 0;
    }

    .currencies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .currency-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 10px;
    }

    .currency-symbol {
      font-size: 14px;
      font-weight: 700;
      color: #4f46e5;
      min-width: 40px;
    }

    .currency-name {
      font-size: 13px;
      color: #374151;
      flex: 1;
    }

    .currency-type {
      font-size: 10px;
      color: #9ca3af;
      padding: 2px 6px;
      background: #e5e7eb;
      border-radius: 4px;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(79, 70, 229, 0.3);
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .converter-row {
        flex-direction: column;
      }

      .swap-btn {
        margin: 0;
        transform: rotate(90deg);
      }

      .swap-btn:hover {
        transform: rotate(270deg);
      }
    }
  `]
})
export class CambioComponent implements OnInit {
    form: FormGroup;
    moedas: Moeda[] = [];
    resultado: ConversaoResultado | null = null;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private cambioApi: CambioApiService,
        private notificationService: NotificationService
    ) {
        this.form = this.fb.group({
            valor: [100, [Validators.required, Validators.min(0.01)]],
            moedaOrigem: ['USD', Validators.required],
            moedaDestino: ['BRL', Validators.required],
            margem: [0, [Validators.min(0)]]
        });
    }

    ngOnInit(): void {
        this.loadMoedas();
    }

    private loadMoedas(): void {
        this.cambioApi.listarMoedas().subscribe({
            next: (moedas) => {
                this.moedas = moedas;
            },
            error: () => {
                this.moedas = [
                    { simbolo: 'BRL', nome: 'Real Brasileiro', tipoMoeda: 'FIAT' },
                    { simbolo: 'USD', nome: 'Dólar Americano', tipoMoeda: 'FIAT' },
                    { simbolo: 'EUR', nome: 'Euro', tipoMoeda: 'FIAT' }
                ];
            }
        });
    }

    swapCurrencies(): void {
        const { moedaOrigem, moedaDestino } = this.form.value;
        this.form.patchValue({
            moedaOrigem: moedaDestino,
            moedaDestino: moedaOrigem
        });
        this.resultado = null;
    }

    calcular(): void {
        if (this.form.invalid) return;

        this.isLoading = true;
        const { valor, moedaOrigem, moedaDestino, margem } = this.form.value;

        this.cambioApi.calcularCusto({
            valor,
            moedaOrigem,
            moedaDestino,
            margem: margem || 0
        }).subscribe({
            next: (resultado) => {
                this.resultado = resultado;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}
