# Enterprise Agentic IDE

**Enterprise Agentic IDE** is a next-generation development environment built on VS Code, featuring advanced AI agents for autonomous coding, testing, debugging, and more. Designed for enterprise teams with multi-tenancy, authentication, and comprehensive backend services.

**Status**: Week 1, Day 1-2 ✅ Complete + Cleaned | Backend API Ready | 6-Week Hybrid Approach

## 🏗️ Monorepo Structure

This is a Turborepo-based monorepo containing:

```
enterprise-agentic-ide/
├── apps/
│   ├── vscode-extension/    # VS Code extension (original Code Agent)
│   ├── api/                  # Backend API service
│   └── web/                  # Web dashboard (Next.js)
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── shared/               # Shared utilities
│   └── config/               # Shared configurations
├── docs/                     # Documentation
└── tools/                    # Build and deployment tools
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 22.0.0
- **npm** >= 10.0.0
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vishalp23/Code-Agent.git
   cd Code-Agent
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build all packages:**

   ```bash
   npm run build
   ```

4. **Start development servers:**

   ```bash
   npm run dev
   ```

## 📦 Workspaces

### Apps

#### VS Code Extension (`apps/vscode-extension`)
The original Code Agent extension with AI-powered project setup and code generation.

```bash
cd apps/vscode-extension
npm run compile
# Press F5 in VS Code to debug
```

#### API Server (`apps/api`)
Backend service for agent orchestration, authentication, and data management.

```bash
cd apps/api
npm run dev
# Server runs on http://localhost:3000
```

#### Web Dashboard (`apps/web`)
Admin dashboard and user portal (Next.js).

```bash
cd apps/web
npm run dev
# Dashboard runs on http://localhost:3001
```

### Packages

#### Types (`packages/types`)
Shared TypeScript types and interfaces used across all workspaces.

#### Shared (`packages/shared`)
Common utilities, helpers, and functions.

#### Config (`packages/config`)
Shared ESLint, TypeScript, and other configuration files.

## 🛠️ Development

### Available Scripts

```bash
npm run build        # Build all packages
npm run dev          # Start all dev servers
npm run lint         # Lint all packages
npm run test         # Run all tests
npm run format       # Format code with Prettier
npm run type-check   # Type check all packages
npm run clean        # Clean build artifacts
```

### Working with Turborepo

Turborepo caches build outputs and runs tasks in parallel for maximum speed.

```bash
# Build only the API
npm run build --filter=@agentic-ide/api

# Run dev for API and its dependencies
npm run dev --filter=@agentic-ide/api...

# Clear Turborepo cache
npx turbo clean
```

## 📖 Documentation

**Essential Reading**:
- [CURRENT_STATUS.md](./CURRENT_STATUS.md) - 📍 **Start here** - Current state & next steps
- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - 🚀 Quick start guide
- [ACCELERATED_6WEEK_PLAN.md](./ACCELERATED_6WEEK_PLAN.md) - 📅 Complete 6-week roadmap
- [WEEK1_PROGRESS.md](./WEEK1_PROGRESS.md) - 📝 Week 1 detailed plan
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 📁 Directory layout
- [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) - ✨ Recent cleanup details

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
PORT=3000
NODE_ENV=development

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agentic_ide

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_here
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test --filter=@agentic-ide/api

# Run tests in watch mode
npm run test -- --watch
```

## 🚢 Deployment

### Docker

```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Build

```bash
# Build for production
NODE_ENV=production npm run build

# Start production server
npm run start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🔗 Links

- [GitHub Repository](https://github.com/vishalp23/Code-Agent)
- [Issue Tracker](https://github.com/vishalp23/Code-Agent/issues)
- [Discussions](https://github.com/vishalp23/Code-Agent/discussions)

## 📞 Support

For questions or support:
- Open an [issue](https://github.com/vishalp23/Code-Agent/issues)
- Start a [discussion](https://github.com/vishalp23/Code-Agent/discussions)

---

**Built with ❤️ for enterprise development teams**
