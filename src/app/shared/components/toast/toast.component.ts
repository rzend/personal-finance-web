import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, ToastMessage } from '@core/services';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts" 
        class="toast" 
        [class]="toast.type"
        (click)="removeToast(toast.id)"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message" *ngIf="toast.message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" (click)="removeToast(toast.id)">✕</button>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1070;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      padding: 14px 16px;
      border-radius: 10px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease;
      cursor: pointer;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .toast.success {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
    }

    .toast.error {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .toast.warning {
      background: #fffbeb;
      border: 1px solid #fde68a;
    }

    .toast.info {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
    }

    .toast-icon {
      font-size: 18px;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .toast-message {
      font-size: 13px;
      color: #6b7280;
      margin-top: 2px;
    }

    .toast-close {
      background: transparent;
      border: none;
      font-size: 12px;
      color: #9ca3af;
      cursor: pointer;
      margin-left: 8px;
      padding: 4px;
    }

    .toast-close:hover {
      color: #6b7280;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
    toasts: ToastMessage[] = [];
    private subscription?: Subscription;

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.subscription = this.notificationService.toast$.subscribe((toast) => {
            this.addToast(toast);
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    private addToast(toast: ToastMessage): void {
        this.toasts.push(toast);

        if (toast.duration && toast.duration > 0) {
            setTimeout(() => {
                this.removeToast(toast.id);
            }, toast.duration);
        }
    }

    removeToast(id: string): void {
        this.toasts = this.toasts.filter((t) => t.id !== id);
    }

    getIcon(type: ToastMessage['type']): string {
        const icons: Record<ToastMessage['type'], string> = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type];
    }
}
