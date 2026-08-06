import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const [input] = process.argv.slice(2);
if (!input) throw new Error('Usage: node scripts/import-posts.mjs posts.json');
const payload = JSON.parse(readFileSync(input, 'utf8'));
const posts = Array.isArray(payload) ? payload : payload.posts;
const users = Array.isArray(payload) ? [] : (payload.users || []);
const databasePath = resolve(process.env.BLOG_DATABASE_PATH || 'data/blog.db');
mkdirSync(dirname(databasePath), { recursive: true });
const db = new Database(databasePath);
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT NOT NULL, content TEXT NOT NULL, og_image TEXT, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL);
`);
const insert = db.prepare(`INSERT INTO blog_posts (id,title,slug,description,content,og_image,created_at) VALUES (@id,@title,@slug,@description,@content,@og_image,@created_at) ON CONFLICT(id) DO UPDATE SET title=excluded.title,slug=excluded.slug,description=excluded.description,content=excluded.content,og_image=excluded.og_image,created_at=excluded.created_at`);
const insertUser = db.prepare(`INSERT INTO admin_users (id,email,password_hash) VALUES (@id,@email,@password_hash) ON CONFLICT(id) DO UPDATE SET email=excluded.email,password_hash=excluded.password_hash`);
db.transaction(() => {
  posts.forEach((row) => insert.run(row));
  users.forEach((row) => insertUser.run(row));
})();
console.log(`Imported ${posts.length} posts and ${users.length} admin users into ${databasePath}`);
