import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-product-category-form',
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
    <h2 mat-dialog-title>{{ isEditMode ? 'Edit' : 'Add' }} Product Category</h2>
    <form [formGroup]="productCategoryForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category Name</mat-label>
          <input matInput formControlName="name" required placeholder="e.g., Raw Material, Components">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" 
                    placeholder="Optional description of this product category"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!productCategoryForm.valid">
          {{ isEditMode ? 'Update' : 'Create' }}
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
      min-width: 400px;
      min-height: 250px;
    }

    mat-dialog-actions {
      padding: 12px 24px;
      gap: 8px;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: unset;
        min-height: unset;
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

      ::ng-deep mat-form-field .mat-mdc-text-field-wrapper {
        background-color: white;
      }

      ::ng-deep mat-form-field .mat-mdc-form-field-infix {
        padding-top: 12px;
        padding-bottom: 12px;
        min-height: 48px;
      }

      input, textarea {
        font-size: 16px !important;
        padding: 4px 0 !important;
      }
    }
  `]
})
export class ProductCategoryFormComponent implements OnInit {
  productCategoryForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {
    this.productCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
    
    this.isEditMode = !!this.data?.id;
  }

  ngOnInit() {
    if (this.data?.id) {
      this.productCategoryForm.patchValue({
        name: this.data.name,
        description: this.data.description
      });
    }
  }

  onSubmit() {
    if (this.productCategoryForm.valid) {
      const productCategoryData = this.productCategoryForm.value;
      
      if (this.isEditMode) {
        this.apiService.updateProductCategory(this.data.id, productCategoryData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error updating product category:', err)
        });
      } else {
        this.apiService.createProductCategory(productCategoryData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error creating product category:', err)
        });
      }
    }
  }
}
