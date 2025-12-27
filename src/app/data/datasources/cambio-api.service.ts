import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    Moeda,
    TaxaCambio,
    CalculoCambioRequest,
    ConversaoResultado
} from '@domain/models';

@Injectable({
    providedIn: 'root'
})
export class CambioApiService extends ApiService {
    private readonly cambioUrl = `${this.baseUrl}/cambio`;

    constructor(http: HttpClient) {
        super(http);
    }

    listarMoedas(): Observable<Moeda[]> {
        return this.http.get<Moeda[]>(`${this.cambioUrl}/moedas`);
    }

    obterTaxa(origem: string, destino: string): Observable<TaxaCambio> {
        const params = this.createParams({ origem, destino });
        return this.http.get<TaxaCambio>(`${this.cambioUrl}/taxa`, { params });
    }

    calcularCusto(request: CalculoCambioRequest): Observable<ConversaoResultado> {
        return this.http.post<ConversaoResultado>(
            `${this.cambioUrl}/calcular-custo`,
            request
        );
    }
}
