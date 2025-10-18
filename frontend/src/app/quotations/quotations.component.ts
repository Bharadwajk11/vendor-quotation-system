import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';
import { QuotationFormComponent } from './quotation-form.component.js';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1 class="page-title">Quotations</h1>
            <p class="page-subtitle">Manage vendor quotations and pricing</p>
          </div>
          <button mat-raised-button color="primary" (click)="openDialog()" class="add-button">
            <mat-icon>add</mat-icon>
            Add Quotation
          </button>
        </div>
      </div>

      <mat-card class="filters-card">
        <div class="compact-filters">
          <mat-form-field appearance="outline" class="compact-search">
            <mat-icon matPrefix class="search-icon">search</mat-icon>
            <input matInput [(ngModel)]="searchText" (input)="applySearch()" 
                   placeholder="Search quotations...">
            <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>

          <mat-form-field appearance="outline" class="compact-filter">
            <mat-icon matPrefix class="filter-icon">store</mat-icon>
            <mat-select [(ngModel)]="selectedVendor" (selectionChange)="applyFilters()" placeholder="Vendor">
              <mat-option [value]="null">All Vendors</mat-option>
              <mat-option *ngFor="let vendor of vendors" [value]="vendor.id">
                {{ vendor.name }}
              </mat-option>
            </mat-select>
            <button mat-icon-button matSuffix *ngIf="selectedVendor !== null" (click)="clearVendorFilter($event)" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
            <mat-icon matIconSuffix *ngIf="selectedVendor === null" class="dropdown-arrow">arrow_drop_down</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="compact-filter">
            <mat-icon matPrefix class="filter-icon">inventory_2</mat-icon>
            <mat-select [(ngModel)]="selectedProduct" (selectionChange)="applyFilters()" placeholder="Product">
              <mat-option [value]="null">All Products</mat-option>
              <mat-option *ngFor="let product of products" [value]="product.id">
                {{ product.name }}
              </mat-option>
            </mat-select>
            <button mat-icon-button matSuffix *ngIf="selectedProduct !== null" (click)="clearProductFilter($event)" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
            <mat-icon matIconSuffix *ngIf="selectedProduct === null" class="dropdown-arrow">arrow_drop_down</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="compact-filter">
            <mat-icon matPrefix class="filter-icon">category</mat-icon>
            <mat-select [(ngModel)]="selectedProductGroup" (selectionChange)="applyFilters()" placeholder="Group">
              <mat-option [value]="null">All Groups</mat-option>
              <mat-option *ngFor="let group of productGroups" [value]="group.id">
                {{ group.name }}
              </mat-option>
            </mat-select>
            <button mat-icon-button matSuffix *ngIf="selectedProductGroup !== null" (click)="clearProductGroupFilter($event)" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
            <mat-icon matIconSuffix *ngIf="selectedProductGroup === null" class="dropdown-arrow">arrow_drop_down</mat-icon>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card>
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z0">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let quote">{{ quote.id }}</td>
          </ng-container>

          <ng-container matColumnDef="vendor">
            <th mat-header-cell *matHeaderCellDef>Vendor</th>
            <td mat-cell *matCellDef="let quote">
              <strong>{{ quote.vendor_name }}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Product</th>
            <td mat-cell *matCellDef="let quote">{{ quote.product_name }}</td>
          </ng-container>

          <ng-container matColumnDef="product_group">
            <th mat-header-cell *matHeaderCellDef>Product Group</th>
            <td mat-cell *matCellDef="let quote">{{ quote.product_group_name || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="product_price">
            <th mat-header-cell *matHeaderCellDef>Product Price</th>
            <td mat-cell *matCellDef="let quote">₹{{ quote.product_price }}</td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Quantity (kg)</th>
            <td mat-cell *matCellDef="let quote">{{ quote.quantity || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="delivery_price">
            <th mat-header-cell *matHeaderCellDef>Delivery Charges</th>
            <td mat-cell *matCellDef="let quote">₹{{ quote.delivery_price }}</td>
          </ng-container>

          <ng-container matColumnDef="total_landing_price">
            <th mat-header-cell *matHeaderCellDef>Total Landing Price (₹)</th>
            <td mat-cell *matCellDef="let quote">
              <strong>{{ calculateTotalLandingPrice(quote) }}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="landing_price">
            <th mat-header-cell *matHeaderCellDef>Landing Price (₹/kg)</th>
            <td mat-cell *matCellDef="let quote">₹{{ quote.kilo_price }}</td>
          </ng-container>

          <ng-container matColumnDef="lead_time">
            <th mat-header-cell *matHeaderCellDef>Lead Time</th>
            <td mat-cell *matCellDef="let quote">{{ quote.lead_time_days }} days</td>
          </ng-container>

          <ng-container matColumnDef="grade_spec">
            <th mat-header-cell *matHeaderCellDef>Grade</th>
            <td mat-cell *matCellDef="let quote">{{ quote.grade_spec }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let quote">
              <button mat-icon-button color="primary" (click)="openDialog(quote)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteQuotation(quote.id)">
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
      margin-bottom: 16px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .add-button {
      white-space: nowrap;
      height: 40px;
    }

    @media (max-width: 600px) {
      .header-content {
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

    .compact-filter {
      min-width: 180px;
      flex: 0 1 auto;
    }

    .compact-search, .compact-filter {
      font-size: 14px;
    }

    .compact-search ::ng-deep .mat-mdc-form-field-infix {
      padding-top: 8px;
      padding-bottom: 8px;
      min-height: 40px;
    }

    .compact-filter ::ng-deep .mat-mdc-form-field-infix {
      padding-top: 8px;
      padding-bottom: 8px;
      min-height: 40px;
    }

    .search-icon, .filter-icon {
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

    .dropdown-arrow {
      color: #666;
      font-size: 24px;
      pointer-events: none;
    }

    ::ng-deep .compact-search .mat-mdc-text-field-wrapper,
    ::ng-deep .compact-filter .mat-mdc-text-field-wrapper {
      padding-bottom: 0;
    }

    ::ng-deep .compact-search .mat-mdc-form-field-subscript-wrapper,
    ::ng-deep .compact-filter .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    table {
      width: 100%;
    }

    th {
      background-color: #3f51b5;
      font-weight: 600;
      color: white;
      padding: 16px;
    }

    td {
      color: #555;
      padding: 12px 16px;
    }
  `]
})
export class QuotationsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allQuotations: any[] = [];
  displayedColumns: string[] = ['id', 'vendor', 'product', 'product_group', 'product_price', 'quantity', 'delivery_price', 'total_landing_price', 'landing_price', 'lead_time', 'grade_spec', 'actions'];

  vendors: any[] = [];
  products: any[] = [];
  productGroups: any[] = [];

  selectedVendor: number | null = null;
  selectedProduct: number | null = null;
  selectedProductGroup: number | null = null;
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadAllData() {
    forkJoin({
      quotations: this.apiService.getQuotations(),
      vendors: this.apiService.getVendors(),
      products: this.apiService.getProducts(),
      productGroups: this.apiService.getProductGroups()
    }).subscribe({
      next: (data) => {
        this.allQuotations = data.quotations.results || data.quotations;
        this.vendors = data.vendors.results || data.vendors;
        this.products = data.products.results || data.products;
        this.productGroups = data.productGroups.results || data.productGroups;
        this.applyFilters();
      },
      error: (err: any) => console.error('Error loading data:', err)
    });
  }

  applyFilters() {
    let filteredData = [...this.allQuotations];

    if (this.selectedVendor !== null || this.selectedProduct !== null || this.selectedProductGroup !== null) {
      filteredData = filteredData.filter(quote => {
        let matchesVendor = true;
        let matchesProduct = true;
        let matchesProductGroup = true;

        if (this.selectedVendor !== null) {
          matchesVendor = quote.vendor === this.selectedVendor;
        }

        if (this.selectedProduct !== null) {
          matchesProduct = quote.product === this.selectedProduct;
        }

        if (this.selectedProductGroup !== null) {
          const product = this.products.find(p => p.id === quote.product);
          matchesProductGroup = product && product.product_group === this.selectedProductGroup;
        }

        return matchesVendor && matchesProduct && matchesProductGroup;
      });
    }

    this.applySearchToData(filteredData);
  }

  applySearchToData(data: any[]) {
    if (this.searchText && this.searchText.trim() !== '') {
      const searchTerm = this.searchText.toLowerCase().trim();
      data = data.filter(quote => {
        return (
          quote.vendor_name?.toLowerCase().includes(searchTerm) ||
          quote.product_name?.toLowerCase().includes(searchTerm) ||
          quote.grade_spec?.toLowerCase().includes(searchTerm) ||
          quote.id?.toString().includes(searchTerm)
        );
      });
    }

    this.dataSource.data = data;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  applySearch() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchText = '';
    this.applyFilters();
  }

  clearVendorFilter(event: Event) {
    event.stopPropagation();
    this.selectedVendor = null;
    this.applyFilters();
  }

  clearProductFilter(event: Event) {
    event.stopPropagation();
    this.selectedProduct = null;
    this.applyFilters();
  }

  clearProductGroupFilter(event: Event) {
    event.stopPropagation();
    this.selectedProductGroup = null;
    this.applyFilters();
  }

  openDialog(quotation?: any) {
    const dialogRef = this.dialog.open(QuotationFormComponent, {
      width: '700px',
      data: quotation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAllData();
      }
    });
  }

  deleteQuotation(id: number) {
    if (confirm('Are you sure you want to delete this quotation?')) {
      this.apiService.deleteQuotation(id).subscribe({
        next: () => this.loadAllData(),
        error: (err: any) => console.error('Error deleting quotation:', err)
      });
    }
  }

  calculateTotalLandingPrice(quote: any): string {
    if (quote.quantity && quote.product_price && quote.delivery_price) {
      const total = (parseFloat(quote.product_price) * parseFloat(quote.quantity)) + parseFloat(quote.delivery_price);
      return '₹' + total.toFixed(2);
    }
    return '-';
  }
}
