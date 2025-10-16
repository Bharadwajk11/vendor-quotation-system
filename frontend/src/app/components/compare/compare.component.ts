import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="compare-container">
      <h2>Compare Vendors</h2>
      
      <div class="form-section">
        <label>Select Product:</label>
        <select [(ngModel)]="selectedProductId" (change)="onProductChange()">
          <option value="">-- Select Product --</option>
          <option *ngFor="let product of products" [value]="product.id">
            {{ product.name }} ({{ product.grade_spec }})
          </option>
        </select>

        <label>Order Quantity:</label>
        <input type="number" [(ngModel)]="orderQty" placeholder="Enter quantity">

        <label>Delivery Location:</label>
        <input type="text" [(ngModel)]="deliveryLocation" placeholder="e.g., Andhra Pradesh">

        <button (click)="compareVendors()" [disabled]="!selectedProductId || !orderQty || !deliveryLocation">
          Compare Vendors
        </button>
      </div>

      <div class="results-section" *ngIf="comparisonResults">
        <h3>Comparison Results for {{ comparisonResults.product_name }}</h3>
        <p>Order Quantity: {{ comparisonResults.order_qty }} | Location: {{ comparisonResults.delivery_location }}</p>
        
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Vendor</th>
              <th>City</th>
              <th>Product Price</th>
              <th>Delivery Price</th>
              <th>Grade</th>
              <th>Lead Time</th>
              <th>Total Cost/Unit</th>
              <th>Total Order Cost</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let result of comparisonResults.comparisons" [class.best-vendor]="result.rank === 1">
              <td>{{ result.rank }}</td>
              <td>{{ result.vendor_name }}</td>
              <td>{{ result.vendor_city }}</td>
              <td>₹{{ result.product_price }}</td>
              <td>₹{{ result.delivery_price }}</td>
              <td>{{ result.grade_spec }}</td>
              <td>{{ result.lead_time_days }} days</td>
              <td>₹{{ result.total_cost_per_unit }}</td>
              <td>₹{{ result.total_order_cost }}</td>
              <td>{{ result.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="errorMessage" class="error">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .compare-container {
      padding: 20px;
    }

    .form-section {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .form-section label {
      display: block;
      margin-top: 15px;
      font-weight: bold;
    }

    .form-section input, .form-section select {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .form-section button {
      margin-top: 20px;
      padding: 10px 20px;
      background: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .form-section button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background: #3f51b5;
      color: white;
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

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getProducts().subscribe({
      next: (data) => this.products = data.results || data,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  onProductChange() {
    this.comparisonResults = null;
    this.errorMessage = '';
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
      error: (err) => {
        this.errorMessage = 'Error comparing vendors: ' + (err.error?.error || err.message);
        console.error('Error:', err);
      }
    });
  }
}
