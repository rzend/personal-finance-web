import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Standalone components
import {
    MetricCardComponent,
    TransactionCardComponent,
    ModalComponent,
    ToastComponent,
    LoadingSpinnerComponent
} from './components';

// Standalone pipes
import {
    BrlCurrencyPipe,
    CpfPipe,
    RelativeDatePipe
} from './pipes';

const STANDALONE_COMPONENTS = [
    MetricCardComponent,
    TransactionCardComponent,
    ModalComponent,
    ToastComponent,
    LoadingSpinnerComponent
];

const STANDALONE_PIPES = [
    BrlCurrencyPipe,
    CpfPipe,
    RelativeDatePipe
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ...STANDALONE_COMPONENTS,
        ...STANDALONE_PIPES
    ],
    exports: [
        // Re-export common modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        // Export components and pipes
        ...STANDALONE_COMPONENTS,
        ...STANDALONE_PIPES
    ]
})
export class SharedModule { }
