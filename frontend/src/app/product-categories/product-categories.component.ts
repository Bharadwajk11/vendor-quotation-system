import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ProductCategoryFormComponent } from './product-category-form.component';

@Component({
  selector: 'app-product-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Product Categories</h1>
          <p class="page-subtitle">Categorize your products</p>
        </div>
        <button mat-raised-button color="primary" (click)="openDialog()" class="add-button">
          <mat-icon>add</mat-icon>
          Add Product Category
        </button>
      </div>

      <mat-card class="filters-card">
        <div class="compact-filters">
          <mat-form-field appearance="outline" class="compact-search">
            <mat-icon matPrefix class="search-icon">search</mat-icon>
            <input matInput [(ngModel)]="searchText" (input)="applySearch()" 
                   placeholder="Search product categories...">
            <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card>
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Category Name</th>
            <td mat-cell *matCellDef="let category"><strong>{{ category.name }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let category">{{ category.description || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="product_count">
            <th mat-header-cell *matHeaderCellDef>Products</th>
            <td mat-cell *matCellDef="let category">{{ category.product_count || 0 }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let category">
              <button mat-icon-button color="primary" (click)="openDialog(category)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProductCategory(category.id)">
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
  `]
})
export class ProductCategoriesComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allProductCategories: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'product_count', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProductCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadProductCategories() {
    this.apiService.getProductCategories().subscribe({
      next: (data) => {
        this.allProductCategories = data.results || data;
        this.applySearch();
      },
      error: (err: any) => console.error('Error loading product categories:', err)
    });
  }

  applySearch() {
    let filteredData = [...this.allProductCategories];

    if (this.searchText && this.searchText.trim() !== '') {
      const searchTerm = this.searchText.toLowerCase().trim();
      filteredData = filteredData.filter(category => {
        return (
          category.name?.toLowerCase().includes(searchTerm) ||
          category.description?.toLowerCase().includes(searchTerm)
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

  openDialog(productCategory?: any) {
    const dialogRef = this.dialog.open(ProductCategoryFormComponent, {
      width: '500px',
      data: productCategory
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductCategories();
      }
    });
  }

  deleteProductCategory(id: number) {
    if (confirm('Are you sure you want to delete this product category?')) {
      this.apiService.deleteProductCategory(id).subscribe({
        next: () => this.loadProductCategories(),
        error: (err: any) => console.error('Error deleting product category:', err)
      });
    }
  }
}