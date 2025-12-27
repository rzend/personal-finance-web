import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambioComponent } from './cambio.component';

const routes: Routes = [
    { path: '', component: CambioComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CambioRoutingModule { }
