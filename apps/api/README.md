# Enterprise Agentic IDE - Backend API

Backend API service for the Enterprise Agentic IDE project.

## Quick Start

### 1. Install Dependencies

```bash
cd apps/api
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `OPENAI_API_KEY` - Your OpenAI API key

### 3. Set Up Database

Make sure PostgreSQL is running, then:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at:
- REST API: `http://localhost:3000`
- WebSocket: `ws://localhost:3001`
- Health Check: `http://localhost:3000/health`

## Project Structure

```
apps/api/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/                # Configuration files
│   │   ├── database.ts        # Prisma client
│   │   └── logger.ts          # Winston logger
│   ├── controllers/           # Request handlers (Day 3-4)
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.ts   # Error handling
│   │   ├── notFoundHandler.ts
│   │   └── requestLogger.ts  # HTTP logging
│   ├── models/               # Data models
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   ├── workspace.routes.ts
│   │   └── user.routes.ts
│   ├── services/             # Business logic
│   │   └── websocket.ts      # WebSocket server
│   ├── utils/                # Utility functions
│   └── index.ts              # Application entry point
├── .env.example              # Environment template
├── package.json
└── tsconfig.json
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication (Day 3-4)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Tasks (Day 5-7)
- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get task details
- `PATCH /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Workspaces (Week 5)
- `GET /api/v1/workspaces` - List workspaces
- `POST /api/v1/workspaces` - Create workspace
- `GET /api/v1/workspaces/:id` - Get workspace details

### Users
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/me` - Update current user

## Database Schema

Key models:
- **User** - User accounts with authentication
- **Workspace** - Team workspaces
- **WorkspaceMember** - Workspace membership with roles
- **Task** - Agent task executions
- **AgentRun** - Detailed LLM execution logs
- **UsageStats** - Aggregated usage analytics
- **AuditLog** - Security audit trail

## Development

### Run Tests

```bash
npm test
```

### Type Check

```bash
npm run type-check
```

### Lint Code

```bash
npm run lint
```

### Database Commands

```bash
# Generate Prisma client after schema changes
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# View database in browser
npm run prisma:studio
```

## Next Steps - Week 1

### Day 3-4: Authentication
- [ ] Implement auth controllers
- [ ] JWT token generation
- [ ] Password hashing
- [ ] Auth middleware

### Day 5-7: Agent Orchestrator
- [ ] Task state machine
- [ ] Task queue with BullMQ
- [ ] Basic LLM integration
- [ ] Task CRUD operations

## License

MIT
