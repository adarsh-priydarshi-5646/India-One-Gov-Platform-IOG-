# India One-Gov Platform - Frontend

Modern React-based citizen portal for the India One-Gov Platform built with Vite, TypeScript, Redux Toolkit, and Material-UI.

## Features

- ✅ **User Authentication** - Login, Register, OTP Verification
- ✅ **Dashboard** - Statistics and recent complaints overview
- ✅ **File Complaints** - Multi-step form with file upload
- ✅ **Geolocation** - Automatic location detection
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Redux State Management** - Centralized state with Redux Toolkit
- ✅ **Material-UI** - Google's Material Design components
- ✅ **TypeScript** - Type-safe code
- ✅ **Toast Notifications** - User feedback for actions

## Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Material-UI (MUI)** - UI components
- **Axios** - HTTP client
- **React Dropzone** - File uploads
- **React Toastify** - Notifications
- **Recharts** - Charts (for future analytics)

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   └── ProtectedRoute.tsx
│   ├── config/            # Configuration
│   │   └── constants.ts
│   ├── hooks/             # Custom hooks
│   │   └── redux.ts
│   ├── pages/             # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── FileComplaintPage.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── store/             # Redux store
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   └── complaintSlice.ts
│   ├── theme/             # MUI theme
│   │   └── index.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env
```

## Setup & Installation

### Prerequisites

- Node.js 18+
- Backend services running (Auth & Complaint services)

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure Environment

Edit `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_COMPLAINT_SERVICE_URL=http://localhost:3002
```

### Run Development Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Walkthrough

### 1. User Registration

- Aadhaar-based registration
- Phone number verification
- OTP verification via SMS
- Password strength validation

### 2. Login

- Login with phone or email
- JWT token-based authentication
- Auto token refresh
- Persistent session

### 3. Dashboard

- Stats cards (Total, Pending, Resolved, Avg Resolution Time)
- Recent complaints list
- Quick actions
- User menu

### 4. File Complaint

- Category selection from 11 categories
- Detailed description (min 50 chars)
- Address with state and district
- Automatic geolocation
- File upload (images, PDFs, videos)
- Drag & drop support
- File size validation (10MB max)

## API Integration

The frontend integrates with two backend services:

1. **Auth Service** (Port 3001)
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/verify-otp`
   - `/api/auth/me`
   - `/api/auth/logout`

2. **Complaint Service** (Port 3002)
   - `/api/complaints` (POST/GET)
   - `/api/complaints/:id` (GET)
   - `/api/complaints/stats` (GET)
   - `/api/complaints/:id/feedback` (POST)

## Theme & Styling

Custom Material-UI theme with Indian flag colors:

- **Primary**: Saffron (#ff9933)
- **Secondary**: Green (#138808)
- **Font**: Inter
- **Border Radius**: 8px/12px

## State Management

Redux Toolkit with two slices:

1. **Auth Slice**
   - User authentication state
   - Login/Register/Logout actions
   - Token management

2. **Complaint Slice**
   - Complaints list
   - Current complaint
   - Statistics
   - Create/Fetch/Update actions

## Security

- JWT tokens stored in localStorage
- Automatic token refresh on 401
- Protected routes
- CSRF protection via axios
- Input validation

## Future Enhancements

- [ ] View all complaints page
- [ ] Complaint details page
- [ ] Search and filters
- [ ] Real-time notifications
- [ ] Chat with officers
- [ ] Analytics dashboard
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Dark mode

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - Government of India

---

**Built with 🇮🇳 for India's Digital Future**
