import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../services/api.service';
import { ProductFormComponent } from './product-form.component.js';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Products</h1>
        <p class="page-subtitle">Manage your product catalog</p>
      </div>

      <div class="action-buttons">
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="products" class="mat-elevation-z0">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let product">{{ product.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Product Name</th>
            <td mat-cell *matCellDef="let product">
              <strong>{{ product.name }}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let product">
              <mat-chip-set>
                <mat-chip>{{ product.category }}</mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="grade_spec">
            <th mat-header-cell *matHeaderCellDef>Grade/Specification</th>
            <td mat-cell *matCellDef="let product">{{ product.grade_spec }}</td>
          </ng-container>

          <ng-container matColumnDef="unit_price">
            <th mat-header-cell *matHeaderCellDef>Unit Price</th>
            <td mat-cell *matCellDef="let product">
              ₹{{ product.unit_price }}/{{ product.unit_type }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let product">
              <button mat-icon-button color="primary" (click)="openDialog(product)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProduct(product.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'category', 'grade_spec', 'unit_price', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (data) => this.products = data.results || data,
      error: (err: any) => console.error('Error loading products:', err)
    });
  }

  openDialog(product?: any) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => console.error('Error deleting product:', err)
      });
    }
  }
}
