// app/design-store/Jewel-tree/page.tsx

export const dynamic = "force-dynamic";

export default function JewelTreePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-[#C4A892]/30 pb-6">
          <h1 className="font-serif text-3xl md:text-4xl text-[#22211B]">
            Jewel Tree Collection
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Discover artisanal jewelry trees, handcrafted display stands, and bespoke decorative pieces.
          </p>
        </header>

        <div className="rounded-2xl border border-[#C4A892]/20 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Products coming soon to this section.
          </p>
        </div>
      </div>
    </main>
  );
}