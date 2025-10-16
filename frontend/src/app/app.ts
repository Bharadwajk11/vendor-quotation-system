import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Vendor Quotation Comparison System';
  vendors: any[] = [];
  products: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getVendors().subscribe({
      next: (data) => this.vendors = data.results || data,
      error: (err) => console.error('Error loading vendors:', err)
    });

    this.apiService.getProducts().subscribe({
      next: (data) => this.products = data.results || data,
      error: (err) => console.error('Error loading products:', err)
    });
  }
}
