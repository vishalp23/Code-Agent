# Clean Project Structure

## 📁 Current Directory Layout

```
Code-Agent/                           # Root monorepo
├── apps/                             # Applications
│   ├── vscode-extension/             # VS Code extension (your original extension)
│   │   ├── src/
│   │   │   ├── commands/            # Command implementations
│   │   │   ├── interfaces/          # TypeScript interfaces
│   │   │   ├── utils/               # Utility functions
│   │   │   └── extension.ts         # Main extension entry
│   │   ├── resources/               # HTML, CSS, JS for webview
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api/                          # Backend API (NEW - Week 1)
│   │   ├── prisma/
│   │   │   └── schema.prisma        # Database schema
│   │   ├── src/
│   │   │   ├── config/              # Database, logger
│   │   │   ├── middleware/          # Auth, errors, logging
│   │   │   ├── routes/              # API endpoints
│   │   │   ├── services/            # Business logic, WebSocket
│   │   │   └── index.ts             # Server entry point
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Web dashboard (Week 5)
│       ├── app/                      # Next.js app directory
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                         # Shared packages
│   ├── types/                        # Shared TypeScript types
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                       # Shared utilities
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                       # Shared configurations
│       └── package.json
│
├── .github/                          # GitHub workflows (if needed)
├── .husky/                           # Git hooks
├── node_modules/                     # Dependencies (managed by npm workspaces)
│
├── Configuration Files
├── .env.example                      # Environment template
├── .eslintrc.json                    # ESLint config
├── .gitignore                        # Git ignore rules
├── .prettierrc.json                  # Prettier config
├── .prettierignore                   # Prettier ignore
├── turbo.json                        # Turborepo config
├── tsconfig.base.json                # Base TypeScript config
├── package.json                      # Root package (workspace manager)
└── package-lock.json                 # Lock file
│
└── Documentation
    ├── README.md                     # Project overview
    ├── CURRENT_STATUS.md             # Current state & next steps
    ├── ACCELERATED_6WEEK_PLAN.md     # Complete 6-week roadmap
    ├── WEEK1_PROGRESS.md             # Week 1 detailed plan
    ├── SETUP_INSTRUCTIONS.md         # Quick start guide
    └── License.md                    # MIT License
```

---

## 🗂️ Key Locations

### VS Code Extension
- **Main File**: `apps/vscode-extension/src/extension.ts`
- **Commands**: `apps/vscode-extension/src/commands/`
- **UI**: `apps/vscode-extension/resources/`

### Backend API
- **Server**: `apps/api/src/index.ts`
- **Database**: `apps/api/prisma/schema.prisma`
- **Routes**: `apps/api/src/routes/`
- **WebSocket**: `apps/api/src/services/websocket.ts`

### Shared Code
- **Types**: `packages/types/src/index.ts`
- **Utils**: `packages/shared/src/index.ts`

---

## 📝 Configuration Files

| File | Purpose |
|------|---------|
| `turbo.json` | Turborepo build configuration |
| `tsconfig.base.json` | Shared TypeScript settings |
| `.eslintrc.json` | Code linting rules |
| `.prettierrc.json` | Code formatting rules |
| `package.json` (root) | Workspace configuration |

---

## 🚀 Workspace Commands

All commands run from project root:

```bash
# Development
npm run dev              # Start all dev servers
npm run build            # Build all packages
npm run lint             # Lint all code
npm run test             # Run all tests
npm run type-check       # TypeScript check all

# Individual workspaces
cd apps/api && npm run dev             # Backend only
cd apps/vscode-extension && npm run dev # Extension only
```

---

## 📦 NPM Workspaces

This project uses **npm workspaces** for monorepo management:

- Dependencies are shared when possible
- Each workspace has its own `package.json`
- Root `package.json` manages workspace configuration
- Turborepo handles build orchestration

---

## 🔄 Dependency Flow

```
apps/vscode-extension
    ↓ depends on
packages/types
packages/shared

apps/api
    ↓ depends on
packages/types
packages/shared

apps/web
    ↓ depends on
packages/types
packages/shared
```

---

## ✅ Clean Structure Benefits

1. **No Duplicates** - Single source of truth for each component
2. **Clear Separation** - Extension, API, and Web are separate
3. **Shared Code** - Common types and utilities in `packages/`
4. **Easy Navigation** - Everything in logical locations
5. **Turborepo Ready** - Optimized builds with caching

---

## 🎯 What Was Removed

### Duplicate Code
- ✅ `/src/` (duplicate extension code)
- ✅ `/out/` (old compiled output)
- ✅ `/resources/` (duplicate resources)
- ✅ `tsconfig.json` (root conflict)
- ✅ `code-agent-0.0.1.vsix` (old package)

### Old Documentation
- ✅ `ENTERPRISE_AGENTIC_IDE_PLAN.md`
- ✅ `PHASE_1_IMPLEMENTATION.md`
- ✅ `IMMEDIATE_ACTIONS.md`
- ✅ `VSCODE_FORK_STATUS.md`
- ✅ `CRITICAL_FIXES.md`
- ✅ `MONOREPO_SETUP.md`
- ✅ `TEST_RESULTS.md`

### Old Files
- ✅ `package.json.old`
- ✅ `package-lock.json.old`
- ✅ `test-setup.sh`
- ✅ `/docs/` (empty)
- ✅ `/tools/` (empty)

---

## 📚 Documentation Structure

| Document | Purpose | When to Read |
|----------|---------|-------------|
| [README.md](README.md) | Project overview | First time setup |
| [CURRENT_STATUS.md](CURRENT_STATUS.md) | Current state | Check progress |
| [ACCELERATED_6WEEK_PLAN.md](ACCELERATED_6WEEK_PLAN.md) | Full roadmap | Planning |
| [WEEK1_PROGRESS.md](WEEK1_PROGRESS.md) | Week 1 details | Week 1 tasks |
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Quick start | Getting started |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | This file | Understanding layout |

---

## 🔍 Finding Things

### "Where is the extension code?"
→ `apps/vscode-extension/src/extension.ts`

### "Where is the backend API?"
→ `apps/api/src/index.ts`

### "Where is the database schema?"
→ `apps/api/prisma/schema.prisma`

### "Where are shared types?"
→ `packages/types/src/index.ts`

### "Where do I configure the database?"
→ `apps/api/.env` (create from `.env.example`)

### "Where are the API routes?"
→ `apps/api/src/routes/`

### "Where is the WebSocket server?"
→ `apps/api/src/services/websocket.ts`

---

## 🎨 Code Organization Principles

1. **Separation of Concerns** - Each app is independent
2. **DRY (Don't Repeat Yourself)** - Shared code in `packages/`
3. **Type Safety** - TypeScript everywhere
4. **Monorepo** - Single repo, multiple packages
5. **Convention over Configuration** - Standard structure

---

This structure supports the 6-week hybrid approach while keeping everything organized and maintainable!
