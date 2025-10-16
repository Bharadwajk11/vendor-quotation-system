import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    MatDialogModule
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
  `
})
export class QuotationsComponent implements OnInit {
  quotations: any[] = [];
  displayedColumns: string[] = ['id', 'vendor', 'product', 'product_price', 'quantity', 'delivery_price', 'total_landing_price', 'landing_price', 'lead_time', 'grade_spec', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadQuotations();
  }

  loadQuotations() {
    this.apiService.getQuotations().subscribe({
      next: (data) => this.quotations = data.results || data,
      error: (err: any) => console.error('Error loading quotations:', err)
    });
  }

  openDialog(quotation?: any) {
    const dialogRef = this.dialog.open(QuotationFormComponent, {
      width: '700px',
      data: quotation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadQuotations();
      }
    });
  }

  deleteQuotation(id: number) {
    if (confirm('Are you sure you want to delete this quotation?')) {
      this.apiService.deleteQuotation(id).subscribe({
        next: () => this.loadQuotations(),
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
