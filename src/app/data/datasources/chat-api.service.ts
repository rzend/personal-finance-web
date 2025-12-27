import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ChatRequest {
    mensagem: string;
    sessionId?: string;
}

export interface ChatResponse {
    resposta: string;
    sessionId: string;
}

export interface ChatMessage {
    id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    criadoEm: string;
    sessionId: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatApiService extends ApiService {
    private readonly chatUrl = `${this.baseUrl}/api/chat`;

    constructor(http: HttpClient) {
        super(http);
    }

    /**
     * Send a message to the chatbot.
     */
    enviarMensagem(mensagem: string, sessionId?: string): Observable<ChatResponse> {
        const request: ChatRequest = { mensagem, sessionId };
        return this.http.post<ChatResponse>(this.chatUrl, request);
    }

    /**
     * Get chat history for the current user.
     */
    buscarHistorico(): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(`${this.chatUrl}/historico`);
    }

    /**
     * Get chat history by session ID.
     */
    buscarHistoricoPorSessao(sessionId: string): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(`${this.chatUrl}/historico/${sessionId}`);
    }

    /**
     * Clear chat history.
     */
    limparHistorico(): Observable<void> {
        return this.http.delete<void>(`${this.chatUrl}/historico`);
    }
}
