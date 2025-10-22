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
import { NotificationService } from '../services/notification.service';
import { ConfirmService } from '../services/confirm.service';

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
        <div class="compact-filters">
          <mat-form-field appearance="outline" class="compact-search">
            <mat-icon matPrefix class="search-icon">search</mat-icon>
            <input matInput [(ngModel)]="searchText" (input)="applySearch()" 
                   placeholder="Search vendors...">
            <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card>
        <!-- Desktop Table View -->
        <div class="desktop-view">
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z0">
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
        </div>

        <!-- Mobile List View -->
        <div class="mobile-view">
          <div class="mobile-list">
            <div class="mobile-list-item" *ngFor="let vendor of getPaginatedData()">
              <div class="mobile-item-header">
                <div class="item-name">{{ vendor.name }}</div>
                <div class="item-actions">
                  <button mat-icon-button color="primary" (click)="openDialog(vendor)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteVendor(vendor.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <div class="mobile-item-content">
                <div class="data-row">
                  <span class="data-label">Vendor Name:</span>
                  <span class="data-value vendor-name">{{ vendor.name }}</span>
                </div>

                <div class="data-row">
                  <span class="data-label">City:</span>
                  <span class="data-value">{{ vendor.city }}</span>
                </div>

                <div class="data-row">
                  <span class="data-label">State:</span>
                  <span class="data-value">{{ vendor.state }}</span>
                </div>

                <div class="data-row">
                  <span class="data-label">Rating:</span>
                  <span class="data-value">
                    <mat-chip [ngClass]="getRatingClass(vendor.rating)">
                      ⭐ {{ vendor.rating }}
                    </mat-chip>
                  </span>
                </div>

                <div class="data-row">
                  <span class="data-label">Contact:</span>
                  <span class="data-value">{{ vendor.contact }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <mat-paginator #paginator
                       [pageSizeOptions]="[5, 10, 20]"
                       [showFirstLastButtons]="true">
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 20px;
    }

    .add-button {
      white-space: nowrap;
      height: 40px;
    }

    @media (max-width: 600px) {
      .page-header {
        align-items: flex-start;
        gap: 12px;
      }

      .add-button {
        height: 36px;
        min-width: 36px;
        padding: 0 12px;
      }

      .add-button mat-icon {
        margin-right: 4px;
        font-size: 20px;
      }

      .add-button .mat-button-wrapper {
        font-size: 13px;
      }
    }

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

    table {
      width: 100%;
    }

    th {
      background-color: #3f51b5;
      font-weight: 600;
      color: white;
      padding: 16px;
    }

    td {
      color: #555;
      padding: 12px 16px;
    }

    /* Desktop/Mobile View Toggle */
    .desktop-view {
      display: block;
    }

    .mobile-view {
      display: none;
    }

    @media (max-width: 600px) {
      .desktop-view {
        display: none;
      }

      .mobile-view {
        display: block;
      }

      .mobile-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px;
      }

      .mobile-list-item {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .mobile-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 12px;
        margin-bottom: 12px;
        border-bottom: 2px solid #3f51b5;
      }

      .item-id {
        font-size: 14px;
        font-weight: 600;
        color: #3f51b5;
      }

      .item-actions {
        display: flex;
        gap: 4px;
      }

      .item-actions button {
        width: 36px;
        height: 36px;
      }

      .mobile-item-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .data-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .data-row:last-child {
        border-bottom: none;
      }

      .data-label {
        font-size: 13px;
        font-weight: 500;
        color: #666;
        flex: 0 0 auto;
        min-width: 110px;
      }

      .data-value {
        font-size: 14px;
        color: #333;
        text-align: right;
        flex: 1;
        word-break: break-word;
      }

      .data-value.vendor-name {
        font-weight: 600;
        color: #3f51b5;
      }

      ::ng-deep .mat-mdc-paginator {
        padding: 8px 0;
      }

      ::ng-deep .mat-mdc-paginator-container {
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }

      ::ng-deep .mat-mdc-paginator-page-size {
        margin: 0 8px;
      }
    }
  `]
})
export class VendorsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allVendors: any[] = [];
  displayedColumns: string[] = ['name', 'city', 'state', 'rating', 'contact', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private confirmService: ConfirmService
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
    this.confirmService.confirm(
      'Delete Vendor',
      'Are you sure you want to delete this vendor? This action cannot be undone.',
      'Delete',
      'Cancel'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.apiService.deleteVendor(id).subscribe({
          next: () => {
            this.loadVendors();
            this.notificationService.showSuccess('Vendor deleted successfully!');
          },
          error: (err: any) => {
            console.error('Error deleting vendor:', err);
            this.notificationService.showError('Failed to delete vendor. Please try again.');
          }
        });
      }
    });
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

  getPaginatedData(): any[] {
    if (!this.paginator) {
      return this.dataSource.filteredData;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }
}