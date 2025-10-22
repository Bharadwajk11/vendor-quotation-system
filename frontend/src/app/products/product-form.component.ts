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
import { ProductCategoryFormComponent } from '../product-categories/product-category-form.component';
import { NotificationService } from '../services/notification.service';
import { ConfirmService } from '../services/confirm.service';

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
    <h2 mat-dialog-title>{{ data?.id ? 'Edit' : 'Add' }} Product</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Name</mat-label>
          <input matInput formControlName="name" required>
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
            <mat-hint class="desktop-only-hint">Manage groups using the buttons →</mat-hint>
          </mat-form-field>
          
          <div class="group-actions">
            <button mat-icon-button type="button" color="primary" 
                    (click)="addProductGroup()" 
                    matTooltip="Add New Group">
              <mat-icon>add</mat-icon>
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

        <div class="product-group-container">
          <mat-form-field appearance="outline" class="product-group-field">
            <mat-label>Product Category (Optional)</mat-label>
            <mat-select formControlName="product_category">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let category of productCategories" [value]="category.id">
                {{ category.name }}
              </mat-option>
            </mat-select>
            <mat-hint class="desktop-only-hint">Manage categories using the buttons →</mat-hint>
          </mat-form-field>
          
          <div class="group-actions">
            <button mat-icon-button type="button" color="primary" 
                    (click)="addProductCategory()" 
                    matTooltip="Add New Category">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-icon-button type="button" color="accent" 
                    (click)="editProductCategory()" 
                    [disabled]="!productForm.get('product_category')?.value"
                    matTooltip="Edit Selected Category">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button type="button" color="warn" 
                    (click)="deleteProductCategory()" 
                    [disabled]="!productForm.get('product_category')?.value"
                    matTooltip="Delete Selected Category">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

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
          <mat-label>Unit Price (₹) - Optional</mat-label>
          <input matInput formControlName="unit_price" type="number" step="0.01">
          <mat-hint>Reference price only, not used in quotations</mat-hint>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!productForm.valid">
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
      min-width: 450px;
    }

    mat-dialog-actions {
      padding: 12px 24px;
      gap: 8px;
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
        margin-bottom: 10px;
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

      .product-group-container {
        gap: 8px;
        margin-bottom: 10px;
      }

      .group-actions button {
        width: 32px !important;
        height: 32px !important;
      }

      .group-actions button mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        line-height: 18px;
      }

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

      .desktop-only-hint {
        display: none;
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

      .group-actions button {
        width: 28px !important;
        height: 28px !important;
      }

      .group-actions button mat-icon {
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
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productGroups: any[] = [];
  productCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private confirmService: ConfirmService
  ) {
    this.productForm = this.fb.group({
      product_group: [''],
      product_category: [''],
      name: ['', Validators.required],
      category: [''],
      grade_spec: [''],
      unit_type: ['', Validators.required],
      unit_price: ['', [Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadProductGroups();
    this.loadProductCategories();
    
    if (this.data?.id) {
      this.productForm.patchValue(this.data);
    }
  }

  loadProductGroups() {
    this.apiService.getProductGroups().subscribe({
      next: (data) => this.productGroups = data.results || data,
      error: (err: any) => console.error('Error loading product groups:', err)
    });
  }

  loadProductCategories() {
    this.apiService.getProductCategories().subscribe({
      next: (data) => this.productCategories = data.results || data,
      error: (err: any) => console.error('Error loading product categories:', err)
    });
  }

  addProductGroup() {
    const dialogRef = this.dialog.open(ProductGroupFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductGroups();
      }
    });
  }

  editProductGroup() {
    const groupId = this.productForm.get('product_group')?.value;
    if (!groupId) return;

    const selectedGroup = this.productGroups.find(g => g.id === groupId);
    if (!selectedGroup) return;

    const dialogRef = this.dialog.open(ProductGroupFormComponent, {
      width: '500px',
      data: selectedGroup
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductGroups();
      }
    });
  }

  deleteProductGroup() {
    const groupId = this.productForm.get('product_group')?.value;
    if (!groupId) return;

    this.confirmService.confirm(
      'Delete Product Group',
      'Are you sure you want to delete this product group? Products in this group will not be deleted.',
      'Delete',
      'Cancel'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.apiService.deleteProductGroup(groupId).subscribe({
          next: () => {
            this.productForm.patchValue({ product_group: null });
            this.loadProductGroups();
            this.notificationService.showSuccess('Product group deleted successfully!');
          },
          error: (err: any) => {
            console.error('Error deleting product group:', err);
            this.notificationService.showError('Failed to delete product group. Please try again.');
          }
        });
      }
    });
  }

  addProductCategory() {
    const dialogRef = this.dialog.open(ProductCategoryFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductCategories();
      }
    });
  }

  editProductCategory() {
    const categoryId = this.productForm.get('product_category')?.value;
    if (!categoryId) return;

    const selectedCategory = this.productCategories.find(c => c.id === categoryId);
    if (!selectedCategory) return;

    const dialogRef = this.dialog.open(ProductCategoryFormComponent, {
      width: '500px',
      data: selectedCategory
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductCategories();
      }
    });
  }

  deleteProductCategory() {
    const categoryId = this.productForm.get('product_category')?.value;
    if (!categoryId) return;

    this.confirmService.confirm(
      'Delete Product Category',
      'Are you sure you want to delete this product category? Products in this category will not be deleted.',
      'Delete',
      'Cancel'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.apiService.deleteProductCategory(categoryId).subscribe({
          next: () => {
            this.productForm.patchValue({ product_category: null });
            this.loadProductCategories();
            this.notificationService.showSuccess('Product category deleted successfully!');
          },
          error: (err: any) => {
            console.error('Error deleting product category:', err);
            this.notificationService.showError('Failed to delete product category. Please try again.');
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        kilo_price: this.productForm.value.unit_price
      };
      
      if (this.data?.id) {
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
