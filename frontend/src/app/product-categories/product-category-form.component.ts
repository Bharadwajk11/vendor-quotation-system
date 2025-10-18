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
    <div class="dialog-header">
      <h2 mat-dialog-title>{{ isEditMode ? 'Edit' : 'Add' }} Product Category</h2>
    </div>
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
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    h2 {
      margin: 0;
      padding: 0;
    }

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
      .dialog-header {
        padding: 12px;
        flex-direction: row;
        justify-content: space-between;
      }

      mat-dialog-content {
        min-width: unset;
        min-height: unset;
        padding: 12px !important;
      }

      h2 {
        font-size: 16px !important;
        padding: 0 !important;
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

      ::ng-deep mat-form-field input,
      ::ng-deep mat-form-field textarea {
        font-size: 13px !important;
        padding: 6px 0;
      }

      ::ng-deep mat-form-field label {
        font-size: 12px !important;
      }

      ::ng-deep mat-form-field .mat-mdc-form-field-subscript-wrapper {
        margin-top: 2px;
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
    }

    @media (max-width: 400px) {
      h2 {
        font-size: 14px !important;
      }

      mat-form-field {
        font-size: 12px;
      }

      ::ng-deep mat-form-field input,
      ::ng-deep mat-form-field textarea {
        font-size: 12px !important;
      }

      ::ng-deep mat-form-field label {
        font-size: 11px !important;
      }

      mat-dialog-actions button {
        font-size: 12px;
        padding: 6px 10px;
        height: 32px;
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
