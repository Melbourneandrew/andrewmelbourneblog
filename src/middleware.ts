import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sessionCookieName, verifySessionToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const valid = await verifySessionToken(request.cookies.get(sessionCookieName)?.value)
  if (!valid) return NextResponse.redirect(new URL('/login', request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path"],
}
