from django.contrib import admin
from .models import Company, Vendor, Product, Quotation, OrderRequest, ComparisonResult


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry_type', 'contact_email', 'created_at']
    search_fields = ['name', 'industry_type']
    list_filter = ['industry_type', 'created_at']


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'state', 'rating', 'company', 'created_at']
    search_fields = ['name', 'city', 'state']
    list_filter = ['state', 'city', 'created_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'grade_spec', 'unit_type', 'unit_price', 'company']
    search_fields = ['name', 'category', 'grade_spec']
    list_filter = ['category', 'unit_type', 'created_at']


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'product', 'product_price', 'delivery_price', 'lead_time_days', 'created_at']
    search_fields = ['vendor__name', 'product__name']
    list_filter = ['created_at']


@admin.register(OrderRequest)
class OrderRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'order_qty', 'delivery_location', 'required_date', 'created_at']
    search_fields = ['product__name', 'delivery_location']
    list_filter = ['required_date', 'created_at']


@admin.register(ComparisonResult)
class ComparisonResultAdmin(admin.ModelAdmin):
    list_display = ['order_request', 'vendor', 'rank', 'total_cost_per_unit', 'total_order_cost', 'score']
    search_fields = ['vendor__name']
    list_filter = ['rank', 'created_at']
