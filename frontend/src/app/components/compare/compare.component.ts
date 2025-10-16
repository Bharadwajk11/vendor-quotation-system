import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Compare Vendors</h1>
        <p class="page-subtitle">Find the best vendor for your procurement needs</p>
      </div>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Quotation Request</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Product</mat-label>
              <mat-select [(ngModel)]="selectedProductId" (selectionChange)="onProductChange()">
                <mat-option *ngFor="let product of products" [value]="product.id">
                  {{ product.name }} ({{ product.grade_spec }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Order Quantity</mat-label>
              <input matInput type="number" [(ngModel)]="orderQty" placeholder="Enter quantity">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Delivery Location (State)</mat-label>
              <input matInput [(ngModel)]="deliveryLocation" placeholder="e.g., Andhra Pradesh">
              <mat-hint>Enter your delivery state. Local vendors (same state) have lower shipping costs.</mat-hint>
            </mat-form-field>
          </div>

          <button mat-raised-button color="primary" class="compare-btn" 
                  (click)="compareVendors()" 
                  [disabled]="!selectedProductId || !orderQty || !deliveryLocation">
            <mat-icon>compare_arrows</mat-icon>
            Compare Vendors
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card class="results-card" *ngIf="comparisonResults">
        <mat-card-header>
          <mat-card-title>Comparison Results for {{ comparisonResults.product_name }}</mat-card-title>
          <mat-card-subtitle>
            Order Quantity: {{ comparisonResults.order_qty }} | Delivery Location: {{ comparisonResults.delivery_location }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="comparisonResults.comparisons" class="mat-elevation-z0">
            <ng-container matColumnDef="vendor_name">
              <th mat-header-cell *matHeaderCellDef>Vendor Name</th>
              <td mat-cell *matCellDef="let result">
                <strong>{{ result.vendor_name }}</strong>
                <mat-chip-set *ngIf="result.rank === 1">
                  <mat-chip class="rank-badge">🏆 Best</mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <ng-container matColumnDef="place">
              <th mat-header-cell *matHeaderCellDef>Place</th>
              <td mat-cell *matCellDef="let result">
                {{ result.vendor_city }}, {{ result.vendor_state }}
                <span *ngIf="result.is_interstate" class="interstate-tag">
                  <br><small>Interstate</small>
                </span>
                <span *ngIf="!result.is_interstate" class="local-tag">
                  <br><small>Local</small>
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="product_price">
              <th mat-header-cell *matHeaderCellDef>Product Price (₹/kg)</th>
              <td mat-cell *matCellDef="let result">₹{{ result.product_price }}</td>
            </ng-container>

            <ng-container matColumnDef="delivery_charges">
              <th mat-header-cell *matHeaderCellDef>Delivery Charges (₹)</th>
              <td mat-cell *matCellDef="let result">
                ₹{{ result.delivery_price }}
                <span *ngIf="result.is_interstate">
                  <br><small class="surcharge-note">Includes 20% surcharge</small>
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="landing_price">
              <th mat-header-cell *matHeaderCellDef>Landing Price (₹/kg)</th>
              <td mat-cell *matCellDef="let result">
                <strong class="landing-price">₹{{ result.total_cost_per_unit }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="kilo_price">
              <th mat-header-cell *matHeaderCellDef>Kilo Price (₹/kg)</th>
              <td mat-cell *matCellDef="let result">₹{{ result.kilo_price }}</td>
            </ng-container>

            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Grade</th>
              <td mat-cell *matCellDef="let result">{{ result.grade_spec }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [class.success-row]="row.rank === 1"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card class="error-card" *ngIf="errorMessage">
        <mat-card-content>
          <mat-icon color="warn">error</mat-icon>
          {{ errorMessage }}
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-card {
      margin-bottom: 24px;
      padding: 20px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .full-width {
      width: 100%;
    }

    .compare-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }

    .results-card {
      padding: 20px;
    }

    .rank-badge {
      background-color: #4caf50 !important;
      color: white !important;
      font-weight: bold;
    }

    .lead-time-fast {
      background-color: #4caf50 !important;
      color: white !important;
    }

    .lead-time-medium {
      background-color: #ff9800 !important;
      color: white !important;
    }

    .lead-time-slow {
      background-color: #f44336 !important;
      color: white !important;
    }

    .error-card {
      background-color: #ffebee;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .error-card mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .interstate-tag {
      color: #f44336;
      font-weight: 500;
    }

    .local-tag {
      color: #4caf50;
      font-weight: 500;
    }

    .landing-price {
      color: #3f51b5;
      font-size: 16px;
    }

    .surcharge-note {
      color: #666;
      font-style: italic;
    }

    .success-row {
      background-color: #e8f5e9 !important;
    }

    .mat-mdc-header-row {
      display: table-row !important;
      height: auto !important;
      min-height: 56px !important;
      background: #3f51b5 !important;
    }

    .mat-mdc-header-cell {
      background: #3f51b5 !important;
      color: white !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      padding: 16px 12px !important;
      text-align: left !important;
      border-bottom: 2px solid #303f9f !important;
      display: table-cell !important;
      vertical-align: middle !important;
    }

    th {
      background: #3f51b5 !important;
      color: white !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      padding: 16px 12px !important;
      text-align: left !important;
      border-bottom: 2px solid #303f9f !important;
    }

    td {
      padding: 12px !important;
    }

    .mat-mdc-row {
      display: table-row !important;
    }

    .mat-mdc-cell {
      display: table-cell !important;
      padding: 12px !important;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      display: table !important;
    }

    .best-vendor {
      background: #c8e6c9;
      font-weight: bold;
    }

    .error {
      color: red;
      padding: 10px;
      background: #ffebee;
      border-radius: 4px;
      margin-top: 10px;
    }
  `]
})
export class CompareComponent implements OnInit {
  products: any[] = [];
  selectedProductId: string = '';
  orderQty: number = 100;
  deliveryLocation: string = '';
  comparisonResults: any = null;
  errorMessage: string = '';
  displayedColumns: string[] = ['vendor_name', 'place', 'product_price', 'delivery_charges', 'landing_price', 'kilo_price', 'grade'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getProducts().subscribe({
      next: (data) => this.products = data.results || data,
      error: (err: any) => console.error('Error loading products:', err)
    });
  }

  onProductChange() {
    this.comparisonResults = null;
    this.errorMessage = '';
  }

  getLeadTimeClass(days: number): string {
    if (days <= 4) return 'lead-time-fast';
    if (days <= 6) return 'lead-time-medium';
    return 'lead-time-slow';
  }

  compareVendors() {
    if (!this.selectedProductId || !this.orderQty || !this.deliveryLocation) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    const requestData = {
      product_id: parseInt(this.selectedProductId),
      order_qty: this.orderQty,
      delivery_location: this.deliveryLocation,
      company_id: 1
    };

    this.apiService.compareVendors(requestData).subscribe({
      next: (data) => {
        this.comparisonResults = data;
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.errorMessage = 'Error comparing vendors: ' + (err.error?.error || err.message);
        console.error('Error:', err);
      }
    });
  }
}
