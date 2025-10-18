# Overview

This project is a single-tenant vendor quotation comparison platform for manufacturing companies, initially focused on plastic manufacturing. Its purpose is to help manufacturers compare vendor quotes efficiently and select optimal suppliers based on cost, quality, and delivery. The platform includes vendor management, product cataloging with categories and groups, quotation entry with inline CRUD operations, and an automated comparison engine with scoring and ranking capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses Angular 20+ with standalone components and Angular Material Design for an enterprise UI. It features a modular architecture with a shell layout, a dashboard with KPI cards and charts (ng2-charts with Chart.js), and CRUD modules for managing entities. State management is service-based with RxJS, and routing is handled by Angular Router. HTTP communication uses `HttpClient` with a proxy. Key design choices include standalone components for performance, dialog-based forms, and visual indicators for data presentation. Inline management for product groups within product forms simplifies the user workflow.

## Backend Architecture

The backend is built with Django 5.2+ and Django REST Framework, offering a RESTful API. It uses a ViewSet-based architecture for CRUD operations and Django ORM for data interaction. The system includes business logic for vendor comparison, evaluating total cost per unit, delivery pricing (including interstate surcharge), quality grades, and lead times, with a weighted scoring system for ranking. Data models include Company (with state field for automatic delivery location), Vendor, Product, ProductGroup, Quotation, OrderRequest, and ComparisonResult. The architecture is single-tenant, with all data automatically associated with a default company.

## System Design Choices

-   **UI/UX**: Professional enterprise UI with Angular Material (indigo-pink theme), shell layout, dashboard analytics, and consistent CRUD interfaces. Enhanced comparison views use badges, color-coding, and result highlighting. Quotation forms display real-time calculated Total Landing Price and Landing Price per kg. Inline CRUD operations allow adding/editing/deleting related entities (vendors, products, product groups, product categories) directly from forms without navigation. Quotations list includes advanced filtering by Vendor, Product, and Product Group with filter state persistence across CRUD operations, real-time search across vendor/product/grade fields, and pagination (10/25/50 records per page). Compare Vendors page automatically uses company's state for delivery location, eliminating manual entry and ensuring consistent interstate surcharge calculations.
-   **Technical Implementations**: Standalone Angular components, service-based state management, Django REST Framework ViewSets, Django ORM.
-   **Feature Specifications**: Automated vendor comparison with a scoring algorithm, dynamic delivery cost calculation (including a 20% interstate surcharge when applicable), real-time landing price calculation in quotation forms, comprehensive product grouping and categorization, inline CRUD operations for seamless data management (uses `data: null` for add mode and `data?.id` checks for edit-mode detection), and advanced quotation filtering by vendor, product, and product group with persistent filter state using `forkJoin` for data synchronization. Quotations list features real-time search (vendor, product, grade, ID), pagination with configurable page sizes (10/25/50 records), and integrated filtering using MatTableDataSource for optimal performance. Compare Vendors page features automatic delivery location from company profile, displaying company state in a visual info box and using the actual company ID for backend comparison requests, ensuring accurate interstate surcharge calculations based on company location vs vendor location.
-   **Single-Tenant Architecture**: Each instance serves a single company, with automatic association of all data to a default company and removal of multi-company selection fields for simplified user experience and enhanced data isolation.
-   **Security**: Writable ViewSets enforce default company assignment, read operations filter by the default company, and the `compare_vendors` endpoint validates product and vendor ownership to ensure complete tenant isolation. CompanyViewSet allows updating company information but blocks creation and deletion. ComparisonResultViewSet is read-only.

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

-   **PostgreSQL**: Primary data store.
-   **Django migrations**: For schema management.

## API Integration

-   Frontend proxy (`proxy.conf.json`) routes `/api/*` requests to the Django backend.
-   RESTful endpoints with JSON serialization for all API responses.