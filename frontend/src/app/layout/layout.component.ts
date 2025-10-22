import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';

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
    MatButtonModule,
    LoadingSpinnerComponent
  ],
  template: `
    <app-loading-spinner></app-loading-spinner>
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav [mode]="isMobile ? 'over' : 'side'" [opened]="!isMobile" class="sidenav">
        <div class="logo-section">
          <div class="logo-container">
            <img src="assets/logo.png" alt="VendorCompare Logo" class="logo-image">
            <div class="logo-text">
              <h2>VendorCompare</h2>
              <p>Enterprise Edition</p>
            </div>
          </div>
        </div>
        
        <nav class="nav-menu">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a routerLink="/companies" routerLinkActive="active" class="nav-link">
            <mat-icon>business</mat-icon>
            <span>Companies</span>
          </a>
          <a routerLink="/vendors" routerLinkActive="active" class="nav-link">
            <mat-icon>store</mat-icon>
            <span>Vendors</span>
          </a>
          <a routerLink="/products" routerLinkActive="active" class="nav-link">
            <mat-icon>inventory_2</mat-icon>
            <span>Products</span>
          </a>
          <a routerLink="/quotations" routerLinkActive="active" class="nav-link">
            <mat-icon>description</mat-icon>
            <span>Quotations</span>
          </a>
          <a routerLink="/users" routerLinkActive="active" class="nav-link">
            <mat-icon>people</mat-icon>
            <span>User Management</span>
          </a>
          <a routerLink="/compare" routerLinkActive="active" class="nav-link">
            <mat-icon>compare_arrows</mat-icon>
            <span>Compare Vendors</span>
          </a>
        </nav>
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
      padding: 20px 16px;
      background: linear-gradient(135deg, #1a2327 0%, #263238 100%);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-image {
      width: 48px;
      height: 48px;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      flex-shrink: 0;
    }

    .logo-text {
      flex: 1;
      min-width: 0;
    }

    .logo-section h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #fff;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .logo-section p {
      margin: 4px 0 0 0;
      font-size: 11px;
      color: #90a4ae;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .nav-menu {
      padding-top: 16px;
      display: flex;
      flex-direction: column;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: #b0bec5;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-link mat-icon {
      margin-right: 16px;
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }

    .nav-link span {
      font-size: 14px;
      white-space: nowrap;
    }

    .nav-link:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }

    .nav-link.active {
      background: #3f51b5;
      color: white;
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

    @media (max-width: 959px) {
      .sidenav {
        width: 220px;
      }

      .toolbar-title {
        font-size: 14px;
      }

      .logo-image {
        width: 42px;
        height: 42px;
      }

      .logo-section h2 {
        font-size: 18px;
      }

      .logo-section p {
        font-size: 10px;
      }

      .nav-link {
        padding: 10px 12px;
      }

      .nav-link mat-icon {
        margin-right: 12px;
        font-size: 18px;
      }

      .nav-link span {
        font-size: 13px;
      }
    }

    @media (max-width: 599px) {
      .sidenav {
        width: 200px;
      }

      .logo-section {
        padding: 16px 12px;
      }

      .logo-container {
        gap: 10px;
      }

      .logo-image {
        width: 36px;
        height: 36px;
      }

      .logo-section h2 {
        font-size: 16px;
      }

      .logo-section p {
        font-size: 9px;
      }

      .toolbar-title {
        display: none;
      }

      .top-toolbar {
        padding: 0 8px;
      }
    }
  `]
})
export class LayoutComponent {
  isMobile: boolean = false;

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 960;
  }
}
