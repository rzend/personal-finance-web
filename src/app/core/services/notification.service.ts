import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private toastSubject = new Subject<ToastMessage>();
    toast$ = this.toastSubject.asObservable();

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    show(toast: Omit<ToastMessage, 'id'>): void {
        this.toastSubject.next({
            ...toast,
            id: this.generateId(),
            duration: toast.duration ?? 5000
        });
    }

    success(title: string, message?: string): void {
        this.show({ type: 'success', title, message });
    }

    error(title: string, message?: string): void {
        this.show({ type: 'error', title, message, duration: 8000 });
    }

    warning(title: string, message?: string): void {
        this.show({ type: 'warning', title, message });
    }

    info(title: string, message?: string): void {
        this.show({ type: 'info', title, message });
    }
}
