import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    const body = await request.json();
    const { username, password } = body;

    if (username === 'gouri' && password === 'gouri@123') {
        const cookieStore = await cookies();
        cookieStore.set('auth', 'true', { path: '/', httpOnly: true });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
