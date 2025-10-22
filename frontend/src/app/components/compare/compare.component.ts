import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
    MatChipsModule,
    MatDividerModule,
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
              <input matInput type="number" [(ngModel)]="orderQty" placeholder="Enter quantity" />
            </mat-form-field>

            <div class="info-box" *ngIf="company">
              <mat-icon>location_on</mat-icon>
              <span><strong>Delivery Location:</strong> {{ company.state || 'Not set - Please update company profile' }}</span>
            </div>
          </div>

          <button
            mat-raised-button
            color="primary"
            class="compare-btn"
            (click)="compareVendors()"
            [disabled]="!selectedProductId || !orderQty || !deliveryLocation"
          >
            <mat-icon>compare_arrows</mat-icon>
            Compare Vendors
          </button>
        </mat-card-content>
      </mat-card>

      <!-- Mobile Card View -->
      <div class="mobile-cards" *ngIf="comparisonResults && isMobile">
        <div class="results-header">
          <h2>{{ comparisonResults.product_name }}</h2>
          <div class="results-meta">
            <span><mat-icon class="meta-icon">shopping_cart</mat-icon> {{ comparisonResults.order_qty }} kg</span>
            <span><mat-icon class="meta-icon">location_on</mat-icon> {{ comparisonResults.delivery_location }}</span>
          </div>
        </div>

        <div class="vendor-cards">
          <mat-card
            *ngFor="let result of comparisonResults.comparisons; let i = index"
            class="vendor-card"
            [class.winner-card]="result.rank === 1"
          >
            <div class="card-header">
              <div class="rank-badge" [class.rank-1]="result.rank === 1" [class.rank-2]="result.rank === 2" [class.rank-3]="result.rank === 3">
                <span class="rank-icon" *ngIf="result.rank === 1">🏆</span>
                <span class="rank-icon" *ngIf="result.rank === 2">🥈</span>
                <span class="rank-icon" *ngIf="result.rank === 3">🥉</span>
                <span class="rank-text">#{{ result.rank }}</span>
              </div>
              <div class="vendor-info">
                <h3>{{ result.vendor_name }}</h3>
                <p class="vendor-location">
                  <mat-icon>location_city</mat-icon>
                  {{ result.vendor_city }}, {{ result.vendor_state }}
                </p>
                <mat-chip-set>
                  <mat-chip [class.interstate-chip]="result.is_interstate" [class.local-chip]="!result.is_interstate">
                    {{ result.is_interstate ? 'Interstate' : 'Local' }}
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="card-body">
              <div class="pricing-highlight">
                <div class="price-item main-price">
                  <span class="price-label">Total Landing Price</span>
                  <span class="price-value">₹{{ result.total_order_cost }}</span>
                </div>
                <div class="price-item secondary-price">
                  <span class="price-label">Per kg</span>
                  <span class="price-value">₹{{ result.total_cost_per_unit }}/kg</span>
                </div>
              </div>

              <div class="details-grid">
                <div class="detail-item">
                  <mat-icon class="detail-icon">attach_money</mat-icon>
                  <div class="detail-content">
                    <span class="detail-label">Product Price</span>
                    <span class="detail-value">₹{{ result.product_price }}/kg</span>
                  </div>
                </div>

                <div class="detail-item">
                  <mat-icon class="detail-icon">local_shipping</mat-icon>
                  <div class="detail-content">
                    <span class="detail-label">Delivery Charges</span>
                    <span class="detail-value">₹{{ result.adjusted_delivery_price || result.delivery_price }}</span>
                    <span class="surcharge-note" *ngIf="result.is_interstate">+20% interstate</span>
                  </div>
                </div>

                <div class="detail-item">
                  <mat-icon class="detail-icon">schedule</mat-icon>
                  <div class="detail-content">
                    <span class="detail-label">Lead Time</span>
                    <mat-chip [class]="getLeadTimeClass(result.lead_time_days)">
                      {{ result.lead_time_days }} days
                    </mat-chip>
                  </div>
                </div>

                <div class="detail-item">
                  <mat-icon class="detail-icon">grade</mat-icon>
                  <div class="detail-content">
                    <span class="detail-label">Grade</span>
                    <span class="detail-value">{{ result.grade_spec }}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- Desktop Table View -->
      <mat-card class="results-card" *ngIf="comparisonResults && !isMobile">
        <mat-card-header>
          <mat-card-title>Comparison Results for {{ comparisonResults.product_name }}</mat-card-title>
          <mat-card-subtitle>
            Order Quantity: {{ comparisonResults.order_qty }} | Delivery Location: {{ comparisonResults.delivery_location }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="comparisonResults.comparisons" class="mat-elevation-z0">
              <ng-container matColumnDef="rank">
                <th mat-header-cell *matHeaderCellDef>Rank</th>
                <td mat-cell *matCellDef="let result">
                  <strong class="rank-number">{{ result.rank }}</strong>
                  <mat-chip-set *ngIf="result.rank === 1">
                    <mat-chip class="rank-badge">🏆</mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <ng-container matColumnDef="vendor_name">
                <th mat-header-cell *matHeaderCellDef>Vendor Name</th>
                <td mat-cell *matCellDef="let result">
                  <strong>{{ result.vendor_name }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="place">
                <th mat-header-cell *matHeaderCellDef>Place</th>
                <td mat-cell *matCellDef="let result">
                  {{ result.vendor_city }}, {{ result.vendor_state }}
                  <span *ngIf="result.is_interstate" class="interstate-tag">
                    <br /><small>Interstate</small>
                  </span>
                  <span *ngIf="!result.is_interstate" class="local-tag">
                    <br /><small>Local</small>
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="product_price">
                <th mat-header-cell *matHeaderCellDef>Product Price (₹/kg)</th>
                <td mat-cell *matCellDef="let result">₹{{ result.product_price }}</td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef>Quantity (kg)</th>
                <td mat-cell *matCellDef="let result">{{ comparisonResults.order_qty }} kg</td>
              </ng-container>

              <ng-container matColumnDef="delivery_charges">
                <th mat-header-cell *matHeaderCellDef>Delivery Charges (₹)</th>
                <td mat-cell *matCellDef="let result">
                  ₹{{ result.adjusted_delivery_price || result.delivery_price }}
                  <span *ngIf="result.is_interstate">
                    <br /><small class="surcharge-note">Includes 20% surcharge</small>
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="landing_price">
                <th mat-header-cell *matHeaderCellDef>Landing Price (₹/kg)</th>
                <td mat-cell *matCellDef="let result">
                  <strong class="landing-price">₹{{ result.total_cost_per_unit }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="total_landing_price">
                <th mat-header-cell *matHeaderCellDef>Total Landing Price (₹)</th>
                <td mat-cell *matCellDef="let result">
                  <strong class="total-landing-price">₹{{ result.total_order_cost }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="grade">
                <th mat-header-cell *matHeaderCellDef>Grade</th>
                <td mat-cell *matCellDef="let result">{{ result.grade_spec }}</td>
              </ng-container>

              <ng-container matColumnDef="lead_time">
                <th mat-header-cell *matHeaderCellDef>Lead Time</th>
                <td mat-cell *matCellDef="let result">
                  <mat-chip-set>
                    <mat-chip [class]="getLeadTimeClass(result.lead_time_days)">
                      {{ result.lead_time_days }} days
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr
                mat-row
                *matRowDef="let row; columns: displayedColumns"
                [class.success-row]="row.rank === 1"
              ></tr>
            </table>
          </div>
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
  styles: [
    `
      .page-container {
        padding: 16px;
        max-width: 1400px;
        margin: 0 auto;
      }

      @media (max-width: 768px) {
        .page-container {
          padding: 12px;
        }
      }

      .page-header {
        margin-bottom: 24px;
      }

      .page-title {
        font-size: 28px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #1a237e;
      }

      .page-subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
      }

      @media (max-width: 768px) {
        .page-title {
          font-size: 22px;
        }
        .page-subtitle {
          font-size: 13px;
        }
      }

      .form-card {
        margin-bottom: 24px;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: 768px) {
        .form-card {
          padding: 16px;
          border-radius: 16px;
        }
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }

      .full-width {
        width: 100%;
      }

      .info-box {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        border-left: 4px solid #2196f3;
        border-radius: 8px;
        font-size: 14px;
        color: #1565c0;
      }

      @media (max-width: 768px) {
        .info-box {
          padding: 14px;
          font-size: 13px;
        }
      }

      .info-box mat-icon {
        color: #2196f3;
      }

      .compare-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        padding: 12px 24px;
        height: auto;
      }

      @media (max-width: 768px) {
        .compare-btn {
          width: 100%;
          justify-content: center;
          font-size: 15px;
          padding: 14px 24px;
        }
      }

      /* Smooth Transitions */
      .mobile-cards,
      .results-card {
        opacity: 0;
        animation: fadeIn 0.3s ease-in-out forwards;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Mobile Cards */
      .mobile-cards {
        margin-top: 24px;
      }

      .results-header {
        background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
        color: white;
        padding: 20px;
        border-radius: 16px 16px 0 0;
        margin-bottom: 16px;
      }

      .results-header h2 {
        margin: 0 0 12px 0;
        font-size: 20px;
        font-weight: 600;
      }

      .results-meta {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        font-size: 14px;
        opacity: 0.95;
      }

      .results-meta span {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .meta-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .vendor-cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .vendor-card {
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .vendor-card:active {
        transform: scale(0.98);
      }

      .winner-card {
        border: 3px solid #4caf50;
        box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
      }

      .card-header {
        padding: 16px;
        background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%);
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .rank-badge {
        min-width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .rank-badge.rank-1 {
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        color: #f57f17;
      }

      .rank-badge.rank-2 {
        background: linear-gradient(135deg, #c0c0c0 0%, #e0e0e0 100%);
        color: #424242;
      }

      .rank-badge.rank-3 {
        background: linear-gradient(135deg, #cd7f32 0%, #d4a574 100%);
        color: #4e342e;
      }

      .rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
        background: linear-gradient(135deg, #90caf9 0%, #64b5f6 100%);
        color: #0d47a1;
      }

      .rank-icon {
        font-size: 24px;
        line-height: 1;
      }

      .rank-text {
        font-size: 16px;
        margin-top: 4px;
      }

      .vendor-info {
        flex: 1;
      }

      .vendor-info h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #1a237e;
      }

      .vendor-location {
        margin: 0 0 8px 0;
        font-size: 13px;
        color: #666;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .vendor-location mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .interstate-chip {
        background-color: #ffebee !important;
        color: #c62828 !important;
        font-weight: 500;
      }

      .local-chip {
        background-color: #e8f5e9 !important;
        color: #2e7d32 !important;
        font-weight: 500;
      }

      .card-body {
        padding: 16px;
      }

      .pricing-highlight {
        background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 16px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      @media (max-width: 480px) {
        .pricing-highlight {
          grid-template-columns: 1fr;
        }
      }

      .price-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .price-label {
        font-size: 12px;
        color: #2e7d32;
        font-weight: 500;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .price-value {
        font-size: 20px;
        font-weight: 700;
        color: #1b5e20;
      }

      .main-price .price-value {
        font-size: 24px;
      }

      .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      @media (max-width: 480px) {
        .details-grid {
          grid-template-columns: 1fr;
        }
      }

      .detail-item {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 12px;
        background: #f5f7fa;
        border-radius: 10px;
      }

      .detail-icon {
        color: #3f51b5;
        font-size: 22px;
        width: 22px;
        height: 22px;
        margin-top: 2px;
      }

      .detail-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }

      .detail-label {
        font-size: 11px;
        color: #666;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .detail-value {
        font-size: 15px;
        font-weight: 600;
        color: #1a237e;
      }

      .surcharge-note {
        color: #d32f2f;
        font-size: 11px;
        font-style: italic;
      }

      /* Desktop Table View */
      .results-card {
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .table-container {
        overflow-x: auto;
        border-radius: 8px;
      }

      .rank-number {
        font-size: 20px;
        color: #3f51b5;
        font-weight: bold;
      }

      .rank-badge {
        background-color: #4caf50 !important;
        color: white !important;
        font-weight: bold;
        margin-left: 8px;
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
        border-radius: 8px;
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

      .total-landing-price {
        color: #2e7d32;
        font-size: 16px;
      }

      .landing-price {
        color: #3f51b5;
        font-size: 16px;
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

      /* Landscape Mode Optimizations for Mobile/Tablet Devices */
      @media (max-width: 959px) and (orientation: landscape) {
        .results-card {
          max-height: 85vh;
          overflow-y: auto;
        }

        .mat-mdc-header-cell,
        th {
          font-size: 12px !important;
          padding: 10px 8px !important;
          white-space: nowrap;
        }

        .mat-mdc-cell,
        td {
          font-size: 12px !important;
          padding: 8px 6px !important;
        }

        table {
          font-size: 12px;
        }

        .mat-mdc-chip {
          font-size: 11px !important;
          min-height: 28px !important;
          padding: 4px 8px !important;
        }

        .total-landing-price,
        .landing-price {
          font-size: 13px;
        }

        .results-card mat-card-content {
          padding: 8px !important;
        }
      }

      /* Extra small landscape devices (phones in landscape) */
      @media (max-width: 767px) and (orientation: landscape) {
        .mat-mdc-header-cell,
        th {
          font-size: 11px !important;
          padding: 8px 4px !important;
        }

        .mat-mdc-cell,
        td {
          font-size: 11px !important;
          padding: 6px 4px !important;
        }

        .mat-mdc-chip {
          font-size: 10px !important;
          min-height: 24px !important;
          padding: 3px 6px !important;
        }
      }
    `,
  ],
})
export class CompareComponent implements OnInit, OnDestroy {
  products: any[] = [];
  selectedProductId: string = '';
  orderQty: number = 100;
  deliveryLocation: string = '';
  company: any = null;
  comparisonResults: any = null;
  errorMessage: string = '';
  isMobile: boolean = false;
  displayedColumns: string[] = [
    'rank',
    'vendor_name',
    'place',
    'product_price',
    'quantity',
    'delivery_charges',
    'landing_price',
    'total_landing_price',
    'grade',
    'lead_time',
  ];

  private portraitMediaQuery: MediaQueryList | null = null;
  private orientationChangeHandler: ((e: MediaQueryListEvent) => void) | null = null;

  constructor(
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.setupOrientationDetection();
    this.loadData();
  }

  ngOnDestroy() {
    if (this.portraitMediaQuery && this.orientationChangeHandler) {
      this.portraitMediaQuery.removeEventListener('change', this.orientationChangeHandler);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateViewMode();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    setTimeout(() => this.updateViewMode(), 100);
  }

  private setupOrientationDetection() {
    this.portraitMediaQuery = window.matchMedia('(orientation: portrait)');
    
    this.orientationChangeHandler = (e: MediaQueryListEvent) => {
      this.updateViewMode();
    };

    this.portraitMediaQuery.addEventListener('change', this.orientationChangeHandler);

    this.breakpointObserver
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletPortrait,
        '(max-width: 599px)'
      ])
      .subscribe(result => {
        this.updateViewMode();
      });

    this.updateViewMode();
  }

  private updateViewMode() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 599px)').matches;
    const isMediumScreen = window.matchMedia('(max-width: 959px)').matches;
    
    if (isSmallScreen && isPortrait) {
      this.isMobile = true;
    } else if (isMediumScreen && isPortrait) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  private loadData() {
    this.apiService.getProducts().subscribe({
      next: (data) => (this.products = data.results || data),
      error: (err: any) => console.error('Error loading products:', err),
    });
    
    this.apiService.getCompanies().subscribe({
      next: (data) => {
        const companies = data.results || data;
        if (companies && companies.length > 0) {
          this.company = companies[0];
          this.deliveryLocation = this.company.state || '';
        }
      },
      error: (err: any) => console.error('Error loading company:', err),
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

    if (!this.company || !this.company.id) {
      this.errorMessage = 'Company information not available. Please refresh the page.';
      return;
    }

    const requestData = {
      product_id: parseInt(this.selectedProductId),
      order_qty: this.orderQty,
      delivery_location: this.deliveryLocation,
      company_id: this.company.id,
    };

    this.apiService.compareVendors(requestData).subscribe({
      next: (data) => {
        this.comparisonResults = data;
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.errorMessage = 'Error comparing vendors: ' + (err.error?.error || err.message);
        console.error('Error:', err);
      },
    });
  }
}
