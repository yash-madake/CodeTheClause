# Role-Based Senior Care Application

## Overview

A comprehensive role-based frontend application for senior care with three distinct user roles:
- **Senior Citizens** - Personal health dashboard
- **Doctors** - Medical information and patient management
- **Caretakers** - Daily activity monitoring and task management

## Features

### 🔐 Role-Based Authentication
- **Common Login Page** with role selection
- **Seniors**: Standard login with phone + PIN
- **Doctors & Caretakers**: Login requires phone + PIN + Senior ID
- Secure session management with protected routes
- Automatic routing based on user role

### 👴 Senior Dashboard
- Personal health score tracking
- Medication management
- Health reports and vitals
- Appointment scheduling
- Wellness tracking
- Government schemes information
- Insurance management
- Emotional wellbeing resources

### 👨‍⚕️ Doctor Dashboard
- **Patient Overview**: Vital signs, current medications
- **Medical History**: Chronic conditions, allergies
- **Reports**: Access to all medical reports
- **Prescriptions**: View and create new prescriptions
- **Appointments**: Schedule and manage patient appointments
- **Vitals Tracking**: Historical vital signs data
- Clear indication of which senior patient is being viewed
- Professional purple-themed interface

### 👩‍⚔️ Caretaker Dashboard
- **Daily Overview**: Task summary and health score
- **Daily Routine**: Scheduled activities with time slots
- **Medication Reminders**: Track and mark medications as taken
- **Activity Tracking**: Steps, sleep, exercise monitoring
- **Task Management**: Create and complete daily tasks
- **Emergency Section**: Quick access to emergency contacts and medical info
- Clear indication of which senior is being monitored
- Caring green-themed interface

## Demo Credentials

### Senior Login
```
Phone: 9876543210
PIN: 1234
Senior ID: SEN001
```

### Doctor Login
```
Phone: 9876543220
PIN: 5678
Senior ID: SEN001 (required to view patient)
```

### Caretaker Login
```
Phone: 9876543230
PIN: 9012
Senior ID: SEN001 (required to monitor senior)
```

## Technology Stack

- **Frontend Framework**: React 19.2.0
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4.1.18
- **Icons**: Phosphor Icons (lucide-react)
- **Charts**: Chart.js 4.5.1
- **Build Tool**: Vite 7.2.4

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── RoleBasedLogin.jsx       # Main login component with role selection
│   │   ├── SeniorDashboard.jsx      # Senior citizen dashboard
│   │   ├── DoctorDashboard.jsx      # Doctor dashboard with medical views
│   │   ├── CaretakerDashboard.jsx   # Caretaker dashboard with daily tasks
│   │   ├── Sidebar.jsx              # Role-aware navigation sidebar
│   │   ├── RightPanel.jsx           # Reminders and calendar
│   │   ├── HealthScoreCard.jsx      # Health score calculation
│   │   └── Toast.jsx                # Notification component
│   ├── contexts/
│   │   └── AuthContext.jsx          # Authentication context and routing logic
│   ├── tabs/
│   │   ├── MedicineTab.jsx          # Medicine management
│   │   ├── ReportsTab.jsx           # Health reports
│   │   ├── WellnessTab.jsx          # Wellness and diet
│   │   ├── AppointmentsTab.jsx      # Appointment scheduling
│   │   ├── GovernmentSchemesTab.jsx # Government schemes
│   │   ├── EmotionalWellnessTab.jsx # Emotional support
│   │   ├── InsuranceTab.jsx         # Insurance information
│   │   └── MedicineShopTab.jsx      # Medicine shopping
│   ├── utils/
│   │   └── db.js                    # Local storage database utilities
│   ├── App.jsx                      # Main app with protected routes
│   └── main.jsx                     # Application entry point
```

## Key Features Implementation

### 1. Role-Based Access Control
- Protected routes using React Router
- AuthContext for centralized authentication
- Role validation before rendering components
- Automatic redirection based on user role

### 2. Senior ID System
- Doctors and Caretakers must provide a Senior ID to access data
- Senior ID stored in session for persistent access
- Clear indication of which senior is being viewed/monitored
- Prevents unauthorized access to unrelated senior data

### 3. Dashboard Customization
- **Senior Dashboard**: Personal health management focus
- **Doctor Dashboard**: Clinical information and medical history
- **Caretaker Dashboard**: Daily care activities and task management
- Each role has distinct UI themes (blue/purple/green)

### 4. Secure Data Management
- Local storage for demo purposes
- Session-based authentication
- Separate data contexts for each role
- User credentials validation

### 5. Responsive Design
- Mobile-first approach
- Collapsible sidebars for mobile
- Touch-friendly interfaces
- Accessible components

### 6. User Experience
- Clear role identification badges
- Senior information banner on Doctor/Caretaker dashboards
- Loading states and transitions
- Toast notifications for user actions
- Intuitive navigation

## Installation & Setup

```bash
# Navigate to project directory
cd /home/user/webapp

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

## Usage Flow

1. **Login Page**:
   - Select your role (Senior, Doctor, or Caretaker)
   - Enter credentials
   - For Doctor/Caretaker: Also provide Senior ID

2. **Dashboard Access**:
   - Automatically routed to role-specific dashboard
   - Senior: Full personal health dashboard
   - Doctor: Medical information for specified senior
   - Caretaker: Daily care tasks for specified senior

3. **Navigation**:
   - Role-appropriate menu items
   - Quick access to frequently used features
   - Profile management
   - Logout functionality

## Security Features

- ✅ Role-based authentication
- ✅ Protected routes with validation
- ✅ Senior ID verification for doctors/caretakers
- ✅ Session management
- ✅ Automatic logout on session expiry
- ✅ Restricted data visibility by role

## Design Principles

### Senior-Friendly Design
- Large, clear typography
- High contrast colors
- Simple navigation
- Minimal cognitive load
- Touch-friendly buttons

### Professional Medical Interface (Doctor)
- Clinical color scheme (purple)
- Organized medical information
- Quick access to critical data
- Professional data presentation

### Practical Care Interface (Caretaker)
- Task-oriented layout (green)
- Daily routine focus
- Emergency information prominence
- Activity tracking emphasis

## Future Enhancements

- [ ] Multi-senior support for doctors/caretakers
- [ ] Real-time notifications
- [ ] Video consultation integration
- [ ] Advanced analytics and reporting
- [ ] Medication reminder push notifications
- [ ] Integration with wearable devices
- [ ] Family member access portal
- [ ] Prescription management system
- [ ] Insurance claim processing

## Development Notes

- All data currently stored in localStorage for demo
- Ready for backend API integration
- Modular component architecture
- Easy to extend with new features
- Follows React best practices

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

Built with modern web technologies for senior care management.
