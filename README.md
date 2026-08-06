# Mobiliq

All-in-one booking and management platform for detailing businesses.

## Features

- **Custom Booking Page** — Each business gets a branded booking page at `mobiliq.com/{slug}`
- **Service Management** — Create services with pricing, duration, and add-ons
- **Booking Dashboard** — View, filter, and manage all bookings with status tracking
- **Team Management** — Add team members with role-based access
- **Multi-tenant** — Organization-based data isolation

## Tech Stack

- Next.js 15 (App Router)
- Supabase (PostgreSQL + Auth)
- Tailwind CSS 4
- TypeScript

## Getting Started

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the Schema

Copy the contents of `supabase-schema.sql` and run it in the Supabase SQL Editor.

### 3. Set Environment Variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 4. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    signup/page.tsx       # Business registration
    login/page.tsx        # Login
    [slug]/page.tsx       # Public booking page
    dashboard/
      layout.tsx          # Sidebar layout + auth
      page.tsx            # Bookings management
      services/page.tsx   # Service CRUD
      team/page.tsx       # Team management
      settings/page.tsx   # Business settings
    api/
      auth/               # Signup, login, logout, me
      org/                # Org settings
      bookings/           # Booking CRUD
      services/           # Service CRUD
      team/               # Team management
      public/[slug]/      # Public endpoints (no auth)
  lib/
    db.ts                # Supabase clients
    auth.ts               # Password/token utils
    verify-auth.ts        # Session verification
```

## License

MIT
