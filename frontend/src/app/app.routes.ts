import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompaniesComponent } from './companies/companies.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ProductsComponent } from './products/products.component';
import { QuotationsComponent } from './quotations/quotations.component';
import { CompareComponent } from './components/compare/compare.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'vendors', component: VendorsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'quotations', component: QuotationsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'compare', component: CompareComponent }
    ]
  }
];
