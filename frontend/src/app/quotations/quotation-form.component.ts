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
            <div class="input-with-actions">
              <mat-form-field appearance="outline" class="flex-input">
                <mat-select formControlName="vendor" required placeholder="Choose vendor">
                  <mat-option *ngFor="let vendor of vendors" [value]="vendor.id">
                    {{ vendor.name }} - {{ vendor.city }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <div class="action-buttons">
                <button mat-raised-button color="primary" type="button" 
                        (click)="addVendor()" 
                        matTooltip="Add Vendor"
                        class="action-btn">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-raised-button color="accent" type="button" 
                        (click)="editVendor()" 
                        [disabled]="!quotationForm.get('vendor')?.value"
                        matTooltip="Edit Vendor"
                        class="action-btn">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-raised-button color="warn" type="button" 
                        (click)="deleteVendor()" 
                        [disabled]="!quotationForm.get('vendor')?.value"
                        matTooltip="Delete Vendor"
                        class="action-btn">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Product Selection Section -->
          <div class="form-section">
            <label class="section-label">Select Product</label>
            <div class="input-with-actions">
              <mat-form-field appearance="outline" class="flex-input">
                <mat-select formControlName="product" required placeholder="Choose product">
                  <mat-option *ngFor="let product of products" [value]="product.id">
                    {{ product.name }} ({{ product.grade_spec }})
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <div class="action-buttons">
                <button mat-raised-button color="primary" type="button" 
                        (click)="addProduct()" 
                        matTooltip="Add Product"
                        class="action-btn">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-raised-button color="accent" type="button" 
                        (click)="editProduct()" 
                        [disabled]="!quotationForm.get('product')?.value"
                        matTooltip="Edit Product"
                        class="action-btn">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-raised-button color="warn" type="button" 
                        (click)="deleteProduct()" 
                        [disabled]="!quotationForm.get('product')?.value"
                        matTooltip="Delete Product"
                        class="action-btn">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Pricing Section -->
          <div class="form-section">
            <label class="section-label">Pricing Details</label>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Product Price (₹/kg)</mat-label>
              <input matInput formControlName="product_price" type="number" step="0.01" required (input)="calculateLandingPrice()" placeholder="Enter price per kg">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Quantity (kg)</mat-label>
              <input matInput formControlName="quantity" type="number" step="1" required (input)="calculateLandingPrice()" placeholder="Enter quantity">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Delivery Charges (₹)</mat-label>
              <input matInput formControlName="delivery_price" type="number" step="0.01" required (input)="calculateLandingPrice()" placeholder="Enter delivery cost">
            </mat-form-field>
          </div>

          <div class="divider"></div>

          <!-- Calculated Results Section -->
          <div class="form-section calculated-section">
            <label class="section-label">Calculated Costs</label>
            
            <div class="calculated-field">
              <label class="calc-label">Total Landing Price</label>
              <div class="calc-value">₹{{ quotationForm.get('total_landing_price')?.value || '0.00' }}</div>
              <div class="calc-formula">Product Price × Quantity + Delivery</div>
            </div>

            <div class="calculated-field">
              <label class="calc-label">Landing Price per kg</label>
              <div class="calc-value">₹{{ quotationForm.get('landing_price')?.value || '0.00' }}/kg</div>
              <div class="calc-formula">Total Landing Price ÷ Quantity</div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Additional Details Section -->
          <div class="form-section">
            <label class="section-label">Additional Information</label>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Lead Time (days)</mat-label>
              <input matInput formControlName="lead_time_days" type="number" required placeholder="Number of days">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Grade/Specification</mat-label>
              <input matInput formControlName="grade_spec" placeholder="Enter grade or spec (optional)">
            </mat-form-field>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="!quotationForm.valid" class="submit-btn">
            {{ data?.id ? 'Update Quotation' : 'Create Quotation' }}
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
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .form-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .form-section {
      margin-bottom: 24px;
    }

    .section-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .input-with-actions {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .flex-input {
      flex: 1;
      margin-bottom: 0;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      padding-top: 4px;
    }

    .action-buttons button {
      width: 40px;
      height: 40px;
      min-height: 40px;
      min-width: 40px;
    }

    .action-buttons mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin: 0;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 !important;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 24px 0;
    }

    .calculated-section {
      background: #f0f9ff;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #bfdbfe;
    }

    .calculated-field {
      background: #ffffff;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 12px;
      border: 1px solid #e0e7ff;
    }

    .calculated-field:last-child {
      margin-bottom: 0;
    }

    .calc-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
      display: block;
      margin-bottom: 4px;
    }

    .calc-value {
      font-size: 20px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 4px;
    }

    .calc-formula {
      font-size: 11px;
      color: #9ca3af;
      font-style: italic;
    }

    .form-actions {
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      display: flex;
      gap: 12px;
    }

    .submit-btn {
      flex: 1;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
    }

    .cancel-btn {
      flex: 1;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
    }

    mat-form-field {
      font-size: 15px;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background: #ffffff;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 600px) {
      .form-title {
        font-size: 20px;
        padding: 16px;
      }

      .form-content {
        padding: 16px;
      }

      .form-section {
        margin-bottom: 24px;
      }

      .section-label {
        font-size: 11px;
        margin-bottom: 12px;
      }

      .input-with-actions {
        flex-direction: column;
        gap: 10px;
      }

      .flex-input {
        width: 100%;
      }

      .action-buttons {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding-top: 0;
      }

      .action-buttons button {
        width: 100%;
        height: 44px;
        min-height: 44px;
        border-radius: 8px;
      }

      .action-buttons button mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .full-width {
        margin-bottom: 14px;
      }

      .divider {
        margin: 20px 0;
      }

      .calculated-section {
        padding: 14px;
      }

      .calculated-field {
        padding: 12px 14px;
      }

      .calc-value {
        font-size: 18px;
      }

      .form-actions {
        flex-direction: column-reverse;
        padding: 16px;
        gap: 10px;
      }

      .submit-btn,
      .cancel-btn {
        width: 100%;
        height: 50px;
        font-size: 16px;
      }

      mat-form-field {
        font-size: 16px;
      }

      input {
        font-size: 16px !important;
      }
    }

    /* Tablet Portrait */
    @media (min-width: 601px) and (max-width: 900px) {
      .form-title {
        font-size: 22px;
        padding: 18px 20px;
      }

      .form-content {
        padding: 20px;
      }

      .action-buttons button {
        width: 44px;
        height: 44px;
        min-height: 44px;
      }

      .action-buttons mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
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
