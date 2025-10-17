from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from decimal import Decimal
from django.contrib.auth.models import User
from .models import Company, Vendor, Product, Quotation, OrderRequest, ComparisonResult, UserProfile, ProductGroup
from .serializers import (
    CompanySerializer, VendorSerializer, ProductSerializer, 
    QuotationSerializer, OrderRequestSerializer, ComparisonResultSerializer,
    CompareVendorsInputSerializer, UserProfileSerializer, UserWithProfileSerializer, ProductGroupSerializer
)


def get_default_company():
    """Get or create the default company for single-tenant mode."""
    company, created = Company.objects.get_or_create(
        id=1,
        defaults={
            'name': 'My Company',
            'industry_type': 'Manufacturing',
            'address': 'Company Address',
            'contact_email': 'contact@mycompany.com'
        }
    )
    return company


class CompanyViewSet(viewsets.ModelViewSet):
    # Single-tenant mode: Allow updates to the default company but prevent create/delete
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_queryset(self):
        # Return only the default company for single-tenant mode
        return Company.objects.filter(id=1)
    
    def create(self, request, *args, **kwargs):
        # Prevent creation of new companies
        return Response(
            {"error": "Cannot create new companies in single-tenant mode"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    def destroy(self, request, *args, **kwargs):
        # Prevent deletion of the company
        return Response(
            {"error": "Cannot delete company in single-tenant mode"},
            status=status.HTTP_403_FORBIDDEN
        )


class ProductGroupViewSet(viewsets.ModelViewSet):
    queryset = ProductGroup.objects.all()
    serializer_class = ProductGroupSerializer

    def perform_create(self, serializer):
        # Auto-assign default company (force it to prevent override)
        serializer.save(company=get_default_company())

    def perform_update(self, serializer):
        # Force default company on update to prevent override
        serializer.save(company=get_default_company())

    def get_queryset(self):
        # Return all product groups for the default company
        return ProductGroup.objects.filter(company=get_default_company())


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def perform_create(self, serializer):
        # Auto-assign default company (force it to prevent override)
        serializer.save(company=get_default_company())

    def perform_update(self, serializer):
        # Force default company on update to prevent override
        serializer.save(company=get_default_company())

    def get_queryset(self):
        # Return all vendors for the default company
        return Vendor.objects.filter(company=get_default_company())


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        # Auto-assign default company (force it to prevent override)
        serializer.save(company=get_default_company())

    def perform_update(self, serializer):
        # Force default company on update to prevent override
        serializer.save(company=get_default_company())

    def get_queryset(self):
        # Return all products for the default company
        return Product.objects.filter(company=get_default_company())


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer

    def perform_create(self, serializer):
        # Validate vendor and product belong to default company
        vendor = serializer.validated_data.get('vendor')
        product = serializer.validated_data.get('product')
        default_company = get_default_company()
        
        if vendor and vendor.company != default_company:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Vendor must belong to the default company")
        if product and product.company != default_company:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Product must belong to the default company")
        
        serializer.save()

    def perform_update(self, serializer):
        # Validate vendor and product belong to default company
        vendor = serializer.validated_data.get('vendor')
        product = serializer.validated_data.get('product')
        default_company = get_default_company()
        
        if vendor and vendor.company != default_company:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Vendor must belong to the default company")
        if product and product.company != default_company:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Product must belong to the default company")
        
        serializer.save()

    def get_queryset(self):
        # Filter by vendors of the default company
        default_company = get_default_company()
        queryset = Quotation.objects.filter(vendor__company=default_company)
        
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

    def perform_create(self, serializer):
        # Force default company on create
        serializer.save(company=get_default_company())

    def perform_update(self, serializer):
        # Force default company on update to prevent override
        serializer.save(company=get_default_company())

    def get_queryset(self):
        # Return all order requests for the default company
        return OrderRequest.objects.filter(company=get_default_company())


class ComparisonResultViewSet(viewsets.ReadOnlyModelViewSet):
    # Read-only: ComparisonResults are only created by the compare_vendors function
    queryset = ComparisonResult.objects.all()
    serializer_class = ComparisonResultSerializer

    def get_queryset(self):
        # Filter by order requests of the default company
        default_company = get_default_company()
        queryset = ComparisonResult.objects.filter(order_request__company=default_company)
        
        order_request_id = self.request.query_params.get('order_request_id', None)
        
        if order_request_id:
            queryset = queryset.filter(order_request_id=order_request_id)
        
        return queryset


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.select_related('user', 'company').all()
    serializer_class = UserProfileSerializer

    def perform_create(self, serializer):
        # Force default company on create
        serializer.save(company=get_default_company())

    def perform_update(self, serializer):
        # Force default company on update to prevent override
        serializer.save(company=get_default_company())

    def get_queryset(self):
        # Return all user profiles for the default company
        default_company = get_default_company()
        queryset = UserProfile.objects.select_related('user', 'company').filter(company=default_company)
        
        role = self.request.query_params.get('role', None)
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
    
    # Always use default company for single-tenant mode (ignore company_id input)
    company = get_default_company()
    
    try:
        product = Product.objects.get(id=product_id, company=company)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found or does not belong to your company"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Filter quotations to only include those from vendors belonging to the default company
    quotations = Quotation.objects.filter(
        product=product,
        vendor__company=company
    ).select_related('vendor')
    
    if not quotations.exists():
        return Response(
            {"error": "No quotations found for this product from your company's vendors"}, 
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
        
        comparison_results.append({
            'quotation': quotation,
            'total_cost_per_unit': total_cost_per_unit,
            'total_order_cost': total_order_cost,
            'lead_time_days': quotation.lead_time_days,
            'is_interstate': is_interstate,
            'base_delivery_price': base_delivery_price,
            'adjusted_delivery_price': adjusted_delivery_price
        })
    
    # Sort by: 1st Total Landing Price, 2nd Landing Price per kg, 3rd Lead Time
    comparison_results.sort(key=lambda x: (
        float(x['total_order_cost']),      # 1st priority: Total Landing Price (lowest wins)
        float(x['total_cost_per_unit']),   # 2nd priority: Landing Price per kg (lowest wins)
        x['lead_time_days']                # 3rd priority: Lead Time (shortest wins)
    ))
    
    saved_results = []
    response_data = []
    
    for rank, result in enumerate(comparison_results, start=1):
        # Calculate score for historical tracking (lower is better)
        # Priority: Total Landing Price > Landing Price per kg > Lead Time
        score = float(result['total_order_cost']) + float(result['total_cost_per_unit']) + (result['lead_time_days'] * 0.01)
        
        comparison = ComparisonResult.objects.create(
            order_request=order_request,
            vendor=result['quotation'].vendor,
            quotation=result['quotation'],
            total_cost_per_unit=result['total_cost_per_unit'],
            total_order_cost=result['total_order_cost'],
            score=score,
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
