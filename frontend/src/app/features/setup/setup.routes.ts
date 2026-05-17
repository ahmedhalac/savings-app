import { Routes } from '@angular/router';
import { setupGuard } from '../../core/guards/accounts.guards';

export const SETUP_ROUTES: Routes = [
  {
    path: '',
    canActivate: [setupGuard],
    loadComponent: () =>
      import('./components/setup/setup').then(m => m.SetupComponent),
  },
];
