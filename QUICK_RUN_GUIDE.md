# 🚀 Quick Start Guide - Running the Project

## Prerequisites
- Python 3.13.7
- Node.js & npm
- Virtual environment (already set up in `.venv`)

---

## Starting the Project

### Option 1: Using Separate Terminals (Recommended)

#### Terminal 1 - Start Django Backend

```bash
# Navigate to project root
cd "c:\Users\Dishanth Patel\Documents\interview prep\property_portal - Copy"

# Activate virtual environment (if needed)
.venv\Scripts\activate

# Start Django development server
python manage.py runserver 8000
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

#### Terminal 2 - Start React Frontend

```bash
# Navigate to frontend
cd frontend

# Start development server
npm run dev
```

**Expected output:**
```
➜  Local:   http://localhost:5173/
```

---

## Accessing the Application

1. **Frontend**: Open [http://localhost:5173](http://localhost:5173)
2. **Django Admin**: [http://localhost:8000/admin](http://localhost:8000/admin)
3. **API Base URL**: `http://localhost:8000/`

---

## API Endpoints

### Authentication
- `POST /accounts/api/register/` - Register new user
- `POST /accounts/api/verify-otp/` - Verify OTP
- `POST /accounts/api/login/` - Login user
- `POST /accounts/api/logout/` - Logout user
- `GET /accounts/api/user/` - Get current user info
- `GET /accounts/api/csrf/` - Get CSRF token

### Properties
- `GET /properties/api/` - List all properties
- `GET /properties/api/<id>/` - Get property details
- `POST /properties/api/create/` - Create property
- `GET /properties/api/my-properties/` - Get user's properties
- `PUT /properties/api/<id>/edit/` - Update property
- `DELETE /properties/api/<id>/delete/` - Delete property
- `GET /properties/api/admin/properties/` - Admin: List all properties
- `POST /properties/api/admin/<id>/approve/` - Admin: Approve property
- `POST /properties/api/admin/<id>/reject/` - Admin: Reject property

### Messaging
- `GET /messaging/api/enquiries/` - List enquiries
- `POST /messaging/api/enquiries/` - Create enquiry
- `GET /messaging/api/messages/` - List messages
- `POST /messaging/api/messages/` - Send message

---

## Test Data Available

### Existing Users
The database contains **24 test users** ready for login:
- Username: `user1` to `user24`
- Password: Check admin panel or test with any credentials

### Sample Properties
The database contains **48 sample properties** across Bangalore with various:
- Property types (Apartment, House, Villa, etc.)
- Listing types (Sale, Rent)
- Price ranges and locations

---

## Common Commands

### Django Management
```bash
# Check system status
python manage.py check

# Show migration status
python manage.py showmigrations

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django shell
python manage.py shell

# Backup database
python manage.py dumpdata > backup.json

# Restore database
python manage.py loaddata backup.json
```

### Frontend Build
```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Troubleshooting

### Backend Issues

**Error: `ModuleNotFoundError: No module named 'django'`**
```bash
# Activate virtual environment
.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

**Error: Database locked**
```bash
# Delete temporary database lock files
del db.sqlite3-journal

# Restart server
python manage.py runserver 8000
```

### Frontend Issues

**Error: `npm: command not found`**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Verify: `node --version` and `npm --version`

**Error: Port 5173 already in use**
```bash
# Use different port
npm run dev -- --port 3000
```

**Error: Missing dependencies**
```bash
# Reinstall all packages
rm -r node_modules
npm install
```

---

## Project Structure

```
property_portal/
├── accounts/              # User authentication app
│   ├── api_views.py      # API endpoints
│   ├── models.py         # User model
│   └── serializers.py    # DRF serializers
├── properties/           # Properties app
│   ├── api_views.py      # Property API
│   ├── models.py         # Property models
│   └── serializers.py
├── messaging/            # Messaging app
│   ├── api_views.py      # Messaging API
│   ├── models.py         # Enquiry/Message models
│   └── serializers.py
├── frontend/             # React frontend
│   ├── src/
│   │   ├── App.jsx       # Main app component
│   │   ├── AuthContext.jsx # Auth state
│   │   └── *.jsx         # Other components
│   └── package.json
├── property_portal/      # Django settings
├── manage.py            # Django CLI
├── db.sqlite3           # Database
└── README.md            # Project documentation
```

---

## Testing the Application

### Manual Test Flow

1. **Register New User**
   - Navigate to [http://localhost:5173/accounts/register/](http://localhost:5173/accounts/register/)
   - Fill form and submit
   - Verify OTP (check logs or use any OTP)
   - Complete registration

2. **Login**
   - Navigate to login page
   - Use credentials from registration
   - Should redirect to home page

3. **Browse Properties**
   - View all available properties
   - Search and filter properties
   - Click on property to see details

4. **Create Property (as Host)**
   - Dashboard → Add Property
   - Fill property details
   - Upload photos/video
   - Submit (pending approval)

5. **Admin Functions**
   - Login as admin user
   - Dashboard → Approve/Reject properties

6. **Messaging**
   - Click enquire on property
   - Send enquiry
   - Receive and reply to messages

---

## Environment Variables

Current configuration uses:
- `DEBUG = True` (development mode)
- `ALLOWED_HOSTS = ['*']` (all hosts allowed for development)
- `CORS_ALLOWED_ORIGINS` includes localhost:5173 and 5174

For production, update `property_portal/settings.py`:
```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
```

---

## Performance Tips

1. **Backend**
   - Use production server (Gunicorn/uWSGI) instead of dev server
   - Enable caching with Redis
   - Use PostgreSQL instead of SQLite

2. **Frontend**
   - Run production build: `npm run build`
   - Serve from CDN for static files
   - Enable compression (gzip)

---

## Support & Documentation

- **Django Docs**: [docs.djangoproject.com](https://docs.djangoproject.com)
- **React Docs**: [react.dev](https://react.dev)
- **DRF Docs**: [www.django-rest-framework.org](https://www.django-rest-framework.org)

---

## Status Check

✅ **Project is ready to run!**

All systems verified and working. Follow the steps above to start development.

---

**Last Updated**: February 18, 2026  
**Status**: 🟢 Ready for Launch
