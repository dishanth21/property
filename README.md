# 🏠 PROPERTY PORTAL - Complete Implementation Guide

**Status:** ✅ **FULLY FUNCTIONAL & FEATURE-RICH**  
**Version:** 2.0  
**Last Updated:** January 11, 2026

A modern, full-stack property listing platform with admin approval workflow, advanced search filters, rent/sell options, real-time messaging, and comprehensive property management.

---

## 📋 TABLE OF CONTENTS
1. [Quick Start](#quick-start)
2. [Login Credentials](#-login-credentials)
3. [Features](#-features)
4. [Installation](#-installation)
5. [Running the Project](#-running-the-project)
6. [How to Use](#-how-to-use)
7. [API Endpoints](#-api-endpoints)
8. [Project Structure](#-project-structure)
9. [Tech Stack](#-tech-stack)
10. [Troubleshooting](#-troubleshooting)

---

## 🚀 QUICK START

### One-Minute Setup

**Terminal 1 - Backend:**
```bash
cd "c:\Users\Dishanth Patel\Documents\interview prep\property_portal - Copy"
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd "c:\Users\Dishanth Patel\Documents\interview prep\property_portal - Copy\frontend"
npm run dev
```

**Open:** `http://localhost:5174`

**That's it!** 🎉

---

## 🔐 LOGIN CREDENTIALS

### Ready-to-Use Test Accounts

| Role | Username | Password | Features | URL After Login |
|------|----------|----------|----------|-----------------|
| 🏘️ **Host** | `testhost` | `testpass123` | Add properties, manage listings | `/dashboard` |
| 🛒 **Buyer** | `testbuyer` | `testpass123` | Browse, filter, message hosts | `/properties` |
| 👮 **Admin** | `admin` | `admin123` | Approve/reject properties | `/admin-dashboard` |

### How to Login
1. Go to **http://localhost:5174**
2. Click **Login** in navbar
3. Enter username and password
4. Click **Sign In**
5. ✅ Auto-redirected to your dashboard

### How to Register New Account
1. Click **Register** in navbar
2. Fill form:
   - Username (3+ characters, unique)
   - Email (valid format)
   - Password (6+ characters)
   - First Name, Last Name
   - Phone Number
   - ☑ Check roles: "Buying/Renting" and/or "Listing Properties"
3. Click **Register Now**
4. ✅ Success modal appears
5. Click **Continue** → Auto-redirected to login
6. Login with new credentials

---

## ✨ FEATURES

### 🏠 Property Management
- ✅ **Add Properties** with complete details
- ✅ **Rent vs Sell** - Choose listing type (required)
- ✅ **Multiple Photos** - Upload and organize
- ✅ **Photo Gallery** - Carousel with thumbnails
- ✅ **Property Videos** - Upload video tours
- ✅ **Detailed Info**:
  - Title, Description, Price
  - Location (Address, City, State, ZIP)
  - Type (House, Apartment, Villa, Condo, etc.)
  - Bedrooms, Bathrooms, Square Feet
  - Year Built, Lot Size
  - Features (Parking, Garden, Pool, Gym, Security, etc.)
  - Furnished/Unfurnished

### 🔍 Advanced Search & Filters
- ✅ **Search Bar** - By property title or city
- ✅ **Listing Type Filter** - All / For Sale / For Rent
- ✅ **Location Filter** - Filter by city
- ✅ **Price Range Filter** - Min and Max price
- ✅ **Clear Filters** - Reset with one click
- ✅ **Real-time Filtering** - Updates as you type

### 📸 Photo Gallery
- ✅ **Hero Image Carousel** - Main property image
- ✅ **Navigation Arrows** - Previous/Next buttons
- ✅ **Image Counter** - Shows current position (e.g., "3/12")
- ✅ **Thumbnail Grid** - Click to view any photo
- ✅ **Hover Zoom** - Zoom effect on thumbnails
- ✅ **Primary Badge** - Marks main photo

### 👥 Admin Approval System
- ✅ **Property Status** - Pending → Approved/Rejected
- ✅ **Pending List** - View all properties awaiting approval
- ✅ **Property Preview**:
  - 📸 Property photo thumbnail
  - 👤 Host name, email, **phone number** ⭐
  - 📍 Location details
  - 💰 Price and property specs
  - 📝 Description preview
- ✅ **One-Click Approve** - Makes property visible to buyers
- ✅ **Rejection with Reason** - Host can see why
- ✅ **Statistics Dashboard** - Count of pending/approved/rejected

### 💬 Messaging System
- ✅ **Send Messages** - To property hosts
- ✅ **Receive Messages** - From interested buyers
- ✅ **Message Thread** - View conversation history
- ✅ **"I'm Interested" Button** ⭐ - Quick messaging
  - Shows on property detail page
  - Pre-fills property context
  - Redirects to messaging page
  - Host receives inquiry

### 🛒 User Dashboard
- ✅ **My Properties** - All your listings
- ✅ **Property Status** - Shows pending/approved/rejected
- ✅ **Quick Actions** - Add property, view messages
- ✅ **Status Notifications** - When property is approved/rejected
- ✅ **Rejection Reasons** - See why property was rejected

### 🎯 Property Details Page
- ✅ **Listing Type Badge** - "For Sale" (green) or "For Rent" (blue)
- ✅ **Host Information**:
  - Host name and email
  - Location details
  - Property features
- ✅ **Action Buttons**:
  - ✓ "I'm Interested" (green) → Messaging
  - 💬 "Send Message" (blue) → Direct message
  - ↩️ "Back to Listings" (secondary)
- ✅ **Responsive Layout** - Desktop, tablet, mobile optimized

### 🔒 Authentication & Security
- ✅ **Direct Registration** - No OTP required (instant approval)
- ✅ **Token-Based Auth** - UUID tokens
- ✅ **Secure Storage** - Token in localStorage
- ✅ **Auto-Login** - Session persists on page refresh
- ✅ **Protected Routes** - Redirects to login if not authenticated
- ✅ **Error Handling** - Clear error messages

### 🎨 User Experience
- ✅ **Smooth Animations** - Framer Motion
- ✅ **Success Modals** - Celebrate actions
- ✅ **Loading States** - Spinners during requests
- ✅ **Error Alerts** - Clear error messages
- ✅ **Responsive Design** - Works on all devices
- ✅ **Modern UI** - Bootstrap 5 + Custom styling
- ✅ **Icon Integration** - React Icons throughout

---

## 💻 INSTALLATION

### Prerequisites
- Python 3.10+
- Node.js 16+
- pip (Python)
- npm (Node)

### Step 1: Navigate to Project
```bash
cd "c:\Users\Dishanth Patel\Documents\interview prep\property_portal - Copy"
```

### Step 2: Backend Setup
```bash
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations (already done, but for reference)
python manage.py migrate
```

### Step 3: Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

### Database
- ✅ Pre-configured with SQLite
- ✅ Pre-populated with test users
- ✅ File: `db.sqlite3` (do not delete)

---

## 🎯 RUNNING THE PROJECT

### Method 1: Two Terminals (Recommended)

**Terminal 1:**
```bash
cd "c:\Users\Dishanth Patel\Documents\interview prep\property_portal - Copy"
python manage.py runserver
```
✅ Backend: `http://127.0.0.1:8000`

**Terminal 2:**
```bash
cd "c:\Users\Dishanth Patel\Documents\interview prep\property_portal - Copy\frontend"
npm run dev
```
✅ Frontend: `http://localhost:5174`

### Method 2: VS Code Split Terminal
1. Open project in VS Code
2. Open Terminal (Ctrl+`)
3. Split terminal (Ctrl+Shift+5)
4. Run both commands above
5. Click on frontend terminal and run `npm run dev`

### Verify It's Running
- Backend: Go to `http://127.0.0.1:8000` → See Django welcome page
- Frontend: Go to `http://localhost:5174` → See app homepage
- Both working? You're ready! 🎉

---

## 📖 HOW TO USE

### WORKFLOW 1: REGISTER & LOGIN

**Steps:**
1. Go to http://localhost:5174
2. Click **Register** (navbar)
3. Fill form:
   - **Username:** myusername
   - **Email:** myemail@gmail.com
   - **Password:** mypassword123
   - **First Name:** John
   - **Last Name:** Doe
   - **Phone:** 9876543210
   - **Check:** "Buying/Renting" (for buyer) or "Listing Properties" (for host)
4. Click **Register Now**
5. ✅ **Success modal** appears
6. Click **Continue**
7. Redirected to login
8. **Enter credentials**
9. Click **Sign In**
10. 🎉 Redirected to dashboard

---

### WORKFLOW 2: ADD A PROPERTY (As Host)

**Prerequisites:** Logged in as host

**Steps:**
1. Go to **Dashboard** (auto-redirected after login)
2. Click **"Add New Property"** (blue card)
3. **Select Listing Type** (REQUIRED):
   - ☑ Sell Property (For Sale)
   - ☑ Rent Property (For Rent)
4. **Fill Basic Info:**
   - Title: "Beautiful 3-BHK House"
   - Property Type: House
   - Description: Full details
   - Price: 75,00,000
5. **Location:**
   - Address: "456 Oak Avenue"
   - City: "Mumbai"
   - State: "Maharashtra"
   - ZIP: "400001"
6. **Details:**
   - Bedrooms: 3
   - Bathrooms: 2
   - Square Feet: 1800
   - Year Built: 2020
7. **Features** (check applicable):
   - ☑ Parking
   - ☑ Garden
   - ☑ Pool
   - ☑ Security
8. **Upload Photos:**
   - Click "Select Photos"
   - Choose multiple images
9. **Upload Video** (optional):
   - Click "Select Video"
10. Click **Submit Property**
11. ✅ **Success modal** appears
12. Click **Continue**
13. 📋 Back to dashboard - See property as **"Pending Approval"**

---

### WORKFLOW 3: APPROVE PROPERTY (As Admin)

**Prerequisites:** Logged in as admin

**Steps:**
1. Go to **Admin Dashboard:**
   - Click navbar dropdown
   - Select "Admin Dashboard"
   - Or go directly to `/admin-dashboard`
2. **View Pending Properties:**
   - See all properties awaiting approval
   - Each shows:
     - 📸 Property photo
     - 👤 Host name, email, **phone**
     - 💰 Price and details
     - 📍 Location
3. **Approve Property:**
   - Click **"Approve"** button (green)
   - ✅ Property now **"APPROVED"**
   - Instantly visible to buyers
4. **Reject Property:**
   - Click **"Reject"** button (red)
   - Enter reason: "Photos not clear"
   - Click **"Confirm Rejection"**
   - ❌ Property status: **"REJECTED"**
   - Host sees reason in dashboard

---

### WORKFLOW 4: BROWSE PROPERTIES (As Buyer)

**Prerequisites:** Logged in as buyer

**Steps:**
1. Click **Browse Properties** (navbar)
2. **Search:**
   - Type in search box: "house mumbai"
   - Results update in real-time
3. **Filter by Type:**
   - Select dropdown: "For Sale" / "For Rent"
4. **Filter by Location:**
   - Enter city: "Mumbai"
5. **Filter by Price:**
   - Min: 50,00,000
   - Max: 1,00,00,000
6. **Clear Filters:**
   - Click "Clear Filters" button
7. **View Property:**
   - Click on any property card
   - See full details with photos
8. **Show Interest:**
   - Click **"✓ I'm Interested"** (green button)
   - Redirected to Messaging
   - Pre-filled with property info
9. **Alternative:** 
   - Click **"Send Message"** (blue button)
   - Direct messaging page

---

### WORKFLOW 5: VIEW PROPERTY DETAILS

**Steps:**
1. Click on any property card from browse page
2. **Hero Section:**
   - See large main image
   - Navigation arrows (◀ ▶) on sides
   - Image counter (e.g., "3/12")
3. **Photo Gallery:**
   - Scroll down
   - See thumbnail grid
   - Click any thumbnail to view in hero
   - Hover for zoom effect
4. **Property Info:**
   - Title with listing badge
   - Address, city, state, zip
   - 💰 Price displayed
5. **Statistics:**
   - Bedrooms, Bathrooms
   - Square Footage
   - Year Built
6. **Features:**
   - Checkmarked features
   - Parking, Garden, Pool, etc.
7. **Host Card** (right sidebar):
   - Host name and email
   - **"✓ I'm Interested"** button → Messaging
   - "Send Message" button
   - "Back to Listings" button

---

### WORKFLOW 6: MESSAGING

**Steps:**
1. Go to **Messaging** (navbar)
2. **View Conversations:**
   - List of all messages
   - Most recent first
3. **Send Message:**
   - Type message
   - Click "Send"
4. **Filter:**
   - View sent enquiries
   - View received enquiries

---

## 🔌 API ENDPOINTS

### Authentication (POST)
| Endpoint | Purpose | Body |
|----------|---------|------|
| `/accounts/api/register/` | Register user | username, email, password, etc. |
| `/accounts/api/login/` | Login | username, password |
| `/accounts/api/user/` | Get current user | (GET request) |

### Properties (GET/POST)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/properties/api/` | GET | List approved properties |
| `/properties/api/{id}/` | GET | Property details |
| `/properties/api/create/` | POST | Create new property |
| `/properties/api/admin/properties/` | GET | Admin: List all |
| `/properties/api/admin/{id}/approve/` | POST | Admin: Approve |
| `/properties/api/admin/{id}/reject/` | POST | Admin: Reject |

### Messaging
| Endpoint | Purpose |
|----------|---------|
| `/messaging/api/` | Get messages |
| `/messaging/api/send/` | Send message |

---

## 📁 PROJECT STRUCTURE

```
property_portal/
│
├── 📁 accounts/
│   ├── models.py           (Custom User model)
│   ├── api_views.py        (Auth endpoints)
│   ├── serializers.py      (User serializers)
│   └── urls.py
│
├── 📁 properties/
│   ├── models.py           (Property, PropertyImage)
│   ├── api_views.py        (Property CRUD + Admin approval)
│   ├── serializers.py      (Property serializers)
│   └── urls.py
│
├── 📁 messaging/
│   ├── models.py           (Message model)
│   ├── views.py            (Messaging views)
│   └── urls.py
│
├── 📁 property_portal/
│   ├── settings.py         (Django config)
│   ├── urls.py             (Main URLs)
│   ├── middleware.py       (Token auth)
│   └── wsgi.py
│
├── 📁 frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── AuthContext.jsx
│   │   ├── Login.jsx
│   │   ├── RegistrationForm.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddProperty.jsx         ⭐ (Rent/Sell selection)
│   │   ├── PropertyList.jsx        ⭐ (Advanced filters)
│   │   ├── PropertyDetail.jsx      ⭐ (I'm Interested button)
│   │   ├── AdminDashboard.jsx      ⭐ (Photos + Phone)
│   │   ├── Messaging.jsx
│   │   ├── SuccessModal.jsx        ⭐ (Success notifications)
│   │   └── main.jsx
│   └── package.json
│
├── 📁 media/
│   └── properties/         (Uploaded photos)
│
├── 📁 static/
│   ├── css/
│   ├── js/
│   └── images/
│
├── 📁 templates/           (Django templates)
│
├── db.sqlite3              (Database)
├── manage.py
├── requirements.txt
└── README.md (this file)
```

---

## 🛠 TECH STACK

### Backend
- **Framework:** Django 5.2.6
- **API:** Django REST Framework
- **Database:** SQLite3
- **Language:** Python 3.13
- **Auth:** Token-based (UUID tokens)
- **CORS:** django-cors-headers

### Frontend
- **UI:** React 18
- **Build:** Vite
- **Styling:** Bootstrap 5
- **Animations:** Framer Motion
- **HTTP:** Axios
- **Routing:** React Router v6
- **Icons:** React Icons
- **State:** React Context API

---

## 🐛 TROUBLESHOOTING

### ❌ "Property not showing after I added it?"
**Solution:**
- Properties start as **PENDING** (not visible to buyers)
- Login as admin → Go to Admin Dashboard
- Click "Approve" on your property
- Now it appears in Browse Properties

### ❌ "Admin dashboard shows blank?"
**Solution:**
- Make sure you're logged in as admin
- Check if admin button appears in navbar
- Go directly to `/admin-dashboard`
- Check browser console (F12 → Console)

### ❌ "Photos won't upload?"
**Solution:**
- Check file format (JPG, PNG supported)
- Check file size (under 5MB recommended)
- Check `media/properties/` folder exists
- Check browser console for errors

### ❌ "Can't login - says 'invalid token'?"
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Clear localStorage (F12 → Application → Local Storage → Delete all)
- Logout and login again
- Check if both servers are running

### ❌ "Frontend won't load (blank page)?"
**Solution:**
- Check if `npm run dev` is running
- Check if terminal shows "http://localhost:5174"
- Open F12 → Console tab for errors
- Try `npm install` again

### ❌ "Backend error 500?"
**Solution:**
- Check Django terminal for error details
- Check database: `db.sqlite3` should exist
- Run migrations: `python manage.py migrate`
- Restart Django server

### ❌ "Port 5174 already in use?"
**Solution:**
```bash
# Use different port
npm run dev -- --port 5175
```

### ❌ "Port 8000 already in use?"
**Solution:**
```bash
# Use different port
python manage.py runserver 8001
```

---

## ✅ CHECKLIST - Before First Use

- [ ] Backend server running (`http://127.0.0.1:8000`)
- [ ] Frontend server running (`http://localhost:5174`)
- [ ] Can access homepage without errors
- [ ] Can login with testhost/testpass123
- [ ] Can add a property
- [ ] Property shows as "Pending"
- [ ] Can login as admin/admin123
- [ ] Can see pending property in admin dashboard
- [ ] Can approve property
- [ ] Can login as testbuyer/testpass123
- [ ] Can see approved property in browse
- [ ] Can click "I'm Interested" button

**If all checked ✅ → You're ready to use the app!**

---

## 📊 DATABASE

### Pre-populated Users
```
Host:    testhost / testpass123
Buyer:   testbuyer / testpass123
Admin:   admin / admin123
```

### Pre-populated Properties
- Multiple approved properties ready to browse
- Some pending properties for admin testing

### Resetting Database
```bash
# Delete all data and reset
python manage.py flush

# Apply migrations
python manage.py migrate

# Database reset ✅
```

---

## 🎓 KEY WORKFLOWS SUMMARY

```
REGISTER → LOGIN → DASHBOARD

HOST WORKFLOW:
Dashboard → Add Property (Rent/Sell) → PENDING
            ↓
         Admin Approves
            ↓
         APPROVED → Visible to Buyers

BUYER WORKFLOW:
Browse → Filter (Price/Location/Type) → Click Property
         ↓
      View Details (Photos, Info)
         ↓
      Click "I'm Interested" → Message Host

ADMIN WORKFLOW:
Login → Admin Dashboard → View Pending Properties
         ↓
    Approve or Reject (with reason)
         ↓
    Update status
```

---

## ⚡ PERFORMANCE TIPS

1. **First Load:** May take 5-10 seconds for Vite to start
2. **Large Photos:** Use compressed images for faster upload
3. **Multiple Filters:** App handles real-time filtering efficiently
4. **Photo Gallery:** Works smoothly even with 20+ photos

---

## 🔒 SECURITY NOTES

- ✅ Token stored securely in localStorage
- ✅ Passwords hashed in database
- ✅ CSRF protection enabled
- ✅ Admin-only endpoints validated
- ✅ User can only see their own data

**Never share credentials in production!**

---

## 📞 QUICK REFERENCE

| Need | Go To |
|------|-------|
| Browse properties | `/properties` |
| Add property | `/add-property` |
| My dashboard | `/dashboard` |
| Messages | `/messaging` |
| Admin approval | `/admin-dashboard` |
| Property detail | `/properties/{id}` |
| Login | `/accounts/login` |
| Register | `/accounts/register` |

---

## 🎉 YOU'RE ALL SET!

**Your Property Portal is ready to use!**

- ✅ Full-featured property listing system
- ✅ Admin approval workflow
- ✅ Advanced search & filters
- ✅ Real-time messaging
- ✅ Photo gallery
- ✅ Responsive design

**Start by:**
1. Adding a property as host
2. Approving it as admin
3. Browsing it as buyer
4. Sending an interest message

**Enjoy! 🏠**

---

**Version:** 2.0 | **Date:** Jan 11, 2026 | **Status:** ✅ Production Ready
