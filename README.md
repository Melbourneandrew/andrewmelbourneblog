# Andrew Melbourne's Blog

A Next.js blog backed by a single local SQLite database. Posts are authored as Markdown files through the admin UI.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Set a strong `BLOG_ADMIN_PASSWORD` and generate the session secret with:

```bash
openssl rand -hex 32
```

The SQLite database is created automatically at `BLOG_DATABASE_PATH`. The database and its WAL sidecars are ignored by Git and must be backed up separately.

## Import posts from Supabase/PostgreSQL

Only the PostgreSQL `db` service is needed for the one-time export. From the existing Supabase Compose directory:

```bash
docker compose up -d --no-deps db
docker exec supabase-db psql -U postgres -d postgres -Atc \
  "select json_build_object(
    'posts', (select coalesce(json_agg(p), '[]'::json) from (select id,title,slug,description,content,og_image,created_at from public.blog_posts order by created_at) p),
    'users', (select coalesce(json_agg(u), '[]'::json) from (select id,email,encrypted_password as password_hash from auth.users) u)
  )" \
  > posts.json
docker compose stop db
```

Copy `posts.json` into the application directory and import it:

```bash
npm run import-posts -- posts.json
```

The importer preserves posts and the existing admin email/password hash. It is idempotent: rows with an existing ID are updated. Verify the post count, login, and pages before retiring the PostgreSQL data.

## Production

The process user needs read/write access to the directory containing `BLOG_DATABASE_PATH`. Back up the database with SQLite's online backup command while the app is running:

```bash
sqlite3 data/blog.db ".backup 'blog-backup.db'"
```
