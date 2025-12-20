# Quick Start Guide - Role-Based Senior Care Application

## 🚀 Live Application

**Access the application here:** https://5173-id3rgye2ad4vdr6dqg8x1-2e77fc33.sandbox.novita.ai

## 👥 Test User Credentials

### 1️⃣ Senior Citizen Login
```
📱 Phone: 9876543210
🔐 PIN: 1234
```
**What you'll see:**
- Personal health dashboard
- Daily health score
- Medication tracking
- Appointments
- Wellness resources
- Reports and vitals

---

### 2️⃣ Doctor Login
```
📱 Phone: 9876543220
🔐 PIN: 5678
👤 Senior ID: SEN001 (required)
```
**What you'll see:**
- Patient medical information
- Vital signs and history
- Medical reports
- Prescription management
- Appointment scheduling
- Medical history and conditions

---

### 3️⃣ Caretaker Login
```
📱 Phone: 9876543230
🔐 PIN: 9012
👤 Senior ID: SEN001 (required)
```
**What you'll see:**
- Daily routine schedule
- Medication reminders
- Task management
- Activity tracking
- Emergency contacts
- Health monitoring

---

## 📋 How to Test

### Step 1: Access the Login Page
1. Open the application URL
2. You'll see three role cards: Senior, Doctor, Caretaker

### Step 2: Choose a Role
- Click on any role card to proceed to login

### Step 3: Enter Credentials
- **For Senior**: Enter phone and PIN only
- **For Doctor/Caretaker**: Enter phone, PIN, AND Senior ID

### Step 4: Explore the Dashboard
Each role has a completely different dashboard:
- **Senior Dashboard** (Blue theme): Personal health management
- **Doctor Dashboard** (Purple theme): Clinical medical information
- **Caretaker Dashboard** (Green theme): Daily care activities

---

## 🎯 Key Features to Test

### Senior Dashboard
✅ View health score breakdown  
✅ Track medications  
✅ Check appointments  
✅ View medical reports  
✅ Access wellness resources  

### Doctor Dashboard
✅ View patient overview  
✅ Check vital signs history  
✅ Review medical reports  
✅ Manage prescriptions  
✅ View medical history and allergies  

### Caretaker Dashboard
✅ Monitor daily tasks  
✅ Track medication schedule  
✅ View daily routine  
✅ Monitor activity (steps, sleep)  
✅ Access emergency information  

---

## 🔒 Security Features

- ✅ Role-based access control
- ✅ Protected routes
- ✅ Senior ID verification for doctors/caretakers
- ✅ Session management
- ✅ Data isolation by role

---

## 💡 Important Notes

1. **Senior ID System**: Doctors and caretakers must provide a valid Senior ID to access patient data
2. **Role Separation**: Each role has completely different UI and features
3. **Data Persistence**: Data is stored locally in browser storage (demo mode)
4. **Logout**: Use the logout button in the sidebar to switch between roles

---

## 🎨 Design Highlights

### Senior-Friendly Design
- Large, clear text
- High contrast colors
- Simple navigation
- Touch-friendly buttons

### Professional Interfaces
- **Doctor**: Clinical purple theme
- **Caretaker**: Caring green theme
- **Senior**: Friendly blue theme

---

## 🔄 Testing Flow

```
1. Start at Login → Select Role
                    ↓
2. Enter Credentials (+ Senior ID for Doctor/Caretaker)
                    ↓
3. Automatic routing to role-specific dashboard
                    ↓
4. Explore features and sections
                    ↓
5. Logout to test another role
```

---

## 📱 Mobile Responsive

- Fully responsive design
- Touch-friendly interface
- Collapsible sidebars
- Optimized for tablets and phones

---

## 🆘 Need Help?

- Check `ROLE_BASED_AUTH_README.md` for detailed documentation
- Ensure you're using the correct credentials
- For Doctor/Caretaker: Don't forget to enter Senior ID
- Clear browser cache if you encounter issues

---

## 🎉 Enjoy Testing!

Experience the complete role-based senior care management system with three distinct user perspectives.
