# Andrew Melbourne's Blog

A small Next.js blog.

## Architecture

- Next.js serves the website and admin pages.
- SQLite stores posts and the admin login locally.
- PM2 keeps the app running on the server.

## Run locally

```bash
cp .env.template .env
npm install
npm run dev
```

Set `BLOG_SESSION_SECRET` to a random value of at least 32 characters. SQLite creates `data/blog.db` automatically.
