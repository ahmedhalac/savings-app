import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AccountsService } from '../../features/accounts/services/accounts.service';

export const accountsExistGuard: CanActivateFn = () => {
  const accountsService = inject(AccountsService);
  const router = inject(Router);
  return accountsService.getAll().pipe(
    map(accounts => accounts.length > 0 ? true : router.createUrlTree(['/setup'])),
    catchError(() => {
      // 401 / network failure — invalidate the poisoned shareReplay cache and bounce to login
      // so a hung guard observable can't strand the user mid-navigation (iOS PWA case).
      accountsService.invalidateCache();
      return of(router.createUrlTree(['/login']));
    }),
  );
};

export const setupGuard: CanActivateFn = () => {
  const accountsService = inject(AccountsService);
  const router = inject(Router);
  return accountsService.getAll().pipe(
    map(accounts => accounts.length === 0 ? true : router.createUrlTree(['/'])),
  );
};
