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
import { ProductGroupFormComponent } from '../product-groups/product-group-form.component';

@Component({
  selector: 'app-product-form',
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
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add' }} Product</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Company</mat-label>
          <mat-select formControlName="company" required (selectionChange)="onCompanyChange($event.value)">
            <mat-option *ngFor="let company of companies" [value]="company.id">
              {{ company.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="product-group-container">
          <mat-form-field appearance="outline" class="product-group-field">
            <mat-label>Product Group (Optional)</mat-label>
            <mat-select formControlName="product_group">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let group of productGroups" [value]="group.id">
                {{ group.name }}
              </mat-option>
            </mat-select>
            <mat-hint>Manage groups using the buttons →</mat-hint>
          </mat-form-field>
          
          <div class="group-actions">
            <button mat-icon-button type="button" color="primary" 
                    (click)="addProductGroup()" 
                    [disabled]="!productForm.get('company')?.value"
                    matTooltip="Add New Group">
              <mat-icon>add_circle</mat-icon>
            </button>
            <button mat-icon-button type="button" color="accent" 
                    (click)="editProductGroup()" 
                    [disabled]="!productForm.get('product_group')?.value"
                    matTooltip="Edit Selected Group">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button type="button" color="warn" 
                    (click)="deleteProductGroup()" 
                    [disabled]="!productForm.get('product_group')?.value"
                    matTooltip="Delete Selected Group">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category" required>
            <mat-option value="Raw Material">Raw Material</mat-option>
            <mat-option value="Component">Component</mat-option>
            <mat-option value="Finished Goods">Finished Goods</mat-option>
            <mat-option value="Packaging">Packaging</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Grade/Specification</mat-label>
          <input matInput formControlName="grade_spec">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Unit Type</mat-label>
          <mat-select formControlName="unit_type" required>
            <mat-option value="kg">kg</mat-option>
            <mat-option value="liter">liter</mat-option>
            <mat-option value="piece">piece</mat-option>
            <mat-option value="box">box</mat-option>
            <mat-option value="ton">ton</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Unit Price (₹)</mat-label>
          <input matInput formControlName="unit_price" type="number" step="0.01" required>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!productForm.valid">
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
      min-width: 500px;
    }

    .product-group-container {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 16px;
    }

    .product-group-field {
      flex: 1;
      margin-bottom: 0;
    }

    .group-actions {
      display: flex;
      gap: 4px;
      padding-top: 8px;
    }

    .group-actions button {
      width: 36px;
      height: 36px;
    }

    .group-actions mat-icon {
      font-size: 20px;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  companies: any[] = [];
  productGroups: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {
    this.productForm = this.fb.group({
      company: ['', Validators.required],
      product_group: [''],
      name: ['', Validators.required],
      category: ['', Validators.required],
      grade_spec: [''],
      unit_type: ['', Validators.required],
      unit_price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadCompanies();
    
    if (this.data) {
      this.productForm.patchValue(this.data);
      if (this.data.company) {
        this.loadProductGroups(this.data.company);
      }
    }
  }

  loadCompanies() {
    this.apiService.getCompanies().subscribe({
      next: (data) => this.companies = data.results || data,
      error: (err: any) => console.error('Error loading companies:', err)
    });
  }

  onCompanyChange(companyId: number) {
    this.loadProductGroups(companyId);
    this.productForm.patchValue({ product_group: null });
  }

  loadProductGroups(companyId: number) {
    this.apiService.getProductGroups(companyId).subscribe({
      next: (data) => this.productGroups = data.results || data,
      error: (err: any) => console.error('Error loading product groups:', err)
    });
  }

  addProductGroup() {
    const companyId = this.productForm.get('company')?.value;
    if (!companyId) return;

    const dialogRef = this.dialog.open(ProductGroupFormComponent, {
      width: '500px',
      data: { company: companyId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductGroups(companyId);
      }
    });
  }

  editProductGroup() {
    const groupId = this.productForm.get('product_group')?.value;
    const companyId = this.productForm.get('company')?.value;
    if (!groupId) return;

    const selectedGroup = this.productGroups.find(g => g.id === groupId);
    if (!selectedGroup) return;

    const dialogRef = this.dialog.open(ProductGroupFormComponent, {
      width: '500px',
      data: selectedGroup
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductGroups(companyId);
      }
    });
  }

  deleteProductGroup() {
    const groupId = this.productForm.get('product_group')?.value;
    const companyId = this.productForm.get('company')?.value;
    if (!groupId) return;

    if (confirm('Are you sure you want to delete this product group? Products in this group will not be deleted.')) {
      this.apiService.deleteProductGroup(groupId).subscribe({
        next: () => {
          this.productForm.patchValue({ product_group: null });
          this.loadProductGroups(companyId);
        },
        error: (err: any) => console.error('Error deleting product group:', err)
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        kilo_price: this.productForm.value.unit_price
      };
      
      if (this.data) {
        this.apiService.updateProduct(this.data.id, productData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error updating product:', err)
        });
      } else {
        this.apiService.createProduct(productData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error creating product:', err)
        });
      }
    }
  }
}
