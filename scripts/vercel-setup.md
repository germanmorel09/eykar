# Vercel setup and deploy checklist

This document guides you to connect the GitHub repository to Vercel and deploy the Next.js app.

1) Connect repository

- Go to https://vercel.com and sign in.
- In the dashboard click "Import Project" → choose Git Repository → select the GitHub repo you just created (or search by name).

2) Environment variables

- In your Vercel project, go to Settings → Environment Variables.
- Add the following (set in Preview and Production):
  - NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
  - NEXT_PUBLIC_SUPABASE_ANON_KEY = <your-anon-key>

3) Deploy

- After adding env vars, trigger a redeploy in Vercel (Deployments → Redeploy) or push new commit to main.
- Monitor build logs in Vercel UI.

4) Verify

- Visit the deployed URL and test signup/login flows.
- Open browser console (Network tab) to inspect requests to Supabase.

CLI options (optional)

If you prefer to use the Vercel CLI:

```powershell
npm i -g vercel
vercel login
vercel link   # run inside project folder
vercel --prod
```

Notes
- Do NOT expose the service_role key in client env vars. Use service_role only server-side.
