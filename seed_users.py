import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from quotations.models import UserProfile, Company

# Get or create the company
company = Company.objects.first()
if not company:
    company = Company.objects.create(
        name="Plastic Manufacturing Co.",
        industry_type="Plastic Manufacturing",
        address="123 Industrial Area, Mumbai",
        contact_email="contact@plasticmfg.com"
    )

# Create admin user
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@vendorcompare.com',
        'first_name': 'System',
        'last_name': 'Administrator',
        'is_staff': True,
        'is_superuser': True
    }
)
if created:
    admin_user.set_password('admin123')
    admin_user.save()
    UserProfile.objects.create(
        user=admin_user,
        role='admin',
        department='IT',
        phone='+91-9876543210',
        company=company,
        is_active=True
    )
    print(f"Created admin user: {admin_user.username}")
else:
    print(f"Admin user already exists: {admin_user.username}")

# Create manager user
manager_user, created = User.objects.get_or_create(
    username='john_manager',
    defaults={
        'email': 'john@plasticmfg.com',
        'first_name': 'John',
        'last_name': 'Smith'
    }
)
if created:
    manager_user.set_password('manager123')
    manager_user.save()
    UserProfile.objects.create(
        user=manager_user,
        role='manager',
        department='Procurement',
        phone='+91-9876543211',
        company=company,
        is_active=True
    )
    print(f"Created manager user: {manager_user.username}")
else:
    print(f"Manager user already exists: {manager_user.username}")

# Create regular user
regular_user, created = User.objects.get_or_create(
    username='sarah_user',
    defaults={
        'email': 'sarah@plasticmfg.com',
        'first_name': 'Sarah',
        'last_name': 'Johnson'
    }
)
if created:
    regular_user.set_password('user123')
    regular_user.save()
    UserProfile.objects.create(
        user=regular_user,
        role='user',
        department='Operations',
        phone='+91-9876543212',
        company=company,
        is_active=True
    )
    print(f"Created regular user: {regular_user.username}")
else:
    print(f"Regular user already exists: {regular_user.username}")

print("\n=== User Profiles Created ===")
print("1. Admin User - username: admin, password: admin123, role: Administrator")
print("2. Manager User - username: john_manager, password: manager123, role: Manager")
print("3. Regular User - username: sarah_user, password: user123, role: User")
print("\nAll users are active and ready to use!")
