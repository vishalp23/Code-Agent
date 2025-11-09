# 🔑 Get Your Supabase Service Role Key (2 minutes)

## Step 1: Open Supabase API Settings

Click this link:
👉 **https://supabase.com/dashboard/project/bsiepkuevunvxuokzlub/settings/api**

## Step 2: Find Service Role Key

1. Scroll down to **"Project API keys"** section
2. Look for the row labeled **"service_role"**
3. Click the **"Reveal"** or **"Copy"** button
4. Copy the entire key (starts with `eyJ...`)

**Note:** Do NOT copy the `anon` key - you need the `service_role` key!

## Step 3: Add to .env

1. Open `apps/api/.env`
2. Go to line 50
3. Replace `your-service-role-key-here` with your copied key

Should look like:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz...
```

## Step 4: Restart Server

```bash
# Stop the current server (Ctrl+C if running)
cd /Users/vishalpatil/Code-Agent/apps/api
npm run dev
```

## Step 5: Test It!

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

You should see:
```json
{
  "success": true,
  "message": "User registered successfully",
  ...
}
```

## ✅ Done!

Your authentication system is now fully working!

See [apps/api/AUTH_TESTING.md](apps/api/AUTH_TESTING.md) for complete testing guide.
