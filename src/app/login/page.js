'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            // Set a simple cookie for client-side check (in a real app, use httpOnly cookies from server)
            document.cookie = "auth=true; path=/";
            router.push('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md p-8 bg-black/40 border-white/10 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-zinc-400">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <Button className="w-full h-12 text-lg">Sign In</Button>
                </form>
            </Card>
        </div>
    );
}
