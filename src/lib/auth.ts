import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export interface UserSession {
    id: string
    name: string
    studentId: string
    year: number
    isAdmin: boolean
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('user-session')
    if (!session) return null

    try {
        return JSON.parse(session.value) as UserSession
    } catch {
        return null
    }
}

export async function setSession(user: UserSession) {
    const cookieStore = await cookies()
    cookieStore.set('user-session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })
}

export async function clearSession() {
    const cookieStore = await cookies()
    cookieStore.delete('user-session')
}
