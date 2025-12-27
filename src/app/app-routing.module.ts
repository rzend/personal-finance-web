import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
        canActivate: [noAuthGuard]
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'transacoes',
                loadChildren: () => import('./features/transacoes/transacoes.module').then(m => m.TransacoesModule)
            },
            {
                path: 'analises',
                loadChildren: () => import('./features/analises/analises.module').then(m => m.AnalisesModule)
            },
            {
                path: 'cambio',
                loadChildren: () => import('./features/cambio/cambio.module').then(m => m.CambioModule)
            },
            {
                path: 'relatorios',
                loadChildren: () => import('./features/relatorios/relatorios.module').then(m => m.RelatoriosModule)
            },
            {
                path: 'minha-familia',
                loadChildren: () => import('./features/familias/familia.module').then(m => m.FamiliaModule)
            },
            {
                path: 'admin',
                loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
                canActivate: [adminGuard]
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
