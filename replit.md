# Overview

This is a multi-industry vendor quotation comparison platform designed to help manufacturing companies compare vendor quotes and select optimal suppliers based on cost, quality, delivery, and other factors. The initial client is a plastic manufacturing company, but the architecture supports expansion to any industry (steel, chemicals, food, etc.).

The application provides vendor management, product cataloging, quotation entry, and automated comparison with scoring/ranking capabilities. It uses a full-stack architecture with Angular frontend, Django REST Framework backend, and PostgreSQL database (Replit-managed).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: Angular 20+ with standalone components and Angular Material Design
- **Component Structure**: Enterprise-level modular architecture with standalone components
- **UI Framework**: Angular Material (indigo-pink theme) for professional enterprise UI
- **Charts**: ng2-charts with Chart.js for data visualization (bar charts, doughnut charts)
- **State Management**: Service-based architecture with RxJS observables
- **Routing**: Angular Router with shell layout and child routes for all modules
- **HTTP Communication**: HttpClient with proxy configuration to backend API

**Enterprise UI Architecture**:
- **Shell Layout**: Professional sidebar navigation (VendorCompare Enterprise Edition) with persistent menu and top toolbar
- **Dashboard Module**: KPI cards (companies, vendors, products, quotations count) + interactive charts (recent activity bar chart, vendor distribution pie chart)
- **CRUD Modules**: Complete Material Design tables and dialog forms for Companies, Vendors, Products, and Quotations
- **Compare Module**: Enhanced vendor comparison with Material cards, ranking badges, color-coded lead times, and result highlighting
- **Responsive Design**: Material sidenav/toolbar system for desktop and mobile compatibility

**Key Design Decisions**:
- Standalone components for better tree-shaking and reduced bundle size
- Proxy configuration (`proxy.conf.json`) routes `/api` requests to Django backend on port 8000
- Separation of concerns with dedicated `ApiService` for all HTTP/CRUD operations
- Dialog-based forms (MatDialog) for add/edit operations to maintain clean UX
- Color-coded visual indicators (rating badges, lead time chips, rank highlighting)

## Backend Architecture

**Technology Stack**: Django 5.2+ with Django REST Framework
- **API Design**: RESTful API using ViewSets and DefaultRouter
- **Data Layer**: Django ORM with model-based database schema
- **Authentication**: Django's built-in authentication (extendable for JWT/OAuth)
- **CORS Handling**: `django-cors-headers` middleware for cross-origin requests

**Key Design Decisions**:
- ViewSet-based architecture for CRUD operations on all entities (Company, Vendor, Product, Quotation)
- Multi-tenancy support through Company model - each company has isolated vendors, products, and quotations
- Filtering capabilities through query parameters (e.g., `?company_id=1` to filter by company)
- Dedicated comparison endpoint (`/api/compare/`) for vendor analysis

**Data Models**:
1. **Company**: Root entity for multi-tenancy (name, industry_type, address, contact_email)
2. **Vendor**: Supplier information linked to company (name, city, state, rating, contact)
3. **Product**: Material/product catalog (name, category, grade_spec, unit_type, pricing)
4. **Quotation**: Vendor quotes for products (product_price, delivery_price, lead_time, kilo_price)
5. **OrderRequest**: Purchase order requests (product, quantity, location, required_date)
6. **ComparisonResult**: Analysis results (vendor ranking, costs, scores)

**Business Logic**:
- Vendor comparison algorithm evaluates total cost per unit, delivery pricing, quality grades, and lead times
- Scoring system ranks vendors based on multiple weighted factors
- Results stored in ComparisonResult model for historical tracking

## External Dependencies

**Frontend Dependencies**:
- Angular CLI (20.3.6) - Development tooling
- Angular Material & CDK - Enterprise UI component library (tables, forms, dialogs, cards, chips, buttons, icons)
- ng2-charts + Chart.js - Data visualization library for dashboard charts
- RxJS (7.8.0) - Reactive programming
- Zone.js (0.15.0) - Change detection

**Backend Dependencies**:
- Django (5.2.7) - Web framework
- Django REST Framework (3.16.1) - API layer
- django-cors-headers (4.9.0) - CORS support
- psycopg2-binary (2.9.11) - PostgreSQL adapter

**Database**:
- PostgreSQL (Replit-managed) - Primary data store with environment-based configuration
- Django migrations for schema management
- Supports multi-company data isolation through foreign key relationships
- Database credentials managed via environment variables (PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT)

**Development Tools**:
- Angular Dev Server with proxy for local development
- Django development server on port 8000
- Seed data script (`seed_data.py`) for initial data population

**API Integration Pattern**:
- Frontend proxy (`proxy.conf.json`) passes `/api/*` requests to Django backend on port 8000
- Angular dev server on port 5000 serves the UI
- RESTful endpoints with consistent URL structure
- Query parameter filtering for related data
- JSON serialization for all API responses

## Recent Implementation (October 2025)

**✅ COMPLETED: Enterprise-Level UI Transformation**
The application has been transformed from a basic single-page app into a professional, multi-module enterprise system with complete CRUD functionality and professional UI/UX.

**Enterprise UI Features** (Similar to Alibaba/Microsoft/SAP):
- ✅ **Professional Shell Layout**: Dark sidebar navigation with VendorCompare branding, persistent menu, and top toolbar
- ✅ **Dashboard Analytics**: 
  - KPI cards showing real-time counts (1 Company, 3 Vendors, 2 Products, Quotations)
  - Bar chart for Recent Activity (monthly trends)
  - Doughnut chart for Vendor Distribution by location
  - Quick action buttons for rapid access to key functions
- ✅ **Complete CRUD Modules**:
  - **Companies**: Material table with add/edit/delete, industry dropdown, email validation
  - **Vendors**: Table with color-coded rating badges (green 4.5+, orange 3.5-4.5, red <3.5), edit/delete actions
  - **Products**: Table with category chips, grade specifications, unit pricing display
  - **Quotations**: Comprehensive table with vendor/product lookups, pricing breakdown, lead time management
- ✅ **Enhanced Compare Module**: Material cards, ranking badges (🏆 for #1), color-coded lead time chips (green ≤4 days, orange 5-6 days, red ≥7 days), highlighted best vendor row
- ✅ **Navigation System**: Full routing between all 6 modules (Dashboard, Companies, Vendors, Products, Quotations, Compare)

**Backend Features**:
- ✅ Full Django REST backend with 6 data models (Company, Vendor, Product, Quotation, OrderRequest, ComparisonResult)
- ✅ PostgreSQL database with migrations and seed data (3 vendors, 2 products, quotations)
- ✅ Complete RESTful API with CRUD endpoints for all entities
- ✅ Vendor comparison engine with cost calculation and multi-factor scoring algorithm

**Key Frontend Files**:
- Layout/Shell: `frontend/src/app/layout/layout.component.ts`
- Dashboard: `frontend/src/app/dashboard/dashboard.component.ts`
- CRUD Modules: `frontend/src/app/{companies,vendors,products,quotations}/`
- Compare: `frontend/src/app/components/compare/compare.component.ts`
- API Service: `frontend/src/app/services/api.service.ts` (all CRUD methods)
- Routing: `frontend/src/app/app.routes.ts`
- Theming: `frontend/src/styles.css` (Material indigo-pink theme)

**Key Backend Files**:
- Models: `quotations/models.py`
- API Views: `quotations/views.py`
- Serializers: `quotations/serializers.py`
- Settings: `backend/settings.py`
- Seed Data: `seed_data.py`

**Using the Application**:

1. **Dashboard** (Default landing page):
   - View KPI cards showing total counts
   - Analyze charts for trends and distribution
   - Click "View All" buttons to navigate to specific modules
   - Use quick action buttons for rapid data entry

2. **Companies Module**:
   - Click "Add Company" to create new client companies
   - View/edit company details (name, industry, address, email)
   - Delete companies (cascades to related data)

3. **Vendors Module**:
   - Click "Add Vendor" to register new suppliers
   - View vendor ratings with color-coded badges
   - Edit vendor information (city, state, contact, rating)
   - Delete vendors as needed

4. **Products Module**:
   - Click "Add Product" to create product catalog
   - Set category, grade/specification, unit type, pricing
   - View products with category badges
   - Edit/delete products

5. **Quotations Module**:
   - Click "Add Quotation" to enter vendor quotes
   - Select vendor and product from dropdowns
   - Enter product price, delivery price, lead time, grade
   - View comprehensive quotation table

6. **Compare Vendors**:
   - Select product from dropdown
   - Enter order quantity
   - Enter delivery location
   - Click "Compare Vendors"
   - View ranked results with #1 highlighted in green
   - See color-coded lead times and total cost breakdown

**API Endpoints** (accessible at http://localhost:8000/api/ or via frontend proxy at /api/):
- Companies: GET, POST, PUT, DELETE `/api/companies/` and `/api/companies/{id}/`
- Vendors: GET, POST, PUT, DELETE `/api/vendors/` and `/api/vendors/{id}/`
- Products: GET, POST, PUT, DELETE `/api/products/` and `/api/products/{id}/`
- Quotations: GET, POST, PUT, DELETE `/api/quotations/` and `/api/quotations/{id}/`
- Compare: POST `/api/compare/` - Vendor comparison with ranking
- Orders: GET `/api/orders/` - Order request history
- Results: GET `/api/comparison-results/` - Comparison analysis history