# Vendor Quotation Comparison Platform

A professional single-tenant vendor quotation comparison platform designed for manufacturing companies, with initial focus on the plastic manufacturing industry. This platform helps manufacturers efficiently compare vendor quotes and select optimal suppliers based on cost, quality, and delivery metrics.

## 🎯 Features

### Core Functionality
- **Vendor Management**: Comprehensive vendor profiles with ratings and contact information
- **Product Catalog**: Multi-level product organization with categories and groups
- **Quotation Management**: Easy quote entry with inline CRUD operations
- **Automated Comparison**: Smart comparison engine with weighted scoring and ranking
- **Real-time Calculations**: Automatic landing price calculations including interstate delivery surcharges

### Advanced Features
- **3-Level Ranking Algorithm**: Evaluates vendors on Total Landing Price, Landing Price per kg, and Lead Time
- **Interstate Surcharge**: Automatic 20% delivery surcharge for out-of-state vendors
- **Dynamic Filtering**: Advanced quotation filtering by Vendor, Product, and Product Group
- **Mobile-First Design**: Fully responsive with orientation-aware layouts
- **Dashboard Analytics**: Real-time KPIs and data visualization with charts

### User Experience
- **Professional UI**: Angular Material Design with indigo-pink theme
- **Dual-View Layouts**: Desktop table view and mobile scrollable list view for all pages
- **Touch-Friendly**: Optimized action buttons and spacing for mobile devices
- **Inline Management**: Seamless data management without leaving the current page
- **Smart Search**: Real-time search across multiple fields

## 🛠️ Tech Stack

### Frontend
- **Angular 20+** with standalone components
- **Angular Material Design** for enterprise UI
- **ng2-charts + Chart.js** for data visualization
- **RxJS** for reactive state management
- **TypeScript** for type safety

### Backend
- **Django 5.2+** web framework
- **Django REST Framework** for RESTful API
- **PostgreSQL** for data persistence
- **django-cors-headers** for CORS support

### Architecture
- Single-tenant architecture with automatic company association
- Service-based state management
- ViewSet-based CRUD operations
- Mobile-first responsive design

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the root directory:
```bash
DATABASE_URL=postgresql://user:password@host:port/dbname
SESSION_SECRET=your-secret-key-here
```

#### Run Database Migrations
```bash
python manage.py migrate
```

#### Create a Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Start Backend Server
```bash
python manage.py runserver 0.0.0.0:8000
```

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Node Dependencies
```bash
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will be available at `http://localhost:4200`

## 📝 Usage

### First-Time Setup
1. Access the application at `http://localhost:4200`
2. Configure your company profile (name, industry, state for delivery calculations)
3. Add vendors with their locations
4. Create product categories and groups
5. Add products to your catalog
6. Start entering quotations from different vendors

### Comparing Vendors
1. Navigate to "Compare Vendors" page
2. Select a product to compare
3. View automated rankings based on:
   - Total Landing Price (40% weight)
   - Landing Price per kg (40% weight)
   - Lead Time (20% weight)
4. Review vendor cards with pricing breakdowns and delivery information

### Mobile Usage
- All pages automatically switch to mobile-optimized views on smaller screens
- Landscape orientation shows desktop table view for easier comparison
- Touch-friendly buttons and spacing throughout

## 🏗️ Project Structure

```
.
├── quotation_app/          # Django project configuration
│   ├── settings.py         # Django settings
│   ├── urls.py            # URL routing
│   └── wsgi.py            # WSGI configuration
├── api/                    # Django REST API app
│   ├── models.py          # Database models
│   ├── serializers.py     # DRF serializers
│   ├── views.py           # API ViewSets
│   └── urls.py            # API endpoints
├── frontend/               # Angular application
│   ├── src/
│   │   ├── app/           # Angular components
│   │   ├── assets/        # Static assets
│   │   └── environments/  # Environment configs
│   ├── package.json       # Node dependencies
│   └── angular.json       # Angular configuration
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🔒 Security Considerations

- All sensitive data (API keys, database credentials) stored as environment variables
- Single-tenant architecture ensures complete data isolation
- ViewSets enforce company-level data filtering
- Read-only endpoints for comparison results
- CORS configured for secure cross-origin requests

## 📱 Mobile Responsiveness

The platform features comprehensive mobile optimization:
- Breakpoint at ≤600px for mobile layouts
- Dual-view system (desktop table / mobile list)
- Pagination-aware mobile rendering
- Orientation detection for optimal viewing
- Touch-friendly UI elements (minimum 36-44px tap targets)

## 🤝 Contributing

This is a single-tenant application designed for individual manufacturing companies. If you'd like to contribute or suggest features, please open an issue or submit a pull request.

## 📄 License

[Add your chosen license here]

## 🆘 Support

For issues or questions:
1. Check existing documentation
2. Review Django and Angular official docs
3. Open an issue in the repository

## 🙏 Acknowledgments

- Built with Django REST Framework
- UI powered by Angular Material Design
- Charts using ng2-charts and Chart.js
- Database powered by PostgreSQL

---

**Note**: This application requires proper environment configuration (database, secrets) to run. Never commit sensitive information to version control.
