import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <div class="logo-section">
          <h2>VendorCompare</h2>
          <p>Enterprise Edition</p>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/companies" routerLinkActive="active">
            <mat-icon>business</mat-icon>
            <span>Companies</span>
          </a>
          <a mat-list-item routerLink="/vendors" routerLinkActive="active">
            <mat-icon>store</mat-icon>
            <span>Vendors</span>
          </a>
          <a mat-list-item routerLink="/products" routerLinkActive="active">
            <mat-icon>inventory_2</mat-icon>
            <span>Products</span>
          </a>
          <a mat-list-item routerLink="/quotations" routerLinkActive="active">
            <mat-icon>description</mat-icon>
            <span>Quotations</span>
          </a>
          <a mat-list-item routerLink="/compare" routerLinkActive="active">
            <mat-icon>compare_arrows</mat-icon>
            <span>Compare Vendors</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="top-toolbar">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">Vendor Quotation Comparison System</span>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button>
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>
        
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 260px;
      background: #263238;
      color: white;
      border-right: none;
    }

    .logo-section {
      padding: 24px 16px;
      background: #1a2327;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo-section h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #fff;
    }

    .logo-section p {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #90a4ae;
    }

    mat-nav-list {
      padding-top: 16px;
    }

    mat-nav-list a {
      color: #b0bec5;
      display: flex;
      align-items: center;
      gap: 16px;
      height: 48px;
      transition: all 0.2s;
    }

    mat-nav-list a:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }

    mat-nav-list a.active {
      background: #3f51b5;
      color: white;
    }

    mat-nav-list a mat-icon {
      margin-left: 16px;
    }

    .top-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-title {
      font-size: 18px;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 0;
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class LayoutComponent {}
