'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createSessionToken, sessionCookieName } from '@/lib/auth'
import { getAdminByEmail } from '@/lib/db'
import { compare } from 'bcryptjs'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const admin = getAdminByEmail(email)
  if (!admin || !(await compare(password, admin.password_hash))) {
    redirect('/error')
  }
  const cookieStore = await cookies()
  cookieStore.set(sessionCookieName, await createSessionToken(admin.email), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, path: '/',
  })
  redirect('/admin')
}
