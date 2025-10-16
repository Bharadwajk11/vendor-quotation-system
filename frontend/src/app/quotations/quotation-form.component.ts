import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../services/api.service';

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
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add' }} Quotation</h2>
    <form [formGroup]="quotationForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Vendor</mat-label>
          <mat-select formControlName="vendor" required>
            <mat-option *ngFor="let vendor of vendors" [value]="vendor.id">
              {{ vendor.name }} - {{ vendor.city }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product</mat-label>
          <mat-select formControlName="product" required>
            <mat-option *ngFor="let product of products" [value]="product.id">
              {{ product.name }} ({{ product.grade_spec }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Price (₹)</mat-label>
          <input matInput formControlName="product_price" type="number" step="0.01" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Delivery Price (₹)</mat-label>
          <input matInput formControlName="delivery_price" type="number" step="0.01" required>
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
          {{ data ? 'Update' : 'Create' }}
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
      min-width: 600px;
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
    private apiService: ApiService
  ) {
    this.quotationForm = this.fb.group({
      vendor: ['', Validators.required],
      product: ['', Validators.required],
      product_price: ['', [Validators.required, Validators.min(0)]],
      delivery_price: ['', [Validators.required, Validators.min(0)]],
      lead_time_days: ['', [Validators.required, Validators.min(1)]],
      grade_spec: ['']
    });
  }

  ngOnInit() {
    this.loadVendors();
    this.loadProducts();
    
    if (this.data) {
      this.quotationForm.patchValue(this.data);
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

  onSubmit() {
    if (this.quotationForm.valid) {
      const quotationData = {
        ...this.quotationForm.value,
        kilo_price: this.quotationForm.value.product_price
      };
      
      if (this.data) {
        this.apiService.updateQuotation(this.data.id, quotationData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error updating quotation:', err)
        });
      } else {
        this.apiService.createQuotation(quotationData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error creating quotation:', err)
        });
      }
    }
  }
}
