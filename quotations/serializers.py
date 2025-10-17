from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, Vendor, Product, Quotation, OrderRequest, ComparisonResult, UserProfile, ProductGroup


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class ProductGroupSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    product_count = serializers.SerializerMethodField()
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), required=False)
    
    class Meta:
        model = ProductGroup
        fields = '__all__'
    
    def get_product_count(self, obj):
        return obj.products.count()


class VendorSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), required=False)
    
    class Meta:
        model = Vendor
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    product_group_name = serializers.CharField(source='product_group.name', read_only=True)
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), required=False)
    
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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']
        read_only_fields = ['date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)
    full_name = serializers.SerializerMethodField()
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('user',)
    
    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    
    def create(self, validated_data):
        # Extract user-related data
        email = validated_data.pop('email', '')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        password = validated_data.pop('password', None)
        username = self.initial_data.get('username', '')
        
        # Create Django User
        user = User.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        if password:
            user.set_password(password)
            user.save()
        
        # Create UserProfile
        user_profile = UserProfile.objects.create(user=user, **validated_data)
        return user_profile
    
    def update(self, instance, validated_data):
        # Extract user-related data
        email = validated_data.pop('email', None)
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        password = validated_data.pop('password', None)
        
        # Update Django User if fields provided
        if email is not None:
            instance.user.email = email
        if first_name is not None:
            instance.user.first_name = first_name
        if last_name is not None:
            instance.user.last_name = last_name
        if password:
            instance.user.set_password(password)
        instance.user.save()
        
        # Update UserProfile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined', 'profile']
        read_only_fields = ['date_joined']
