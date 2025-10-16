import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule
  ],
  template: `
    <div class="users-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <h2>User Management</h2>
          </mat-card-title>
          <button mat-raised-button color="primary" (click)="openUserDialog()">
            <mat-icon>add</mat-icon> Add User
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="userProfiles" class="mat-elevation-z2">
            
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
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    mat-card-title h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    table {
      width: 100%;
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
  `]
})
export class UsersComponent implements OnInit {
  userProfiles: any[] = [];
  displayedColumns: string[] = ['username', 'full_name', 'email', 'role', 'department', 'phone', 'company', 'status', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUserProfiles().subscribe((data: any) => {
      this.userProfiles = data.results || data;
    });
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
