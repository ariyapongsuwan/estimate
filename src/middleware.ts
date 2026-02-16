import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('user-session')
    const { pathname } = request.nextUrl

    // Define public routes
    const isPublicRoute = pathname === '/login' || pathname.startsWith('/api/auth')

    if (!session && !isPublicRoute) {
        // If not logged in and not a public route, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (session && pathname === '/login') {
        // If already logged in and visiting login page, redirect to home
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Admin protection
    if (pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const user = JSON.parse(session.value)
            if (!user.isAdmin) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
}
