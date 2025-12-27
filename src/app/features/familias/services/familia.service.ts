import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '@domain/models';

@Injectable({
    providedIn: 'root'
})
export class FamiliaService {
    private apiUrl = `${environment.apiUrl}/familias`;

    constructor(private http: HttpClient) { }

    criarFamilia(nome: string): Observable<void> {
        return this.http.post<void>(this.apiUrl, { nome });
    }

    adicionarMembro(familiaId: number, usuarioId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${familiaId}/membros`, { usuarioId });
    }

    listarMeusMembros(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/meus-membros`);
    }
}
