"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F0] text-[#22211B] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[#22211B] text-white flex items-center justify-center font-serif text-2xl font-bold">
            T
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">Create an Account</h2>
          <p className="text-xs text-gray-500 font-medium">Join TCL Gallery to explore & collect fine art</p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#22211B] transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#22211B] transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#22211B] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22211B] hover:bg-[#4D3024] text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs mt-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"} <FiArrowRight size={14} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#4D3024] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}