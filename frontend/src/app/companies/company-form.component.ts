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
  selector: 'app-company-form',
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
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add' }} Company</h2>
    <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Company Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Industry Type</mat-label>
          <mat-select formControlName="industry_type" required>
            <mat-option value="Plastic Manufacturing">Plastic Manufacturing</mat-option>
            <mat-option value="Steel Manufacturing">Steel Manufacturing</mat-option>
            <mat-option value="Chemical Manufacturing">Chemical Manufacturing</mat-option>
            <mat-option value="Food & Beverage">Food & Beverage</mat-option>
            <mat-option value="Textile">Textile</mat-option>
            <mat-option value="Other">Other</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Address</mat-label>
          <textarea matInput formControlName="address" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>State</mat-label>
          <input matInput formControlName="state" placeholder="e.g., Maharashtra, Tamil Nadu">
          <mat-hint>State is used to calculate interstate shipping charges</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contact Email</mat-label>
          <input matInput formControlName="contact_email" type="email">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!companyForm.valid">
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
      min-width: 400px;
    }

    mat-dialog-actions {
      padding: 12px 24px;
      gap: 8px;
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

      ::ng-deep .mat-mdc-select-trigger {
        min-height: 48px;
      }
    }
  `]
})
export class CompanyFormComponent implements OnInit {
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      industry_type: ['', Validators.required],
      address: [''],
      state: [''],
      contact_email: ['', [Validators.email]]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.companyForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const companyData = this.companyForm.value;
      
      if (this.data) {
        this.apiService.updateCompany(this.data.id, companyData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error updating company:', err)
        });
      } else {
        this.apiService.createCompany(companyData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error creating company:', err)
        });
      }
    }
  }
}
