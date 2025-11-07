# Supabase Database Setup

## Problem
Prisma migrations require direct database access with advisory locks, which doesn't work well with Supabase's connection pooler. The direct database endpoint requires IPv6 connectivity which may not be available on all networks.

## Solution
Run the SQL migration directly in Supabase SQL Editor.

## Steps

### 1. Open Supabase SQL Editor
1. Go to your Supabase project: https://supabase.com/dashboard/project/bsiepkuevunvxuokzlub
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### 2. Copy and Paste the SQL Migration
Copy the entire contents of `initial_schema.sql` file and paste it into the SQL Editor.

The file is located at: `/Users/vishalpatil/Code-Agent/apps/api/initial_schema.sql`

### 3. Run the Migration
Click the **Run** button (or press Cmd+Enter) to execute the SQL.

This will create:
- 2 Enums: `Role`, `TaskStatus`
- 9 Tables: `users`, `workspaces`, `workspace_members`, `tasks`, `agent_runs`, `refresh_tokens`, `api_keys`, `usage_stats`, `audit_logs`
- All indexes and foreign key constraints

### 4. Verify Tables Were Created
After running the SQL:
1. Click on **Table Editor** in the left sidebar
2. You should see all 9 tables listed
3. Click on any table to see its structure

### 5. Update Prisma
After the tables are created in Supabase, generate the Prisma client:

```bash
cd /Users/vishalpatil/Code-Agent/apps/api
npm run prisma:generate
```

### 6. Start the Backend
```bash
npm run dev
```

The backend should now be able to connect to the database using the transaction pooler (port 6543).

## Connection Configuration

The `.env` file is already configured with:

```env
DATABASE_URL=postgresql://postgres.bsiepkuevunvxuokzlub:postgres%40231999@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

This uses the **Transaction pooler** (port 6543) which is compatible with Prisma Client for queries and mutations.

## Why This Approach?

1. **Migrations**: Require direct connection (port 5432) with IPv6 or run via SQL Editor
2. **Application**: Uses transaction pooler (port 6543) for all database operations
3. **Prisma Client**: Works perfectly with the pooler for queries, mutations, and transactions

This is a common pattern for Prisma + Supabase and is documented in their official guides.

## Future Migrations

For future schema changes:
1. Update `prisma/schema.prisma`
2. Generate new migration SQL: `npx prisma migrate diff --from-migrations ./prisma/migrations --to-schema-datamodel ./prisma/schema.prisma --script > migration.sql`
3. Run the SQL in Supabase SQL Editor
4. Run `npm run prisma:generate` to update the Prisma Client

## Alternative: Enable IPv6

If you want to use `prisma migrate` directly, you need:
1. IPv6-enabled network connection
2. Update DIRECT_URL in .env to: `postgresql://postgres.bsiepkuevunvxuokzlub:postgres%40231999@db.bsiepkuevunvxuokzlub.supabase.co:5432/postgres`
3. Add `directUrl = env("DIRECT_URL")` to prisma/schema.prisma

This is not recommended for most development environments.
