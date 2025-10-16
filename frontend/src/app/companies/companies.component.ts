import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { CompanyFormComponent } from './company-form.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Companies</h1>
        <p class="page-subtitle">Manage your client companies</p>
      </div>

      <div class="action-buttons">
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Add Company
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="companies" class="mat-elevation-z0">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let company">{{ company.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Company Name</th>
            <td mat-cell *matCellDef="let company">{{ company.name }}</td>
          </ng-container>

          <ng-container matColumnDef="industry_type">
            <th mat-header-cell *matHeaderCellDef>Industry</th>
            <td mat-cell *matCellDef="let company">{{ company.industry_type }}</td>
          </ng-container>

          <ng-container matColumnDef="contact_email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let company">{{ company.contact_email }}</td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef>Address</th>
            <td mat-cell *matCellDef="let company">{{ company.address }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let company">
              <button mat-icon-button color="primary" (click)="openDialog(company)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteCompany(company.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `
})
export class CompaniesComponent implements OnInit {
  companies: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'industry_type', 'contact_email', 'address', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.apiService.getCompanies().subscribe({
      next: (data) => this.companies = data.results || data,
      error: (err) => console.error('Error loading companies:', err)
    });
  }

  openDialog(company?: any) {
    const dialogRef = this.dialog.open(CompanyFormComponent, {
      width: '600px',
      data: company
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompanies();
      }
    });
  }

  deleteCompany(id: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.apiService.deleteCompany(id).subscribe({
        next: () => this.loadCompanies(),
        error: (err) => console.error('Error deleting company:', err)
      });
    }
  }
}
