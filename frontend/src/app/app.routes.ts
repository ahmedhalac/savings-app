import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { accountsExistGuard } from './core/guards/accounts.guards';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.LOGIN_ROUTES),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.REGISTER_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'setup',
        loadChildren: () =>
          import('./features/setup/setup.routes').then(m => m.SETUP_ROUTES),
      },
      {
        path: '',
        canActivate: [accountsExistGuard],
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'accounts',
        canActivate: [accountsExistGuard],
        loadChildren: () =>
          import('./features/accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES),
      },
      {
        path: 'transactions',
        canActivate: [accountsExistGuard],
        loadChildren: () =>
          import('./features/transactions/transactions.routes').then(m => m.TRANSACTIONS_ROUTES),
      },
      {
        path: 'goals',
        canActivate: [accountsExistGuard],
        loadChildren: () =>
          import('./features/goals/goals.routes').then(m => m.GOALS_ROUTES),
      },
      {
        path: 'loans',
        canActivate: [accountsExistGuard],
        loadChildren: () =>
          import('./features/loans/loans.routes').then(m => m.LOANS_ROUTES),
      },
    ],
  },
];
