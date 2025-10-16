# Overview

This project is a multi-industry vendor quotation comparison platform, initially tailored for plastic manufacturing but designed for scalability across various industries (e.g., steel, chemicals). Its primary purpose is to enable manufacturing companies to efficiently compare vendor quotes and select optimal suppliers based on critical factors like cost, quality, and delivery. The platform offers comprehensive features including vendor management, product cataloging, quotation entry, and an automated comparison engine with scoring and ranking capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with Angular 20+ using standalone components and Angular Material Design for a professional enterprise UI. It features an enterprise-level modular architecture with a shell layout for navigation, a dashboard with KPI cards and charts (ng2-charts with Chart.js), and CRUD modules for managing companies, vendors, products, and quotations. The compare module provides enhanced vendor analysis with visual ranking and color-coded indicators. State management uses a service-based architecture with RxJS, and routing is handled by Angular Router. All HTTP communication to the backend is managed via `HttpClient` with a proxy configuration. Key design decisions include using standalone components for performance, dialog-based forms for UX, and visual indicators for data presentation.

## Backend Architecture

The backend is developed with Django 5.2+ and Django REST Framework, providing a RESTful API. It uses a ViewSet-based architecture for CRUD operations across all entities and Django ORM for data interaction. Multi-tenancy is supported through the Company model, ensuring data isolation. The system includes a sophisticated business logic layer for vendor comparison, evaluating total cost per unit, delivery pricing (including an interstate surcharge calculation), quality grades, and lead times. A scoring system ranks vendors based on weighted factors. Data models include Company, Vendor, Product, Quotation, OrderRequest, and ComparisonResult.

**Data Models**:
1.  **Company**: Root entity for multi-tenancy.
2.  **Vendor**: Supplier information linked to a company.
3.  **Product**: Material/product catalog.
4.  **Quotation**: Vendor quotes for products.
5.  **OrderRequest**: Purchase order requests.
6.  **ComparisonResult**: Analysis results.

## System Design Choices

-   **UI/UX**: Professional enterprise UI with Angular Material (indigo-pink theme), shell layout, dashboard analytics, and consistent CRUD interfaces. Enhanced comparison views with badges, color-coding, and result highlighting.
-   **Technical Implementations**: Standalone Angular components, service-based state management, Django REST Framework ViewSets, Django ORM.
-   **Feature Specifications**: Automated vendor comparison with a scoring algorithm, multi-tenancy support, dynamic delivery cost calculation (including interstate surcharges), real-time landing price calculation in quotation forms.
-   **Smart Delivery Location**: Automatically applies a 20% interstate shipping surcharge when the vendor's state differs from the delivery location.

# External Dependencies

## Frontend Dependencies

-   **Angular CLI**: Development tooling.
-   **Angular Material & CDK**: UI component library.
-   **ng2-charts + Chart.js**: Data visualization.
-   **RxJS**: Reactive programming.

## Backend Dependencies

-   **Django**: Web framework.
-   **Django REST Framework**: API layer.
-   **django-cors-headers**: CORS support.
-   **psycopg2-binary**: PostgreSQL adapter.

## Database

-   **PostgreSQL**: Primary data store (Replit-managed, configurable via environment variables). SQLite is used for local development.
-   **Django migrations**: For schema management.

## API Integration

-   Frontend proxy (`proxy.conf.json`) routes `/api/*` requests to the Django backend.
-   RESTful endpoints with JSON serialization for all API responses.

# Recent Changes (October 16, 2025)

## Product Groups Feature

**New Module: Product Groups** - Full CRUD operations for organizing products into custom groups/categories:

**Backend Implementation**:
- **ProductGroup Model**: New model with fields: name, description, company (ForeignKey), created_at, updated_at
- **Product Model Update**: Added optional product_group ForeignKey field (SET_NULL on delete)
- **API Endpoints**: `/api/product-groups/` with full CRUD operations (GET, POST, PUT, DELETE)
- **Filtering**: Product groups can be filtered by company_id via query parameter
- **Product Count**: Serializer includes product_count field showing number of products in each group
- **Migration**: quotations.0004_productgroup_product_product_group applied successfully

**Frontend Implementation**:
- **Product Groups Page**: New standalone module at `/product-groups` with table listing all groups
- **Table Columns**: ID, Group Name, Description, Products (count badge), Company, Actions (Edit/Delete)
- **Product Group Form**: Dialog-based form with Company selection, Group Name, and optional Description
- **Dynamic Loading**: Product groups load based on selected company
- **Navigation**: Added "Product Groups" menu item with category icon between Vendors and Products
- **Product Form Enhancement**: Added optional Product Group dropdown that dynamically loads groups when company is selected
- **User Workflow**: Users create product groups first, then assign products to groups during product creation/editing

**Benefits**:
- Better product organization and categorization
- User-defined grouping based on business needs (e.g., "Plastic Resins", "Metal Parts", "Raw Materials")
- Easy filtering and management of products by group
- Scalable structure for multi-company environments

# Recent Changes (October 16, 2025) - Comparison Table Enhancements

## Enhanced Comparison Results Table

**Vendor Comparison Table (10 Columns)**:
1. **Rank** - Vendor position (1, 2, 3...) with 🏆 trophy badge for #1
2. **Vendor Name** - Company name
3. **Place** - City, State with Interstate/Local indicator
4. **Product Price (₹/kg)** - Base product price per kilogram
5. **Delivery Charges (₹)** - Total delivery cost (shows 20% surcharge for interstate)
6. **Total Landing Price (₹)** - Complete order cost: (Product Price × Quantity) + Delivery Charges - **Highlighted in green**
7. **Landing Price (₹/kg)** - Final cost per kg: Total Landing Price ÷ Quantity - **Highlighted in blue**
8. **Kilo Price (₹/kg)** - Original quoted kilo price from vendor
9. **Grade** - Product quality specification
10. **Lead Time** - Delivery days with color-coded chips (Green ≤4 days, Orange 5-6 days, Red ≥7 days)

**Enhanced Table Headers**: Dark blue background (#3f51b5), white bold text, extra padding for visibility

**Intelligent Ranking Algorithm**:
- **1st Priority**: Total Landing Price (₹) - Lowest total order cost wins
- **2nd Priority**: Landing Price (₹/kg) - If Total Landing Price is tied, lowest per-kg cost wins
- **3rd Priority**: Lead Time - If both prices are tied, shortest delivery time wins
- Best vendor gets 🏆 trophy badge and green row highlighting

## Enhanced Quotation Form

**Dual Landing Price Display**:
- **Total Landing Price (₹)**: Shows complete order cost = (Product Price × Quantity) + Delivery Charges
- **Landing Price (₹/kg)**: Shows per-kilogram cost = Total Landing Price ÷ Quantity
- Real-time calculation updates as user enters values
- Both fields are read-only with helpful hint text
- Robust validation using `Number.isFinite()` to prevent NaN display
- **Quantity field**: Now stored in database, properly saves and loads custom quantities (e.g., 60kg, 30kg)
- **Quotations table enhancements**:
  - Shows Quantity (kg) column to display saved quantity values
  - Shows Total Landing Price (₹) column with auto-calculated values: (Product Price × Quantity) + Delivery Charges
  - All table headers use consistent dark blue (#3f51b5) background with white bold text throughout the application
- **Example**: Product Price ₹90/kg, Quantity 30kg, Delivery ₹33 → Total Landing Price ₹2,733, Landing Price ₹91.1/kg