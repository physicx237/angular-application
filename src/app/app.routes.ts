import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then((module) => module.Dashboard),
  },
  {
    path: 'timeline',
    loadComponent: () => import('./components/timeline/timeline').then((module) => module.Timeline),
  },
];
