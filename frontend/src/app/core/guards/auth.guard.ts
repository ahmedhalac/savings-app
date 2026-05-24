import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If already authenticated (optimistic after login OR confirmed session), let through immediately.
  // Never block on isLoading here — on mobile PWA the session refetch can hang indefinitely.
  if (auth.isAuthenticated()) return true;
  if (!auth.isLoading()) return router.createUrlTree(['/login']);

  return toObservable(auth.isLoading).pipe(
    filter(loading => !loading),
    take(1),
    map(() => auth.isAuthenticated() ? true : router.createUrlTree(['/login']))
  );
};
