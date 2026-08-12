"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "CredentialsSignin") {
      setError("Invalid email or password");
    } else if (urlError) {
      setError("An authentication error occurred. Please try again.");
    }

    // Clean up loop parameters if redirected back incorrectly
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl && (callbackUrl.includes("/login") || callbackUrl.includes("/account/login"))) {
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (res?.ok) {
        // Respect callbackUrl if valid, otherwise go straight to /admin
        const rawCallback = searchParams.get("callbackUrl");
        const destination =
          rawCallback &&
          !rawCallback.includes("/login") &&
          !rawCallback.includes("/account/login")
            ? rawCallback
            : "/admin";

        // Hard refresh to synchronize NextAuth cookies across server and client components
        window.location.href = destination;
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    const rawCallback = searchParams.get("callbackUrl");
    const destination =
      rawCallback &&
      !rawCallback.includes("/login") &&
      !rawCallback.includes("/account/login")
        ? rawCallback
        : "/admin";

    signIn("google", { callbackUrl: destination });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF9F0] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E8E2D5] shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-[#22211B] mb-6 text-center">
          Sign In
        </h2>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg mb-4 border border-red-200 text-center">
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
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-xs focus:outline-none focus:border-[#22211B] disabled:opacity-50"
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
              disabled={loading}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-xs focus:outline-none focus:border-[#22211B] disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22211B] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#4D3024] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8E2D5]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-[#E8E2D5] text-[#22211B] py-2.5 rounded-xl text-xs font-semibold hover:bg-[#FAF7F0] transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF9F0]" />}>
      <LoginForm />
    </Suspense>
  );
}