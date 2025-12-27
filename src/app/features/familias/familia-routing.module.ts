import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamiliaGerenciarComponent } from './components/familia-gerenciar/familia-gerenciar.component';
import { MembroDetalheComponent } from './components/membro-detalhe/membro-detalhe.component';

const routes: Routes = [
    { path: '', component: FamiliaGerenciarComponent },
    { path: ':id/detalhes', component: MembroDetalheComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FamiliaRoutingModule { }
