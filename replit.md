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