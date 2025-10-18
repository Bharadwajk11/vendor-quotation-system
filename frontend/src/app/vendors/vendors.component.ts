import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { VendorFormComponent } from './vendor-form.component';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatPaginatorModule,
    FormsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Vendors</h1>
        <p class="page-subtitle">Manage your supplier network</p>
      </div>

      <div class="search-and-actions">
        <mat-form-field class="search-field">
          <mat-label>Search Vendors</mat-label>
          <input matInput [(ngModel)]="searchText" (keyup)="applySearch()" placeholder="Ex. Vendor Name, City">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="openDialog()">
            <mat-icon>add</mat-icon>
            Add Vendor
          </button>
        </div>
      </div>

      <mat-card>
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z0">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let vendor">{{ vendor.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Vendor Name</th>
            <td mat-cell *matCellDef="let vendor">
              <strong>{{ vendor.name }}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="city">
            <th mat-header-cell *matHeaderCellDef>City</th>
            <td mat-cell *matCellDef="let vendor">{{ vendor.city }}</td>
          </ng-container>

          <ng-container matColumnDef="state">
            <th mat-header-cell *matHeaderCellDef>State</th>
            <td mat-cell *matCellDef="let vendor">{{ vendor.state }}</td>
          </ng-container>

          <ng-container matColumnDef="rating">
            <th mat-header-cell *matHeaderCellDef>Rating</th>
            <td mat-cell *matCellDef="let vendor">
              <mat-chip-set>
                <mat-chip [ngClass]="getRatingClass(vendor.rating)">
                  ⭐ {{ vendor.rating }}
                </mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Contact</th>
            <td mat-cell *matCellDef="let vendor">{{ vendor.contact }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let vendor">
              <button mat-icon-button color="primary" (click)="openDialog(vendor)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteVendor(vendor.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator #paginator
                       [pageSizeOptions]="[5, 10, 20]"
                       [showFirstLastButtons]="true">
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
    .page-header {
      margin-bottom: 20px;
      text-align: center;
    }
    .page-title {
      font-size: 2em;
      font-weight: bold;
      color: #333;
    }
    .page-subtitle {
      font-size: 1.1em;
      color: #666;
    }
    .search-and-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .search-field {
      flex-grow: 1;
      margin-right: 20px;
      min-width: 250px;
    }
    .action-buttons {
      white-space: nowrap;
    }
    mat-card {
      margin-top: 20px;
      padding: 20px;
    }
    table {
      width: 100%;
    }
    th.mat-header-cell {
      font-weight: bold;
      color: #333;
    }
    td.mat-cell strong {
      color: #007bff;
    }
    mat-chip {
      min-height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .rating-high {
      background-color: #4caf50 !important;
      color: white !important;
    }
    .rating-medium {
      background-color: #ff9800 !important;
      color: white !important;
    }
    .rating-low {
      background-color: #f44336 !important;
      color: white !important;
    }
  `]
})
export class VendorsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allVendors: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'city', 'state', 'rating', 'contact', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadVendors();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadVendors() {
    this.apiService.getVendors().subscribe({
      next: (data) => {
        this.allVendors = data.results || data;
        this.dataSource.data = this.allVendors;
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
      error: (err: any) => console.error('Error loading vendors:', err)
    });
  }

  getRatingClass(rating: number): string {
    if (rating >= 4.5) return 'rating-high';
    if (rating >= 3.5) return 'rating-medium';
    return 'rating-low';
  }

  openDialog(vendor?: any) {
    const dialogRef = this.dialog.open(VendorFormComponent, {
      width: '600px',
      data: vendor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVendors();
      }
    });
  }

  deleteVendor(id: number) {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.apiService.deleteVendor(id).subscribe({
        next: () => this.loadVendors(),
        error: (err: any) => console.error('Error deleting vendor:', err)
      });
    }
  }

  applySearch() {
    let filteredData = [...this.allVendors];

    if (this.searchText && this.searchText.trim() !== '') {
      const searchTerm = this.searchText.toLowerCase().trim();
      filteredData = filteredData.filter(vendor => {
        return (
          vendor.name?.toLowerCase().includes(searchTerm) ||
          vendor.city?.toLowerCase().includes(searchTerm) ||
          vendor.state?.toLowerCase().includes(searchTerm) ||
          vendor.contact?.toLowerCase().includes(searchTerm)
        );
      });
    }

    this.dataSource.data = filteredData;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}