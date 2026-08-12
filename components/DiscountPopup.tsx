'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function DiscountPopup() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted email:', email);
    setIsOpen(false);
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex w-full max-w-[820px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row min-h-[480px]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left Side: Image Container */}
        <div className="relative h-48 w-full md:h-auto md:w-1/2 bg-zinc-100">
          <Image
            src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop"
            alt="Gallery Interior"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Right Side: Content */}
        <div className="flex w-full flex-col items-center justify-center p-8 text-center md:w-1/2 md:p-12">
          <h2 className="mb-3 text-2xl font-medium tracking-tight text-zinc-900 md:text-3xl">
            Sign up and get 10% off your first order
          </h2>
          <p className="mb-7 text-sm text-zinc-500">
            Latest finds, editor’s choice, VIP perks.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-lg border border-zinc-200 py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0000d6] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#0000b3]"
            >
              <span>Get 10% off now</span>
              <span>&rarr;</span>
            </button>
          </form>

          <button
            onClick={handleClose}
            type="button"
            className="mt-4 text-xs text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
          >
            I don&apos;t want the discount
          </button>
        </div>
      </div>
    </div>
  );
}