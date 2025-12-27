import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AnaliseDespesas } from '@domain/models';

@Injectable({
    providedIn: 'root'
})
export class AnaliseApiService extends ApiService {
    private readonly analiseUrl = `${this.baseUrl}/analise`;

    constructor(http: HttpClient) {
        super(http);
    }

    analisarDespesas(
        usuarioId: number,
        inicio?: string,
        fim?: string,
        moedaPadrao: string = 'BRL'
    ): Observable<AnaliseDespesas> {
        const params = this.createParams({
            usuarioId,
            inicio,
            fim,
            moedaPadrao
        });
        return this.http.get<AnaliseDespesas>(`${this.analiseUrl}/despesas`, { params });
    }
}
