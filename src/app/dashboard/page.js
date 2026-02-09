'use client';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Activity, Heart, Moon, Flame, ArrowRight, AlertTriangle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';

export default function Dashboard() {
    const [greeting, setGreeting] = useState("Good Morning");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        critical: 0,
        sick: 0,
        stable: 0,
        healthy: 0,
    });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await fetch('/api/patients');
            const data = await res.json();
            if (data.success) {
                processStats(data.data);
                setPatients(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch patients", error);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (data) => {
        const newStats = {
            total: data.length,
            critical: data.filter(p => p.status === 'Critical').length,
            sick: data.filter(p => p.status === 'Sick').length,
            stable: data.filter(p => p.status === 'Stable').length,
            healthy: data.filter(p => p.status === 'Healthy').length,
        };
        setStats(newStats);
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {greeting}, <span className="text-gradient">Gouri</span>
                </h1>
                <p className="text-lg text-zinc-400">
                    Admin Overview & Patient Analytics
                </p>
            </div>

            {/* Critical Alert Section */}
            {stats.critical > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-500">Critical Attention Required</h3>
                            <p className="text-red-400/80">
                                You have <span className="font-bold text-white">{stats.critical}</span> patient(s) in critical condition.
                            </p>
                        </div>
                    </div>
                    <Link href="/patients?filter=critical">
                        <Button className="bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20">
                            View Details
                        </Button>
                    </Link>
                </motion.div>
            )}

            {/* Main Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Patients"
                    value={stats.total}
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                    subtext="Registered in system"
                    color="text-blue-400"
                />
                <StatCard
                    title="Critical Cases"
                    value={stats.critical}
                    icon={<AlertTriangle className="h-6 w-6 text-rose-500" />}
                    subtext="Requires immediate attention"
                    color="text-rose-400"
                />
                <StatCard
                    title="Sick / Treatment"
                    value={stats.sick}
                    icon={<Activity className="h-6 w-6 text-amber-500" />}
                    subtext="Under active care"
                    color="text-amber-400"
                />
                <StatCard
                    title="Healthy / Stable"
                    value={stats.healthy + stats.stable}
                    icon={<Heart className="h-6 w-6 text-emerald-500" />}
                    subtext="Routine monitoring"
                    color="text-emerald-400"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Analytics Chart */}
                <Card className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">Patient Distribution</h3>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-4">
                        <StatusBar label="Critical" count={stats.critical} total={stats.total} color="bg-rose-500" />
                        <StatusBar label="Sick" count={stats.sick} total={stats.total} color="bg-amber-500" />
                        <StatusBar label="Stable" count={stats.stable} total={stats.total} color="bg-blue-500" />
                        <StatusBar label="Healthy" count={stats.healthy} total={stats.total} color="bg-emerald-500" />
                    </div>
                </Card>

                {/* Recent Patients List */}
                <Card className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">Recent Admissions</h3>
                        <Link href="/patients">
                            <Button variant="ghost" className="h-8 px-3 text-sm">
                                View All
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {loading ? (
                            <div className="text-zinc-500 text-center py-4">Loading patients...</div>
                        ) : patients.slice(0, 4).map((patient) => (
                            <div
                                key={patient._id}
                                className="flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                   
                                    <div>
                                        <div className="font-medium text-white">{patient.name}</div>
                                        <div className="text-xs text-zinc-400">{patient.condition}</div>
                                    </div>
                                </div>
                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${patient.status === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                        patient.status === 'Sick' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-emerald-500/10 text-emerald-400'
                                    }`}>
                                    {patient.status}
                                </div>
                            </div>
                        ))}
                        {patients.length === 0 && !loading && (
                            <div className="text-zinc-500 text-center py-4">No patients found.</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, subtext, color }) {
    return (
        <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">{title}</span>
                <div className="rounded-full bg-white/5 p-2">{icon}</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className={`text-xs font-medium ${color}`}>{subtext}</div>
            </div>
        </Card>
    );
}

function StatusBar({ label, count, total, color }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-zinc-300 font-medium">{label}</span>
                <span className="text-zinc-400">{count} ({Math.round(percentage)}%)</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    );
}
