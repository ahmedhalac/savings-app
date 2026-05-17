import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'accounts',
    loadChildren: () =>
      import('./features/accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES),
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./features/transactions/transactions.routes').then(m => m.TRANSACTIONS_ROUTES),
  },
  {
    path: 'goals',
    loadChildren: () =>
      import('./features/goals/goals.routes').then(m => m.GOALS_ROUTES),
  },
  {
    path: 'loans',
    loadChildren: () =>
      import('./features/loans/loans.routes').then(m => m.LOANS_ROUTES),
  },
  {
    path: 'ai',
    loadChildren: () =>
      import('./features/ai/ai.routes').then(m => m.AI_ROUTES),
  },
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
];
