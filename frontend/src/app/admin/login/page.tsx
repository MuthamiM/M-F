"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { WaterBackground } from "@/features/landing/components/WaterBackground";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        sessionStorage.setItem("adminToken", resData.data.token);
        router.push("/admin");
      } else {
        setErrorMsg(resData.error || "Authentication failed. Please verify credentials.");
      }
    } catch {
      setErrorMsg("Unable to contact verification server. Ensure the backend is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 font-sans antialiased text-[#1B222C]">
      
      {/* ── Animated Background ─────────────────────────────────────── */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, -120px) scale(1.1); }
          50% { transform: translate(-60px, -200px) scale(0.95); }
          75% { transform: translate(100px, -80px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-100px, 60px) scale(1.15); }
          50% { transform: translate(80px, 120px) scale(0.9); }
          75% { transform: translate(-60px, -40px) scale(1.1); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(120px, -60px) scale(1.2); }
          66% { transform: translate(-80px, 80px) scale(0.85); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-70px, -100px) rotate(90deg); }
          50% { transform: translate(60px, -160px) rotate(180deg); }
          75% { transform: translate(-40px, -60px) rotate(270deg); }
        }
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(90px, 70px) scale(1.1); }
          60% { transform: translate(-50px, -90px) scale(0.95); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes grid-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .orb-1 { animation: float1 20s ease-in-out infinite; }
        .orb-2 { animation: float2 25s ease-in-out infinite; }
        .orb-3 { animation: float3 18s ease-in-out infinite; }
        .orb-4 { animation: float4 30s linear infinite; }
        .orb-5 { animation: float5 22s ease-in-out infinite; }
        .pulse-slow { animation: pulse-glow 4s ease-in-out infinite; }
        .grid-anim { animation: grid-scroll 8s linear infinite; }
        .shimmer-line {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      {/* Flowing water backdrop, shared with the public landing page. */}
      <WaterBackground />
      <div className="absolute inset-0 bg-[#08202d]/60" />
      
      {/* Subtle animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="grid-anim absolute inset-[-40px]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Gradient mesh orbs */}
      <div className="orb-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-600/25 to-cyan-400/10 blur-[100px]" />
      <div className="orb-2 absolute bottom-[5%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-violet-600/20 to-fuchsia-500/10 blur-[100px]" />
      <div className="orb-3 absolute top-[50%] left-[60%] w-[350px] h-[350px] rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-400/10 blur-[80px]" />
      <div className="orb-5 absolute top-[20%] right-[30%] w-[250px] h-[250px] rounded-full bg-gradient-to-bl from-amber-500/10 to-orange-400/5 blur-[70px]" />

      {/* Floating geometric shapes */}
      <div className="orb-4 absolute top-[25%] left-[8%] w-16 h-16 border border-white/[0.06] rounded-2xl" />
      <div className="orb-2 absolute top-[70%] left-[20%] w-10 h-10 border border-white/[0.05] rounded-full" />
      <div className="orb-3 absolute top-[15%] right-[18%] w-20 h-20 border border-white/[0.04] rounded-3xl rotate-45" />
      <div className="orb-1 absolute bottom-[20%] right-[12%] w-8 h-8 border border-white/[0.06] rounded-lg rotate-12" />
      <div className="orb-5 absolute bottom-[35%] left-[40%] w-6 h-6 bg-white/[0.03] rounded-full" />
      <div className="orb-4 absolute top-[60%] right-[35%] w-12 h-12 border border-white/[0.04] rounded-xl" />

      {/* Glowing accent dots */}
      <div className="pulse-slow absolute top-[30%] left-[35%] w-2 h-2 bg-blue-400/40 rounded-full shadow-[0_0_20px_6px_rgba(96,165,250,0.15)]" />
      <div className="pulse-slow absolute top-[65%] right-[25%] w-1.5 h-1.5 bg-violet-400/40 rounded-full shadow-[0_0_20px_6px_rgba(167,139,250,0.15)]" style={{ animationDelay: '1.5s' }} />
      <div className="pulse-slow absolute bottom-[25%] left-[55%] w-2.5 h-2.5 bg-emerald-400/30 rounded-full shadow-[0_0_20px_6px_rgba(52,211,153,0.1)]" style={{ animationDelay: '3s' }} />
      <div className="pulse-slow absolute top-[12%] right-[40%] w-1.5 h-1.5 bg-cyan-400/30 rounded-full shadow-[0_0_15px_5px_rgba(34,211,238,0.1)]" style={{ animationDelay: '2s' }} />

      {/* Shimmer lines */}
      <div className="shimmer-line absolute top-[40%] left-0 right-0 h-[1px]" />
      <div className="shimmer-line absolute top-[60%] left-0 right-0 h-[1px]" style={{ animationDelay: '1.5s' }} />

      {/* ── Glassmorphism Login Card ─────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glow behind card */}
        <div className="absolute -inset-4 bg-gradient-to-b from-blue-500/10 via-violet-500/5 to-transparent rounded-[2rem] blur-2xl" />
        
        <div className="relative bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] space-y-6">
          {/* Top shimmer accent */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-white/40 hover:text-white/80 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to M&amp;F Website
          </Link>

          {/* Brand Logo & Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 flex items-center justify-center shadow-[0_0_30px_4px_rgba(96,165,250,0.08)]">
              <div className="relative h-7 w-7 rounded-full bg-white/10 flex items-center justify-center">
                <span className="h-3.5 w-3.5 rounded-full bg-white/80 absolute" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30 absolute right-0" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Admin Console</h2>
              <p className="text-[11px] text-white/40 max-w-xs mx-auto mt-1 leading-relaxed">
                Authorize credentials to access internal ticket queues and call center consoles.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mftechnologies.com"
                  className="w-full text-xs pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-400/40 focus:bg-white/[0.08] focus:shadow-[0_0_20px_2px_rgba(96,165,250,0.08)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-400/40 focus:bg-white/[0.08] focus:shadow-[0_0_20px_2px_rgba(96,165,250,0.08)] transition-all"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl flex items-start gap-2 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-[0_8px_32px_-4px_rgba(96,165,250,0.3)] hover:shadow-[0_8px_40px_-4px_rgba(96,165,250,0.5)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border border-white/10"
            >
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <span>Authenticate Account</span>
              )}
            </button>
          </form>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}
