import { Routes } from '@angular/router';
import { ProductListComponent } from './features/feature-1/ui/product-list/product-list.component';
import { CreateProductFormularioComponent } from './features/feature-1/ui/create-product-formulario/create-product-formulario.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    component: ProductListComponent
  },
  {
    path: 'crear-producto',
    component: CreateProductFormularioComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

