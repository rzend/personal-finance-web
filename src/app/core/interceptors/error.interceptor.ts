import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private storageService: StorageService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Ocorreu um erro inesperado';

                if (error.error instanceof ErrorEvent) {
                    // Client-side error
                    errorMessage = error.error.message;
                } else {
                    // Server-side error
                    switch (error.status) {
                        case 400:
                            errorMessage = this.extractErrorMessage(error) || 'Dados inválidos';
                            break;
                        case 401:
                            errorMessage = 'Sessão expirada. Faça login novamente.';
                            this.handleUnauthorized();
                            break;
                        case 403:
                            errorMessage = 'Você não tem permissão para esta ação';
                            break;
                        case 404:
                            errorMessage = 'Recurso não encontrado';
                            break;
                        case 409:
                            errorMessage = this.extractErrorMessage(error) || 'Conflito de dados';
                            break;
                        case 422:
                            errorMessage = this.extractErrorMessage(error) || 'Erro de validação';
                            break;
                        case 500:
                            errorMessage = 'Erro interno do servidor';
                            break;
                        case 0:
                            errorMessage = 'Não foi possível conectar ao servidor';
                            break;
                    }
                }

                // Show notification for non-401 errors (401 already handled)
                if (error.status !== 401) {
                    this.notificationService.error('Erro', errorMessage);
                }

                return throwError(() => ({
                    status: error.status,
                    message: errorMessage,
                    originalError: error
                }));
            })
        );
    }

    private extractErrorMessage(error: HttpErrorResponse): string | null {
        if (error.error) {
            if (typeof error.error === 'string') {
                return error.error;
            }
            if (error.error.message) {
                return error.error.message;
            }
            if (error.error.error) {
                return error.error.error;
            }
        }
        return null;
    }

    private handleUnauthorized(): void {
        this.storageService.clearAll();
        this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: this.router.url }
        });
    }
}
