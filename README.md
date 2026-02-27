# QueueEase — Web-Based Appointment Booking System

A full-stack appointment booking system for small businesses (salons, clinics, tutors). Built with Next.js, Tailwind CSS, and MongoDB Atlas.

---

## Team Members

| Member | Student ID | Responsibilities |
|--------|-----------|-----------------|
| Zwe Khant Lin | 6632710 | Member |
| Tun Tauk Oo | 6611302 | Service Management, Time Slot Management, Dashboard UI, Backend APIs, Auth System |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Database | MongoDB Atlas + Mongoose ODM |
| Auth | localStorage-based session (role-aware) |
| Deployment | Vercel + MongoDB Atlas |

---

## Features

### Authentication
- Login / Register with email and password
- Two roles: **Admin** and **Staff**
- Route protection — unauthenticated users are redirected to `/login`

### Dashboard
- Stats overview: Total, Today, Confirmed, Pending, Cancelled appointments
- Full appointment list with status badges
- Change appointment status (Pending / Confirmed / Cancelled)
- Edit appointment details (Admin only)
- Delete appointments (Admin and Staff)

### Weekly Schedule
- 7-day calendar view (Mon–Sun)
- Navigate between weeks (Prev / Next / Today)
- Today's column highlighted in blue
- Appointments displayed per day with status badges
- Weekly appointments list sorted by date and time

### Service Management
- View all services with name, description, duration, and price
- Add / Edit / Delete services (Admin only)
- Staff can view services (read-only)

### Time Slot Management
- View time slots grouped by date
- Add / Edit / Delete time slots (Admin only)
- Toggle availability per slot (Admin only)
- Staff can view slots (read-only)

### Book Appointment
- Select service from dropdown (populated from DB)
- Select date, then choose from available time slots for that date
- Booked time slots are automatically marked as unavailable
- Reads logged-in user's email from session

---

## Role Permissions

| Feature | Admin | Staff |
|---------|-------|-------|
| View Dashboard | ✅ | ✅ |
| Change appointment status | ✅ | ✅ |
| Edit appointment | ✅ | ❌ |
| Delete appointment | ✅ | ✅ |
| View Weekly Schedule | ✅ | ✅ |
| View Services | ✅ | ✅ |
| Add / Edit / Delete Services | ✅ | ❌ |
| View Time Slots | ✅ | ✅ |
| Add / Edit / Delete Time Slots | ✅ | ❌ |
| Toggle slot availability | ✅ | ❌ |
| Book Appointment | ✅ | ✅ |

---

## Data Models

### User
```
name, email, password, role (admin | staff)
```

### Service
```
name, description, duration (minutes), price
```

### TimeSlot
```
date, startTime, endTime, isAvailable
```

### Appointment
```
name, service, date, time, userEmail, status (pending | confirmed | cancelled)
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env.local`
```env
MONGODB_URI=your_mongodb_connection_string
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Seed Test Data

To populate the database with sample data, send a POST request to the seed endpoint:

```bash
curl -X POST http://localhost:3000/api/seed
```

This creates:
- 2 users (admin + staff)
- 4 services (Haircut, Hair Coloring, Beard Trim, Deep Conditioning)
- 24 time slots across 3 days
- 5 sample appointments

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@queueease.com | admin123 |
| Staff | alice@queueease.com | staff123 |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments/list` | Get all appointments |
| POST | `/api/appointments/create` | Create appointment + mark slot unavailable |
| PUT | `/api/appointments/update/[id]` | Update appointment |
| DELETE | `/api/appointments/delete/[id]` | Delete appointment |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services/list` | Get all services |
| POST | `/api/services/create` | Create service |
| PUT | `/api/services/update/[id]` | Update service |
| DELETE | `/api/services/delete/[id]` | Delete service |

### Time Slots
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timeslots/list` | Get all time slots |
| POST | `/api/timeslots/create` | Create time slot |
| PUT | `/api/timeslots/update/[id]` | Update time slot |
| DELETE | `/api/timeslots/delete/[id]` | Delete time slot |

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── appointments/  (create, list, update, delete)
│   │   ├── auth/          (login, register)
│   │   ├── services/      (create, list, update, delete)
│   │   ├── timeslots/     (create, list, update, delete)
│   │   └── seed/          (test data)
│   ├── calendar/          (weekly schedule view)
│   ├── dashboard/         (appointments dashboard)
│   ├── login/
│   ├── register/
│   ├── schedule/          (book appointment)
│   ├── services/
│   └── timeslots/
├── components/
│   ├── AppShell.tsx       (auth guard + layout)
│   └── Sidebar.tsx        (navigation)
├── lib/
│   ├── mongodb.ts         (DB connection)
│   └── session.ts         (localStorage session helpers)
└── models/
    ├── Appointment.js
    ├── Service.js
    ├── TimeSlot.js
    └── User.js
```
