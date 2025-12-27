import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatApiService, ChatMessage, ChatResponse } from '../../../data/datasources/chat-api.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
    @ViewChild('messageInput') private messageInput!: ElementRef;

    isOpen = false;
    isLoading = false;
    messages: ChatMessage[] = [];
    newMessage = '';
    sessionId: string = '';

    constructor(private chatService: ChatApiService) {
        this.sessionId = this.generateSessionId();
    }

    ngOnInit(): void {
        this.loadHistory();
    }

    ngOnDestroy(): void { }

    private generateSessionId(): string {
        return 'session_' + Math.random().toString(36).substring(2, 15);
    }

    toggleChat(): void {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            setTimeout(() => {
                this.scrollToBottom();
                this.messageInput?.nativeElement?.focus();
            }, 100);
        }
    }

    loadHistory(): void {
        this.chatService.buscarHistorico().subscribe({
            next: (messages) => {
                this.messages = messages;
                setTimeout(() => this.scrollToBottom(), 100);
            },
            error: (err) => console.error('Error loading history', err)
        });
    }

    sendMessage(): void {
        if (!this.newMessage.trim() || this.isLoading) return;

        const userMessage = this.newMessage.trim();
        this.newMessage = '';

        // Add user message to UI immediately
        const tempUserMsg: ChatMessage = {
            id: Date.now(),
            role: 'user',
            content: userMessage,
            criadoEm: new Date().toISOString(),
            sessionId: this.sessionId
        };
        this.messages.push(tempUserMsg);
        this.scrollToBottom();

        this.isLoading = true;

        this.chatService.enviarMensagem(userMessage, this.sessionId).subscribe({
            next: (response: ChatResponse) => {
                // Add assistant response
                const assistantMsg: ChatMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: response.resposta,
                    criadoEm: new Date().toISOString(),
                    sessionId: response.sessionId
                };
                this.messages.push(assistantMsg);
                this.sessionId = response.sessionId;
                this.isLoading = false;
                this.scrollToBottom();
            },
            error: (err) => {
                console.error('Error sending message', err);
                // Add error message
                const errorMsg: ChatMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
                    criadoEm: new Date().toISOString(),
                    sessionId: this.sessionId
                };
                this.messages.push(errorMsg);
                this.isLoading = false;
                this.scrollToBottom();
            }
        });
    }

    clearHistory(): void {
        if (confirm('Deseja limpar todo o histórico de conversas?')) {
            this.chatService.limparHistorico().subscribe({
                next: () => {
                    this.messages = [];
                    this.sessionId = this.generateSessionId();
                },
                error: (err) => console.error('Error clearing history', err)
            });
        }
    }

    private scrollToBottom(): void {
        try {
            setTimeout(() => {
                if (this.messagesContainer) {
                    this.messagesContainer.nativeElement.scrollTop =
                        this.messagesContainer.nativeElement.scrollHeight;
                }
            }, 50);
        } catch (err) { }
    }

    handleKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
}
