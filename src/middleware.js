import { NextResponse } from 'next/server';

export function middleware(request) {
    const authCookie = request.cookies.get('auth');
    const { pathname } = request.nextUrl;

    // Protected routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/patients')) {
        if (!authCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect to dashboard if already logged in and trying to access login
    if (pathname.startsWith('/login')) {
        if (authCookie) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/patients/:path*', '/login'],
};
