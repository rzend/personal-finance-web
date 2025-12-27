import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthApiService } from '@data/datasources/auth-api.service';
import { AuthUser, LoginRequest, LoginResponse, UsuarioCriacao, Usuario } from '@domain/models';

interface JwtPayload {
    sub: string;
    roles: string[];
    exp: number;
    iat: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    currentUser$ = this.currentUserSubject.asObservable();
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private storageService: StorageService,
        private authApi: AuthApiService,
        private router: Router
    ) {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        const token = this.storageService.getToken();
        let user = this.storageService.getUser();

        if (token && user) {
            // Se o usuário não tiver roles (ex: login antigo salvo), tenta extrair do token novamente
            if (!user.roles || user.roles.length === 0) {
                console.log('Recuperando roles do token armazenado...');
                user.roles = this.getRolesFromToken(token);
                this.storageService.setUser(user);
            }

            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
        }
    }

    get currentUser(): AuthUser | null {
        return this.currentUserSubject.value;
    }

    get isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    get token(): string | null {
        return this.storageService.getToken();
    }

    hasRole(role: string): boolean {
        const user = this.currentUserSubject.value;
        return user?.roles?.includes(role) ?? false;
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.authApi.login(credentials).pipe(
            tap((response: LoginResponse) => {
                this.handleLoginSuccess(response);
            })
        );
    }

    register(userData: UsuarioCriacao): Observable<Usuario> {
        return this.authApi.register(userData);
    }

    logout(): void {
        this.storageService.clearAll();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/auth/login']);
    }

    private handleLoginSuccess(response: LoginResponse): void {
        console.log('Login Response:', response); // Debug

        let roles: string[] = this.getRolesFromToken(response.token);

        // Fallback: Se não encontrou roles no token, usa o 'tipo' retornado no login
        if (roles.length === 0 && response.tipo) {
            // Normaliza o tipo para o formato de role (ex: MASTER -> ROLE_MASTER)
            const role = response.tipo.startsWith('ROLE_') ? response.tipo : `ROLE_${response.tipo}`;
            roles = [role];
        }

        console.log('Calculated Roles in Login:', roles); // Debug

        const user: AuthUser = {
            id: response.usuarioId,
            email: response.email,
            nomeCompleto: response.nomeCompleto,
            roles: roles
        };

        this.storageService.setToken(response.token);
        this.storageService.setUser(user);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    updateCurrentUser(updates: Partial<AuthUser>): void {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
            const updatedUser = { ...currentUser, ...updates };
            this.storageService.setUser(updatedUser);
            this.currentUserSubject.next(updatedUser);
        }
    }

    private getRolesFromToken(token: string): string[] {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload: any = JSON.parse(decodedPayload);

            console.log('JWT Payload:', parsedPayload); // Debug

            let roles: string[] = [];

            if (Array.isArray(parsedPayload.roles)) {
                roles = parsedPayload.roles;
            } else if (typeof parsedPayload.roles === 'string') {
                roles = [parsedPayload.roles];
            } else if (parsedPayload.scope) {
                roles = typeof parsedPayload.scope === 'string' ? parsedPayload.scope.split(' ') : parsedPayload.scope;
            } else if (Array.isArray(parsedPayload.authorities)) {
                roles = parsedPayload.authorities;
            }

            console.log('Extracted Roles:', roles); // Debug
            return roles;
        } catch (e) {
            console.error('Erro ao decodificar token JWT', e);
            return [];
        }
    }
}
