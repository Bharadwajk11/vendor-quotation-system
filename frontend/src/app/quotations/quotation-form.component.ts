
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
    <div class="form-container">
      <h1 class="form-title">{{ data?.id ? 'Edit' : 'Add' }} Quotation</h1>
      
      <form [formGroup]="quotationForm" (ngSubmit)="onSubmit()">
        <div class="form-content">
          
          <!-- Vendor Selection Section -->
          <div class="form-section">
            <label class="section-label">Select Vendor</label>
            <div class="input-with-icons">
              <mat-form-field appearance="outline" class="compact-field">
                <mat-select formControlName="vendor" required placeholder="Choose vendor">
                  <mat-option *ngFor="let vendor of vendors" [value]="vendor.id">
                    {{ vendor.name }} - {{ vendor.city }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <div class="inline-icons">
                <button mat-icon-button color="primary" type="button" 
                        (click)="addVendor()" 
                        matTooltip="Add"
                        class="icon-btn">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-icon-button color="accent" type="button" 
                        (click)="editVendor()" 
                        [disabled]="!quotationForm.get('vendor')?.value"
                        matTooltip="Edit"
                        class="icon-btn">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" type="button" 
                        (click)="deleteVendor()" 
                        [disabled]="!quotationForm.get('vendor')?.value"
                        matTooltip="Delete"
                        class="icon-btn">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Product Selection Section -->
          <div class="form-section">
            <label class="section-label">Select Product</label>
            <div class="input-with-icons">
              <mat-form-field appearance="outline" class="compact-field">
                <mat-select formControlName="product" required placeholder="Choose product">
                  <mat-option *ngFor="let product of products" [value]="product.id">
                    {{ product.name }} ({{ product.grade_spec }})
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <div class="inline-icons">
                <button mat-icon-button color="primary" type="button" 
                        (click)="addProduct()" 
                        matTooltip="Add"
                        class="icon-btn">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-icon-button color="accent" type="button" 
                        (click)="editProduct()" 
                        [disabled]="!quotationForm.get('product')?.value"
                        matTooltip="Edit"
                        class="icon-btn">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" type="button" 
                        (click)="deleteProduct()" 
                        [disabled]="!quotationForm.get('product')?.value"
                        matTooltip="Delete"
                        class="icon-btn">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Pricing Section -->
          <div class="form-section">
            <label class="section-label">Pricing Details</label>
            
            <mat-form-field appearance="outline" class="compact-field full-width">
              <mat-label>Product Price (₹/kg)</mat-label>
              <input matInput formControlName="product_price" type="number" step="0.01" required (input)="calculateLandingPrice()">
            </mat-form-field>

            <mat-form-field appearance="outline" class="compact-field full-width">
              <mat-label>Quantity (kg)</mat-label>
              <input matInput formControlName="quantity" type="number" step="1" required (input)="calculateLandingPrice()">
            </mat-form-field>

            <mat-form-field appearance="outline" class="compact-field full-width">
              <mat-label>Delivery Charges (₹)</mat-label>
              <input matInput formControlName="delivery_price" type="number" step="0.01" required (input)="calculateLandingPrice()">
            </mat-form-field>
          </div>

          <div class="divider"></div>

          <!-- Calculated Results Section -->
          <div class="form-section calculated-section">
            <label class="section-label">Calculated Costs</label>
            
            <div class="calc-row">
              <div class="calc-item">
                <span class="calc-label">Total Landing Price</span>
                <span class="calc-value">₹{{ quotationForm.get('total_landing_price')?.value || '0.00' }}</span>
              </div>
              <div class="calc-item">
                <span class="calc-label">Per kg</span>
                <span class="calc-value">₹{{ quotationForm.get('landing_price')?.value || '0.00' }}/kg</span>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Additional Details Section -->
          <div class="form-section">
            <label class="section-label">Additional Information</label>
            
            <mat-form-field appearance="outline" class="compact-field full-width">
              <mat-label>Lead Time (days)</mat-label>
              <input matInput formControlName="lead_time_days" type="number" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="compact-field full-width">
              <mat-label>Grade/Specification</mat-label>
              <input matInput formControlName="grade_spec">
            </mat-form-field>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="!quotationForm.valid" class="submit-btn">
            {{ data?.id ? 'Update' : 'Create' }}
          </button>
          <button mat-stroked-button type="button" (click)="dialogRef.close()" class="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      background: #ffffff;
    }

    .form-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .form-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }

    .form-section {
      margin-bottom: 16px;
    }

    .section-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .input-with-icons {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .compact-field {
      flex: 1;
      margin-bottom: 0;
    }

    .inline-icons {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      line-height: 32px;
      padding: 0;
    }

    .icon-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 16px 0;
    }

    .calculated-section {
      background: #f0f9ff;
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid #bfdbfe;
    }

    .calc-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .calc-item {
      flex: 1;
      background: #ffffff;
      padding: 8px 10px;
      border-radius: 4px;
      border: 1px solid #e0e7ff;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .calc-label {
      font-size: 10px;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .calc-value {
      font-size: 15px;
      font-weight: 700;
      color: #1e40af;
    }

    .form-actions {
      padding: 12px 20px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      display: flex;
      gap: 10px;
    }

    .submit-btn,
    .cancel-btn {
      flex: 1;
      height: 42px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 8px;
    }

    /* Compact Material Form Fields */
    ::ng-deep .compact-field .mat-mdc-text-field-wrapper {
      padding-bottom: 0;
    }

    ::ng-deep .compact-field .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    ::ng-deep .compact-field .mat-mdc-form-field-infix {
      min-height: 36px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    ::ng-deep .compact-field input,
    ::ng-deep .compact-field .mat-mdc-select {
      font-size: 13px;
    }

    ::ng-deep .compact-field .mat-mdc-floating-label {
      font-size: 12px;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 600px) {
      .form-title {
        font-size: 18px;
        padding: 14px 16px;
      }

      .form-content {
        padding: 14px 16px;
      }

      .form-section {
        margin-bottom: 14px;
      }

      .section-label {
        font-size: 10px;
        margin-bottom: 6px;
      }

      .input-with-icons {
        gap: 4px;
      }

      .inline-icons {
        gap: 1px;
      }

      .icon-btn {
        width: 28px;
        height: 28px;
        line-height: 28px;
      }

      .icon-btn mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }

      .full-width {
        margin-bottom: 8px;
      }

      .divider {
        margin: 12px 0;
      }

      .calculated-section {
        padding: 8px 10px;
      }

      .calc-row {
        flex-direction: column;
        gap: 8px;
      }

      .calc-item {
        padding: 6px 8px;
      }

      .calc-label {
        font-size: 9px;
      }

      .calc-value {
        font-size: 14px;
      }

      .form-actions {
        padding: 10px 16px;
        gap: 8px;
      }

      .submit-btn,
      .cancel-btn {
        height: 38px;
        font-size: 13px;
      }

      /* Even more compact form fields on mobile */
      ::ng-deep .compact-field .mat-mdc-form-field-infix {
        min-height: 32px;
        padding-top: 6px;
        padding-bottom: 6px;
      }

      ::ng-deep .compact-field input,
      ::ng-deep .compact-field .mat-mdc-select {
        font-size: 12px;
      }

      ::ng-deep .compact-field .mat-mdc-floating-label {
        font-size: 11px;
      }

      ::ng-deep .compact-field .mat-mdc-select-value {
        font-size: 12px;
      }
    }

    /* Tablet Portrait */
    @media (min-width: 601px) and (max-width: 900px) {
      .form-title {
        font-size: 19px;
        padding: 15px 18px;
      }

      .form-content {
        padding: 15px 18px;
      }

      .icon-btn {
        width: 30px;
        height: 30px;
      }

      .icon-btn mat-icon {
        font-size: 17px;
        width: 17px;
        height: 17px;
      }

      ::ng-deep .compact-field .mat-mdc-form-field-infix {
        min-height: 34px;
        padding-top: 7px;
        padding-bottom: 7px;
      }

      ::ng-deep .compact-field input,
      ::ng-deep .compact-field .mat-mdc-select {
        font-size: 12.5px;
      }
    }

    /* Desktop */
    @media (min-width: 901px) {
      .form-title {
        font-size: 22px;
        padding: 18px 24px;
      }

      .form-content {
        padding: 20px 24px;
      }

      .form-section {
        margin-bottom: 20px;
      }

      .section-label {
        font-size: 12px;
        margin-bottom: 10px;
      }

      .divider {
        margin: 20px 0;
      }

      .form-actions {
        padding: 14px 24px;
      }

      .submit-btn,
      .cancel-btn {
        height: 44px;
        font-size: 15px;
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
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVendors();
      }
    });
  }

  editVendor() {
    const vendorId = this.quotationForm.get('vendor')?.value;
    if (!vendorId) return;
    
    const vendor = this.vendors.find(v => v.id === vendorId);
    const dialogRef = this.dialog.open(VendorFormComponent, {
      width: '600px',
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
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct() {
    const productId = this.quotationForm.get('product')?.value;
    if (!productId) return;
    
    const product = this.products.find(p => p.id === productId);
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
      
      if (this.data?.id) {
        this.apiService.updateQuotation(this.data.id, formValue).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error updating quotation:', err)
        });
      } else {
        this.apiService.createQuotation(formValue).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error creating quotation:', err)
        });
      }
    }
  }
}
