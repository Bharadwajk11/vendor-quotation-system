import { Routes } from '@angular/router';
import { CompareComponent } from './components/compare/compare.component';

export const routes: Routes = [
  { path: 'compare', component: CompareComponent },
  { path: '', redirectTo: '/compare', pathMatch: 'full' }
];
