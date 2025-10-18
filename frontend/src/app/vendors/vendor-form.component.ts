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
      min-width: 300px;
      max-width: 500px;
    }

    @media (max-width: 599px) {
      mat-dialog-content {
        padding: 16px;
        min-width: 100%;
        max-width: 100%;
      }

      .full-width {
        margin-bottom: 12px;
      }

      ::ng-deep .mat-mdc-dialog-container {
        max-width: 95vw !important;
        margin: 8px;
      }

      ::ng-deep .mat-mdc-form-field {
        font-size: 14px;
      }

      ::ng-deep .mat-mdc-text-field-wrapper {
        padding: 0;
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
