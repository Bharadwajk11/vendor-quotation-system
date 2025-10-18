#!/usr/bin/env python
"""
Script to renumber all IDs in the database to start from 1 with no gaps.
WARNING: Only use in development! Never run in production!
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vendor_comparison.settings')
django.setup()

from django.db import connection, transaction
from quotations.models import (
    Company, ProductCategory, ProductGroup, Product, 
    Vendor, Quotation, OrderRequest, ComparisonResult, UserProfile
)

def renumber_table(model, order_by='id'):
    """Renumber a table's IDs starting from 1."""
    print(f"\n📋 Renumbering {model.__name__}...")
    
    records = list(model.objects.all().order_by(order_by))
    
    if not records:
        print(f"   ⚠️  No records found, skipping.")
        return {}
    
    # Create mapping of old_id -> new_id
    id_mapping = {}
    for new_id, record in enumerate(records, start=1):
        old_id = record.id
        id_mapping[old_id] = new_id
    
    print(f"   Found {len(records)} records")
    print(f"   Old IDs: {list(id_mapping.keys())}")
    print(f"   New IDs: {list(id_mapping.values())}")
    
    return id_mapping, records

def apply_renumbering():
    """Main function to renumber all tables."""
    
    print("=" * 60)
    print("🔄 RENUMBERING ALL IDS IN DATABASE")
    print("=" * 60)
    
    with transaction.atomic():
        cursor = connection.cursor()
        
        # Disable foreign key constraints (SQLite)
        cursor.execute("PRAGMA foreign_keys = OFF")
        print("\n✅ Foreign key constraints disabled")
        
        try:
            # Step 1: Renumber independent tables
            print("\n" + "=" * 60)
            print("STEP 1: Renumbering Independent Tables")
            print("=" * 60)
            
            company_mapping, companies = renumber_table(Company)
            category_mapping, categories = renumber_table(ProductCategory)
            vendor_mapping, vendors = renumber_table(Vendor)
            user_mapping, users = renumber_table(UserProfile)
            
            # Step 2: Renumber ProductGroup (depends on ProductCategory)
            print("\n" + "=" * 60)
            print("STEP 2: Renumbering ProductGroup")
            print("=" * 60)
            
            group_mapping, groups = renumber_table(ProductGroup)
            
            # Step 3: Renumber Product (depends on ProductGroup)
            print("\n" + "=" * 60)
            print("STEP 3: Renumbering Product")
            print("=" * 60)
            
            product_mapping, products = renumber_table(Product)
            
            # Step 4: Renumber Quotation (depends on Vendor, Product)
            print("\n" + "=" * 60)
            print("STEP 4: Renumbering Quotation")
            print("=" * 60)
            
            quotation_mapping, quotations = renumber_table(Quotation)
            
            # Step 5: Renumber OrderRequest (depends on Product)
            print("\n" + "=" * 60)
            print("STEP 5: Renumbering OrderRequest")
            print("=" * 60)
            
            order_mapping, orders = renumber_table(OrderRequest)
            
            # Step 6: Renumber ComparisonResult (depends on OrderRequest, Vendor, Product)
            print("\n" + "=" * 60)
            print("STEP 6: Renumbering ComparisonResult")
            print("=" * 60)
            
            result_mapping, results = renumber_table(ComparisonResult)
            
            # Now update all IDs using raw SQL
            print("\n" + "=" * 60)
            print("APPLYING ID CHANGES")
            print("=" * 60)
            
            # Update Companies
            if company_mapping:
                print("\n🔧 Updating Company IDs...")
                for old_id, new_id in company_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_company SET id = ? WHERE id = ?",
                        [-new_id, old_id]  # Use negative to avoid conflicts
                    )
                # Fix negatives
                for old_id, new_id in company_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_company SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                print(f"   ✅ Updated {len(company_mapping)} companies")
            
            # Update ProductCategory
            if category_mapping:
                print("\n🔧 Updating ProductCategory IDs...")
                for old_id, new_id in category_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_productcategory SET id = ? WHERE id = ?",
                        [-new_id, old_id]
                    )
                for old_id, new_id in category_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_productcategory SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                print(f"   ✅ Updated {len(category_mapping)} categories")
            
            # Update ProductGroup and its foreign keys
            if group_mapping:
                print("\n🔧 Updating ProductGroup IDs...")
                for old_id, new_id in group_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_productgroup SET id = ? WHERE id = ?",
                        [-new_id, old_id]
                    )
                for old_id, new_id in group_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_productgroup SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                # Update category_id foreign keys
                if category_mapping:
                    for old_id, new_id in category_mapping.items():
                        cursor.execute(
                            "UPDATE quotations_productgroup SET category_id = ? WHERE category_id = ?",
                            [new_id, old_id]
                        )
                print(f"   ✅ Updated {len(group_mapping)} product groups")
            
            # Update Vendor
            if vendor_mapping:
                print("\n🔧 Updating Vendor IDs...")
                for old_id, new_id in vendor_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_vendor SET id = ? WHERE id = ?",
                        [-new_id, old_id]
                    )
                for old_id, new_id in vendor_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_vendor SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                print(f"   ✅ Updated {len(vendor_mapping)} vendors")
            
            # Update Product and its foreign keys
            if product_mapping:
                print("\n🔧 Updating Product IDs...")
                for old_id, new_id in product_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_product SET id = ? WHERE id = ?",
                        [-new_id, old_id]
                    )
                for old_id, new_id in product_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_product SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                # Update group_id foreign keys
                if group_mapping:
                    for old_id, new_id in group_mapping.items():
                        cursor.execute(
                            "UPDATE quotations_product SET group_id = ? WHERE group_id = ?",
                            [new_id, old_id]
                        )
                print(f"   ✅ Updated {len(product_mapping)} products")
            
            # Update Quotation and its foreign keys
            if quotation_mapping:
                print("\n🔧 Updating Quotation IDs...")
                for old_id, new_id in quotation_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_quotation SET id = ? WHERE id = ?",
                        [-new_id, old_id]
                    )
                for old_id, new_id in quotation_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_quotation SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                # Update vendor_id and product_id foreign keys
                if vendor_mapping:
                    for old_id, new_id in vendor_mapping.items():
                        cursor.execute(
                            "UPDATE quotations_quotation SET vendor_id = ? WHERE vendor_id = ?",
                            [new_id, old_id]
                        )
                if product_mapping:
                    for old_id, new_id in product_mapping.items():
                        cursor.execute(
                            "UPDATE quotations_quotation SET product_id = ? WHERE product_id = ?",
                            [new_id, old_id]
                        )
                print(f"   ✅ Updated {len(quotation_mapping)} quotations")
            
            # Update OrderRequest and its foreign keys
            if order_mapping:
                print("\n🔧 Updating OrderRequest IDs...")
                for old_id, new_id in order_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_orderrequest SET id = ? WHERE id = ?",
                        [-new_id, old_id]
                    )
                for old_id, new_id in order_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_orderrequest SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                # Update product_id foreign key
                if product_mapping:
                    for old_id, new_id in product_mapping.items():
                        cursor.execute(
                            "UPDATE quotations_orderrequest SET product_id = ? WHERE product_id = ?",
                            [new_id, old_id]
                        )
                print(f"   ✅ Updated {len(order_mapping)} order requests")
            
            # Update ComparisonResult and its foreign keys
            if result_mapping:
                print("\n🔧 Updating ComparisonResult IDs...")
                for old_id, new_id in result_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_comparisonresult SET id = ? WHERE id = ?",
                        [-new_id, old_id]
                    )
                for old_id, new_id in result_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_comparisonresult SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                # Update foreign keys
                if order_mapping:
                    for old_id, new_id in order_mapping.items():
                        cursor.execute(
                            "UPDATE quotations_comparisonresult SET order_request_id = ? WHERE order_request_id = ?",
                            [new_id, old_id]
                        )
                if vendor_mapping:
                    for old_id, new_id in vendor_mapping.items():
                        cursor.execute(
                            "UPDATE quotations_comparisonresult SET vendor_id = ? WHERE vendor_id = ?",
                            [new_id, old_id]
                        )
                if product_mapping:
                    for old_id, new_id in product_mapping.items():
                        cursor.execute(
                            "UPDATE quotations_comparisonresult SET product_id = ? WHERE product_id = ?",
                            [new_id, old_id]
                        )
                print(f"   ✅ Updated {len(result_mapping)} comparison results")
            
            # Update UserProfile
            if user_mapping:
                print("\n🔧 Updating UserProfile IDs...")
                for old_id, new_id in user_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_userprofile SET id = ? WHERE id = ?",
                        [-new_id, old_id]
                    )
                for old_id, new_id in user_mapping.items():
                    cursor.execute(
                        "UPDATE quotations_userprofile SET id = ? WHERE id = ?",
                        [new_id, -new_id]
                    )
                print(f"   ✅ Updated {len(user_mapping)} user profiles")
            
            # Reset sequences
            print("\n" + "=" * 60)
            print("RESETTING SEQUENCES")
            print("=" * 60)
            
            tables = [
                ('quotations_company', len(companies) if companies else 0),
                ('quotations_productcategory', len(categories) if categories else 0),
                ('quotations_productgroup', len(groups) if groups else 0),
                ('quotations_product', len(products) if products else 0),
                ('quotations_vendor', len(vendors) if vendors else 0),
                ('quotations_quotation', len(quotations) if quotations else 0),
                ('quotations_orderrequest', len(orders) if orders else 0),
                ('quotations_comparisonresult', len(results) if results else 0),
                ('quotations_userprofile', len(users) if users else 0),
            ]
            
            for table_name, max_id in tables:
                cursor.execute(
                    f"UPDATE sqlite_sequence SET seq = {max_id} WHERE name = '{table_name}'"
                )
                print(f"   ✅ {table_name}: sequence set to {max_id}")
            
        finally:
            # Re-enable foreign key constraints
            cursor.execute("PRAGMA foreign_keys = ON")
            print("\n✅ Foreign key constraints re-enabled")
    
    print("\n" + "=" * 60)
    print("✅ RENUMBERING COMPLETE!")
    print("=" * 60)
    print("\nAll IDs have been renumbered to start from 1 with no gaps.")
    print("New records will continue from the next sequential number.")

if __name__ == '__main__':
    apply_renumbering()
