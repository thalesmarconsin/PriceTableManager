import { Routes } from '@angular/router';
import { PriceTableComponent } from './price-table/price-table.component';
import { FormProductsComponent } from './products/form-products/form-products.component';
import { FormCategoriesComponent } from './categories/form-categories/form-categories.component';
import { GridCategoriasComponent } from './categories/grid-categories/grid-categories.component';
import { HomeComponent } from './home/home.component';
import { EditCategoriesComponent } from './categories/edit-categories/edit-categories.component';
import { GridProductsComponent } from './products/grid-products/grid-products.component';
import { EditProductsComponent } from './products/edit-products/edit-products.component';

export const COMPONENTS_ROUTE: Routes = [
  { path: '', component: HomeComponent },

  { path: 'table', component: PriceTableComponent },

  { path: 'categories', component: GridCategoriasComponent},
  { path: 'categories/categoriesForm', component: FormCategoriesComponent},
  { path: 'categories/editCategories/:id', component: EditCategoriesComponent},

  { path: 'products', component: GridProductsComponent },
  { path: 'products/productsForm', component: FormProductsComponent },
  { path: 'products/editProducts/:id', component: EditProductsComponent },
];
