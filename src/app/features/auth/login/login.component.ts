import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService, NotificationService } from '@core/services';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">💰</div>
          <h1>Bem-vindo de volta</h1>
          <p>Entre para gerenciar suas finanças</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              class="form-input"
              formControlName="email"
              placeholder="seu@email.com"
              [class.error]="isFieldInvalid('email')"
            />
            <span class="form-error" *ngIf="isFieldInvalid('email')">
              {{ getFieldError('email') }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="senha">Senha</label>
            <input
              type="password"
              id="senha"
              class="form-input"
              formControlName="senha"
              placeholder="••••••••"
              [class.error]="isFieldInvalid('senha')"
            />
            <span class="form-error" *ngIf="isFieldInvalid('senha')">
              {{ getFieldError('senha') }}
            </span>
          </div>

          <button 
            type="submit" 
            class="btn-submit"
            [disabled]="form.invalid || isLoading"
          >
            <span *ngIf="!isLoading">Entrar</span>
            <span *ngIf="isLoading" class="spinner"></span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Não tem uma conta? <a routerLink="/auth/register">Registrar-se</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-logo {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .auth-header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .auth-header p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      font-size: 15px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      transition: all 0.2s ease;
      background: #ffffff;
    }

    .form-input:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .form-error {
      font-size: 12px;
      color: #ef4444;
      margin-top: 4px;
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .auth-footer p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .auth-footer a {
      color: #4f46e5;
      font-weight: 500;
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
    form: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    isFieldInvalid(field: string): boolean {
        const control = this.form.get(field);
        return !!(control && control.invalid && control.touched);
    }

    getFieldError(field: string): string {
        const control = this.form.get(field);
        if (control?.errors) {
            if (control.errors['required']) return 'Campo obrigatório';
            if (control.errors['email']) return 'Email inválido';
            if (control.errors['minlength']) return 'Mínimo 6 caracteres';
        }
        return '';
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const { email, senha } = this.form.value;

        this.authService.login({ email, senha }).subscribe({
            next: () => {
                this.isLoading = false;
                this.notificationService.success('Login realizado com sucesso!');
                const returnUrl = this.route.snapshot.queryParams['returnUrl'];
                if (returnUrl && !returnUrl.includes('auth')) {
                    this.router.navigateByUrl(returnUrl);
                } else {
                    this.router.navigate(['/dashboard']);
                }
            },
            error: () => {
                this.isLoading = false;
                // Error is handled by the interceptor
            }
        });
    }
}
