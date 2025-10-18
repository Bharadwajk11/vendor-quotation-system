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
    <h2 mat-dialog-title>{{ data?.id ? 'Edit' : 'Add' }} Quotation</h2>
    <form [formGroup]="quotationForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="field-container">
          <mat-form-field appearance="outline" class="field-select">
            <mat-label>Vendor</mat-label>
            <mat-select formControlName="vendor" required>
              <mat-option *ngFor="let vendor of vendors" [value]="vendor.id">
                {{ vendor.name }} - {{ vendor.city }}
              </mat-option>
            </mat-select>
            <mat-hint class="desktop-only-hint">Manage vendors using the buttons →</mat-hint>
          </mat-form-field>
          
          <div class="field-actions">
            <button mat-icon-button type="button" color="primary" 
                    (click)="addVendor()" 
                    matTooltip="Add New Vendor">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-icon-button type="button" color="accent" 
                    (click)="editVendor()" 
                    [disabled]="!quotationForm.get('vendor')?.value"
                    matTooltip="Edit Selected Vendor">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button type="button" color="warn" 
                    (click)="deleteVendor()" 
                    [disabled]="!quotationForm.get('vendor')?.value"
                    matTooltip="Delete Selected Vendor">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <div class="field-container">
          <mat-form-field appearance="outline" class="field-select">
            <mat-label>Product</mat-label>
            <mat-select formControlName="product" required>
              <mat-option *ngFor="let product of products" [value]="product.id">
                {{ product.name }} ({{ product.grade_spec }})
              </mat-option>
            </mat-select>
            <mat-hint class="desktop-only-hint">Manage products using the buttons →</mat-hint>
          </mat-form-field>
          
          <div class="field-actions">
            <button mat-icon-button type="button" color="primary" 
                    (click)="addProduct()" 
                    matTooltip="Add New Product">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-icon-button type="button" color="accent" 
                    (click)="editProduct()" 
                    [disabled]="!quotationForm.get('product')?.value"
                    matTooltip="Edit Selected Product">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button type="button" color="warn" 
                    (click)="deleteProduct()" 
                    [disabled]="!quotationForm.get('product')?.value"
                    matTooltip="Delete Selected Product">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Price (₹/kg)</mat-label>
          <input matInput formControlName="product_price" type="number" step="0.01" required (input)="calculateLandingPrice()">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity (kg)</mat-label>
          <input matInput formControlName="quantity" type="number" step="1" required (input)="calculateLandingPrice()">
          <mat-hint class="desktop-only-hint">Enter quantity for landing price calculation</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Delivery Charges (₹)</mat-label>
          <input matInput formControlName="delivery_price" type="number" step="0.01" required (input)="calculateLandingPrice()">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width calculated-field">
          <mat-label>Total Landing Price (₹)</mat-label>
          <input matInput formControlName="total_landing_price" type="number" step="0.01" readonly>
          <mat-hint class="desktop-only-hint">Total cost: (Product Price × Quantity) + Delivery Charges</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width calculated-field">
          <mat-label>Landing Price (₹/kg)</mat-label>
          <input matInput formControlName="landing_price" type="number" step="0.01" readonly>
          <mat-hint class="desktop-only-hint">Per kg cost: Total Landing Price ÷ Quantity</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Lead Time (days)</mat-label>
          <input matInput formControlName="lead_time_days" type="number" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Grade/Specification</mat-label>
          <input matInput formControlName="grade_spec">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!quotationForm.valid">
          {{ data?.id ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      padding: 20px 24px;
      min-width: 500px;
    }

    mat-dialog-actions {
      padding: 12px 24px;
      gap: 8px;
    }

    .field-container {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 16px;
    }

    .field-select {
      flex: 1;
      margin-bottom: 0;
    }

    .field-actions {
      display: flex;
      gap: 4px;
      padding-top: 8px;
    }

    .field-actions button {
      width: 36px;
      height: 36px;
    }

    .field-actions mat-icon {
      font-size: 20px;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: unset;
        padding: 16px 12px;
        max-height: 70vh;
        overflow-y: auto;
      }

      mat-dialog-actions {
        padding: 12px;
        flex-direction: column-reverse;
        align-items: stretch;
        gap: 10px;
        position: sticky;
        bottom: 0;
        background: white;
        border-top: 1px solid #e0e0e0;
        margin: 0 -12px -12px -12px;
      }

      mat-dialog-actions button {
        width: 100%;
        margin: 0 !important;
        height: 48px;
        font-size: 16px;
        border-radius: 8px;
      }

      .full-width {
        margin-bottom: 14px;
      }

      h2 {
        font-size: 18px;
        padding: 12px;
        margin: 0 -12px 12px -12px;
        border-bottom: 1px solid #e0e0e0;
        background: #fafafa;
      }

      .field-container {
        flex-direction: column;
        gap: 10px;
        margin-bottom: 18px;
        padding: 12px;
        background: #f9f9f9;
        border-radius: 8px;
        border: 1px solid #e8e8e8;
      }

      .field-select {
        width: 100%;
        margin-bottom: 0;
      }

      .field-actions {
        width: 100%;
        justify-content: space-evenly;
        padding-top: 4px;
        gap: 8px;
        border-top: 1px dashed #ddd;
        padding-top: 10px;
      }

      .field-actions button {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        border-radius: 8px;
      }

      .field-actions mat-icon {
        font-size: 22px;
      }

      /* Hide helper text on mobile for cleaner look */
      .desktop-only-hint {
        display: none;
      }

      /* Larger touch targets for inputs */
      mat-form-field {
        font-size: 16px;
      }

      ::ng-deep mat-form-field .mat-mdc-text-field-wrapper {
        background-color: white;
      }

      ::ng-deep mat-form-field .mat-mdc-form-field-infix {
        padding-top: 12px;
        padding-bottom: 12px;
        min-height: 48px;
      }

      input {
        font-size: 16px !important;
        padding: 4px 0 !important;
      }

      ::ng-deep .mat-mdc-select-trigger {
        min-height: 48px;
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
      // Calculate Total Landing Price = (Product Price × Quantity) + Delivery Charges
      const totalLandingPrice = (price * qty) + delivery;
      
      // Calculate Landing Price per kg = Total Landing Price ÷ Quantity
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
