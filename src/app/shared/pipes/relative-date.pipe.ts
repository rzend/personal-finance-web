import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'relativeDate',
    standalone: true
})
export class RelativeDatePipe implements PipeTransform {
    transform(value: string | Date | null | undefined): string {
        if (!value) {
            return '-';
        }

        const date = value instanceof Date ? value : new Date(value);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 1) {
            return 'Agora';
        }

        if (diffMinutes < 60) {
            return `${diffMinutes} min atrás`;
        }

        if (diffHours < 24) {
            return `${diffHours}h atrás`;
        }

        if (diffDays === 0) {
            return 'Hoje';
        }

        if (diffDays === 1) {
            return 'Ontem';
        }

        if (diffDays < 7) {
            return `${diffDays} dias atrás`;
        }

        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
        }

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}
