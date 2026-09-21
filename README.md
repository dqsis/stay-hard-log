# Gym Log

Personal gym workout logger — log sets on your phone at the gym, view/edit history from any device. React + Vite PWA, Supabase (Postgres + Auth), deployed on Vercel.

## One-time setup

1. **Supabase project**: create one at [supabase.com](https://supabase.com) (free tier). Note the Project URL and anon public key from Settings → API.
2. **Disable public signup**: Authentication → Settings → turn off "Allow new users to sign up." This is a single-user app; the only account is created manually in the next step.
3. **Create your account**: Authentication → Users → "Add user" (email + password). Dashboard-created users are auto-confirmed. Copy the new user's UUID.
4. **Run the schema**: open the SQL Editor and run `supabase/migrations/0001_init.sql`.
5. **Seed exercises**: open `supabase/seed.sql`, replace every `REPLACE_WITH_YOUR_AUTH_USER_UUID` with the UUID from step 3, then run it in the SQL Editor.
6. **Local env**: `cp .env.example .env.local` and fill in the URL/key from step 1.
7. **GitHub + Vercel**: push this repo to a private GitHub repo, then import it into Vercel (Framework preset: Vite) and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` as environment variables (Production + Preview).

## Local development

```bash
npm install
npm run dev
```

## Notes

- Weight is logged in kilograms only.
- The exercise picker grows as you log new exercises — it's not limited to the seed list.
- No offline-write support: if you're logging with no signal, "Add Set" will show a retry error rather than queueing silently.
