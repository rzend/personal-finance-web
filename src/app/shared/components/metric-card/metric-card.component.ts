import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-metric-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="metric-card" [class.clickable]="clickable">
      <div class="metric-header">
        <span class="metric-icon" [style.background]="iconBgColor">
          {{ icon }}
        </span>
        <span class="metric-trend" *ngIf="trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
          {{ trend > 0 ? '↑' : '↓' }} {{ trend | number:'1.1-1' }}%
        </span>
      </div>
      <div class="metric-value" [style.color]="valueColor">
        {{ prefix }}{{ value | number:'1.2-2' }}
      </div>
      <div class="metric-label">{{ label }}</div>
      <div class="metric-sublabel" *ngIf="sublabel">{{ sublabel }}</div>
    </div>
  `,
    styles: [`
    .metric-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
    }

    .metric-card.clickable:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
      cursor: pointer;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .metric-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      background: #f3f4f6;
    }

    .metric-trend {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 20px;
    }

    .metric-trend.positive {
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
    }

    .metric-trend.negative {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    .metric-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }

    .metric-sublabel {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }
  `]
})
export class MetricCardComponent {
    @Input() icon: string = '💰';
    @Input() iconBgColor: string = '#f3f4f6';
    @Input() value: number = 0;
    @Input() prefix: string = 'R$ ';
    @Input() label: string = '';
    @Input() sublabel: string = '';
    @Input() trend: number | null = null;
    @Input() valueColor: string = '#111827';
    @Input() clickable: boolean = false;
}
