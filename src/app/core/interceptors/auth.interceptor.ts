import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { environment } from '@env/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private storageService: StorageService) { }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        // Only add token for API requests
        if (!request.url.startsWith(environment.apiUrl)) {
            return next.handle(request);
        }

        // Skip auth header for login and register endpoints
        if (
            request.url.includes('/auth/login') ||
            request.url.includes('/auth/registrar')
        ) {
            return next.handle(request);
        }

        const token = this.storageService.getToken();

        if (token) {
            const authRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(authRequest);
        }

        return next.handle(request);
    }
}
