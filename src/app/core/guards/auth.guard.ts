import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
    const storageService = inject(StorageService);
    const router = inject(Router);

    if (storageService.hasToken()) {
        return true;
    }

    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};

export const noAuthGuard: CanActivateFn = (route, state) => {
    const storageService = inject(StorageService);
    const router = inject(Router);

    if (!storageService.hasToken()) {
        return true;
    }

    router.navigate(['/dashboard']);
    return false;
};
