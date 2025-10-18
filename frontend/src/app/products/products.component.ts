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
        <div class="compact-filters">
          <mat-form-field appearance="outline" class="compact-search">
            <mat-icon matPrefix class="search-icon">search</mat-icon>
            <input matInput [(ngModel)]="searchText" (input)="applySearch()" 
                   placeholder="Search products...">
            <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
        </div>
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

          <ng-container matColumnDef="unit_type">
            <th mat-header-cell *matHeaderCellDef>Unit Type</th>
            <td mat-cell *matCellDef="let product">{{ product.unit_type }}</td>
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
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 20px;
    }

    .add-button {
      white-space: nowrap;
      height: 40px;
    }

    @media (max-width: 600px) {
      .page-header {
        align-items: flex-start;
        gap: 12px;
      }

      .add-button {
        height: 36px;
        min-width: 36px;
        padding: 0 12px;
      }

      .add-button mat-icon {
        margin-right: 4px;
        font-size: 20px;
      }

      .add-button .mat-button-wrapper {
        font-size: 13px;
      }
    }

    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }

    .page-subtitle {
      font-size: 16px;
      color: #666;
    }

    .add-button {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 8px;
    }

    .filters-card {
      margin-bottom: 20px;
      padding: 12px 16px;
    }

    .compact-filters {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .compact-search {
      flex: 1;
      min-width: 280px;
    }

    .compact-search ::ng-deep .mat-mdc-form-field-infix {
      padding-top: 8px;
      padding-bottom: 8px;
      min-height: 40px;
    }

    .search-icon {
      color: #666;
      font-size: 20px;
      margin-right: 4px;
    }

    .clear-btn {
      width: 32px;
      height: 32px;
    }

    .clear-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    ::ng-deep .compact-search .mat-mdc-text-field-wrapper {
      padding-bottom: 0;
    }

    ::ng-deep .compact-search .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    table {
      width: 100%;
      table-layout: auto;
    }

    th {
      background-color: #f9f9f9;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
      padding: 12px 16px;
    }

    td {
      color: #555;
      padding: 12px 16px;
    }

    td strong {
      font-weight: 500;
    }

    .mat-chip-set {
      margin: 0;
    }

    .mat-chip {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
    }

    .no-data {
      color: #ccc;
      font-style: italic;
    }

    mat-card {
      overflow-x: auto;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .page-title {
        font-size: 22px;
      }

      .page-subtitle {
        font-size: 14px;
      }

      .add-button {
        width: 100%;
        justify-content: center;
      }

      .filters-card {
        padding: 10px 12px;
      }

      .compact-search {
        min-width: 100%;
      }
    }

    @media (max-width: 600px) {
      .page-container {
        padding: 12px;
      }

      .page-title {
        font-size: 20px;
      }

      .page-subtitle {
        font-size: 13px;
      }

      .add-button {
        font-size: 13px;
        padding: 10px 16px;
      }

      table {
        font-size: 13px;
      }

      th, td {
        padding: 8px 4px;
      }

      .mat-chip {
        font-size: 11px;
        padding: 3px 6px;
      }

      button[mat-icon-button] {
        width: 36px;
        height: 36px;
      }

      button[mat-icon-button] mat-icon {
        font-size: 20px;
      }
    }

    @media (max-width: 400px) {
      .page-container {
        padding: 10px;
      }

      .page-title {
        font-size: 18px;
      }

      .page-subtitle {
        font-size: 12px;
      }

      .add-button {
        font-size: 12px;
        padding: 8px 12px;
      }

      table {
        font-size: 12px;
      }

      th, td {
        padding: 6px 3px;
      }

      button[mat-icon-button] {
        width: 32px;
        height: 32px;
      }

      button[mat-icon-button] mat-icon {
        font-size: 18px;
      }
    }
  `]
})
export class ProductsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allProducts: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'product_group', 'product_category', 'grade_spec', 'unit_type', 'actions'];
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