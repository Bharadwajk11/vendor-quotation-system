import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ProductFormComponent } from './product-form.component';

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
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatPaginatorModule,
    FormsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Products</h1>
          <p class="page-subtitle">Manage your product catalog</p>
        </div>
        <button mat-raised-button color="primary" (click)="openDialog()" class="add-button">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <mat-card class="filters-card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [(ngModel)]="searchText" (input)="applySearch()" placeholder="Search products...">
          <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
      </mat-card>

      <mat-card>

        <table mat-table [dataSource]="dataSource" class="mat-elevation-z0">
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

          <ng-container matColumnDef="product_group">
            <th mat-header-cell *matHeaderCellDef>Product Group</th>
            <td mat-cell *matCellDef="let product">
              <mat-chip-set *ngIf="product.product_group_name">
                <mat-chip color="primary">{{ product.product_group_name }}</mat-chip>
              </mat-chip-set>
              <span *ngIf="!product.product_group_name" class="no-data">—</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="product_category">
            <th mat-header-cell *matHeaderCellDef>Product Category</th>
            <td mat-cell *matCellDef="let product">
              <mat-chip-set *ngIf="product.product_category_name">
                <mat-chip color="accent">{{ product.product_category_name }}</mat-chip>
              </mat-chip-set>
              <span *ngIf="!product.product_category_name" class="no-data">—</span>
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

        <mat-paginator [pageSizeOptions]="[10, 25, 50]" 
                       [pageSize]="10"
                       showFirstLastButtons>
        </mat-paginator>
      </mat-card>
    </div>
  `
})
export class ProductsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allProducts: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'product_group', 'product_category', 'grade_spec', 'unit_price', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data.results || data;
        this.dataSource.data = this.allProducts;
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
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

  applySearch() {
    let filteredData = [...this.allProducts];

    if (this.searchText && this.searchText.trim() !== '') {
      const searchTerm = this.searchText.toLowerCase().trim();
      filteredData = filteredData.filter(product => {
        return (
          product.name?.toLowerCase().includes(searchTerm) ||
          product.product_group_name?.toLowerCase().includes(searchTerm) ||
          product.product_category_name?.toLowerCase().includes(searchTerm) ||
          product.grade_spec?.toLowerCase().includes(searchTerm)
        );
      });
    }

    this.dataSource.data = filteredData;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  clearSearch() {
    this.searchText = '';
    this.applySearch();
  }
}