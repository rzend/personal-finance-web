import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'brlCurrency',
    standalone: true
})
export class BrlCurrencyPipe implements PipeTransform {
    transform(value: number | null | undefined, currency: string = 'BRL'): string {
        if (value === null || value === undefined) {
            return '-';
        }

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(value);
    }
}
