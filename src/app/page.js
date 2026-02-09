import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Activity, Shield, Users, Phone, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32 space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl">
          The Future of <span className="text-gradient">Health Tech</span> is Here
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl">
          Streamline patient management, track vitals in real-time, and experience a new era of digital health monitoring with our advanced dashboard.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button className="h-12 px-8 text-lg">Get Started</Button>
          </Link>
          <Button variant="secondary" className="h-12 px-8 text-lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-emerald-400" />}
            title="Secure Data"
            description="Enterprise-grade encryption for all patient records and sensitive medical data."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-blue-400" />}
            title="Real-time Analytics"
            description="Instant insights into patient health trends with our powered dashboard."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-400" />}
            title="Patient Management"
            description="Effortlessly manage patient profiles, history, and appointments in one place."
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl font-bold text-white">Contact Us</h2>
          <div className="flex justify-center gap-8 text-zinc-400">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <span>support@healthpulse.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
