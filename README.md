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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## VPS deployment (InterServer)

A production deployment baseline is now included for a Docker-based Ubuntu VPS setup.

### Files added
- Dockerfile for building and running the Next.js app in production mode
- docker-compose.yml for the app plus Nginx reverse proxy
- nginx/conf.d/default.conf for HTTP routing to the app container
- scripts/setup-vps.sh for installing Docker on the server
- scripts/deploy-vps.sh for building and starting the stack
- .env.production.example for production environment variables

### Server steps
1. Copy the example environment file and update it:
   ```bash
   cp .env.production.example .env.production
   ```
2. On the VPS, install Docker:
   ```bash
   bash scripts/setup-vps.sh
   ```
3. From the project root, deploy the stack:
   ```bash
   bash scripts/deploy-vps.sh
   ```
4. Point your domain to the VPS IP and configure SSL via Let's Encrypt or your preferred certificate manager.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






ai rag, memory

screen revamp