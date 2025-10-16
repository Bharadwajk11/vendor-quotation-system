import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/`);
  }

  getVendors(companyId?: number): Observable<any> {
    const url = companyId ? `${this.apiUrl}/vendors/?company_id=${companyId}` : `${this.apiUrl}/vendors/`;
    return this.http.get(url);
  }

  getProducts(companyId?: number): Observable<any> {
    const url = companyId ? `${this.apiUrl}/products/?company_id=${companyId}` : `${this.apiUrl}/products/`;
    return this.http.get(url);
  }

  getQuotations(productId?: number): Observable<any> {
    const url = productId ? `${this.apiUrl}/quotations/?product_id=${productId}` : `${this.apiUrl}/quotations/`;
    return this.http.get(url);
  }

  compareVendors(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/compare/`, data);
  }

  getOrderHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/`);
  }

  getComparisonResults(orderRequestId?: number): Observable<any> {
    const url = orderRequestId ? `${this.apiUrl}/comparison-results/?order_request_id=${orderRequestId}` : `${this.apiUrl}/comparison-results/`;
    return this.http.get(url);
  }
}
