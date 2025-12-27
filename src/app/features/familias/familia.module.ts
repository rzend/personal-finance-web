import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FamiliaRoutingModule } from './familia-routing.module';
import { FamiliaGerenciarComponent } from './components/familia-gerenciar/familia-gerenciar.component';
import { MembroDetalheComponent } from './components/membro-detalhe/membro-detalhe.component';

@NgModule({
    declarations: [
        FamiliaGerenciarComponent,
        MembroDetalheComponent
    ],
    imports: [
        CommonModule,
        FamiliaRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class FamiliaModule { }
