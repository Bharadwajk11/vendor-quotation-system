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

  createCompany(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/companies/`, data);
  }

  updateCompany(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/companies/${id}/`, data);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/companies/${id}/`);
  }

  createVendor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/vendors/`, data);
  }

  updateVendor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/vendors/${id}/`, data);
  }

  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vendors/${id}/`);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/`, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}/`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}/`);
  }

  createQuotation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/quotations/`, data);
  }

  updateQuotation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/quotations/${id}/`, data);
  }

  deleteQuotation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/quotations/${id}/`);
  }
}
