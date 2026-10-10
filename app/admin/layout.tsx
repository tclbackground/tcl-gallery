
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import {
  FiGrid,
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiFolder,
  FiUserCheck,
  FiStar,
  FiSettings,
  FiSearch,
  FiBell,
  FiMoon,
  FiPlus,
  FiImage,
  FiBox,
  FiFileText,
} from "react-icons/fi";

import AdminUserMenu from "./components/AdminUserMenu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  const userRole = String(
    (session.user as { role?: string } | null)?.role ?? ""
  ).toUpperCase();

  if (userRole && userRole !== "ADMIN") {
    redirect("/");
  }

  const user = session.user;

  const navLinkClass =
    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-bold text-gray-600 transition hover:bg-[#F8F4EE] hover:text-[#22211B]";

  const subLinkClass =
    "ml-5 flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition hover:bg-[#FAF7F0] hover:text-[#22211B]";

  return (
    <div className="flex min-h-screen bg-[#FBF9F0] font-sans antialiased text-[#22211B]">
      {/* SIDEBAR */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#E8E2D5] bg-white md:flex">
        {/* BRAND */}
        <div className="shrink-0 border-b border-[#E8E2D5]/50 p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22211B] font-serif text-lg font-bold text-white">
              T
            </div>

            <span className="font-serif text-xl font-bold tracking-tight text-[#22211B]">
              TCL Admin
            </span>
          </Link>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="space-y-1 text-xs font-semibold">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Menu
            </p>

            <Link href="/admin" className={navLinkClass}>
              <FiGrid size={16} />
              Dashboard
            </Link>

            <Link href="/admin/artworks" className={navLinkClass}>
              <FiPackage size={16} />
              Artworks
            </Link>

            <Link href="/admin/add-product" className={subLinkClass}>
              <FiPlus size={14} />
              Add Product
            </Link>

            <Link href="/admin/fine-art/new" className={subLinkClass}>
              <FiImage size={14} />
              Add Fine Art
            </Link>

            {/* DESIGN STORE */}
            <div className="pt-3">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Design Store
              </p>

              <Link href="/design-store" className={navLinkClass}>
                <FiBox size={16} />
                All Products
              </Link>

              <Link href="/design-store/new" className={subLinkClass}>
                <FiPlus size={14} />
                Add Design Store Product
              </Link>
            </div>

            {/* BLOG MANAGEMENT */}
            <div className="pt-3">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Content Management
              </p>

              <Link href="/admin/blog" className={navLinkClass}>
                <FiFileText size={16} />
                Blog Management
              </Link>

              <Link href="/admin/blog/new" className={subLinkClass}>
                <FiPlus size={14} />
                Create Blog Post
              </Link>
            </div>

            {/* OTHER ADMIN SECTIONS */}
            <div className="pt-3">
              <Link href="/admin/artists/add" className={navLinkClass}>
                <FiUsers size={16} />
                Artists
              </Link>

              <Link href="/admin" className={navLinkClass}>
                <FiShoppingBag size={16} />
                Orders
              </Link>

              <Link href="/admin" className={navLinkClass}>
                <FiFolder size={16} />
                Categories
              </Link>

              <Link href="/admin" className={navLinkClass}>
                <FiUserCheck size={16} />
                Customers
              </Link>

              <Link href="/admin" className={navLinkClass}>
                <FiStar size={16} />
                Featured
              </Link>

              <Link href="/admin" className={navLinkClass}>
                <FiSettings size={16} />
                Settings
              </Link>
            </div>
          </nav>
        </div>

        {/* QUICK ACTIONS */}
        <div className="shrink-0 space-y-2 border-t border-[#E8E2D5] bg-[#FAF7F0] p-4">
          <Link
            href="/admin/add-product"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22211B] py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4D3024]"
          >
            <FiPlus size={14} />
            Add Product
          </Link>

          <Link
            href="/admin/fine-art/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C4A892] bg-white py-2.5 text-xs font-semibold text-[#4D3024] transition hover:bg-[#F1EBDD]"
          >
            <FiImage size={14} />
            Add Fine Art
          </Link>

          <Link
            href="/design-store/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C4A892] bg-white py-2.5 text-xs font-semibold text-[#4D3024] transition hover:bg-[#F1EBDD]"
          >
            <FiBox size={14} />
            Add Design Store Product
          </Link>

          <Link
            href="/admin/blog/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C4A892] bg-white py-2.5 text-xs font-semibold text-[#4D3024] transition hover:bg-[#F1EBDD]"
          >
            <FiFileText size={14} />
            Create Blog Post
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-[#E8E2D5] bg-white px-6">
          <div className="relative w-full max-w-md">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />

            <input
              type="text"
              placeholder="Search or type command..."
              aria-label="Search admin"
              className="w-full rounded-xl border border-[#E8E2D5] bg-[#FAF7F0] py-2 pl-10 pr-12 text-xs transition focus:border-[#22211B] focus:outline-none"
            />

            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#E8E2D5] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-400">
              Ctrl K
            </kbd>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Dark mode"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E2D5] bg-[#FAF7F0] text-gray-600 transition hover:text-[#22211B]"
            >
              <FiMoon size={15} />
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E2D5] bg-[#FAF7F0] text-gray-600 transition hover:text-[#22211B]"
            >
              <FiBell size={15} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#4D3024]" />
            </button>

            <div className="h-6 w-px bg-[#E8E2D5]" />

            <AdminUserMenu user={user} />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="min-w-0 flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
