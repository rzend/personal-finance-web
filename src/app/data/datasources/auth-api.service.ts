import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, UsuarioCriacao, Usuario } from '@domain/models';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService extends ApiService {
    private readonly authUrl = `${this.baseUrl}/auth`;

    constructor(http: HttpClient) {
        super(http);
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.authUrl}/login`, credentials);
    }

    register(userData: UsuarioCriacao): Observable<Usuario> {
        return this.http.post<Usuario>(`${this.authUrl}/registrar`, userData);
    }
}
