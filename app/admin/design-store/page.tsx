
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminDesignStorePage() {
  return (
    <main className="min-h-screen bg-[#F8F6F3] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#A18B70]">
              TCL Gallery / Administration
            </p>

            <h1 className="font-serif text-3xl text-[#29231F] md:text-4xl">
              Design Store
            </h1>

            <p className="mt-3 text-sm text-[#81766D]">
              Manage your creative designs and digital collections.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-lg border border-[#D8CFC5] px-5 py-3 text-sm text-[#51463C] transition hover:bg-white"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Main Content */}
        <section className="rounded-2xl border border-[#EAE3DB] bg-white p-8 shadow-sm md:p-12">

          <div className="mx-auto max-w-xl py-12 text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5EFE7]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                className="text-[#A18B70]"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>

            <h2 className="font-serif text-2xl text-[#29231F]">
              Welcome to Design Store
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#81766D]">
              Your creative collection management area is ready.
              You can manage your TCL Gallery design store from here.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <Link
                href="/design-store"
                target="_blank"
                className="rounded-lg bg-[#493322] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#634831]"
              >
                View Design Store →
              </Link>

              <Link
                href="/"
                className="rounded-lg border border-[#D8CFC5] px-7 py-3.5 text-sm text-[#51463C] transition hover:bg-[#F8F6F3]"
              >
                Visit Website
              </Link>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs tracking-wide text-[#A69A8E]">
          TCL GALLERY · TODAY CELEBRATE LIFE
        </footer>

      </div>
    </main>
  );
}
