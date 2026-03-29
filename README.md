# Real Estate Buyer Portal

A small full-stack assessment app with:
- Email/password auth (bcrypt hash)
- JWT session in httpOnly cookie
- Buyer dashboard with personal favourites (like/unlike)
- Supabase Postgres + Drizzle ORM

## Live Demo (Vercel)

### https://buyerportalassesment.vercel.app

## Quick run
1. Create `.env.local`:
   - `DATABASE_URL=...`
   - `JWT_SECRET=...` (16+ chars)
2. In Supabase SQL editor, run:
   - `supabase/migrations/supabase_schema.sql`
   - `supabase/migrations/supabase_property_details.sql`
3. Install and run:
   - `npm install`
   - `npm run db:seed`
   - `npm run dev`
4. Open `http://localhost:3000`

## Example flow
`Sign up -> Login -> Open dashboard -> Add favourite -> Remove favourite -> Sign out`

## Core routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/favourites`
- `POST /api/favourites`
- `DELETE /api/favourites/:propertyId`
