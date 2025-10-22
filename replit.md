# Overview

This project is a single-tenant vendor quotation comparison platform for manufacturing companies, initially focused on plastic manufacturing. Its purpose is to help manufacturers compare vendor quotes efficiently and select optimal suppliers based on cost, quality, and delivery. The platform includes vendor management, product cataloging with categories and groups, quotation entry with inline CRUD operations, and an automated comparison engine with scoring and ranking capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses Angular 20+ with standalone components and Angular Material Design for an enterprise UI. It features a modular architecture with a shell layout, a dashboard with KPI cards and charts (ng2-charts with Chart.js), and CRUD modules for managing entities. State management is service-based with RxJS, and routing is handled by Angular Router. HTTP communication uses `HttpClient` with a proxy. Key design choices include standalone components for performance, dialog-based forms, and visual indicators for data presentation. Inline management for product groups within product forms simplifies the user workflow. All CRUD forms (Vendor, Company, Product, Product Group, Product Category, Quotation, User) are fully responsive with mobile-optimized layouts featuring full-width buttons, single-column stacking, touch-friendly spacing, and proper padding adjustments at breakpoint ≤600px. The Compare Vendors page is fully responsive with mobile-first design using Angular CDK's BreakpointObserver, displaying beautiful stacked vendor cards on mobile/tablet devices and a comprehensive table view on desktop.

## Backend Architecture

The backend is built with Django 5.2+ and Django REST Framework, offering a RESTful API. It uses a ViewSet-based architecture for CRUD operations and Django ORM for data interaction. The system includes business logic for vendor comparison, evaluating total cost per unit, delivery pricing (including interstate surcharge), quality grades, and lead times, with a weighted scoring system for ranking. Data models include Company (with state field for automatic delivery location), Vendor, Product, ProductGroup, Quotation, OrderRequest, and ComparisonResult. The architecture is single-tenant, with all data automatically associated with a default company.

## System Design Choices

-   **UI/UX**: Professional enterprise UI with Angular Material (indigo-pink theme), shell layout, dashboard analytics, and consistent CRUD interfaces. Enhanced comparison views use badges, color-coding, and result highlighting. Quotation form features a completely redesigned mobile-first layout with single-column structure, uppercase section labels (SELECT VENDOR, PRICING DETAILS, etc.), full-width form controls, and visual separators between sections. Inline CRUD buttons (add/edit/delete) are vertically stacked on mobile (≤600px) with 50px height for optimal touch targets, while desktop displays them horizontally next to dropdowns. Calculated fields (Total Landing Price, Landing Price per kg) are displayed in a blue-tinted card with large values and formula explanations. The form uses natural scrolling without inner scrollbars via flex container layout. All CRUD forms are mobile-responsive: dialog padding adjusts from 24px to 20px-16px, action buttons stack vertically in full-width column-reverse order with 48-50px height, and forms use 16px input font size to prevent iOS auto-zoom. Quotations list includes advanced filtering by Vendor, Product, and Product Group with filter state persistence across CRUD operations, real-time search across vendor/product/grade fields, and pagination (10/25/50 records per page). On mobile (≤600px), quotations display as a clean scrollable list with all data visible in label-value format, with highlighted pricing sections and touch-friendly action buttons. Compare Vendors page is fully responsive with mobile-first design featuring stacked vendor cards with gradient backgrounds, rank badges (gold/silver/bronze), touch-friendly spacing (min 44px tap targets), and single-column layouts for very small screens (<480px). Desktop view shows a comprehensive table. The page automatically switches to desktop table view when device is rotated to landscape orientation, providing side-by-side comparison of all vendor details for easier viewing. The page automatically uses company's state for delivery location, eliminating manual entry and ensuring consistent interstate surcharge calculations.
-   **Technical Implementations**: Standalone Angular components, service-based state management, Django REST Framework ViewSets, Django ORM. Responsive design uses CSS media queries (@media max-width: 600px) for form dialogs and Angular CDK BreakpointObserver combined with window.matchMedia() and HostListener for Compare Vendors page orientation detection. The page detects screen sizes (HandsetPortrait, TabletPortrait) and orientation changes using multiple methods for reliability: window.matchMedia('orientation: portrait'), window resize events, and orientationchange events. It dynamically switches between mobile card view (portrait) and desktop table view (landscape) with smooth fade-in transitions (0.3s). Landscape mode (HandsetLandscape, TabletLandscape) automatically triggers desktop table view with optimized font scaling (12px on tablets, 11px on phones) and reduced padding for better data visibility on horizontal screens.
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