# Setup Instructions - Enterprise Agentic IDE

## 🎯 What We've Built (Week 1, Day 1-2)

You now have a complete backend API foundation with:
- ✅ Express REST API with TypeScript
- ✅ WebSocket server for real-time updates
- ✅ Complete Prisma database schema (9 models)
- ✅ Logging, error handling, security middleware
- ✅ All dependencies installed
- ✅ Docker support

## 🚀 Quick Start Guide

### Step 1: Set Up Database (Choose One Option)

#### Option A: Supabase (Recommended - Easiest)
1. Go to [https://supabase.com](https://supabase.com)
2. Create free account
3. Create new project
4. Copy the "Connection String" (Direct connection)
5. It looks like: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
postgresql://postgres:[YOUR_PASSWORD]@db.bsiepkuevunvxuokzlub.supabase.co:5432/postgres
#### Option B: Railway (Also Easy)
1. Go to [https://railway.app](https://railway.app)
2. Create free account
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the `DATABASE_URL` from the PostgreSQL service

#### Option C: Local PostgreSQL
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
createdb agentic_ide

# Your DATABASE_URL will be:
# postgresql://localhost:5432/agentic_ide
```

### Step 2: Set Up Redis (Choose One Option)

#### Option A: Upstash (Recommended - Free)
1. Go to [https://upstash.com](https://upstash.com)
2. Create free account
3. Create Redis database
4. Copy the `UPSTASH_REDIS_REST_URL`

#### Option B: Local Redis
```bash
# macOS
brew install redis
brew services start redis

# Your REDIS_URL will be:
# redis://localhost:6379
```

### Step 3: Configure Environment

Edit the `.env` file in the project root:

```env
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database - PASTE YOUR DATABASE_URL HERE
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# Redis - PASTE YOUR REDIS_URL HERE
REDIS_URL=redis://localhost:6379

# JWT - Generate a random secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-openssl-rand-base64-32
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-also-use-openssl-rand-base64-32
JWT_REFRESH_EXPIRES_IN=7d

# OpenAI - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic (optional for now)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3001,vscode://extension

# Logging
LOG_LEVEL=info

# Cost Limits (in cents)
DEFAULT_USER_BUDGET_CENTS=1000
DEFAULT_TASK_BUDGET_CENTS=10

# WebSocket
WS_PORT=3001
WS_HEARTBEAT_INTERVAL=30000
```

**Generate secure JWT secrets:**
```bash
# Run these commands to generate random secrets
openssl rand -base64 32  # Use for JWT_SECRET
openssl rand -base64 32  # Use for JWT_REFRESH_SECRET
```

### Step 4: Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# (Optional) Open Prisma Studio to view your database
npm run prisma:studio
```

### Step 5: Start the Server

```bash
# Start in development mode (with auto-reload)
npm run dev
```

You should see:
```
🚀 API Server running on port 3000
📝 Environment: development
🔗 Health check: http://localhost:3000/health
✅ Database connected successfully
🔌 WebSocket Server running on port 3001
```

### Step 6: Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:3000/health

# Should return:
# {"status":"ok","timestamp":"2025-11-07T...","uptime":1.234,"version":"v1"}

# API info
curl http://localhost:3000/api/v1
```

---

## 🎉 Success! What's Next?

### Current Status
- ✅ Backend API running
- ✅ Database connected
- ✅ WebSocket server active
- ⏳ Authentication (Day 3-4)
- ⏳ Task execution (Day 5-7)
- ⏳ LLM integration (Week 3)

### Next: Implement Authentication (Day 3-4)

We'll build:
1. User registration with password hashing
2. Login with JWT tokens
3. Token refresh mechanism
4. Protected routes middleware

See [WEEK1_PROGRESS.md](WEEK1_PROGRESS.md) for detailed next steps.

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check your `DATABASE_URL` is correct
- Make sure database is running
- Try connecting with `psql` or a database client

### "ECONNREFUSED Redis"
- Check Redis is running: `redis-cli ping` should return `PONG`
- Verify `REDIS_URL` in `.env`

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Port already in use
- Change `PORT` in `.env` to different port (e.g., 3002)
- Or kill process using the port

---

## 📁 Project Structure

```
Code-Agent/
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client
│   │   └── logger.ts          # Winston logger
│   ├── middleware/
│   │   ├── auth.ts           # JWT auth (Day 3-4)
│   │   ├── errorHandler.ts   # Error handling
│   │   └── requestLogger.ts  # HTTP logging
│   ├── routes/
│   │   ├── auth.routes.ts    # Auth endpoints
│   │   ├── task.routes.ts    # Task management
│   │   ├── workspace.routes.ts # Workspaces
│   │   └── user.routes.ts    # User management
│   ├── services/
│   │   ├── auth.service.ts   # Auth logic (Day 3-4)
│   │   ├── task.service.ts   # Task logic (Day 5-7)
│   │   └── websocket.ts      # WebSocket server
│   └── index.ts              # App entry point
├── prisma/
│   └── schema.prisma         # Database schema
├── .env                      # Your environment variables
├── package.json              # Dependencies
└── README.md                 # API documentation
```

---

## 💻 Development Commands

```bash
# Development
npm run dev              # Start with auto-reload
npm run build            # Build for production
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Create migration
npm run prisma:studio    # Open database GUI
npm run prisma:push      # Push schema (dev only)

# Code Quality
npm run type-check       # TypeScript check
npm run lint             # Lint code
npm run test             # Run tests (coming soon)
```

---

## 🔐 Security Checklist

Before deploying to production:
- [ ] Change all default secrets in `.env`
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable database SSL
- [ ] Review Prisma migrations

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [6-Week Plan](./ACCELERATED_6WEEK_PLAN.md)
- [Week 1 Progress](./WEEK1_PROGRESS.md)

---

## 🆘 Need Help?

1. Check [WEEK1_PROGRESS.md](./WEEK1_PROGRESS.md) for detailed status
2. Review [ACCELERATED_6WEEK_PLAN.md](./ACCELERATED_6WEEK_PLAN.md) for roadmap
3. Open an issue on GitHub
4. Check the logs in `logs/` directory

**Current Phase**: Week 1, Day 1-2 ✅ COMPLETE
**Next Phase**: Week 1, Day 3-4 → Authentication System
