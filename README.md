# 🏭 Vendor Quotation Comparison System

A professional single-tenant vendor quotation comparison platform designed for manufacturing companies, with an initial focus on the plastic manufacturing industry. This full-stack application helps manufacturers efficiently compare vendor quotes and select optimal suppliers based on cost, quality, and delivery metrics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Angular](https://img.shields.io/badge/angular-20%2B-red)
![Django](https://img.shields.io/badge/django-5.2%2B-green)

## ✨ Features

### 🎯 Core Functionality
- **Vendor Management** - Complete CRUD operations for vendor profiles with location tracking
- **Product Cataloging** - Multi-level product organization with categories and groups
- **Quotation Entry** - Streamlined quote entry with inline CRUD operations
- **Automated Comparison** - Intelligent 3-level ranking algorithm evaluating:
  - Total Landing Price (includes delivery costs)
  - Landing Price per kg (unit cost efficiency)
  - Lead Time (delivery speed)
- **Location-Based Shipping** - Automatic 20% interstate surcharge calculation
- **Transparent Pricing** - Real-time calculation breakdown with formula explanations

### 📊 Analytics & Visualization
- **Interactive Dashboard** - Real-time KPIs with ng2-charts visualization
- **Vendor Ranking** - Color-coded badges (🥇 Gold, 🥈 Silver, 🥉 Bronze)
- **Comparison Views** - Side-by-side vendor analysis with score breakdowns

### 👥 User Management
- **Role-Based Access** - User profiles with permission management
- **Company Profiles** - Single-tenant architecture with automatic data association

### 🎨 Modern UX/UI
- **Material Design** - Professional Angular Material components (indigo-pink theme)
- **Mobile-First Responsive** - Optimized layouts for all screen sizes
- **Orientation-Aware** - Dynamic view switching (portrait cards ↔ landscape tables)
- **Professional Notifications** - Toast messages and Material Design confirmation dialogs
- **Loading Feedback** - Global spinner with counter-based concurrent request handling
- **Touch-Optimized** - 44px minimum tap targets, full-width mobile buttons

### 🔧 Developer Features
- **RESTful API** - Django REST Framework with ViewSet architecture
- **Optimized Queries** - Server-side filtering, select_related() to eliminate N+1 queries
- **Standalone Components** - Angular 20+ with standalone architecture
- **Service-Based State** - RxJS-powered reactive state management
- **Security First** - Environment-based secrets, CORS protection, tenant isolation

## 🛠️ Technology Stack

### Frontend
- **Framework:** Angular 20+ (Standalone Components)
- **UI Library:** Angular Material & CDK
- **Charts:** ng2-charts with Chart.js
- **State Management:** RxJS Services
- **HTTP:** Angular HttpClient with proxy configuration
- **Styling:** SCSS with responsive design

### Backend
- **Framework:** Django 5.2+
- **API:** Django REST Framework 3.16+
- **Database ORM:** Django ORM
- **CORS:** django-cors-headers
- **Database Adapter:** psycopg2-binary

### Database
- **Development:** SQLite3
- **Production:** PostgreSQL (Neon-backed on Replit)

## 📋 Prerequisites

- **Python:** 3.10 or higher
- **Node.js:** 18 or higher
- **npm:** 9 or higher
- **Angular CLI:** 20 or higher (`npm install -g @angular/cli`)
- **PostgreSQL:** 14+ (for production)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/vendor-quotation-system.git
cd vendor-quotation-system
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and add your SECRET_KEY
# Generate one: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Start backend server (port 8000)
python manage.py runserver 0.0.0.0:8000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start development server (port 5000)
npm start
```

### 4. Access the Application

- **Frontend:** http://localhost:5000
- **Backend API:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/

## 📚 Detailed Setup Guide

For comprehensive installation instructions, production deployment, and troubleshooting, see **[SETUP.md](SETUP.md)**.

## 🗂️ Project Structure

```
vendor-quotation-system/
├── backend/                  # Django backend
│   ├── quotations/          # Main Django app (API)
│   │   ├── models.py        # Database models
│   │   ├── serializers.py   # DRF serializers
│   │   ├── views.py         # ViewSets and API logic
│   │   ├── urls.py          # API endpoints
│   │   └── migrations/      # Database migrations
│   ├── settings.py          # Django settings (uses env variables)
│   ├── urls.py              # Main URL routing
│   └── wsgi.py              # WSGI application
│
├── frontend/                # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/          # Dashboard with charts
│   │   │   ├── vendors/            # Vendor CRUD module
│   │   │   ├── products/           # Product CRUD module
│   │   │   ├── quotations/         # Quotation CRUD module
│   │   │   ├── compare/            # Vendor comparison engine
│   │   │   ├── users/              # User management
│   │   │   ├── companies/          # Company profiles
│   │   │   ├── product-groups/     # Product grouping
│   │   │   ├── product-categories/ # Product categorization
│   │   │   ├── services/           # Shared services
│   │   │   │   ├── api.service.ts       # HTTP API calls
│   │   │   │   ├── loading.service.ts   # Global spinner
│   │   │   │   ├── notification.service.ts # Toast notifications
│   │   │   │   └── confirm.service.ts    # Confirmation dialogs
│   │   │   └── shell/              # App layout shell
│   │   ├── assets/           # Static assets (logo, images)
│   │   └── styles.scss       # Global styles
│   ├── angular.json          # Angular configuration
│   ├── package.json          # Node dependencies
│   └── proxy.conf.json       # API proxy configuration
│
├── manage.py                 # Django management script
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── requirements.txt          # Python dependencies
├── LICENSE                   # MIT License
├── CONTRIBUTING.md           # Contribution guidelines
├── README.md                 # This file
└── SETUP.md                  # Detailed setup instructions
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Django Settings
SECRET_KEY=your-secret-key-here-generate-a-new-one
DEBUG=True

# Database Configuration (optional - defaults to SQLite)
# For PostgreSQL:
# DATABASE_URL=postgresql://username:password@host:port/database_name

# CORS Settings (adjust for production)
# CORS_ALLOWED_ORIGINS=http://localhost:5000,https://yourdomain.com
```

**⚠️ Security Warning:** Never commit the `.env` file to version control. Always use `.env.example` as a template.

## 📖 API Documentation

### Base URL
- Development: `http://localhost:8000/api/`
- Production: `https://your-domain.com/api/`

### Main Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/vendors/` | GET, POST | List/Create vendors |
| `/api/vendors/{id}/` | GET, PUT, DELETE | Retrieve/Update/Delete vendor |
| `/api/products/` | GET, POST | List/Create products |
| `/api/products/{id}/` | GET, PUT, DELETE | Retrieve/Update/Delete product |
| `/api/quotations/` | GET, POST | List/Create quotations |
| `/api/quotations/{id}/` | GET, PUT, DELETE | Retrieve/Update/Delete quotation |
| `/api/compare-vendors/` | POST | Compare vendors for a product |
| `/api/comparison-results/` | GET | View comparison history |
| `/api/product-groups/` | GET, POST | List/Create product groups |
| `/api/product-categories/` | GET, POST | List/Create product categories |
| `/api/users/` | GET, POST | List/Create users |
| `/api/companies/` | GET, PUT | View/Update company profile |

### Example API Request

```bash
# Get all vendors
curl http://localhost:8000/api/vendors/

# Compare vendors for a product
curl -X POST http://localhost:8000/api/compare-vendors/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1}'
```

## 🧪 Testing

```bash
# Backend tests
python manage.py test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run e2e
```

## 🏗️ Production Deployment

### Option 1: Replit Deployment

1. Import project to Replit
2. Configure environment secrets in Replit Secrets
3. Database automatically provisioned (PostgreSQL via Neon)
4. Click "Deploy" → Configure Autoscale deployment
5. Set run command: `python manage.py runserver 0.0.0.0:5000`

### Option 2: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser
```

### Option 3: Traditional Server

See **[SETUP.md](SETUP.md)** for detailed deployment instructions.

## 🎯 Usage Guide

### 1. Set Up Your Company Profile
- Navigate to **Companies** → Edit your company details
- Set your company's state (for accurate shipping calculations)

### 2. Add Vendors
- Go to **Vendors** → Click "Add Vendor"
- Enter vendor details including location

### 3. Organize Products
- Create **Product Categories** (e.g., Raw Materials, Packaging)
- Create **Product Groups** (e.g., HDPE Granules, PET Bottles)
- Add **Products** and assign to groups/categories

### 4. Enter Quotations
- Navigate to **Quotations** → Click "Add Quotation"
- Select vendor and product
- Enter pricing details (base price, delivery, quantity)
- System automatically calculates landing price with interstate surcharge

### 5. Compare Vendors
- Go to **Compare Vendors**
- Select a product to compare
- View ranked vendors with:
  - 🥇 Best total price
  - ⚡ Fastest delivery
  - 📊 Detailed score breakdown

## 🤝 Contributing

We welcome contributions! Please see **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure they pass
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the **[LICENSE](LICENSE)** file for details.

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/YOUR_USERNAME/vendor-quotation-system/issues) page to report bugs or request features.

### Reporting Bugs

Include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Python/Node versions)

## 📞 Support

- **Documentation:** See [SETUP.md](SETUP.md) for detailed guides
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/vendor-quotation-system/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/vendor-quotation-system/discussions)

## 🙏 Acknowledgments

- Built with [Django](https://www.djangoproject.com/) and [Angular](https://angular.dev/)
- UI components from [Angular Material](https://material.angular.io/)
- Charts powered by [ng2-charts](https://valor-software.com/ng2-charts/) and [Chart.js](https://www.chartjs.org/)
- Inspired by the needs of modern manufacturing operations

## 📊 Project Status

- ✅ Core Features: Complete
- ✅ Mobile Responsive: Complete
- ✅ User Management: Complete
- ✅ Professional Notifications: Complete
- ✅ Loading States: Complete
- ✅ Query Optimization: Complete
- 🚧 Unit Tests: In Progress
- 🚧 E2E Tests: In Progress

---

**Made with ❤️ for the Manufacturing Industry**
