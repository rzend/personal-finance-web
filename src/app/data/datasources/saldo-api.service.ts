import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface SaldoConta {
    usuarioId: number;
    saldo: number;
    moeda: string;
}

@Injectable({
    providedIn: 'root'
})
export class SaldoApiService extends ApiService {
    private readonly saldoUrl = `${this.baseUrl}/saldo-conta`;

    constructor(http: HttpClient) {
        super(http);
    }

    obterSaldo(usuarioId: number): Observable<SaldoConta> {
        const params = this.createParams({ usuarioId });
        return this.http.get<SaldoConta>(this.saldoUrl, { params });
    }
}
