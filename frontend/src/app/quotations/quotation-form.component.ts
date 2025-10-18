
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
    <div class="modal-overlay">
      <div class="form-card">
        <div class="form-header">
          <h2>{{ data?.id ? 'Edit' : 'Add' }} Quotation</h2>
        </div>
        
        <form [formGroup]="quotationForm" (ngSubmit)="onSubmit()">
          <div class="form-body">
            
            <!-- Vendor Selection -->
            <div class="form-group">
              <label class="field-label">Vendor</label>
              <div class="input-with-icons">
                <select formControlName="vendor" required class="form-control">
                  <option value="">Select vendor...</option>
                  <option *ngFor="let vendor of vendors" [value]="vendor.id">
                    {{ vendor.name }} - {{ vendor.city }}
                  </option>
                </select>
                <div class="icon-group">
                  <button type="button" class="icon-btn add" (click)="addVendor()" matTooltip="Add Vendor">
                    <mat-icon>add</mat-icon>
                  </button>
                  <button type="button" class="icon-btn edit" (click)="editVendor()" 
                          [disabled]="!quotationForm.get('vendor')?.value" matTooltip="Edit Vendor">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button type="button" class="icon-btn delete" (click)="deleteVendor()" 
                          [disabled]="!quotationForm.get('vendor')?.value" matTooltip="Delete Vendor">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>

            <!-- Product Selection -->
            <div class="form-group">
              <label class="field-label">Product</label>
              <div class="input-with-icons">
                <select formControlName="product" required class="form-control">
                  <option value="">Select product...</option>
                  <option *ngFor="let product of products" [value]="product.id">
                    {{ product.name }} ({{ product.grade_spec }})
                  </option>
                </select>
                <div class="icon-group">
                  <button type="button" class="icon-btn add" (click)="addProduct()" matTooltip="Add Product">
                    <mat-icon>add</mat-icon>
                  </button>
                  <button type="button" class="icon-btn edit" (click)="editProduct()" 
                          [disabled]="!quotationForm.get('product')?.value" matTooltip="Edit Product">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button type="button" class="icon-btn delete" (click)="deleteProduct()" 
                          [disabled]="!quotationForm.get('product')?.value" matTooltip="Delete Product">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>

            <!-- Two Column Grid -->
            <div class="form-grid">
              <!-- Product Price -->
              <div class="form-group">
                <label class="field-label">Product Price (₹/kg)</label>
                <input type="number" formControlName="product_price" step="0.01" required 
                       (input)="calculateLandingPrice()" class="form-control" placeholder="0.00">
              </div>

              <!-- Quantity -->
              <div class="form-group">
                <label class="field-label">Quantity (kg)</label>
                <input type="number" formControlName="quantity" step="1" required 
                       (input)="calculateLandingPrice()" class="form-control" placeholder="0">
              </div>

              <!-- Delivery Charges -->
              <div class="form-group">
                <label class="field-label">Delivery Charges (₹)</label>
                <input type="number" formControlName="delivery_price" step="0.01" required 
                       (input)="calculateLandingPrice()" class="form-control" placeholder="0.00">
              </div>

              <!-- Lead Time -->
              <div class="form-group">
                <label class="field-label">Lead Time (days)</label>
                <input type="number" formControlName="lead_time_days" required 
                       class="form-control" placeholder="0">
              </div>
            </div>

            <!-- Grade/Spec Full Width -->
            <div class="form-group">
              <label class="field-label">Grade/Specification</label>
              <input type="text" formControlName="grade_spec" class="form-control" 
                     placeholder="Enter grade or specification (optional)">
            </div>

            <!-- Calculated Fields -->
            <div class="calculated-box">
              <div class="calc-row">
                <div class="calc-item">
                  <span class="calc-label">Total Landing Price</span>
                  <span class="calc-value">₹{{ quotationForm.get('total_landing_price')?.value || '0.00' }}</span>
                </div>
                <div class="calc-item">
                  <span class="calc-label">Landing Price per kg</span>
                  <span class="calc-value">₹{{ quotationForm.get('landing_price')?.value || '0.00' }}/kg</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-footer">
            <button type="submit" class="btn btn-primary" [disabled]="!quotationForm.valid">
              {{ data?.id ? 'Update' : 'Create' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="dialogRef.close()">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .form-card {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 700px;
      overflow: hidden;
    }

    .form-header {
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    .form-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
    }

    .form-body {
      padding: 24px;
      max-height: calc(90vh - 160px);
      overflow-y: auto;
    }

    .form-group {
      margin-bottom: 18px;
    }

    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #555;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      background: #ffffff;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
      height: 38px;
    }

    .form-control:focus {
      outline: none;
      border-color: #3f51b5;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }

    .form-control::placeholder {
      color: #999;
    }

    select.form-control {
      cursor: pointer;
    }

    .input-with-icons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .input-with-icons .form-control {
      flex: 1;
    }

    .icon-group {
      display: flex;
      gap: 6px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      padding: 0;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .icon-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      color: #666;
    }

    .icon-btn:hover:not(:disabled) {
      background: #f5f5f5;
      border-color: #999;
    }

    .icon-btn.add:hover:not(:disabled) {
      background: #e8f5e9;
      border-color: #4caf50;
    }

    .icon-btn.add:hover:not(:disabled) mat-icon {
      color: #4caf50;
    }

    .icon-btn.edit:hover:not(:disabled) {
      background: #fff3e0;
      border-color: #ff9800;
    }

    .icon-btn.edit:hover:not(:disabled) mat-icon {
      color: #ff9800;
    }

    .icon-btn.delete:hover:not(:disabled) {
      background: #ffebee;
      border-color: #f44336;
    }

    .icon-btn.delete:hover:not(:disabled) mat-icon {
      color: #f44336;
    }

    .icon-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 18px;
    }

    .calculated-box {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border: 1px solid #90caf9;
      border-radius: 6px;
      padding: 16px;
      margin-top: 20px;
    }

    .calc-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .calc-item {
      background: #ffffff;
      padding: 12px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .calc-label {
      font-size: 11px;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .calc-value {
      font-size: 18px;
      font-weight: 700;
      color: #1565c0;
    }

    .form-footer {
      padding: 16px 24px;
      background: #f9f9f9;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 12px;
    }

    .btn {
      flex: 1;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-primary {
      background: #3f51b5;
      color: #ffffff;
    }

    .btn-primary:hover:not(:disabled) {
      background: #303f9f;
      box-shadow: 0 2px 8px rgba(63, 81, 181, 0.3);
    }

    .btn-primary:disabled {
      background: #9fa8da;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #ffffff;
      color: #666;
      border: 1px solid #d0d0d0;
    }

    .btn-secondary:hover {
      background: #f5f5f5;
      border-color: #999;
    }

    /* Mobile Responsive */
    @media (max-width: 600px) {
      .modal-overlay {
        padding: 0;
      }

      .form-card {
        max-width: 100%;
        border-radius: 0;
        max-height: 100vh;
      }

      .form-header {
        padding: 14px 16px;
      }

      .form-header h2 {
        font-size: 18px;
      }

      .form-body {
        padding: 16px;
        max-height: calc(100vh - 140px);
      }

      .form-group {
        margin-bottom: 16px;
      }

      .field-label {
        font-size: 11px;
      }

      .form-control {
        font-size: 16px;
        height: 42px;
        padding: 10px 12px;
      }

      .input-with-icons {
        flex-direction: column;
        gap: 10px;
      }

      .icon-group {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .icon-btn {
        width: 100%;
        height: 40px;
      }

      .icon-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .calc-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .calc-value {
        font-size: 16px;
      }

      .form-footer {
        padding: 14px 16px;
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
        padding: 12px 20px;
        font-size: 15px;
      }
    }

    /* Tablet */
    @media (min-width: 601px) and (max-width: 900px) {
      .form-card {
        max-width: 600px;
      }

      .form-grid {
        gap: 14px;
      }

      .icon-btn {
        width: 36px;
        height: 36px;
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
