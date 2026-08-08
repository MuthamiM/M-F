"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#1B222C] flex items-center justify-center p-4 font-sans antialiased text-[#1B222C]">
      <div className="w-full max-w-md bg-white border border-[#E4E7EB] rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to M&amp;F Website
        </Link>

        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#1B222C] flex items-center justify-center shadow-lg">
            <div className="relative h-6 w-6 rounded-full bg-[#3E4C59] flex items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-white absolute" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#3E4C59] absolute right-0" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Admin Console Login</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Authorize credentials to access internal ticket queues and call center consoles.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mftechnologies.com"
                className="w-full text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] transition-colors"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1B222C] hover:bg-[#3E4C59] text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <span>Authenticate Account</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
