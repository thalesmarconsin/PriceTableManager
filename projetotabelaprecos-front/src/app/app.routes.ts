import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/components.routes').then((m) => m.COMPONENTS_ROUTE),
  },

];
