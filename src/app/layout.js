import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Background from "@/components/scene/Background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HealthPulse",
  description: "Modern health management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-zinc-100 min-h-screen`}
      >
        <Background />
        <Navbar />
        <main className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
