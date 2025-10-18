import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    BaseChartDirective
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Overview of your vendor quotation system</p>
      </div>

      <mat-card class="quick-actions">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="action-buttons">
            <button mat-raised-button color="primary" routerLink="/vendors">
              <mat-icon>add</mat-icon>
              Add Vendor
            </button>
            <button mat-raised-button color="primary" routerLink="/products">
              <mat-icon>add</mat-icon>
              Add Product
            </button>
            <button mat-raised-button color="primary" routerLink="/quotations">
              <mat-icon>add</mat-icon>
              Add Quotation
            </button>
            <button mat-raised-button color="accent" routerLink="/compare">
              <mat-icon>compare_arrows</mat-icon>
              Compare Vendors
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Companies</h3>
          <div class="value">{{ stats.companies }}</div>
          <button mat-button color="primary" routerLink="/companies">View All</button>
        </div>
        <div class="stat-card">
          <h3>Total Vendors</h3>
          <div class="value">{{ stats.vendors }}</div>
          <button mat-button color="primary" routerLink="/vendors">View All</button>
        </div>
        <div class="stat-card">
          <h3>Total Products</h3>
          <div class="value">{{ stats.products }}</div>
          <button mat-button color="primary" routerLink="/products">View All</button>
        </div>
        <div class="stat-card">
          <h3>Total Quotations</h3>
          <div class="value">{{ stats.quotations }}</div>
          <button mat-button color="primary" routerLink="/quotations">View All</button>
        </div>
      </div>

      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="barChartData"
              [options]="barChartOptions"
              [type]="'bar'">
            </canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Vendor Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="pieChartData"
              [options]="pieChartOptions"
              [type]="'doughnut'">
            </canvas>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .chart-card {
      padding: 20px;
    }

    .quick-actions {
      padding: 20px;
      margin-bottom: 24px;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    companies: 0,
    vendors: 0,
    products: 0,
    quotations: 0
  };

  barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Quotations', backgroundColor: '#3f51b5' }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ffc107', '#e91e63']
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
    this.loadVendorDistribution();
    this.loadRecentActivity();
  }

  loadStats() {
    this.apiService.getCompanies().subscribe({
      next: (data) => this.stats.companies = data.count || data.results?.length || data.length || 0
    });
    
    this.apiService.getVendors().subscribe({
      next: (data) => this.stats.vendors = data.count || data.results?.length || data.length || 0
    });
    
    this.apiService.getProducts().subscribe({
      next: (data) => this.stats.products = data.count || data.results?.length || data.length || 0
    });
    
    this.apiService.getQuotations().subscribe({
      next: (data) => this.stats.quotations = data.count || data.results?.length || data.length || 0
    });
  }

  loadVendorDistribution() {
    this.apiService.getVendors().subscribe({
      next: (data) => {
        const vendors = data.results || data;
        
        // Group vendors by city
        const cityCount: { [key: string]: number } = {};
        vendors.forEach((vendor: any) => {
          const city = vendor.city || 'Unknown';
          cityCount[city] = (cityCount[city] || 0) + 1;
        });

        // Convert to chart data
        const cities = Object.keys(cityCount);
        const counts = Object.values(cityCount);

        this.pieChartData = {
          labels: cities,
          datasets: [{
            data: counts,
            backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ffc107', '#e91e63']
          }]
        };
      },
      error: (err: any) => console.error('Error loading vendor distribution:', err)
    });
  }

  loadRecentActivity() {
    this.apiService.getQuotations().subscribe({
      next: (data) => {
        const quotations = data.results || data;
        
        // Group quotations by month
        const monthCount: { [key: string]: number } = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        quotations.forEach((quotation: any) => {
          if (quotation.created_at) {
            const date = new Date(quotation.created_at);
            const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            monthCount[monthYear] = (monthCount[monthYear] || 0) + 1;
          }
        });

        // Sort by date and get last 6 months
        const sortedMonths = Object.keys(monthCount).sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        }).slice(-6);

        const counts = sortedMonths.map(month => monthCount[month]);

        this.barChartData = {
          labels: sortedMonths,
          datasets: [
            { data: counts, label: 'Quotations', backgroundColor: '#3f51b5' }
          ]
        };
      },
      error: (err: any) => console.error('Error loading recent activity:', err)
    });
  }
}
