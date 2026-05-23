import { Routes } from '@angular/router';

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login').then(m => m.LoginComponent),
  },
];

export const REGISTER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./register/register').then(m => m.RegisterComponent),
  },
];
