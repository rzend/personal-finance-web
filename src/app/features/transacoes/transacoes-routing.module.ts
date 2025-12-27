import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransacoesListComponent } from './transacoes-list/transacoes-list.component';
import { TransacaoFormComponent } from './transacao-form/transacao-form.component';

const routes: Routes = [
    { path: '', component: TransacoesListComponent },
    { path: 'nova', component: TransacaoFormComponent },
    { path: 'editar/:id', component: TransacaoFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransacoesRoutingModule { }
