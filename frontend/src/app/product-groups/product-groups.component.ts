import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../services/api.service';
import { ProductGroupFormComponent } from './product-group-form.component';

@Component({
  selector: 'app-product-groups',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Product Groups</h1>
        <p class="page-subtitle">Manage product categories and groups</p>
      </div>

      <div class="action-buttons">
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Add Product Group
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="productGroups" class="mat-elevation-z0">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let group">{{ group.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Group Name</th>
            <td mat-cell *matCellDef="let group">
              <strong>{{ group.name }}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let group">{{ group.description || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="product_count">
            <th mat-header-cell *matHeaderCellDef>Products</th>
            <td mat-cell *matCellDef="let group">
              <mat-chip-set>
                <mat-chip>{{ group.product_count || 0 }} items</mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="company_name">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let group">{{ group.company_name }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let group">
              <button mat-icon-button color="primary" (click)="openDialog(group)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProductGroup(group.id)">
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
export class ProductGroupsComponent implements OnInit {
  productGroups: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'product_count', 'company_name', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProductGroups();
  }

  loadProductGroups() {
    this.apiService.getProductGroups().subscribe({
      next: (data) => this.productGroups = data.results || data,
      error: (err: any) => console.error('Error loading product groups:', err)
    });
  }

  openDialog(productGroup?: any) {
    const dialogRef = this.dialog.open(ProductGroupFormComponent, {
      width: '600px',
      data: productGroup
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductGroups();
      }
    });
  }

  deleteProductGroup(id: number) {
    if (confirm('Are you sure you want to delete this product group?')) {
      this.apiService.deleteProductGroup(id).subscribe({
        next: () => this.loadProductGroups(),
        error: (err: any) => console.error('Error deleting product group:', err)
      });
    }
  }
}
