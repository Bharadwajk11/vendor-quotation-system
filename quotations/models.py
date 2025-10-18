from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('user', 'User'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    phone = models.CharField(max_length=20, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    company = models.ForeignKey('Company', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.role})"


class Company(models.Model):
    name = models.CharField(max_length=200)
    industry_type = models.CharField(max_length=100)
    address = models.TextField()
    contact_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Vendor(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='vendors')
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    rating = models.FloatField(null=True, blank=True)
    contact = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.city}"


class ProductGroup(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='product_groups')
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Product Groups"

    def __str__(self):
        return self.name


class ProductCategory(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='product_categories')
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Product Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='products')
    product_group = models.ForeignKey(ProductGroup, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    product_category = models.ForeignKey(ProductCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, null=True, blank=True)
    grade_spec = models.CharField(max_length=200)
    unit_type = models.CharField(max_length=50)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    kilo_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.grade_spec})"


class Quotation(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='quotations')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='quotations')
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(null=True, blank=True)
    delivery_price = models.DecimalField(max_digits=10, decimal_places=2)
    kilo_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    grade_spec = models.CharField(max_length=200)
    lead_time_days = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.vendor.name} - {self.product.name} - ₹{self.product_price}"


class OrderRequest(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='order_requests')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_requests')
    order_qty = models.IntegerField()
    delivery_location = models.CharField(max_length=200)
    required_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.id} - {self.product.name} x {self.order_qty}"


class ComparisonResult(models.Model):
    order_request = models.ForeignKey(OrderRequest, on_delete=models.CASCADE, related_name='comparison_results')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='comparison_results')
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='comparison_results')
    total_cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_order_cost = models.DecimalField(max_digits=12, decimal_places=2)
    score = models.FloatField()
    rank = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['rank']

    def __str__(self):
        return f"Rank {self.rank}: {self.vendor.name} - ₹{self.total_order_cost}"
