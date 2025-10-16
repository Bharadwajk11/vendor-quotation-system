from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, VendorViewSet, ProductViewSet, ProductGroupViewSet,
    QuotationViewSet, OrderRequestViewSet, ComparisonResultViewSet,
    UserProfileViewSet, UserViewSet,
    compare_vendors
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'product-groups', ProductGroupViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'products', ProductViewSet)
router.register(r'quotations', QuotationViewSet)
router.register(r'orders', OrderRequestViewSet)
router.register(r'comparison-results', ComparisonResultViewSet)
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('compare/', compare_vendors, name='compare-vendors'),
]
