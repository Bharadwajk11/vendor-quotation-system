import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from quotations.models import Company, Vendor, Product, Quotation
from decimal import Decimal

print("Creating seed data...")

company = Company.objects.create(
    name="Plastic Manufacturing Co.",
    industry_type="Plastic Manufacturing",
    address="Industrial Area, Andhra Pradesh, India",
    contact_email="contact@plasticmfg.com"
)
print(f"Created company: {company.name}")

vendor1 = Vendor.objects.create(
    company=company,
    name="Chennai Polymers Pvt Ltd",
    city="Chennai",
    state="Tamil Nadu",
    rating=4.5,
    contact="+91-9876543210"
)

vendor2 = Vendor.objects.create(
    company=company,
    name="Delhi Resin Suppliers",
    city="Delhi",
    state="Delhi",
    rating=4.2,
    contact="+91-9876543211"
)

vendor3 = Vendor.objects.create(
    company=company,
    name="Mumbai Materials Ltd",
    city="Mumbai",
    state="Maharashtra",
    rating=4.7,
    contact="+91-9876543212"
)
print(f"Created {Vendor.objects.count()} vendors")

product1 = Product.objects.create(
    company=company,
    name="PP Granules",
    category="Raw Material",
    grade_spec="Grade A - High Impact",
    unit_type="kg",
    unit_price=Decimal('100.00'),
    kilo_price=Decimal('100.00')
)

product2 = Product.objects.create(
    company=company,
    name="PVC Resin",
    category="Raw Material",
    grade_spec="Grade B - Standard",
    unit_type="kg",
    unit_price=Decimal('85.00'),
    kilo_price=Decimal('85.00')
)
print(f"Created {Product.objects.count()} products")

Quotation.objects.create(
    vendor=vendor1,
    product=product1,
    product_price=Decimal('120.00'),
    delivery_price=Decimal('30.00'),
    kilo_price=Decimal('120.00'),
    grade_spec="Grade A - High Impact",
    lead_time_days=5
)

Quotation.objects.create(
    vendor=vendor2,
    product=product1,
    product_price=Decimal('90.00'),
    delivery_price=Decimal('80.00'),
    kilo_price=Decimal('90.00'),
    grade_spec="Grade A - High Impact",
    lead_time_days=7
)

Quotation.objects.create(
    vendor=vendor3,
    product=product1,
    product_price=Decimal('110.00'),
    delivery_price=Decimal('50.00'),
    kilo_price=Decimal('110.00'),
    grade_spec="Grade A - High Impact",
    lead_time_days=4
)

Quotation.objects.create(
    vendor=vendor1,
    product=product2,
    product_price=Decimal('88.00'),
    delivery_price=Decimal('25.00'),
    kilo_price=Decimal('88.00'),
    grade_spec="Grade B - Standard",
    lead_time_days=6
)

Quotation.objects.create(
    vendor=vendor2,
    product=product2,
    product_price=Decimal('82.00'),
    delivery_price=Decimal('60.00'),
    kilo_price=Decimal('82.00'),
    grade_spec="Grade B - Standard",
    lead_time_days=8
)

print(f"Created {Quotation.objects.count()} quotations")
print("\nSeed data created successfully!")
print(f"\nSummary:")
print(f"- {Company.objects.count()} company")
print(f"- {Vendor.objects.count()} vendors")
print(f"- {Product.objects.count()} products")
print(f"- {Quotation.objects.count()} quotations")
