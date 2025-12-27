import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AuthUser } from '@domain/models';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly tokenKey = environment.tokenKey;
    private readonly userKey = environment.userKey;

    // Token methods
    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    hasToken(): boolean {
        return !!this.getToken();
    }

    // User methods
    setUser(user: AuthUser): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    getUser(): AuthUser | null {
        const userJson = localStorage.getItem(this.userKey);
        if (userJson) {
            try {
                return JSON.parse(userJson) as AuthUser;
            } catch {
                return null;
            }
        }
        return null;
    }

    removeUser(): void {
        localStorage.removeItem(this.userKey);
    }

    // Clear all auth data
    clearAll(): void {
        this.removeToken();
        this.removeUser();
    }
}
