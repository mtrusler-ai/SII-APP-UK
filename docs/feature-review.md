# Feature Review – Startup Ideas Index App

## Summary
- Align the self-service research form, admin pipeline, and `/api/research` contract so end users actually receive generated ideas while the database remains in sync.
- Lock down the research runner endpoint and improve its feedback so operators understand what changed after a run.
- Track create-versus-update outcomes correctly when persisting ideas to avoid confusing metrics and dead UI states.

## Detailed Recommendations

### 1. Unify the research experience for end users
The `SearchForm` component posts audience, region, and budget inputs to `/api/research` and expects an `ideas` array in the JSON response, but the API currently only accepts pre-structured idea records and responds with bookkeeping arrays (`created`, `updated`, `skipped`).【F:app/components/SearchForm.tsx†L22-L117】【F:app/api/research/route.ts†L17-L69】 Because the API never returns generated ideas, the form always shows an empty state, which means the self-serve research feature is effectively broken. Consider:
- Splitting the responsibilities: have `/api/research` orchestrate idea generation (invoking the same finder used by the admin pipeline) and return the generated list for the client while delegating persistence to a secondary call, or
- Updating the client to display the bookkeeping data and moving the user-facing discovery experience to a page that queries Prisma directly once new ideas are saved.
Either approach should ensure the API returns the data the UI expects.

### 2. Harden and clarify the admin research pipeline
The admin screen only guards the "Run Research" button with Clerk's `SignedIn` component, but the server route `/api/research/run` accepts unauthenticated POSTs and will happily write to the database. That means anyone who finds the endpoint can trigger upstream fetches and mutate the data store.【F:app/admin/page.tsx†L12-L22】【F:app/api/research/run/route.ts†L14-L69】 Move the auth check server-side (e.g., require a Clerk session, check `isAdmin`, and reject otherwise) and consider logging who triggered the run. Additionally, the admin UI only shows a raw JSON blob; augmenting the response with human-friendly counts (created vs updated) once issue #3 is addressed will make it clearer what the run accomplished.

### 3. Report create vs update outcomes accurately
Both research persistence handlers push every successful upsert into the `updated` array, even for brand-new ideas, leaving the `created` array empty. Operators therefore cannot tell if a run added anything new, and the admin JSON output is misleading.【F:app/api/research/route.ts†L35-L66】【F:app/api/research/run/route.ts†L43-L65】 Track the create/update path explicitly—e.g., query first or inspect timestamps (`createdAt === updatedAt`)—and push titles into the correct bucket. Once fixed, surface those counts in the admin UI so users immediately see what changed during a run.

