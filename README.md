## EnglishKale Web Landing

This is the Next.js bento-style landing page for EnglishKale, featuring:

- Hero section with APK download CTA
- Lessons showcase
- Translation showcase
- Research/trust messaging

## Getting Started

1) Install dependencies:

```bash
npm install
```

2) Configure the APK download URL:

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_APK_URL` in `.env.local` to your hosted APK.
Also set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MODEL_API_URL` (for `/translate`)

3) Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start local dev server
- `npm run lint` - run lint checks
- `npm run build` - production build

## Notes

- If `NEXT_PUBLIC_APK_URL` is missing, download buttons display an unavailable state.
- This app uses the App Router and Tailwind CSS.
- Mobile-aligned flow on web:
  - Register (`/signup`) -> Consent (`/consent`) -> Lessons (`/lessons`)
  - Login (`/login`) -> Lessons (`/lessons`)
  - Translation (`/translation`) calls `${NEXT_PUBLIC_MODEL_API_URL}/translate` with fallback.

## Environment variables
- `NEXT_PUBLIC_APK_URL`: points to the served APK file (default: `/apk/english-kale.apk`)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase auth + database connectivity
- `NEXT_PUBLIC_MODEL_API_URL`: translation service base URL (default: `https://leeroykip-english-kale.hf.space`)
