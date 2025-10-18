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
  selector: 'app-vendor-form',
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
    <h2 mat-dialog-title>{{ data?.id ? 'Edit' : 'Add' }} Vendor</h2>
    <form [formGroup]="vendorForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Vendor Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>City</mat-label>
          <input matInput formControlName="city" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>State</mat-label>
          <input matInput formControlName="state" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rating (1-5)</mat-label>
          <input matInput formControlName="rating" type="number" min="1" max="5" step="0.1">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contact</mat-label>
          <input matInput formControlName="contact">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!vendorForm.valid">
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
      min-width: 400px;
    }

    mat-dialog-actions {
      padding: 12px 24px;
      gap: 8px;
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

      ::ng-deep mat-form-field input {
        font-size: 12px !important;
      }

      ::ng-deep mat-form-field .mat-mdc-select {
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
export class VendorFormComponent implements OnInit {
  vendorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VendorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {
    this.vendorForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      rating: [4.0, [Validators.required, Validators.min(1), Validators.max(5)]],
      contact: ['']
    });
  }

  ngOnInit() {
    if (this.data?.id) {
      this.vendorForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.vendorForm.valid) {
      const vendorData = this.vendorForm.value;
      
      if (this.data?.id) {
        this.apiService.updateVendor(this.data.id, vendorData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error updating vendor:', err)
        });
      } else {
        this.apiService.createVendor(vendorData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error creating vendor:', err)
        });
      }
    }
  }
}
