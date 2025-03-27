import { Routes } from '@angular/router';
import { ProductListComponent } from './features/feature-1/ui/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    component: ProductListComponent
  }
];
//export const routes: Routes = [];
