## TODO: update doco

## Set-up your dev server

Make some certs in `.ssl/*`:

```bash

brew install nss mkcert
mkcert -install

# Now we want to generate the cert for this project
mkdir .ssl
mkcert -cert-file .ssl/cert.pem -key-file .ssl/key.pem localhost "*.localhost" localhost 127.0.0.1 ::1
```

[Read more](https://geekflare.com/local-dev-environment-ssl/)

Make a `.env` file:

```bash
HTTPS=true
SSL_CRT_FILE=.ssl/cert.pem
SSL_KEY_FILE=.ssl/key.pem

REACT_APP_SUPABASE_URL=https://API_URL.supabase.co
REACT_APP_SUPABASE_ANON_KEY=API_KEY
SUPABASE_OPENAPI_URL=https://API_URL.supabase.co/rest/v1/?apikey=API_KEY

REACT_APP_SOULECTION_BASE_URL=https://soulection.com/
```

## Generate Typescript Types

```bash
# Can't put this into package.json due to env variables
# TODO: update to use supabase cli https://supabase.com/docs/guides/api/rest/generating-types#generating-types-using-supabase-cli
npx openapi-typescript@5 $SUPABASE_OPENAPI_URL  --output src/types-supabase.d.ts --version 2
```

## Adding new SVG icons

Optimise your files:

```bash
npx svgo -f ~/path/to/input/files ./src/icons
```

Import in a component:

```ts
import { ReactComponent as MyIcon } from "./icons/myicon.svg";
```

## TODO: update doco

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
