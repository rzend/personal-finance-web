import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated && authService.hasRole('ROLE_MASTER')) {
        return true;
    }

    // Se estiver logado mas não for master, redireciona para dashboard
    if (authService.isAuthenticated) {
        router.navigate(['/dashboard']);
        return false;
    }

    // Se não estiver logado, redireciona para login
    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};
