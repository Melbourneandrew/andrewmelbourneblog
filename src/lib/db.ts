import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export type BlogPost = { id: string; title: string; slug: string; description: string; content: string; og_image: string | null; created_at: string };
const databasePath = resolve(process.env.BLOG_DATABASE_PATH || 'data/blog.db');
mkdirSync(dirname(databasePath), { recursive: true });
const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL, content TEXT NOT NULL, og_image TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
); CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at DESC);`);
db.exec(`CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL
);`);

export const getPosts = () => db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all() as BlogPost[];
export const getPostById = (id: string) => db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id) as BlogPost | undefined;
export const getPostBySlug = (slug: string) => db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug) as BlogPost | undefined;
export function createPost(post: Omit<BlogPost, 'id' | 'created_at'>) {
  db.prepare('INSERT INTO blog_posts (id,title,slug,description,content,og_image) VALUES (?,?,?,?,?,?)')
    .run(crypto.randomUUID(), post.title, post.slug, post.description, post.content, post.og_image);
}
export function updatePost(post: BlogPost) {
  db.prepare('UPDATE blog_posts SET title=?,slug=?,description=?,content=?,og_image=?,created_at=? WHERE id=?')
    .run(post.title, post.slug, post.description, post.content, post.og_image, post.created_at, post.id);
}
export function deletePost(id: string) { db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id); }
export function getAdminByEmail(email: string) {
  return db.prepare('SELECT id, email, password_hash FROM admin_users WHERE lower(email) = lower(?)').get(email) as
    { id: string; email: string; password_hash: string } | undefined;
}
