
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../services/api.service';
import { VendorFormComponent } from '../vendors/vendor-form.component';
import { ProductFormComponent } from '../products/product-form.component';

@Component({
  selector: 'app-quotation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ data?.id ? 'Edit' : 'Add' }} Quotation</h2>
    
    <mat-dialog-content class="dialog-content">
      <form [formGroup]="quotationForm" class="quotation-form">
        
        <!-- Vendor Selection -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Vendor</mat-label>
            <mat-select formControlName="vendor" required>
              <mat-option *ngFor="let vendor of vendors" [value]="vendor.id">
                {{ vendor.name }} - {{ vendor.city }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <div class="action-buttons">
            <button mat-icon-button color="primary" type="button" (click)="addVendor()" matTooltip="Add Vendor" class="icon-btn">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-icon-button color="accent" type="button" (click)="editVendor()" 
                    [disabled]="!quotationForm.get('vendor')?.value" matTooltip="Edit Vendor" class="icon-btn">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" type="button" (click)="deleteVendor()" 
                    [disabled]="!quotationForm.get('vendor')?.value" matTooltip="Delete Vendor" class="icon-btn">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <!-- Product Selection -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Product</mat-label>
            <mat-select formControlName="product" required>
              <mat-option *ngFor="let product of products" [value]="product.id">
                {{ product.name }} ({{ product.grade_spec }})
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <div class="action-buttons">
            <button mat-icon-button color="primary" type="button" (click)="addProduct()" matTooltip="Add Product" class="icon-btn">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-icon-button color="accent" type="button" (click)="editProduct()" 
                    [disabled]="!quotationForm.get('product')?.value" matTooltip="Edit Product" class="icon-btn">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" type="button" (click)="deleteProduct()" 
                    [disabled]="!quotationForm.get('product')?.value" matTooltip="Delete Product" class="icon-btn">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <!-- Pricing Fields -->
        <div class="form-grid">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Product Price (₹/kg)</mat-label>
            <input matInput formControlName="product_price" type="number" step="0.01" required (input)="calculateLandingPrice()">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Quantity (kg)</mat-label>
            <input matInput formControlName="quantity" type="number" step="1" required (input)="calculateLandingPrice()">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Delivery Charges (₹)</mat-label>
            <input matInput formControlName="delivery_price" type="number" step="0.01" required (input)="calculateLandingPrice()">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Lead Time (days)</mat-label>
            <input matInput formControlName="lead_time_days" type="number" required>
          </mat-form-field>
        </div>

        <!-- Calculated Values -->
        <div class="calculated-section">
          <div class="calculated-item">
            <span class="calc-label">Total Landing Price</span>
            <span class="calc-value">₹{{ quotationForm.get('total_landing_price')?.value || '0.00' }}</span>
          </div>
          <div class="calculated-item">
            <span class="calc-label">Landing Price per kg</span>
            <span class="calc-value">₹{{ quotationForm.get('landing_price')?.value || '0.00' }}/kg</span>
          </div>
        </div>

        <!-- Additional Information -->
        <mat-form-field appearance="outline" class="form-field full-width">
          <mat-label>Grade/Specification</mat-label>
          <input matInput formControlName="grade_spec">
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="dialogRef.close()" class="action-btn cancel-btn">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!quotationForm.valid" class="action-btn submit-btn">
        {{ data?.id ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
      padding: 16px 20px;
    }

    .dialog-content {
      padding: 0 20px 16px;
      min-width: 500px;
    }

    .quotation-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .form-field {
      flex: 1;
      font-size: 14px;
    }

    .form-field ::ng-deep .mat-mdc-form-field-infix {
      min-height: 48px;
      padding-top: 12px;
      padding-bottom: 12px;
    }

    .form-field ::ng-deep input,
    .form-field ::ng-deep .mat-mdc-select {
      font-size: 14px;
    }

    .form-field ::ng-deep .mat-mdc-floating-label {
      font-size: 13px;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
      align-items: center;
      padding-top: 4px;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      line-height: 36px;
    }

    .icon-btn ::ng-deep .mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .full-width {
      width: 100%;
    }

    .calculated-section {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 8px;
      padding: 12px 16px;
      margin: 8px 0;
    }

    .calculated-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
    }

    .calculated-item + .calculated-item {
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      margin-top: 6px;
      padding-top: 10px;
    }

    .calc-label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 500;
    }

    .calc-value {
      font-size: 16px;
      font-weight: 600;
      color: #1976d2;
    }

    .dialog-actions {
      padding: 12px 20px;
      gap: 8px;
      justify-content: flex-end;
    }

    .action-btn {
      min-width: 90px;
      height: 40px;
      font-size: 14px;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 600px) {
      .dialog-title {
        font-size: 16px;
        padding: 12px 16px;
      }

      .dialog-content {
        min-width: unset;
        padding: 0 12px 12px;
      }

      .quotation-form {
        gap: 10px;
      }

      .form-row {
        flex-direction: column;
        gap: 6px;
      }

      .form-field {
        width: 100%;
        font-size: 13px;
      }

      .form-field ::ng-deep .mat-mdc-form-field-infix {
        min-height: 42px;
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .form-field ::ng-deep input,
      .form-field ::ng-deep .mat-mdc-select {
        font-size: 13px;
      }

      .form-field ::ng-deep .mat-mdc-floating-label {
        font-size: 12px;
      }

      .action-buttons {
        flex-direction: row;
        justify-content: flex-start;
        gap: 6px;
        padding-top: 0;
        width: 100%;
      }

      .icon-btn {
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      .icon-btn ::ng-deep .mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .calculated-section {
        padding: 10px 12px;
        margin: 6px 0;
      }

      .calculated-item {
        padding: 4px 0;
      }

      .calc-label {
        font-size: 11px;
      }

      .calc-value {
        font-size: 14px;
      }

      .dialog-actions {
        flex-direction: column-reverse;
        padding: 10px 12px;
        gap: 8px;
      }

      .action-btn {
        width: 100%;
        min-width: unset;
        height: 44px;
        font-size: 13px;
      }
    }

    @media (max-width: 400px) {
      .icon-btn {
        width: 28px;
        height: 28px;
        line-height: 28px;
      }

      .icon-btn ::ng-deep .mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        line-height: 14px;
      }

      .calc-value {
        font-size: 13px;
      }
    }
  `]
})
export class QuotationFormComponent implements OnInit {
  quotationForm: FormGroup;
  vendors: any[] = [];
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<QuotationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {
    this.quotationForm = this.fb.group({
      vendor: ['', Validators.required],
      product: ['', Validators.required],
      product_price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      delivery_price: ['', [Validators.required, Validators.min(0)]],
      total_landing_price: [{ value: '', disabled: true }],
      landing_price: [{ value: '', disabled: true }],
      lead_time_days: ['', [Validators.required, Validators.min(1)]],
      grade_spec: ['']
    });
  }

  calculateLandingPrice() {
    const productPrice = this.quotationForm.get('product_price')?.value;
    const quantity = this.quotationForm.get('quantity')?.value;
    const deliveryCharges = this.quotationForm.get('delivery_price')?.value;
    
    const price = parseFloat(productPrice);
    const qty = parseFloat(quantity);
    const delivery = parseFloat(deliveryCharges);
    
    if (Number.isFinite(price) && Number.isFinite(qty) && qty > 0 && Number.isFinite(delivery) && delivery >= 0) {
      const totalLandingPrice = (price * qty) + delivery;
      const landingPricePerKg = totalLandingPrice / qty;
      
      this.quotationForm.patchValue({
        total_landing_price: totalLandingPrice.toFixed(2),
        landing_price: landingPricePerKg.toFixed(2)
      });
    } else {
      this.quotationForm.patchValue({
        total_landing_price: '',
        landing_price: ''
      });
    }
  }

  ngOnInit() {
    this.loadVendors();
    this.loadProducts();
    
    if (this.data?.id) {
      this.quotationForm.patchValue(this.data);
      this.calculateLandingPrice();
    }
  }

  loadVendors() {
    this.apiService.getVendors().subscribe({
      next: (data) => this.vendors = data.results || data,
      error: (err: any) => console.error('Error loading vendors:', err)
    });
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (data) => this.products = data.results || data,
      error: (err: any) => console.error('Error loading products:', err)
    });
  }

  addVendor() {
    const dialogRef = this.dialog.open(VendorFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVendors();
        this.quotationForm.patchValue({ vendor: result.id });
      }
    });
  }

  editVendor() {
    const vendorId = this.quotationForm.get('vendor')?.value;
    if (!vendorId) return;

    const vendor = this.vendors.find(v => v.id === vendorId);
    const dialogRef = this.dialog.open(VendorFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: vendor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVendors();
      }
    });
  }

  deleteVendor() {
    const vendorId = this.quotationForm.get('vendor')?.value;
    if (!vendorId) return;

    if (confirm('Are you sure you want to delete this vendor?')) {
      this.apiService.deleteVendor(vendorId).subscribe({
        next: () => {
          this.loadVendors();
          this.quotationForm.patchValue({ vendor: '' });
        },
        error: (err: any) => console.error('Error deleting vendor:', err)
      });
    }
  }

  addProduct() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.quotationForm.patchValue({ product: result.id });
      }
    });
  }

  editProduct() {
    const productId = this.quotationForm.get('product')?.value;
    if (!productId) return;

    const product = this.products.find(p => p.id === productId);
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct() {
    const productId = this.quotationForm.get('product')?.value;
    if (!productId) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
          this.quotationForm.patchValue({ product: '' });
        },
        error: (err: any) => console.error('Error deleting product:', err)
      });
    }
  }

  onSubmit() {
    if (this.quotationForm.valid) {
      const formValue = this.quotationForm.getRawValue();
      this.dialogRef.close(formValue);
    }
  }
}
