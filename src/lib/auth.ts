import { SignJWT, jwtVerify } from 'jose';
export const sessionCookieName = 'blog_admin_session';
function secret() {
  const value = process.env.BLOG_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('BLOG_SESSION_SECRET must be at least 32 characters');
  return new TextEncoder().encode(value);
}
export const createSessionToken = (email: string) => new SignJWT({ email }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret());
export async function verifySessionToken(token?: string) {
  if (!token) return false;
  try { await jwtVerify(token, secret()); return true; } catch { return false; }
}
