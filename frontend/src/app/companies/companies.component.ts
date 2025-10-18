import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
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
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Companies</h1>
          <p class="page-subtitle">Manage your company profiles</p>
        </div>
        <button mat-raised-button color="primary" (click)="openDialog()" class="add-button">
          <mat-icon>add</mat-icon>
          Add Company
        </button>
      </div>

      <mat-card class="filters-card">
        <div class="compact-filters">
          <mat-form-field appearance="outline" class="compact-search">
            <mat-icon matPrefix class="search-icon">search</mat-icon>
            <input matInput [(ngModel)]="searchText" (input)="applySearch()" 
                   placeholder="Search companies...">
            <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card>
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z0">
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

          <ng-container matColumnDef="state">
            <th mat-header-cell *matHeaderCellDef>State</th>
            <td mat-cell *matCellDef="let company">{{ company.state || '-' }}</td>
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

        <mat-paginator [pageSizeOptions]="[5, 10, 25]" 
                       [pageSize]="10"
                       showFirstLastButtons>
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .filters-card {
      margin-bottom: 20px;
      padding: 12px 16px;
    }

    .compact-filters {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .compact-search {
      flex: 1;
      min-width: 280px;
    }

    .compact-search ::ng-deep .mat-mdc-form-field-infix {
      padding-top: 8px;
      padding-bottom: 8px;
      min-height: 40px;
    }

    .search-icon {
      color: #666;
      font-size: 20px;
      margin-right: 4px;
    }

    .clear-btn {
      width: 32px;
      height: 32px;
    }

    .clear-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    ::ng-deep .compact-search .mat-mdc-text-field-wrapper {
      padding-bottom: 0;
    }

    ::ng-deep .compact-search .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `]
})
export class CompaniesComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allCompanies: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'industry_type', 'state', 'contact_email', 'address', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCompanies();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadCompanies() {
    this.apiService.getCompanies().subscribe({
      next: (data) => {
        this.allCompanies = data.results || data;
        this.applySearch();
      },
      error: (err: any) => console.error('Error loading companies:', err)
    });
  }

  applySearch() {
    let filteredData = [...this.allCompanies];

    if (this.searchText && this.searchText.trim() !== '') {
      const searchTerm = this.searchText.toLowerCase().trim();
      filteredData = filteredData.filter(company => {
        return (
          company.name?.toLowerCase().includes(searchTerm) ||
          company.industry_type?.toLowerCase().includes(searchTerm) ||
          company.state?.toLowerCase().includes(searchTerm) ||
          company.address?.toLowerCase().includes(searchTerm) ||
          company.contact_email?.toLowerCase().includes(searchTerm)
        );
      });
    }

    this.dataSource.data = filteredData;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  clearSearch() {
    this.searchText = '';
    this.applySearch();
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