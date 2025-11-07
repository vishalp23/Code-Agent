# Next Steps - Database Setup

## Current Status ✅

1. ✅ Backend API structure created
2. ✅ Prisma schema designed (9 models)
3. ✅ Dependencies installed
4. ✅ Environment configured with Supabase
5. ✅ Prisma Client generated
6. ✅ SQL migration file generated

## What You Need to Do NOW (5 minutes)

### Step 1: Run the SQL Migration in Supabase

The automated migration doesn't work due to connection pooler limitations. You need to run the SQL manually:

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/bsiepkuevunvxuokzlub
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

2. **Copy the SQL Migration**
   - Open this file: `/Users/vishalpatil/Code-Agent/apps/api/initial_schema.sql`
   - Copy ALL the contents (263 lines)

3. **Paste and Run**
   - Paste into Supabase SQL Editor
   - Click "Run" button (or Cmd+Enter)
   - Wait for "Success" message

4. **Verify Tables**
   - Click "Table Editor" in left sidebar
   - You should see 9 new tables:
     - users
     - workspaces
     - workspace_members
     - tasks
     - agent_runs
     - refresh_tokens
     - api_keys
     - usage_stats
     - audit_logs

### Step 2: Start the Backend

After the tables are created:

```bash
cd /Users/vishalpatil/Code-Agent/apps/api
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📊 API Version: v1
🔌 WebSocket server running on port 3001
```

### Step 3: Test the API

Open a new terminal and test:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-07T...",
  "environment": "development"
}
```

## What's Next After Setup

Once the backend is running, you're ready for **Week 1, Day 3-4**: Authentication System

This includes:
- User registration endpoint
- Login with JWT tokens
- Password hashing with bcrypt
- Token refresh logic
- Protected routes middleware

See [WEEK1_PROGRESS.md](./WEEK1_PROGRESS.md) for detailed Day 3-4 tasks.

## Troubleshooting

### "Can't reach database server"
- Make sure you ran the SQL in Supabase SQL Editor first
- The connection pooler doesn't support migrations, only queries

### "Tables already exist"
- Tables were already created, skip to Step 2
- Run `npm run dev` to start the backend

### "Connection refused to Redis"
- Redis is optional for now
- Install with: `brew install redis && brew services start redis`
- Or comment out Redis code in `src/index.ts` for now

## Files Reference

- **SQL Migration**: `apps/api/initial_schema.sql`
- **Setup Guide**: `apps/api/SUPABASE_SETUP.md`
- **Environment**: `apps/api/.env`
- **Database Schema**: `apps/api/prisma/schema.prisma`

## Summary

1. Copy SQL from `initial_schema.sql`
2. Paste and run in Supabase SQL Editor
3. Run `npm run dev` in apps/api/
4. Test with `curl http://localhost:3000/health`
5. Move on to Day 3-4 authentication tasks

**Total time**: 5 minutes

Let me know when the tables are created and the server is running!
