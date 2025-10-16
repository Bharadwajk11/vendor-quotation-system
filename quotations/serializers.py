from rest_framework import serializers
from .models import Company, Vendor, Product, Quotation, OrderRequest, ComparisonResult


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class VendorSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Vendor
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'


class QuotationSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    vendor_city = serializers.CharField(source='vendor.city', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Quotation
        fields = '__all__'


class OrderRequestSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = OrderRequest
        fields = '__all__'


class ComparisonResultSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    vendor_city = serializers.CharField(source='vendor.city', read_only=True)
    vendor_state = serializers.CharField(source='vendor.state', read_only=True)
    product_price = serializers.DecimalField(source='quotation.product_price', max_digits=10, decimal_places=2, read_only=True)
    delivery_price = serializers.DecimalField(source='quotation.delivery_price', max_digits=10, decimal_places=2, read_only=True)
    kilo_price = serializers.DecimalField(source='quotation.kilo_price', max_digits=10, decimal_places=2, read_only=True)
    grade_spec = serializers.CharField(source='quotation.grade_spec', read_only=True)
    lead_time_days = serializers.IntegerField(source='quotation.lead_time_days', read_only=True)
    
    class Meta:
        model = ComparisonResult
        fields = '__all__'


class CompareVendorsInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    order_qty = serializers.IntegerField()
    delivery_location = serializers.CharField(max_length=200)
    required_date = serializers.DateField(required=False)
    company_id = serializers.IntegerField(required=False)
