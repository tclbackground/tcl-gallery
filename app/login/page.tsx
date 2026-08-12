"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
      return;
    }

    // Redirect to home/dashboard on successful login
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF9F0] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E8E2D5] shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-[#22211B] mb-6 text-center">
          Sign In
        </h2>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#22211B] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-xs focus:outline-none focus:border-[#22211B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#22211B] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-xs focus:outline-none focus:border-[#22211B]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#22211B] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#4D3024] transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}