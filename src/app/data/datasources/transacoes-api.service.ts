import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Transacao,
    TransacaoCriacao,
    TransacaoFiltros,
    TransacaoPage
} from '@domain/models';

@Injectable({
    providedIn: 'root'
})
export class TransacoesApiService extends ApiService {
    private readonly transacoesUrl = `${this.baseUrl}/transacoes`;

    constructor(http: HttpClient) {
        super(http);
    }

    listar(
        filtros: TransacaoFiltros = {},
        page: number = 0,
        size: number = 10
    ): Observable<TransacaoPage> {
        const params = this.createParams({
            ...filtros,
            page,
            size
        });
        return this.http.get<TransacaoPage>(this.transacoesUrl, { params });
    }

    buscarPorId(id: number): Observable<Transacao> {
        return this.http.get<Transacao>(`${this.transacoesUrl}/${id}`);
    }

    criar(transacao: TransacaoCriacao): Observable<Transacao> {
        return this.http.post<Transacao>(this.transacoesUrl, transacao);
    }

    atualizar(id: number, transacao: Partial<TransacaoCriacao>): Observable<Transacao> {
        return this.http.put<Transacao>(`${this.transacoesUrl}/${id}`, transacao);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.transacoesUrl}/${id}`);
    }

    listarRecentes(usuarioId: number, limite: number = 5): Observable<TransacaoPage> {
        const params = this.createParams({
            usuarioId,
            page: 0,
            size: limite
        });
        return this.http.get<TransacaoPage>(this.transacoesUrl, { params });
    }
}
