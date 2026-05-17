import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AccountsService } from '../../features/accounts/services/accounts.service';

export const accountsExistGuard: CanActivateFn = () => {
  const accountsService = inject(AccountsService);
  const router = inject(Router);
  return accountsService.getAll().pipe(
    map(accounts => accounts.length > 0 ? true : router.createUrlTree(['/setup'])),
  );
};

export const setupGuard: CanActivateFn = () => {
  const accountsService = inject(AccountsService);
  const router = inject(Router);
  return accountsService.getAll().pipe(
    map(accounts => accounts.length === 0 ? true : router.createUrlTree(['/'])),
  );
};
