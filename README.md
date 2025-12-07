# 🇮🇳 India One-Gov Platform (IOG)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0.0-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> A comprehensive unified e-governance platform for India, inspired by Chinese government portals. Built with modern technologies to provide seamless access to 30+ government schemes and 13+ services.

## 🌟 Live Demo

**Frontend:** [http://localhost:3000](http://localhost:3000)  
**API Gateway:** [http://localhost:4000](http://localhost:4000)

## 📸 Screenshots

```
[Dashboard] [Services] [Healthcare] [Schemes]
```

## ✨ Key Highlights

- 🎯 **22 Fully Functional Pages** - Complete user journey
- 📋 **30+ Real Government Schemes** - Ayushman Bharat, PM-KISAN, PMAY, etc.
- 🏥 **25,000+ Government Hospitals** - State/District/Block-wise database
- 🌐 **6 Indian Languages** - Hindi, English, Tamil, Telugu, Bengali, Marathi
- 🎨 **Chinese Portal Design** - Clean, minimal, government-grade UI
- 🔒 **Production Ready** - CI/CD, Docker, Security scanning
- 📱 **Fully Responsive** - Works on all devices

## 🎯 Overview

IOG Platform is a complete e-governance solution that provides:

## 🎯 Overview

IOG Platform is a complete e-governance solution that provides:
- **22 Pages** with full functionality
- **30+ Real Government Schemes** (Ayushman Bharat, PM-KISAN, PMAY, etc.)
- **13 Government Services** (Complaints, FIR, Healthcare, Education, etc.)
- **Multi-language Support** (6 Indian languages)
- **Location-based Services** with notifications
- **Government Promises Tracking** with completion percentages
- **Comprehensive Hospital Database** (25,000+ hospitals)

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Material-UI** for Chinese portal design
- **Redux Toolkit** for state management
- **React Router** for navigation
- **i18next** for multi-language support
- **Vite** for fast development

### Backend (Microservices)
- **Auth Service** (Port 3001) - User authentication & authorization
- **Complaint Service** (Port 3002) - Complaint management
- **Crime Service** (Port 3003) - FIR management
- **Corruption Service** (Port 3004) - Anonymous reporting
- **Employment Service** (Port 3005) - Job portal
- **Notification Service** (Port 3006) - Multi-channel notifications
- **API Gateway** (Port 4000) - Unified routing

### Databases
- **PostgreSQL** - Structured data (users, complaints, FIRs)
- **MongoDB** - Documents and evidence files
- **Redis** - Session management and caching

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- MongoDB 7+
- Redis 7+
- Docker & Docker Compose (optional)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/your-org/iog-platform.git
cd iog-platform

# Start all services
docker-compose up -d

# Access the platform
# Frontend: http://localhost:3000
# API Gateway: http://localhost:4000
```

### Manual Setup

#### 1. Setup Databases

```bash
# PostgreSQL
createdb iog_db

# MongoDB (already running)
# Redis (already running)
```

#### 2. Backend Services

```bash
# Install dependencies for all services
cd backend
npm install

# Start Auth Service
cd services/auth-service
npm install
npm run dev

# Start Complaint Service
cd ../complaint-service
npm install
npm run dev

# Start Crime Service
cd ../crime-service
npm install
npm run dev

# Start API Gateway
cd ../../api-gateway
npm install
npm run dev
```

#### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🚀 Features

### Core Features
- ✅ User Authentication (JWT-based)
- ✅ Multi-language Support (6 languages)
- ✅ Chinese Government Portal Design
- ✅ Responsive Design
- ✅ Real-time Notifications
- ✅ File Upload Support
- ✅ Location-based Services

### Government Services

#### 1. Complaint Management
- File complaints with location tracking
- Track complaint status
- Location-based routing to authorities
- Evidence upload support

#### 2. FIR Management
- 3-step FIR filing process
- Crime type categorization
- Police station routing
- Evidence management

#### 3. Corruption Reporting
- Anonymous reporting
- Anti-Corruption Bureau routing
- Secure evidence submission

#### 4. Healthcare Services
- 25,000+ government hospitals database
- State/District/Block-wise search
- Health schemes (Ayushman Bharat, PM-JAY, etc.)
- Government promises tracking
- Latest notifications

#### 5. Education Services
- Scholarship portal
- School admissions
- Exam results
- Online courses

#### 6. Employment Services
- Government job portal
- Skill development programs
- Application tracking

#### 7. Transport Services
- Driving license application
- Vehicle registration
- Traffic challan payment

#### 8. Business Services
- Company registration
- GST registration
- Trade license
- MSME registration

#### 9. Housing Services
- PM Awas Yojana
- Property registration
- Housing loan schemes

#### 10. Government Policies Tracker
- 156 active policies
- Promises tracking with completion %
- Future plans (2024-2030)

### Real Government Schemes (30+)

**Healthcare:**
- Ayushman Bharat - PM-JAY (₹5L coverage, 50 Cr beneficiaries)
- National Health Mission
- Janani Suraksha Yojana

**Education:**
- Samagra Shiksha Abhiyan (15.6 Cr students)
- PM SHRI Schools
- Mid-Day Meal Scheme (11.8 Cr children)

**Employment:**
- MGNREGA (7.79 Cr households)
- PM Kaushal Vikas Yojana (1 Cr+ youth)

**Agriculture:**
- PM-KISAN (₹6,000/year, 11 Cr farmers)
- PM Fasal Bima Yojana
- Kisan Credit Card

**Housing:**
- PM Awas Yojana - Urban (1.12 Cr houses)
- PM Awas Yojana - Gramin (2.95 Cr houses)

**Social Welfare:**
- PM Jan Dhan Yojana (50 Cr+ accounts)
- PM Ujjwala Yojana (9.59 Cr women)
- Swachh Bharat Mission (11 Cr toilets)

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend/services/auth-service
npm test

# Run all tests
npm run test:all
```

## 🔄 CI/CD Pipeline

GitHub Actions workflow includes:
- ✅ Frontend build and tests
- ✅ Backend services tests
- ✅ Security scanning (Trivy)
- ✅ Automated deployment
- ✅ Health checks

## 📊 API Documentation

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile
```

### Complaints
```
POST /api/complaints - File new complaint
GET /api/complaints - Get all complaints
GET /api/complaints/:id - Get complaint details
GET /api/complaints/stats - Get statistics
```

### FIRs
```
POST /api/crime/firs - File new FIR
GET /api/crime/firs - Get all FIRs
GET /api/crime/firs/:id - Get FIR details
```

## 🌐 Environment Variables

```env
# Frontend
VITE_API_GATEWAY_URL=http://localhost:4000

# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/iog_db
MONGODB_URI=mongodb://localhost:27017/iog_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
PORT=3001
```

## 📱 Pages

1. Dashboard - Main landing page
2. Services Page - All services catalog
3. All Schemes Page - 30+ government schemes
4. File Complaint Page
5. Complaints List Page
6. Complaint Details Page
7. File FIR Page
8. FIRs List Page
9. Corruption Report Page
10. Government Jobs Portal
11. Education Services Page
12. Healthcare Services Page (Comprehensive)
13. Transport Services Page
14. Business Services Page
15. Housing Services Page
16. Government Policies Page
17. Profile Page
18. Admin Dashboard
19. Officer Dashboard
20. Login Page
21. Register Page

## 🎨 Design

- Chinese Government Portal inspired design
- Pure white background (#FFFFFF)
- Chinese red primary color (#C8102E)
- Blue secondary color (#003DA5)
- 3-tier header (language bar + red header + blue navigation)
- No sidebar navigation
- Minimal border radius (1-2px)
- Clean borders (#DDDDDD)

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Security headers

## 📈 Performance

- Code splitting
- Lazy loading
- Image optimization
- Caching strategy
- Database indexing
- Redis caching

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs** - Found a bug? [Create an issue](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/issues)
2. **Suggest Features** - Have ideas? Share them!
3. **Submit PRs** - Code contributions are welcome
4. **Improve Documentation** - Help others understand the project
5. **Add Government Schemes** - Help us add more schemes
6. **Translate** - Add support for more Indian languages

### Development Workflow

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/India-One-Gov-Platform-IOG-.git
cd India-One-Gov-Platform-IOG-

# 3. Create a feature branch
git checkout -b feature/AmazingFeature

# 4. Make your changes and commit
git add .
git commit -m 'Add some AmazingFeature'

# 5. Push to your fork
git push origin feature/AmazingFeature

# 6. Open a Pull Request
```

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

### Pull Request Guidelines

- ✅ Describe your changes clearly
- ✅ Link related issues
- ✅ Add screenshots for UI changes
- ✅ Ensure all tests pass
- ✅ Update documentation if needed

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

## 💡 Feature Requests

We love new ideas! When suggesting features:
- Explain the use case
- Describe the expected behavior
- Add mockups if possible
- Consider implementation complexity

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Liability and warranty not provided

## 👥 Contributors

Thanks to all contributors who have helped build this platform!

<a href="https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-" />
</a>

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-?style=social)
![GitHub forks](https://img.shields.io/github/forks/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-?style=social)
![GitHub issues](https://img.shields.io/github/issues/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-)
![GitHub pull requests](https://img.shields.io/github/issues-pr/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-)

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- [x] Core platform setup
- [x] 22 pages implementation
- [x] 30+ government schemes
- [x] Multi-language support
- [x] CI/CD pipeline
- [x] Docker deployment

### Phase 2 (In Progress) 🚧
- [ ] Mobile app (React Native)
- [ ] AI chatbot integration
- [ ] Voice assistance
- [ ] Offline mode
- [ ] PWA support

### Phase 3 (Planned) 📋
- [ ] Blockchain for transparency
- [ ] Biometric authentication
- [ ] Real-time analytics dashboard
- [ ] Integration with DigiLocker
- [ ] SMS/WhatsApp notifications

## 📞 Support & Community

- 💬 **Discussions:** [GitHub Discussions](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/discussions)
- 🐛 **Issues:** [GitHub Issues](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/issues)
- 📧 **Email:** support@iog.gov.in
- 🌐 **Website:** [Coming Soon]

## 🙏 Acknowledgments

- **Government of India** - For open data and scheme information
- **Chinese Government Portals** - Design inspiration
- **Open Source Community** - For amazing tools and libraries
- **Contributors** - For making this project better

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-&type=Date)](https://star-history.com/#adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-&Date)

## 📜 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 🔗 Related Projects

- [Digital India](https://digitalindia.gov.in/)
- [MyGov](https://www.mygov.in/)
- [UMANG](https://web.umang.gov.in/)

---

<div align="center">

**Made with ❤️ for India**

If you find this project useful, please consider giving it a ⭐!

[Report Bug](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/issues) · [Request Feature](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/issues) · [Contribute](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/pulls)

</div>
