# 📚 Vendor Quotation System - Detailed Setup Guide

Complete installation, configuration, and deployment guide for the Vendor Quotation Comparison System.

## 📑 Table of Contents

1. [System Requirements](#system-requirements)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Performance Optimization](#performance-optimization)

---

## 🖥️ System Requirements

### Minimum Requirements

- **Operating System:** Linux, macOS, or Windows (with WSL2 recommended)
- **Python:** 3.10 or higher
- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 2GB minimum

### Recommended Development Tools

- **Code Editor:** VS Code with extensions:
  - Python
  - Angular Language Service
  - Prettier
  - ESLint
- **Database Client:** pgAdmin (for PostgreSQL) or DB Browser for SQLite
- **API Testing:** Postman or Thunder Client
- **Git:** Version 2.30 or higher

---

## 🚀 Local Development Setup

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/YOUR_USERNAME/vendor-quotation-system.git

# Or clone via SSH
git clone git@github.com:YOUR_USERNAME/vendor-quotation-system.git

# Navigate to project directory
cd vendor-quotation-system
```

### Step 2: Backend (Django) Setup

#### 2.1 Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

#### 2.2 Install Python Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

#### 2.3 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Generate a new Django SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Edit .env file and paste the generated SECRET_KEY
nano .env  # or use your preferred editor
```

**Example `.env` configuration for development:**

```bash
# Django Settings
SECRET_KEY=django-insecure-your-generated-secret-key-here
DEBUG=True

# Database (leave commented for SQLite development)
# DATABASE_URL=postgresql://user:password@localhost:5432/vendor_quotations

# CORS Settings (optional - adjust if needed)
# CORS_ALLOWED_ORIGINS=http://localhost:5000
```

#### 2.4 Initialize Database

```bash
# Run migrations
python manage.py migrate

# Create superuser account
python manage.py createsuperuser
# Follow prompts to set username, email, and password

# (Optional) Load sample data
# python manage.py loaddata sample_data.json
```

#### 2.5 Start Backend Server

```bash
# Start Django development server
python manage.py runserver 0.0.0.0:8000

# Server should start at http://localhost:8000
# Admin panel available at http://localhost:8000/admin
# API endpoints at http://localhost:8000/api/
```

### Step 3: Frontend (Angular) Setup

Open a **new terminal window** (keep backend running).

#### 3.1 Install Angular CLI Globally

```bash
# Install Angular CLI
npm install -g @angular/cli@latest

# Verify installation
ng version
```

#### 3.2 Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install all Node.js dependencies
npm install

# This will install Angular, Material, ng2-charts, etc.
```

#### 3.3 Start Frontend Development Server

```bash
# Start Angular development server
npm start

# Application will open at http://localhost:5000
```

### Step 4: Verify Installation

1. **Backend Health Check:**
   - Visit: http://localhost:8000/api/
   - Should see Django REST Framework browsable API

2. **Frontend Health Check:**
   - Visit: http://localhost:5000
   - Should see the dashboard with navigation menu

3. **Admin Panel Check:**
   - Visit: http://localhost:8000/admin
   - Login with superuser credentials
   - Should see Django admin interface

---

## ⚙️ Environment Configuration

### Django Settings (backend/backend/settings.py)

Key configurations managed via environment variables:

```python
# Security
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'

# Database
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}

# CORS (for frontend communication)
CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5000'
).split(',')
```

### Angular Configuration (frontend/angular.json)

```json
{
  "projects": {
    "frontend": {
      "architect": {
        "serve": {
          "options": {
            "port": 5000,
            "host": "0.0.0.0"
          }
        }
      }
    }
  }
}
```

### API Proxy Configuration (frontend/proxy.conf.json)

Routes `/api/*` requests to Django backend:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

---

## 🗄️ Database Setup

### Development: SQLite (Default)

SQLite is used by default for local development:

```bash
# Database file location
db.sqlite3

# No additional setup required
# Automatically created on first migration
```

### Production: PostgreSQL (Recommended)

#### Install PostgreSQL

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**On macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**On Windows:**
Download installer from https://www.postgresql.org/download/windows/

#### Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE vendor_quotations;
CREATE USER vendor_admin WITH PASSWORD 'your-secure-password';
ALTER ROLE vendor_admin SET client_encoding TO 'utf8';
ALTER ROLE vendor_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE vendor_admin SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE vendor_quotations TO vendor_admin;
\q
```

#### Configure Django for PostgreSQL

Update `.env`:

```bash
DATABASE_URL=postgresql://vendor_admin:your-secure-password@localhost:5432/vendor_quotations
```

Run migrations:

```bash
python manage.py migrate
python manage.py createsuperuser
```

---

## 🌐 Production Deployment

### Option 1: Replit Deployment (Easiest)

#### Step 1: Import to Replit

1. Go to https://replit.com
2. Click "Create Repl" → "Import from GitHub"
3. Paste your repository URL
4. Replit will auto-detect the stack

#### Step 2: Configure Secrets

In Replit Secrets (Environment variables):

```bash
SECRET_KEY=your-production-secret-key
DEBUG=False
DATABASE_URL=postgresql://...  # Auto-configured by Replit
```

#### Step 3: Configure Deployment

1. Click "Deploy" button
2. Choose "Autoscale" deployment type
3. Configure:
   - **Run command:** `python manage.py runserver 0.0.0.0:5000`
   - **Build command:** Leave empty (auto-detected)
4. Click "Deploy"

#### Step 4: Run Migrations

In Replit Shell:

```bash
python manage.py migrate
python manage.py createsuperuser
```

Your app is now live! 🎉

### Option 2: Traditional Linux Server (VPS)

#### Requirements

- Ubuntu 20.04+ or similar Linux distribution
- Nginx web server
- Gunicorn WSGI server
- Supervisor process manager
- SSL certificate (Let's Encrypt)

#### Step 1: Install System Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3-pip python3-venv nginx supervisor postgresql -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

#### Step 2: Clone and Setup Application

```bash
# Create application directory
sudo mkdir -p /var/www/vendor-quotation-system
sudo chown $USER:$USER /var/www/vendor-quotation-system

# Clone repository
cd /var/www/vendor-quotation-system
git clone https://github.com/YOUR_USERNAME/vendor-quotation-system.git .

# Setup Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Install frontend dependencies and build
cd frontend
npm install
npm run build --prod
cd ..
```

#### Step 3: Configure Environment

```bash
# Create production .env
nano .env
```

Add production settings:

```bash
SECRET_KEY=your-production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/vendor_quotations
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

#### Step 4: Setup Database

```bash
# Run migrations
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

#### Step 5: Configure Gunicorn

Create `/etc/supervisor/conf.d/vendor-quotation.conf`:

```ini
[program:vendor-quotation]
directory=/var/www/vendor-quotation-system
command=/var/www/vendor-quotation-system/venv/bin/gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/vendor-quotation.err.log
stdout_logfile=/var/log/vendor-quotation.out.log
```

Start supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start vendor-quotation
```

#### Step 6: Configure Nginx

Create `/etc/nginx/sites-available/vendor-quotation`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (Angular build)
    location / {
        root /var/www/vendor-quotation-system/frontend/dist/frontend;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files
    location /static/ {
        alias /var/www/vendor-quotation-system/staticfiles/;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/vendor-quotation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 7: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 3: Docker Deployment

#### Create Dockerfile (Backend)

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: vendor_quotations
      POSTGRES_USER: vendor_admin
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    command: gunicorn backend.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://vendor_admin:secure_password@db:5432/vendor_quotations
      - SECRET_KEY=your-secret-key

  frontend:
    image: node:18
    working_dir: /app
    volumes:
      - ./frontend:/app
    command: npm start
    ports:
      - "5000:5000"

volumes:
  postgres_data:
```

#### Deploy with Docker

```bash
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `Address already in use: 0.0.0.0:8000`

**Solution:**
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
python manage.py runserver 0.0.0.0:8001
```

#### 2. Database Connection Error

**Error:** `OperationalError: could not connect to server`

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start if stopped
sudo systemctl start postgresql

# Verify DATABASE_URL in .env
```

#### 3. CORS Errors in Browser

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
```python
# In backend/backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
]
```

#### 4. Module Not Found Errors

**Error:** `ModuleNotFoundError: No module named 'django'`

**Solution:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### 5. npm Install Fails

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### 6. Static Files Not Loading

**Error:** 404 on static files in production

**Solution:**
```bash
# Collect static files
python manage.py collectstatic --noinput

# Verify STATIC_ROOT in settings.py
# Ensure Nginx is configured to serve from correct path
```

---

## ⚡ Performance Optimization

### Backend Optimizations

1. **Database Query Optimization:**
```python
# Use select_related() for foreign keys
quotations = Quotation.objects.select_related('vendor', 'product')

# Use prefetch_related() for reverse foreign keys
vendors = Vendor.objects.prefetch_related('quotations')
```

2. **Enable Database Connection Pooling:**
```python
# In settings.py
DATABASES = {
    'default': {
        # ...
        'CONN_MAX_AGE': 600,  # 10 minutes
    }
}
```

3. **Use Django Debug Toolbar (Development):**
```bash
pip install django-debug-toolbar
# Add to INSTALLED_APPS and middleware
```

### Frontend Optimizations

1. **Production Build:**
```bash
cd frontend
npm run build --prod
# Uses AOT compilation, tree-shaking, minification
```

2. **Lazy Loading:**
```typescript
// Already implemented with standalone components
// Each route loads components on-demand
```

3. **Enable Service Worker (PWA):**
```bash
ng add @angular/pwa
```

### Server Optimizations

1. **Enable Gzip Compression (Nginx):**
```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **Browser Caching:**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
}
```

3. **Use CDN for Static Assets**

---

## 🛡️ Security Checklist

### Production Security

- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Enable HTTPS
- [ ] Set secure cookies (`SESSION_COOKIE_SECURE=True`)
- [ ] Use environment variables for all secrets
- [ ] Regular security updates (`pip list --outdated`)
- [ ] Enable database backups
- [ ] Configure firewall (UFW/iptables)
- [ ] Set up monitoring and logging

---

## 📞 Need Help?

- **Documentation Issues:** Open an issue on GitHub
- **Deployment Questions:** Check GitHub Discussions
- **Bug Reports:** Use GitHub Issues with full error logs

---

**Last Updated:** October 2025
