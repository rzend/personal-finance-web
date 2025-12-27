import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario, UsuarioCriacao, UsuarioAtualizacao } from '@domain/models';

export interface ResultadoImportacao {
    sucesso: number;
    falhas: number;
    erros: string[];
}

@Injectable({
    providedIn: 'root'
})
export class UsuariosApiService extends ApiService {
    private readonly usuariosUrl = `${this.baseUrl}/usuarios`;

    constructor(http: HttpClient) {
        super(http);
    }

    listar(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.usuariosUrl);
    }

    buscarPorId(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.usuariosUrl}/${id}`);
    }

    criar(usuario: UsuarioCriacao): Observable<Usuario> {
        return this.http.post<Usuario>(this.usuariosUrl, usuario);
    }

    atualizar(id: number, dados: UsuarioAtualizacao): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.usuariosUrl}/${id}`, dados);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.usuariosUrl}/${id}`);
    }

    importarExcel(arquivo: File): Observable<ResultadoImportacao> {
        const formData = new FormData();
        formData.append('arquivo', arquivo);
        return this.http.post<ResultadoImportacao>(
            `${this.usuariosUrl}/importar-excel`,
            formData
        );
    }
}
