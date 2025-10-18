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
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [(ngModel)]="searchText" (input)="applySearch()" placeholder="Search users...">
          <button mat-icon-button matSuffix *ngIf="searchText" (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
      </mat-card>

      <mat-card>
        <mat-card-content>
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

          <mat-paginator [pageSizeOptions]="[10, 25, 50]" 
                         [pageSize]="10"
                         showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`

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