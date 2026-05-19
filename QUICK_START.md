# Quick Reference Guide - Property Portal

## 🚀 START HERE

### To Run the Application:

**Terminal 1 - Django Backend:**
```bash
cd "c:\Users\Dishanth Patel\Documents\interview prep\property_portal - Copy"
python manage.py runserver
```
Server runs at: `http://127.0.0.1:8000`

**Terminal 2 - React Frontend:**
```bash
cd "c:\Users\Dishanth Patel\Documents\interview prep\property_portal - Copy\frontend"
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 👥 TEST ACCOUNTS

### Admin Account (For Approving Properties):
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** `/admin/` page to approve/reject properties

### Demo Host Account:
- **Username:** `testhost`
- **Password:** `testhost123`
- **Role:** Can add properties

### Demo Buyer Account:
- **Username:** `testbuyer`
- **Password:** `testbuyer123`
- **Role:** Can view properties

---

## 🎯 MAIN FEATURES

### For Hosts:
1. **Dashboard** - View all your properties with approval status
2. **Add Property** - Submit new property (starts as "Pending")
3. **Browse Properties** - See approved properties
4. **Messages** - Communicate with buyers

### For Admins:
1. **Admin Panel** (`/admin/`) - Review pending properties
2. **Approve** - Click button to approve a property
3. **Reject** - Click button and add reason for rejection
4. **Dashboard** - See approval stats

### For Buyers:
1. **Browse Properties** - Only sees approved properties
2. **Property Details** - View full information about a property
3. **Messages** - Contact host about the property
4. **Dashboard** - Manage account and preferences

---

## 📍 KEY URLs

| URL | Purpose | Access |
|-----|---------|--------|
| `/` | Home Page | Everyone |
| `/accounts/login/` | Login | Everyone |
| `/accounts/register/` | Register | Everyone |
| `/dashboard/` | User Dashboard | Logged In Users |
| `/admin/` | Admin Panel | Admins Only |
| `/properties/` | Browse Properties | Everyone |
| `/properties/add/` | Add Property | Hosts Only |
| `/properties/:id/` | View Property | Everyone |
| `/messaging/` | Messages | Logged In Users |

---

## 🔄 PROPERTY APPROVAL WORKFLOW

```
┌─────────────────────────────────────────┐
│ Host Creates Property                   │
│ Status: PENDING                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Admin Reviews in Admin Panel            │
│ Sees: Title, Host, Price, Description  │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
    ┌────────┐    ┌────────┐
    │APPROVE │    │ REJECT │
    └────┬───┘    └────┬───┘
         │             │
         ▼             ▼
    ┌────────────┐  ┌──────────────────┐
    │ APPROVED   │  │ REJECTED         │
    │ Visible    │  │ Host Sees Reason │
    │ to Buyers  │  │ Not Listed       │
    └────────────┘  └──────────────────┘
```

---

## 💡 TIPS & TRICKS

### Check Property Status:
1. Login as host
2. Go to Dashboard
3. Look at "My Properties" table
4. Status column shows: ✅ Approved, ⏳ Pending, ❌ Rejected

### View Property Details as Owner:
1. Click property in My Properties table
2. See approval alert at top of page
3. Shows what admin said if rejected

### Approve Multiple Properties:
1. Go to Admin Panel
2. Scroll through Pending list
3. Approve each property individually

### Find Rejected Property:
1. Go to Admin Panel
2. Scroll to bottom section: "Rejected"
3. See host, property info, and rejection reason

---

## 🐛 IF SOMETHING ISN'T WORKING

### Registration Not Working?
- [ ] Django server is running? (Check terminal for errors)
- [ ] Frontend server is running? (Should be on http://localhost:5173)
- [ ] Browser console clear? (Press F12 → Console)

### Can't See Properties After Adding?
- [ ] Check Dashboard → My Properties table
- [ ] See "Pending Approval" status?
- [ ] Need to login as admin and approve it first!

### Admin Panel Showing Error?
- [ ] Logged in with admin account?
- [ ] Check URL: `http://localhost:5173/admin/`
- [ ] Check browser console for errors

### Properties Not Showing in Browse?
- [ ] Are they approved? (Pending properties are hidden)
- [ ] Login as admin to approve them first
- [ ] Try refreshing the page

### Upload Not Working?
- [ ] Check file size (shouldn't be too large)
- [ ] Try using JPG/PNG for images
- [ ] Check browser console for specific error

---

## 📱 QUICK ACTIONS

| Action | Steps |
|--------|-------|
| Register | Click "Register" → Fill form → Verify OTP → Login |
| Add Property | Dashboard → "Add Property" → Fill form → Submit |
| Browse Properties | Click "Browse Properties" → Search/Filter → Click property |
| View Approval Status | Dashboard → "My Properties" → Check Status column |
| Approve Property (Admin) | Admin Panel → "Pending Approval" → Click "Approve" |
| Reject Property (Admin) | Admin Panel → "Pending Approval" → Click "Reject" → Add reason |
| Send Message | Property detail → "Send Message" → Type message |

---

## 🔑 IMPORTANT CONSTANTS

- **Pending Status:** Properties not visible to public, only to owner
- **Approved Status:** Properties visible to all buyers
- **Rejected Status:** Properties hidden, only owner sees reason
- **Default:** New properties are created as "Pending"
- **Visibility:** Only "Approved" show in Browse Properties

---

## 📞 GETTING HELP

### Check Django Logs:
- Look at terminal where Django server is running
- Error messages will appear there
- Check for `ERROR` or `Exception` messages

### Check Browser Console:
- Press `F12` in browser
- Go to "Console" tab
- Look for red error messages
- Check "Network" tab for API failures

### Check Network Requests:
- Press `F12` in browser
- Go to "Network" tab
- Try action again
- Look for red requests (failures)
- Click on failed request to see error details

### Common API Response Codes:
- `200` - Success ✅
- `400` - Bad request (check form data)
- `401` - Not authenticated (need to login)
- `403` - Permission denied (need admin access)
- `404` - Not found (wrong URL)
- `500` - Server error (check Django logs)

---

## 📊 DEFAULT DATA

### Admin User (Pre-created):
```
Username: admin
Password: admin123
Email: admin@propertyportal.com
Permissions: All admin permissions
```

### Create New Users (Shell):
```bash
python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()

# Create host
host = User.objects.create_user(
    username='newhost',
    email='host@example.com',
    password='pass123',
    is_host=True,
    is_active=True
)

# Create buyer
buyer = User.objects.create_user(
    username='newbuyer',
    email='buyer@example.com',
    password='pass123',
    is_buyer=True,
    is_active=True
)
```

---

## ⚠️ IMPORTANT REMINDERS

1. **Always Approve Properties** - New properties are "Pending" by default
2. **Check Status** - Look at "My Properties" table to verify approval
3. **Admin Login** - Need admin account to approve (username: Admin1, password: Admin242)
4. **CSRF Token** - Browser must accept cookies for CORS
5. **Media Files** - Make sure `media/` folder exists for uploads
6. **Database** - Migrations are already applied, don't need to run migrate unless you change models

---

## 🎓 LEARNING PATH

**For First Time Users:**
1. Register a new account (Buyer role)
2. Browse properties - see what's available
3. Register another account (Host role)
4. Add a property
5. Login as admin and approve it
6. See it appear in Browse Properties

---

**Last Updated:** January 11, 2026
**Status:** ✅ Production Ready
