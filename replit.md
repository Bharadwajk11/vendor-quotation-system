# Overview

This is a multi-industry vendor quotation comparison platform designed to help manufacturing companies compare vendor quotes and select optimal suppliers based on cost, quality, delivery, and other factors. The initial client is a plastic manufacturing company, but the architecture supports expansion to any industry (steel, chemicals, food, etc.).

The application provides vendor management, product cataloging, quotation entry, and automated comparison with scoring/ranking capabilities. It uses a full-stack architecture with Angular frontend, Django REST Framework backend, and PostgreSQL database (Replit-managed).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: Angular 20+ with standalone components
- **Component Structure**: Uses modern Angular standalone components (no traditional NgModules)
- **State Management**: Service-based architecture with RxJS observables
- **Routing**: Angular Router with lazy-loaded components
- **HTTP Communication**: HttpClient with proxy configuration to backend API
- **UI Framework**: Angular Material for consistent UI components

**Key Design Decisions**:
- Standalone components for better tree-shaking and reduced bundle size
- Proxy configuration (`proxy.conf.json`) routes `/api` requests to Django backend on port 8000
- Separation of concerns with dedicated `ApiService` for all HTTP operations
- Comparison component handles vendor quotation comparison logic

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
- Angular Material & CDK - UI component library
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

**Completed Features**:
- ✅ Full Django REST backend with 6 data models (Company, Vendor, Product, Quotation, OrderRequest, ComparisonResult)
- ✅ PostgreSQL database with migrations and seed data (3 vendors, 2 products, 5 quotations)
- ✅ Complete API endpoints for CRUD operations on all entities
- ✅ Vendor comparison engine with cost calculation and scoring algorithm
- ✅ Angular 20 frontend with standalone components
- ✅ Compare component with form, API integration, and results table
- ✅ Proxy configuration for seamless frontend-backend communication in Replit environment
- ✅ Both workflows running successfully (Backend on port 8000, Frontend on port 5000)

**Key Files**:
- Backend: `quotations/models.py`, `quotations/views.py`, `quotations/serializers.py`, `backend/settings.py`
- Frontend: `frontend/src/app/components/compare/`, `frontend/src/app/services/api.service.ts`, `frontend/proxy.conf.json`
- Data: `seed_data.py` for test data population

**Testing the App**:
1. The app automatically loads with the Compare Vendors page
2. Select a product from the dropdown (PP Granules or PVC Resin)
3. Enter order quantity (e.g., 100)
4. Enter delivery location (e.g., "Andhra Pradesh")
5. Click "Compare Vendors" to see ranked results
6. Best vendor is highlighted in green with lowest total cost

**API Endpoints** (accessible at http://localhost:8000/api/ or via frontend proxy at /api/):
- `GET /api/companies/` - List all companies
- `GET /api/vendors/` - List all vendors (supports ?company_id= filter)
- `GET /api/products/` - List all products (supports ?company_id= filter)
- `GET /api/quotations/` - List all quotations (supports ?product_id= and ?vendor_id= filters)
- `POST /api/compare/` - Compare vendors for a product order
- `GET /api/orders/` - List order requests
- `GET /api/comparison-results/` - List comparison results (supports ?order_request_id= filter)