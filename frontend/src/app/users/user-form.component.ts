import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit User' : 'Add New User' }}</h2>
    <mat-dialog-content>
      <form #userForm="ngForm">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="formData.username" name="username" required [disabled]="data">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="formData.email" name="email" required>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput [(ngModel)]="formData.first_name" name="first_name">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput [(ngModel)]="formData.last_name" name="last_name">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select [(ngModel)]="formData.role" name="role" required>
              <mat-option value="admin">Administrator</mat-option>
              <mat-option value="manager">Manager</mat-option>
              <mat-option value="user">User</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <input matInput [(ngModel)]="formData.department" name="department">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput [(ngModel)]="formData.phone" name="phone">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Company</mat-label>
            <mat-select [(ngModel)]="formData.company" name="company">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let company of companies" [value]="company.id">
                {{ company.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-checkbox [(ngModel)]="formData.is_active" name="is_active">
            Active User
          </mat-checkbox>
        </div>

        <div class="form-row" *ngIf="!data">
          <mat-form-field appearance="outline" style="width: 100%;">
            <mat-label>Password</mat-label>
            <input matInput type="password" [(ngModel)]="formData.password" name="password" required>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!userForm.valid">
        {{ data ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 450px;
      padding: 20px 24px;
    }

    mat-dialog-actions {
      padding: 12px 24px;
      gap: 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    mat-checkbox {
      margin-top: 10px;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: unset;
        padding: 16px;
      }

      mat-dialog-actions {
        padding: 12px 16px;
        flex-direction: column-reverse;
        align-items: stretch;
      }

      mat-dialog-actions button {
        width: 100%;
        margin: 4px 0 !important;
      }

      h2 {
        font-size: 18px;
        padding: 12px 16px;
      }

      .form-row {
        flex-direction: column;
        gap: 12px;
        margin-bottom: 12px;
      }

      .form-row mat-form-field {
        width: 100%;
      }
    }
  `]
})
export class UserFormComponent implements OnInit {
  formData: any = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'user',
    department: '',
    phone: '',
    company: null,
    is_active: true,
    password: ''
  };
  
  companies: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.getCompanies().subscribe((companies: any) => {
      this.companies = companies;
    });

    if (this.data) {
      this.formData = {
        username: this.data.username,
        email: this.data.email,
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        role: this.data.role,
        department: this.data.department,
        phone: this.data.phone,
        company: this.data.company,
        is_active: this.data.is_active
      };
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.data) {
      this.apiService.updateUserProfile(this.data.id, this.formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.apiService.createUserProfile(this.formData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
