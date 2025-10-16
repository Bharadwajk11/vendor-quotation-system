from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from decimal import Decimal
from .models import Company, Vendor, Product, Quotation, OrderRequest, ComparisonResult
from .serializers import (
    CompanySerializer, VendorSerializer, ProductSerializer, 
    QuotationSerializer, OrderRequestSerializer, ComparisonResultSerializer,
    CompareVendorsInputSerializer
)


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get_queryset(self):
        queryset = Vendor.objects.all()
        company_id = self.request.query_params.get('company_id', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        company_id = self.request.query_params.get('company_id', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer

    def get_queryset(self):
        queryset = Quotation.objects.all()
        product_id = self.request.query_params.get('product_id', None)
        vendor_id = self.request.query_params.get('vendor_id', None)
        
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        if vendor_id:
            queryset = queryset.filter(vendor_id=vendor_id)
        
        return queryset


class OrderRequestViewSet(viewsets.ModelViewSet):
    queryset = OrderRequest.objects.all()
    serializer_class = OrderRequestSerializer


class ComparisonResultViewSet(viewsets.ModelViewSet):
    queryset = ComparisonResult.objects.all()
    serializer_class = ComparisonResultSerializer

    def get_queryset(self):
        queryset = ComparisonResult.objects.all()
        order_request_id = self.request.query_params.get('order_request_id', None)
        
        if order_request_id:
            queryset = queryset.filter(order_request_id=order_request_id)
        
        return queryset


@api_view(['POST'])
def compare_vendors(request):
    """
    Compare vendors for a specific product order.
    
    Input:
    {
        "product_id": 1,
        "order_qty": 100,
        "delivery_location": "Andhra Pradesh",
        "required_date": "2025-12-31",
        "company_id": 1
    }
    
    Output:
    List of vendors with comparison metrics sorted by best value
    """
    
    serializer = CompareVendorsInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    product_id = data['product_id']
    order_qty = data['order_qty']
    delivery_location = data['delivery_location']
    required_date = data.get('required_date', None)
    company_id = data.get('company_id', None)
    
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    if company_id:
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        company = product.company
    
    quotations = Quotation.objects.filter(product=product).select_related('vendor')
    
    if not quotations.exists():
        return Response(
            {"error": "No quotations found for this product"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    order_request = OrderRequest.objects.create(
        company=company,
        product=product,
        order_qty=order_qty,
        delivery_location=delivery_location,
        required_date=required_date or '2025-12-31'
    )
    
    comparison_results = []
    
    for quotation in quotations:
        delivery_per_unit = quotation.delivery_price / Decimal(order_qty)
        total_cost_per_unit = quotation.product_price + delivery_per_unit
        total_order_cost = total_cost_per_unit * Decimal(order_qty)
        
        cost_score = float(total_cost_per_unit)
        lead_time_score = quotation.lead_time_days * 10
        
        final_score = cost_score + lead_time_score
        
        comparison_results.append({
            'quotation': quotation,
            'total_cost_per_unit': total_cost_per_unit,
            'total_order_cost': total_order_cost,
            'score': final_score
        })
    
    comparison_results.sort(key=lambda x: x['score'])
    
    saved_results = []
    for rank, result in enumerate(comparison_results, start=1):
        comparison = ComparisonResult.objects.create(
            order_request=order_request,
            vendor=result['quotation'].vendor,
            quotation=result['quotation'],
            total_cost_per_unit=result['total_cost_per_unit'],
            total_order_cost=result['total_order_cost'],
            score=result['score'],
            rank=rank
        )
        saved_results.append(comparison)
    
    serializer = ComparisonResultSerializer(saved_results, many=True)
    
    return Response({
        'order_request_id': order_request.id,
        'product_name': product.name,
        'order_qty': order_qty,
        'delivery_location': delivery_location,
        'comparisons': serializer.data
    })
