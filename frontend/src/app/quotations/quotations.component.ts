import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    FormsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Quotations</h1>
        <p class="page-subtitle">Manage vendor quotations and pricing</p>
      </div>

      <div class="action-buttons">
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Add Quotation
        </button>
      </div>

      <mat-card class="filters-card">
        <div class="filters-container">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filter by Vendor</mat-label>
            <mat-select [(ngModel)]="selectedVendor" (selectionChange)="applyFilters()">
              <mat-option [value]="null">All Vendors</mat-option>
              <mat-option *ngFor="let vendor of vendors" [value]="vendor.id">
                {{ vendor.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filter by Product</mat-label>
            <mat-select [(ngModel)]="selectedProduct" (selectionChange)="applyFilters()">
              <mat-option [value]="null">All Products</mat-option>
              <mat-option *ngFor="let product of products" [value]="product.id">
                {{ product.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filter by Product Group</mat-label>
            <mat-select [(ngModel)]="selectedProductGroup" (selectionChange)="applyFilters()">
              <mat-option [value]="null">All Product Groups</mat-option>
              <mat-option *ngFor="let group of productGroups" [value]="group.id">
                {{ group.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button color="primary" (click)="clearFilters()" class="clear-filters-btn">
            <mat-icon>clear</mat-icon>
            Clear Filters
          </button>
        </div>
      </mat-card>

      <mat-card>
        <table mat-table [dataSource]="quotations" class="mat-elevation-z0">
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
      </mat-card>
    </div>
  `,
  styles: [`
    .filters-card {
      margin-bottom: 24px;
      padding: 16px;
    }

    .filters-container {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-field {
      min-width: 200px;
      flex: 1;
    }

    .clear-filters-btn {
      margin-top: 8px;
    }
  `]
})
export class QuotationsComponent implements OnInit {
  quotations: any[] = [];
  allQuotations: any[] = [];
  displayedColumns: string[] = ['id', 'vendor', 'product', 'product_price', 'quantity', 'delivery_price', 'total_landing_price', 'landing_price', 'lead_time', 'grade_spec', 'actions'];

  vendors: any[] = [];
  products: any[] = [];
  productGroups: any[] = [];

  selectedVendor: number | null = null;
  selectedProduct: number | null = null;
  selectedProductGroup: number | null = null;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAllData();
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
    if (this.selectedVendor === null && this.selectedProduct === null && this.selectedProductGroup === null) {
      this.quotations = [...this.allQuotations];
      return;
    }

    this.quotations = this.allQuotations.filter(quote => {
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

  clearFilters() {
    this.selectedVendor = null;
    this.selectedProduct = null;
    this.selectedProductGroup = null;
    this.quotations = [...this.allQuotations];
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
