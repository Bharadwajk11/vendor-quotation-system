from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, VendorViewSet, ProductViewSet, 
    QuotationViewSet, OrderRequestViewSet, ComparisonResultViewSet,
    compare_vendors
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'products', ProductViewSet)
router.register(r'quotations', QuotationViewSet)
router.register(r'orders', OrderRequestViewSet)
router.register(r'comparison-results', ComparisonResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('compare/', compare_vendors, name='compare-vendors'),
]
