// app/checkout/success/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const displayId = params.orderId || "TCL-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#7B8F50]/15 text-[#7B8F50]">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
          Payment Confirmed
        </p>

        <h1 className="mt-2 font-serif text-3xl font-bold text-[#22211B] md:text-4xl">
          Thank You for Your Order
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Your order has been recorded. Our print masters are preparing your archival artwork.
        </p>

        <div className="mt-8 rounded-2xl border border-[#C4A892]/30 bg-white p-6 text-left shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Order Reference
              </p>
              <p className="text-base font-bold text-[#22211B]">{displayId}</p>
            </div>
            <span className="rounded-full bg-[#FAF8F5] px-3 py-1 text-[11px] font-semibold text-[#4D3024]">
              Processing Print
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span className="font-semibold text-[#22211B]">5–7 Business Days</span>
            </div>
            <div className="flex justify-between">
              <span>Certificate of Authenticity:</span>
              <span className="font-semibold text-[#22211B]">Included in Crate</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-[#22211B] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#4D3024]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}