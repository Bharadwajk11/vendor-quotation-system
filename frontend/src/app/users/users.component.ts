import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatChipsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Users</h1>
          <p class="page-subtitle">Manage user accounts and permissions</p>
        </div>
        <button mat-raised-button color="primary" (click)="openUserDialog()" class="add-button">
          <mat-icon>add</mat-icon>
          Add User
        </button>
      </div>

      <mat-card class="filters-card">
        <div class="compact-filters">
          <mat-form-field appearance="outline" class="compact-search">
            <mat-icon matPrefix class="search-icon">search</mat-icon>
            <input matInput [(ngModel)]="searchText" (input)="applySearch()" 
                   placeholder="Search users...">
            <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()" class="clear-btn">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <!-- Desktop Table View -->
          <div class="desktop-view">
            <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">

              <ng-container matColumnDef="username">
                <th mat-header-cell *matHeaderCellDef>Username</th>
                <td mat-cell *matCellDef="let user">{{ user.username }}</td>
              </ng-container>

              <ng-container matColumnDef="full_name">
                <th mat-header-cell *matHeaderCellDef>Full Name</th>
                <td mat-cell *matCellDef="let user">{{ user.full_name }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">{{ user.email }}</td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [ngClass]="getRoleClass(user.role)">
                    {{ user.role | uppercase }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef>Department</th>
                <td mat-cell *matCellDef="let user">{{ user.department || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let user">{{ user.phone || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="company">
                <th mat-header-cell *matHeaderCellDef>Company</th>
                <td mat-cell *matCellDef="let user">{{ user.company_name || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [ngClass]="user.is_active ? 'status-active' : 'status-inactive'">
                    {{ user.is_active ? 'ACTIVE' : 'INACTIVE' }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button color="primary" (click)="openUserDialog(user)" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteUser(user.id)" matTooltip="Delete">
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
              <div class="mobile-list-item" *ngFor="let user of dataSource.filteredData">
                <div class="mobile-item-header">
                  <div class="item-name">{{ user.username }}</div>
                  <div class="item-actions">
                    <button mat-icon-button color="primary" (click)="openUserDialog(user)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteUser(user.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>

                <div class="mobile-item-content">
                  <div class="data-row">
                    <span class="data-label">Full Name:</span>
                    <span class="data-value">{{ user.full_name }}</span>
                  </div>

                  <div class="data-row">
                    <span class="data-label">Email:</span>
                    <span class="data-value">{{ user.email }}</span>
                  </div>

                  <div class="data-row">
                    <span class="data-label">Role:</span>
                    <span class="data-value">
                      <mat-chip [ngClass]="getRoleClass(user.role)">
                        {{ user.role | uppercase }}
                      </mat-chip>
                    </span>
                  </div>

                  <div class="data-row">
                    <span class="data-label">Department:</span>
                    <span class="data-value">{{ user.department || '-' }}</span>
                  </div>

                  <div class="data-row">
                    <span class="data-label">Phone:</span>
                    <span class="data-value">{{ user.phone || '-' }}</span>
                  </div>

                  <div class="data-row">
                    <span class="data-label">Company:</span>
                    <span class="data-value">{{ user.company_name || '-' }}</span>
                  </div>

                  <div class="data-row">
                    <span class="data-label">Status:</span>
                    <span class="data-value">
                      <mat-chip [ngClass]="user.is_active ? 'status-active' : 'status-inactive'">
                        {{ user.is_active ? 'ACTIVE' : 'INACTIVE' }}
                      </mat-chip>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <mat-paginator [pageSizeOptions]="[10, 25, 50]" 
                         [pageSize]="10"
                         showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
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


    .role-admin {
      background-color: #f44336 !important;
      color: white !important;
    }

    .role-manager {
      background-color: #ff9800 !important;
      color: white !important;
    }

    .role-user {
      background-color: #2196f3 !important;
      color: white !important;
    }

    .status-active {
      background-color: #4caf50 !important;
      color: white !important;
    }

    .status-inactive {
      background-color: #9e9e9e !important;
      color: white !important;
    }

    mat-chip {
      font-weight: 500;
      font-size: 11px;
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

      .item-name {
        font-size: 16px;
        font-weight: 600;
        color: #3f51b5;
        flex: 1;
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
        min-width: 100px;
      }

      .data-value {
        font-size: 14px;
        color: #333;
        text-align: right;
        flex: 1;
        word-break: break-word;
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
export class UsersComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allUsers: any[] = [];
  displayedColumns: string[] = ['username', 'full_name', 'email', 'role', 'department', 'phone', 'company', 'status', 'actions'];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers() {
    this.apiService.getUserProfiles().subscribe({
      next: (data) => {
        this.allUsers = data.results || data;
        this.applySearch();
      },
      error: (err: any) => console.error('Error loading users:', err)
    });
  }

  applySearch() {
    let filteredData = [...this.allUsers];

    if (this.searchText && this.searchText.trim() !== '') {
      const searchTerm = this.searchText.toLowerCase().trim();
      filteredData = filteredData.filter(user => {
        return (
          user.username?.toLowerCase().includes(searchTerm) ||
          user.full_name?.toLowerCase().includes(searchTerm) ||
          user.email?.toLowerCase().includes(searchTerm) ||
          user.role?.toLowerCase().includes(searchTerm) ||
          user.department?.toLowerCase().includes(searchTerm) ||
          user.phone?.toLowerCase().includes(searchTerm) ||
          user.company_name?.toLowerCase().includes(searchTerm)
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

  getRoleClass(role: string): string {
    return `role-${role}`;
  }

  openUserDialog(user?: any) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUserProfile(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}