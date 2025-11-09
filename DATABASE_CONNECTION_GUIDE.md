# 🔌 Database Connection Guide

## ⚠️ Important: This is PostgreSQL, NOT MySQL!

Your Supabase database uses **PostgreSQL**. MySQL clients won't work.

---

## Option 1: Prisma Studio (Easiest - Already Running!)

**Prisma Studio is now running at:**
👉 **http://localhost:5555**

Just open that URL in your browser to see all your tables and data!

**Features:**
- ✅ Visual table browser
- ✅ Edit data directly
- ✅ Filter and search
- ✅ See relationships
- ✅ No configuration needed

---

## Option 2: Supabase Dashboard (Cloud-based)

**Best for quick viewing:**
- Tables: https://supabase.com/dashboard/project/bsiepkuevunvxuokzlub/editor
- Users: https://supabase.com/dashboard/project/bsiepkuevunvxuokzlub/auth/users
- SQL Editor: https://supabase.com/dashboard/project/bsiepkuevunvxuokzlub/sql/new

---

## Option 3: VS Code Database Client Extension

**If you want to use the Database Client extension in VS Code:**

### Fix Your Connection:

1. Open Database Client extension sidebar
2. Click "+ Add Connection"
3. **Select "PostgreSQL"** (NOT MySQL!)
4. Enter these settings:

```
Connection Name: Supabase Code-Agent
Server Type: PostgreSQL  ← IMPORTANT!
Host: aws-1-us-east-1.pooler.supabase.com
Port: 6543
Username: postgres
Password: postgres@231999
Database: postgres
SSL: Enable
```

5. Click "Connect"

### Why It Failed Before:

❌ You selected MySQL → Won't work
✅ You need PostgreSQL → Will work

---

## Option 4: Command Line (psql)

```bash
# Install PostgreSQL client
brew install postgresql

# Connect
psql "postgresql://postgres:postgres@231999@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"

# List tables
\dt

# Query users
SELECT * FROM users;

# Exit
\q
```

---

## Your Database Details

```
Type: PostgreSQL (NOT MySQL!)
Host: aws-1-us-east-1.pooler.supabase.com
Port: 6543 (Transaction pooler)
Database: postgres
Username: postgres
Password: postgres@231999
SSL: Required
```

---

## Current Tables (9 total)

1. **users** - User accounts
2. **workspaces** - Team workspaces
3. **workspace_members** - Workspace membership
4. **tasks** - Agent tasks
5. **agent_runs** - Task execution logs
6. **refresh_tokens** - JWT refresh tokens
7. **api_keys** - API access keys
8. **usage_stats** - Usage analytics
9. **audit_logs** - Security audit trail

Plus Supabase auth tables in `auth` schema.

---

## Quick Check Your Data

**Registered Users:**
- demo@example.com
- user@example.com

**View in browser:**
- Prisma Studio: http://localhost:5555
- Supabase: https://supabase.com/dashboard/project/bsiepkuevunvxuokzlub/auth/users

---

## Troubleshooting

### "Connection timeout"
- Make sure you selected **PostgreSQL**, not MySQL
- Check port is 6543, not 3306 (MySQL port)

### "Authentication failed"
- Username: `postgres` (not `postgres.bsiepkuevunvxuokzlub`)
- Password: `postgres@231999`
- Make sure to URL-encode the @ if needed

### "SSL required"
- Enable SSL in connection settings
- Or add `?sslmode=require` to connection string

---

## Recommended Tools

**For VS Code:**
- Database Client (cweijan.vscode-mysql-client2) - Supports PostgreSQL!
- PostgreSQL (chris-kolkman.vscode-postgres)

**Standalone:**
- Prisma Studio (http://localhost:5555) ← Already running!
- pgAdmin - Official PostgreSQL GUI
- TablePlus - Modern, beautiful
- DBeaver - Universal database tool

---

## Summary

✅ **Easiest**: Open http://localhost:5555 (Prisma Studio)
✅ **Cloud**: Use Supabase Dashboard
✅ **VS Code**: Use Database Client with **PostgreSQL** (not MySQL!)

**Remember**: Your database is PostgreSQL, not MySQL!
