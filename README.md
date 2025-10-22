
# Vendor Quotation Comparison Platform

A professional single-tenant vendor quotation comparison platform designed for manufacturing companies, with initial focus on the plastic manufacturing industry. This platform helps manufacturers efficiently compare vendor quotes and select optimal suppliers based on cost, quality, and delivery metrics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Angular](https://img.shields.io/badge/angular-20%2B-red)
![Django](https://img.shields.io/badge/django-5.2%2B-green)

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
- **PostgreSQL** for production database
- **SQLite** for development
- **django-cors-headers** for CORS support

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL database (for production)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/vendor-quotation-comparison.git
cd vendor-quotation-comparison
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database (PostgreSQL for production)
DATABASE_URL=postgresql://username:password@host:port/dbname

# For development, you can omit DATABASE_URL to use SQLite
```

**Important**: Never commit your `.env` file. It's already in `.gitignore`.

#### Run Database Migrations
```bash
python manage.py migrate
```

#### Create Sample Data (Optional)
```bash
python seed_data.py
```

#### Create a Superuser
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

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
.
├── backend/                # Django project configuration
│   ├── settings.py        # Django settings
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI configuration
├── quotations/            # Django app for core functionality
│   ├── models.py         # Database models
│   ├── serializers.py    # DRF serializers
│   ├── views.py          # API ViewSets
│   └── urls.py           # API endpoints
├── frontend/              # Angular application
│   ├── src/
│   │   ├── app/          # Angular components
│   │   ├── assets/       # Static assets
│   │   └── environments/ # Environment configs
│   └── package.json      # Node dependencies
├── .gitignore            # Git ignore rules
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🔒 Security Considerations

- **Environment Variables**: All sensitive data (API keys, database credentials, secret keys) are stored in `.env` file which is excluded from Git
- **Single-Tenant Architecture**: Complete data isolation per company
- **CORS Configuration**: Configured for secure cross-origin requests
- **Password Validation**: Django's built-in password validators enabled
- **CSRF Protection**: Django CSRF middleware active

## 🌐 Deployment

This application is designed to run on [Replit](https://replit.com) for easy deployment:

1. Import this repository to Replit
2. Configure environment variables in Replit Secrets:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: Django secret key
3. The application will automatically start both frontend and backend

For production deployment, ensure:
- `DEBUG=False` in settings
- Use PostgreSQL database
- Configure proper ALLOWED_HOSTS
- Set up HTTPS

## 📱 Mobile Responsiveness

- Breakpoint at ≤600px for mobile layouts
- Dual-view system (desktop table / mobile list)
- Touch-friendly UI elements
- Orientation detection for optimal viewing

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

### Main Endpoints

- `GET /api/vendors/` - List all vendors
- `GET /api/products/` - List all products
- `GET /api/quotations/` - List all quotations
- `POST /api/compare/` - Compare vendors for a product
- `GET /api/companies/` - List companies

All endpoints support standard CRUD operations (GET, POST, PUT, DELETE).

## 🐛 Known Issues

- None at this time

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Django REST Framework
- UI powered by Angular Material Design
- Charts using ng2-charts and Chart.js
- Database powered by PostgreSQL

## 📧 Support

For issues or questions:
1. Check existing documentation
2. Open an issue in the repository
3. Contact: [your-email@example.com]

---

**Note**: This is a development setup. For production deployment, ensure proper security configurations are in place.
