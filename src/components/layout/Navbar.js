'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, Users, Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    // Simple check: if we are on landing page or login, assume not logged in context visually for now.
    // In a real app, we'd use a Context Provider or check cookies client-side (though cookies are httpOnly).
    // Since we set a client-side readable cookie "auth=true" in login page *as well* (for this demo), we can check that.
    // HOWEVER, for this demo, let's rely on the middleware to protect routes, and here just show links based on checking document.cookie (not ideal but works for demo) OR
    // simpler: Just show the links. The middleware protects the routes.
    // BUT user asked for "if not logged in only home page accessible".
    // Let's use a simple client-side check if we are on dashboard/patients to show navbar options.

    // Better approach for this demo: Check if we are NOT on home/login page.
    const isPublicPage = pathname === '/' || pathname === '/login';

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"; // Clear client backup cookie
        router.push('/');
        router.refresh();
    };

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
            <nav className="glass mx-auto flex items-center justify-between rounded-full px-6 py-3 shadow-2xl shadow-black/5">
                <Link href="/" className="flex items-center gap-2 text-blue-500 transition-colors hover:text-blue-400">
                    <Activity className="h-6 w-6" />
                    <span className="font-bold text-lg hidden sm:block">HealthPulse</span>
                </Link>

                <div className="flex items-center gap-1">
                    {!isPublicPage ? (
                        <>
                            <NavLink href="/dashboard" icon={<Activity className="h-5 w-5" />} label="Dashboard" isActive={pathname === '/dashboard'} />
                            <NavLink href="/patients" icon={<Users className="h-5 w-5" />} label="Patients" isActive={pathname === '/patients'} />
                            <button
                                onClick={handleLogout}
                                className="group relative flex items-center justify-center rounded-full p-3 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        pathname !== '/login' && (
                            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                                <LogIn className="h-4 w-4" />
                                <span>Login</span>
                            </Link>
                        )
                    )}
                </div>
            </nav>
        </header>
    );
}

function NavLink({ href, icon, label, isActive }) {
    return (
        <Link
            href={href}
            className={`group relative flex items-center justify-center rounded-full p-3 transition-colors ${isActive ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-500 hover:bg-blue-500/10 hover:text-blue-500'
                }`}
            title={label}
        >
            {icon}
            <span className="sr-only">{label}</span>
        </Link>
    );
}
