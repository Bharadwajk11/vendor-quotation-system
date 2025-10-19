
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
    
    <mat-dialog-content>
      <form [formGroup]="quotationForm">
        <!-- Vendor Selection -->
        <div style="display: flex; gap: 8px; align-items: flex-start;">
          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Vendor</mat-label>
            <mat-select formControlName="vendor" required>
              <mat-option *ngFor="let vendor of vendors" [value]="vendor.id">
                {{ vendor.name }} - {{ vendor.city }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <button mat-mini-fab color="primary" type="button" (click)="addVendor()" matTooltip="Add Vendor">
            <mat-icon>add</mat-icon>
          </button>
          <button mat-mini-fab color="accent" type="button" (click)="editVendor()" 
                  [disabled]="!quotationForm.get('vendor')?.value" matTooltip="Edit Vendor">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-mini-fab color="warn" type="button" (click)="deleteVendor()" 
                  [disabled]="!quotationForm.get('vendor')?.value" matTooltip="Delete Vendor">
            <mat-icon>delete</mat-icon>
          </button>
        </div>

        <!-- Product Selection -->
        <div style="display: flex; gap: 8px; align-items: flex-start;">
          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Product</mat-label>
            <mat-select formControlName="product" required>
              <mat-option *ngFor="let product of products" [value]="product.id">
                {{ product.name }} ({{ product.grade_spec }})
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <button mat-mini-fab color="primary" type="button" (click)="addProduct()" matTooltip="Add Product">
            <mat-icon>add</mat-icon>
          </button>
          <button mat-mini-fab color="accent" type="button" (click)="editProduct()" 
                  [disabled]="!quotationForm.get('product')?.value" matTooltip="Edit Product">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-mini-fab color="warn" type="button" (click)="deleteProduct()" 
                  [disabled]="!quotationForm.get('product')?.value" matTooltip="Delete Product">
            <mat-icon>delete</mat-icon>
          </button>
        </div>

        <!-- Pricing Details -->
        <mat-form-field appearance="outline">
          <mat-label>Product Price (₹/kg)</mat-label>
          <input matInput formControlName="product_price" type="number" step="0.01" required (input)="calculateLandingPrice()">
          <mat-hint>Required field</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Quantity (kg)</mat-label>
          <input matInput formControlName="quantity" type="number" step="1" (input)="calculateLandingPrice()">
          <mat-hint>Optional</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Delivery Charges (₹)</mat-label>
          <input matInput formControlName="delivery_price" type="number" step="0.01" (input)="calculateLandingPrice()">
          <mat-hint>Optional</mat-hint>
        </mat-form-field>

        <!-- Calculated Values -->
        <mat-form-field appearance="outline">
          <mat-label>Total Landing Price (₹)</mat-label>
          <input matInput [value]="quotationForm.get('total_landing_price')?.value || '0.00'" readonly>
          <mat-hint>Product Price × Quantity + Delivery Charges</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Landing Price per kg (₹/kg)</mat-label>
          <input matInput [value]="quotationForm.get('landing_price')?.value || '0.00'" readonly>
          <mat-hint>Total Landing Price ÷ Quantity</mat-hint>
        </mat-form-field>

        <!-- Additional Information -->
        <mat-form-field appearance="outline">
          <mat-label>Lead Time (days)</mat-label>
          <input matInput formControlName="lead_time_days" type="number">
          <mat-hint>Optional</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Grade/Specification</mat-label>
          <input matInput formControlName="grade_spec">
          <mat-hint>Optional</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!quotationForm.valid">
        {{ data?.id ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 500px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: unset;
        padding: 12px !important;
      }

      h2 {
        font-size: 16px !important;
        padding: 12px !important;
        margin: 0 !important;
      }

      form {
        gap: 10px;
      }

      mat-form-field {
        font-size: 13px;
      }

      ::ng-deep mat-form-field .mat-mdc-text-field-wrapper {
        padding-bottom: 0;
      }

      ::ng-deep mat-form-field .mat-mdc-form-field-infix {
        padding-top: 10px;
        padding-bottom: 10px;
        min-height: 36px;
      }

      ::ng-deep mat-form-field input {
        font-size: 13px !important;
        padding: 6px 0;
      }

      ::ng-deep mat-form-field .mat-mdc-select {
        font-size: 13px !important;
      }

      ::ng-deep mat-form-field label {
        font-size: 12px !important;
      }

      ::ng-deep mat-form-field .mat-mdc-form-field-hint {
        font-size: 11px !important;
      }

      ::ng-deep mat-form-field .mat-mdc-form-field-subscript-wrapper {
        margin-top: 2px;
      }

      /* Reduce button sizes */
      button[mat-mini-fab] {
        width: 32px !important;
        height: 32px !important;
      }

      button[mat-mini-fab] mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        line-height: 18px;
      }

      /* Action buttons at bottom */
      mat-dialog-actions {
        padding: 10px 12px !important;
        gap: 8px;
      }

      mat-dialog-actions button {
        font-size: 13px;
        padding: 8px 12px;
        min-width: 70px;
        height: 36px;
      }

      /* Reduce spacing between vendor/product action buttons */
      div[style*="display: flex"] {
        gap: 4px !important;
      }
    }

    @media (max-width: 400px) {
      h2 {
        font-size: 14px !important;
      }

      mat-form-field {
        font-size: 12px;
      }

      ::ng-deep mat-form-field input {
        font-size: 12px !important;
      }

      ::ng-deep mat-form-field .mat-mdc-select {
        font-size: 12px !important;
      }

      ::ng-deep mat-form-field label {
        font-size: 11px !important;
      }

      button[mat-mini-fab] {
        width: 28px !important;
        height: 28px !important;
      }

      button[mat-mini-fab] mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }

      mat-dialog-actions button {
        font-size: 12px;
        padding: 6px 10px;
        height: 32px;
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
      quantity: ['', Validators.min(1)],
      delivery_price: ['', Validators.min(0)],
      total_landing_price: [{ value: '', disabled: true }],
      landing_price: [{ value: '', disabled: true }],
      lead_time_days: ['', Validators.min(1)],
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
