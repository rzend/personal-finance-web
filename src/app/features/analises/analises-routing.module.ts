import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalisesComponent } from './analises.component';

const routes: Routes = [
    { path: '', component: AnalisesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalisesRoutingModule { }
