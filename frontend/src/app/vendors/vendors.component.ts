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
        <div>
          <h1 class="page-title">Vendors</h1>
          <p class="page-subtitle">Manage your supplier network</p>
        </div>
        <button mat-raised-button color="primary" (click)="openDialog()" class="add-button">
          <mat-icon>add</mat-icon>
          Add Vendor
        </button>
      </div>

      <mat-card class="filters-card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [(ngModel)]="searchText" (input)="applySearch()" placeholder="Search vendors...">
          <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
      </mat-card>

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
    mat-chip {
      min-height: 28px;
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

  clearSearch() {
    this.searchText = '';
    this.applySearch();
  }
}