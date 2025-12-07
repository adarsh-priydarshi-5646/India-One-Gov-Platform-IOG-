# Contributing to India One-Gov Platform (IOG)

Thank you for your interest in contributing to the India One-Gov Platform! This document provides comprehensive guidelines for contributing to the project.

## 🌟 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding New Features](#adding-new-features)
- [Bug Reports](#bug-reports)
- [Community](#community)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **PostgreSQL** (v15.0 or higher)
- **MongoDB** (v7.0 or higher)
- **Redis** (v7.0 or higher)
- **Git** (v2.30.0 or higher)
- **Docker** (optional, for containerized development)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/India-One-Gov-Platform-IOG-.git
cd India-One-Gov-Platform-IOG-
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-.git
```

## 🛠️ Development Setup

### Step 1: Database Setup

#### PostgreSQL Setup

```bash
# Create database
createdb iog_db

# Create user (if needed)
createuser iog_user -P

# Grant privileges
psql -d iog_db -c "GRANT ALL PRIVILEGES ON DATABASE iog_db TO iog_user;"
```

#### MongoDB Setup

```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Or use MongoDB Atlas (recommended)
# Get connection string from https://cloud.mongodb.com
```

#### Redis Setup

```bash
# Start Redis
redis-server

# Or use Redis Cloud (recommended)
```

### Step 2: Environment Configuration

Create `.env` files for each service:

#### Backend Services (.env)

```bash
# Auth Service (backend/services/auth-service/.env)
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://iog_user:password@localhost:5432/iog_db
MONGODB_URI=mongodb://localhost:27017/iog_auth
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# Complaint Service (backend/services/complaint-service/.env)
PORT=3002
NODE_ENV=development
DATABASE_URL=postgresql://iog_user:password@localhost:5432/iog_db
MONGODB_URI=mongodb://localhost:27017/iog_complaints
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Crime Service (backend/services/crime-service/.env)
PORT=3003
NODE_ENV=development
DATABASE_URL=postgresql://iog_user:password@localhost:5432/iog_db
MONGODB_URI=mongodb://localhost:27017/iog_crime
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API Gateway (backend/api-gateway/.env)
PORT=4000
NODE_ENV=development
AUTH_SERVICE_URL=http://localhost:3001
COMPLAINT_SERVICE_URL=http://localhost:3002
CRIME_SERVICE_URL=http://localhost:3003
CORRUPTION_SERVICE_URL=http://localhost:3004
EMPLOYMENT_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3006
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

#### Frontend (.env)

```bash
# frontend/.env
VITE_API_GATEWAY_URL=http://localhost:4000
VITE_APP_NAME=India One-Gov Platform
VITE_APP_VERSION=1.0.0
```

### Step 3: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install each service dependencies
cd services/auth-service && npm install && cd ../..
cd services/complaint-service && npm install && cd ../..
cd services/crime-service && npm install && cd ../..
cd services/corruption-service && npm install && cd ../..
cd services/employment-service && npm install && cd ../..
cd services/notification-service && npm install && cd ../..

# Install API Gateway dependencies
cd api-gateway && npm install && cd ..

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 4: Database Migration

```bash
# Run migrations for each service
cd backend/services/auth-service
npm run migrate

cd ../complaint-service
npm run migrate

cd ../crime-service
npm run migrate
```

### Step 5: Start Development Servers

#### Option 1: Start All Services (Recommended)

```bash
# From root directory
npm run dev:all
```

#### Option 2: Start Services Individually

```bash
# Terminal 1: Auth Service
cd backend/services/auth-service
npm run dev

# Terminal 2: Complaint Service
cd backend/services/complaint-service
npm run dev

# Terminal 3: Crime Service
cd backend/services/crime-service
npm run dev

# Terminal 4: API Gateway
cd backend/api-gateway
npm run dev

# Terminal 5: Frontend
cd frontend
npm run dev
```

### Step 6: Verify Setup

1. **Frontend:** http://localhost:3000
2. **API Gateway:** http://localhost:4000/health
3. **Auth Service:** http://localhost:3001/health
4. **Complaint Service:** http://localhost:3002/health
5. **Crime Service:** http://localhost:3003/health

## 📁 Project Structure

```
India-One-Gov-Platform-IOG-/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # CI/CD pipeline
├── backend/
│   ├── api-gateway/           # Unified API Gateway
│   │   ├── src/
│   │   │   ├── index.ts       # Gateway entry point
│   │   │   ├── routes/        # Route definitions
│   │   │   └── middleware/    # Gateway middleware
│   │   └── package.json
│   ├── services/
│   │   ├── auth-service/      # Authentication service
│   │   │   ├── src/
│   │   │   │   ├── controllers/
│   │   │   │   ├── models/
│   │   │   │   ├── routes/
│   │   │   │   ├── middleware/
│   │   │   │   ├── utils/
│   │   │   │   └── index.ts
│   │   │   └── package.json
│   │   ├── complaint-service/ # Complaint management
│   │   ├── crime-service/     # FIR management
│   │   ├── corruption-service/
│   │   ├── employment-service/
│   │   └── notification-service/
│   └── database/
│       ├── migrations/        # Database migrations
│       └── seeds/             # Seed data
├── frontend/
│   ├── public/
│   │   └── locales/           # Translation files
│   │       ├── en/
│   │       ├── hi/
│   │       ├── ta/
│   │       ├── te/
│   │       ├── bn/
│   │       └── mr/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout/
│   │   │   └── AIAssistant/
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration
│   │   ├── data/              # Static data
│   │   ├── i18n/              # i18n configuration
│   │   ├── theme.ts           # MUI theme
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   └── package.json
├── docs/                      # Documentation
├── tests/                     # Test scripts
├── docker-compose.yml         # Docker configuration
├── README.md
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards
- Add comments for complex logic
- Update documentation if needed
- Add tests for new features

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Run all checks
npm run validate
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Select your feature branch
- Fill in the PR template
- Submit the PR

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use async/await instead of promises
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for public APIs

```typescript
// Good
const getUserById = async (userId: string): Promise<User> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

// Bad
function getUser(id) {
  return User.findById(id);
}
```

### React Components

- Use functional components with hooks
- Use TypeScript for props
- Keep components small and focused
- Use meaningful component names
- Extract reusable logic into custom hooks

```typescript
// Good
interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <Card>
      <Typography>{user.name}</Typography>
      <Button onClick={() => onEdit(user.id)}>Edit</Button>
    </Card>
  );
};
```

### File Naming

- Use PascalCase for components: `UserCard.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use kebab-case for CSS: `user-card.css`
- Use descriptive names

### CSS/Styling

- Use Material-UI's `sx` prop for styling
- Keep styles close to components
- Use theme variables for colors
- Maintain consistent spacing

```typescript
<Box
  sx={{
    p: 2,
    bgcolor: 'background.paper',
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
  }}
>
  Content
</Box>
```

## 🧪 Testing Guidelines

### Unit Tests

```typescript
describe('getUserById', () => {
  it('should return user when found', async () => {
    const user = await getUserById('123');
    expect(user).toBeDefined();
    expect(user.id).toBe('123');
  });

  it('should throw error when user not found', async () => {
    await expect(getUserById('invalid')).rejects.toThrow('User not found');
  });
});
```

### Integration Tests

```typescript
describe('POST /api/auth/login', () => {
  it('should login user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        phoneNumber: '+919876543210',
        password: 'Test@123456',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
```

## 📋 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```bash
feat(auth): add password reset functionality

- Add forgot password endpoint
- Add reset password endpoint
- Add email notification for password reset

Closes #123

fix(complaint): resolve file upload issue

The file upload was failing due to incorrect MIME type validation.
Updated the validation to accept all image formats.

Fixes #456

docs(readme): update installation instructions

Added detailed steps for MongoDB setup and environment configuration.
```

## 🔍 Pull Request Process

### Before Submitting

1. ✅ Update your branch with latest main
2. ✅ Run all tests and ensure they pass
3. ✅ Run linting and fix any issues
4. ✅ Update documentation if needed
5. ✅ Add screenshots for UI changes
6. ✅ Test on different browsers (if frontend)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged

## ✨ Adding New Features

### Adding a New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add translations in `frontend/public/locales/`
4. Add navigation link if needed
5. Update documentation

### Adding a New Service

1. Create service directory in `backend/services/`
2. Set up Express server
3. Add database models
4. Create controllers and routes
5. Add middleware
6. Update API Gateway routes
7. Add tests
8. Update documentation

### Adding a Government Scheme

1. Add scheme data in `frontend/src/data/governmentSchemes.ts`
2. Include accurate information:
   - Scheme name
   - Ministry
   - Launch year
   - Coverage
   - Beneficiaries
   - Eligibility
   - Official website
3. Add translations
4. Update AllSchemesPage if needed

### Adding a New Language

1. Create translation file in `frontend/public/locales/[lang]/translation.json`
2. Translate all keys
3. Add language to `frontend/src/i18n/config.ts`
4. Add language selector option in header
5. Test all pages with new language

## 🐛 Bug Reports

### Before Reporting

1. Check if the bug is already reported
2. Try to reproduce the bug
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
Add screenshots if applicable

**Environment:**
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node version: [e.g., 18.17.0]
- App version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

## 💬 Community

### Communication Channels

- **GitHub Discussions:** For general questions and discussions
- **GitHub Issues:** For bug reports and feature requests
- **Pull Requests:** For code contributions

### Getting Help

- Check the [README](README.md) first
- Search existing issues
- Ask in GitHub Discussions
- Be respectful and patient

### Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Acknowledged in the community

## 🎯 Areas for Contribution

### High Priority

- 🔴 Adding more government schemes
- 🔴 Improving accessibility
- 🔴 Adding more Indian languages
- 🔴 Performance optimization
- 🔴 Security enhancements

### Medium Priority

- 🟡 UI/UX improvements
- 🟡 Documentation improvements
- 🟡 Test coverage increase
- 🟡 Code refactoring

### Good First Issues

Look for issues labeled `good first issue` - these are perfect for newcomers!

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🙏 Thank You!

Thank you for contributing to the India One-Gov Platform! Your efforts help make government services more accessible to millions of Indians.

Together, we can build a more transparent, efficient, and citizen-centric governance system.

---

**Questions?** Feel free to ask in [GitHub Discussions](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/discussions)

**Found a bug?** [Report it here](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/issues)

**Want to contribute?** [Start here](https://github.com/adarsh-priydarshi-5646/India-One-Gov-Platform-IOG-/pulls)
