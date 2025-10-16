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
  selector: 'app-product-group-form',
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
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add' }} Product Group</h2>
    <form [formGroup]="productGroupForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Company</mat-label>
          <mat-select formControlName="company" required>
            <mat-option *ngFor="let company of companies" [value]="company.id">
              {{ company.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Group Name</mat-label>
          <input matInput formControlName="name" required placeholder="e.g., Plastic Resins, Metal Parts">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" 
                    placeholder="Optional description of this product group"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!productGroupForm.valid">
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
      min-height: 300px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class ProductGroupFormComponent implements OnInit {
  productGroupForm: FormGroup;
  companies: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductGroupFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {
    this.productGroupForm = this.fb.group({
      company: ['', Validators.required],
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadCompanies();
    
    if (this.data) {
      this.productGroupForm.patchValue({
        company: this.data.company,
        name: this.data.name,
        description: this.data.description
      });
    }
  }

  loadCompanies() {
    this.apiService.getCompanies().subscribe({
      next: (data) => this.companies = data.results || data,
      error: (err: any) => console.error('Error loading companies:', err)
    });
  }

  onSubmit() {
    if (this.productGroupForm.valid) {
      const productGroupData = this.productGroupForm.value;
      
      if (this.data) {
        this.apiService.updateProductGroup(this.data.id, productGroupData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error updating product group:', err)
        });
      } else {
        this.apiService.createProductGroup(productGroupData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error creating product group:', err)
        });
      }
    }
  }
}
