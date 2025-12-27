import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario, UsuarioAtualizacao } from '@domain/models';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) { }

    listarTodos(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    buscarPorId(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    }

    atualizar(id: number, dados: UsuarioAtualizacao): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, dados);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    importarExcel(arquivo: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', arquivo);
        return this.http.post(`${this.apiUrl}/importar-excel`, formData);
    }
}
