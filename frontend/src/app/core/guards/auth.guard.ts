import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, race, take, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;
  if (!auth.isLoading()) return router.createUrlTree(['/login']);

  // Cap the wait at 8 seconds — on mobile PWA the session fetch can hang indefinitely
  // (e.g. Render cold start). After timeout, treat as unauthenticated.
  const resolved$ = toObservable(auth.isLoading).pipe(
    filter(loading => !loading),
    take(1),
  );
  return race(resolved$, timer(8000)).pipe(
    take(1),
    map(() => auth.isAuthenticated() ? true : router.createUrlTree(['/login'])),
  );
};
