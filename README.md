# Startup Ideas Index — Deploy Kit (Next.js 14 + Prisma + Vercel)

## TL;DR
Upload these files to a **new GitHub repo** → Import to **Vercel** → Add `DATABASE_URL` → **Build Command:** `npm run vercel-build` → Deploy.

## 1) Create a new, empty GitHub repo
- Do **not** add README/.gitignore/license when creating.
- Click **Add file → Upload files** and **drag the contents** of this folder (not the folder itself).
- Commit.

*(Optional)* Use GitHub CLI instead:
```bash
bash scripts/push-github.sh startup-ideas-index-clean private
# or on Windows PowerShell
./scripts/push-github.ps1 -RepoName startup-ideas-index-clean -Visibility private
