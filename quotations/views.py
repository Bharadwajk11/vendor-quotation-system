from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from decimal import Decimal
from django.contrib.auth.models import User
from .models import Company, Vendor, Product, Quotation, OrderRequest, ComparisonResult, UserProfile
from .serializers import (
    CompanySerializer, VendorSerializer, ProductSerializer, 
    QuotationSerializer, OrderRequestSerializer, ComparisonResultSerializer,
    CompareVendorsInputSerializer, UserProfileSerializer, UserWithProfileSerializer
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


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.select_related('user', 'company').all()
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        queryset = UserProfile.objects.select_related('user', 'company').all()
        company_id = self.request.query_params.get('company_id', None)
        role = self.request.query_params.get('role', None)
        
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if role:
            queryset = queryset.filter(role=role)
        
        return queryset


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserWithProfileSerializer


def normalize_state(state_str):
    """
    Normalize state name to handle abbreviations and formatting variations.
    Returns lowercase normalized state name for comparison.
    """
    if not state_str:
        return ''
    
    # Common state mappings (Indian states)
    state_mappings = {
        'ap': 'andhra pradesh',
        'ar': 'arunachal pradesh',
        'as': 'assam',
        'br': 'bihar',
        'cg': 'chhattisgarh',
        'ga': 'goa',
        'gj': 'gujarat',
        'hr': 'haryana',
        'hp': 'himachal pradesh',
        'jk': 'jammu and kashmir',
        'jh': 'jharkhand',
        'ka': 'karnataka',
        'kl': 'kerala',
        'mp': 'madhya pradesh',
        'mh': 'maharashtra',
        'mn': 'manipur',
        'ml': 'meghalaya',
        'mz': 'mizoram',
        'nl': 'nagaland',
        'or': 'odisha',
        'pb': 'punjab',
        'rj': 'rajasthan',
        'sk': 'sikkim',
        'tn': 'tamil nadu',
        'tg': 'telangana',
        'tr': 'tripura',
        'up': 'uttar pradesh',
        'uk': 'uttarakhand',
        'wb': 'west bengal',
        'dl': 'delhi',
        'dd': 'daman and diu',
        'dn': 'dadra and nagar haveli',
        'ld': 'lakshadweep',
        'py': 'puducherry',
    }
    
    normalized = state_str.strip().lower()
    
    # If it's an abbreviation, expand it
    if normalized in state_mappings:
        return state_mappings[normalized]
    
    return normalized


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
        base_delivery_price = quotation.delivery_price
        
        # Apply interstate shipping surcharge if vendor is in different state
        vendor_state_normalized = normalize_state(quotation.vendor.state)
        delivery_state_normalized = normalize_state(delivery_location)
        
        # Check if it's interstate delivery (vendor state != delivery state)
        if vendor_state_normalized != delivery_state_normalized:
            # Add 20% interstate shipping surcharge
            adjusted_delivery_price = base_delivery_price * Decimal('1.20')
            is_interstate = True
        else:
            # Local delivery - use base price
            adjusted_delivery_price = base_delivery_price
            is_interstate = False
        
        delivery_per_unit = adjusted_delivery_price / Decimal(order_qty)
        total_cost_per_unit = quotation.product_price + delivery_per_unit
        total_order_cost = total_cost_per_unit * Decimal(order_qty)
        
        # Scoring: lower is better
        cost_score = float(total_cost_per_unit)
        lead_time_score = quotation.lead_time_days * 10
        
        final_score = cost_score + lead_time_score
        
        comparison_results.append({
            'quotation': quotation,
            'total_cost_per_unit': total_cost_per_unit,
            'total_order_cost': total_order_cost,
            'score': final_score,
            'is_interstate': is_interstate,
            'base_delivery_price': base_delivery_price,
            'adjusted_delivery_price': adjusted_delivery_price
        })
    
    comparison_results.sort(key=lambda x: x['score'])
    
    saved_results = []
    response_data = []
    
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
        
        # Add interstate flag to response
        comparison_dict = ComparisonResultSerializer(comparison).data
        comparison_dict['is_interstate'] = result['is_interstate']
        comparison_dict['base_delivery_price'] = str(result['base_delivery_price'])
        comparison_dict['adjusted_delivery_price'] = str(result['adjusted_delivery_price'])
        response_data.append(comparison_dict)
    
    return Response({
        'order_request_id': order_request.id,
        'product_name': product.name,
        'order_qty': order_qty,
        'delivery_location': delivery_location,
        'comparisons': response_data
    })
