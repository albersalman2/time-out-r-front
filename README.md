This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Time Out Online Ordering

Customer ordering is available from the menu page:

```bash
http://localhost:3000/nl/menu
```

The staff order dashboard is available at:

```bash
http://localhost:3000/admin/orders
```

The staff menu dashboard is available at:

```bash
http://localhost:3000/admin/menu
```

The staff login page is available at:

```bash
http://localhost:3000/admin/login
```

Local seeded admin credentials:

```bash
Email: admin@timeout.local
Password: AdminPass12345!
```

Orders use PostgreSQL when `DATABASE_URL` or `POSTGRES_URL` is configured. The app creates the `orders` table automatically on first use. For local development without PostgreSQL, orders are stored in `.data/orders.json`.

Example local PostgreSQL configuration:

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/time_out
```

Database schema scripts are kept in `database/orders.sql` and `database/menu.sql`. The menu dashboard can inject the current TypeScript menu into PostgreSQL with the "Sync current menu" button.

Admin users and sessions use `database/auth.sql` plus `AUTH_SECRET`. Menu photo uploads use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is configured:

```bash
BLOB_STORE_ID=store_xxxxxxxxxxxxxxxx
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxx
STORAGE_ENV=local
```

Menu image keys are stored by environment folder. Local development uploads to `local/menu/...`; production uploads to `production/menu/...`. Set `STORAGE_ENV` to override the folder name, for example `preview` or `staging`.

AWS S3 or Cloudflare R2 can still be used as a fallback with S3-compatible environment variables:

```bash
S3_BUCKET=your-bucket
S3_REGION=auto
S3_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_PUBLIC_BASE_URL=https://cdn.example.com
```

When Blob and S3/R2 variables are not set, uploaded menu images are stored locally under `public/uploads/menu`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
