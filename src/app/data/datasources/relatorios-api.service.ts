import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class RelatoriosApiService extends ApiService {
    private readonly relatoriosUrl = `${this.baseUrl}/relatorios`;

    constructor(http: HttpClient) {
        super(http);
    }

    downloadPdf(
        usuarioId: number,
        inicio?: string,
        fim?: string,
        moeda?: string
    ): Observable<Blob> {
        const params = this.createParams({ usuarioId, inicio, fim, moeda });
        return this.http.get(`${this.relatoriosUrl}/transacoes.pdf`, {
            params,
            responseType: 'blob'
        });
    }

    downloadExcel(
        usuarioId: number,
        inicio?: string,
        fim?: string,
        moeda?: string
    ): Observable<Blob> {
        const params = this.createParams({ usuarioId, inicio, fim, moeda });
        return this.http.get(`${this.relatoriosUrl}/transacoes.xlsx`, {
            params,
            responseType: 'blob'
        });
    }
}
