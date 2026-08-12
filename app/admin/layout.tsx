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
} from "react-icons/fi";
import AdminDashboardOverview from "./page";
import AdminUserMenu from "./components/AdminUserMenu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch user session on the server
  const session = await getServerSession(authOptions);

  // 2. Protect route: redirect non-admin users to login
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/account/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#FBF9F0] text-[#22211B] flex font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#E8E2D5] bg-white flex flex-col h-screen sticky top-0 shrink-0 hidden md:flex">
        {/* Brand Logo */}
        <div className="p-6 border-b border-[#E8E2D5]/50 shrink-0">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#22211B] text-white flex items-center justify-center font-serif text-lg font-bold">
              T
            </div>
            <span className="font-serif text-xl font-bold text-[#22211B] tracking-tight">
              TCL Admin
            </span>
          </Link>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <nav className="space-y-1 text-xs font-semibold">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
              Menu
            </p>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#F8F4EE] hover:text-[#22211B] text-gray-600 font-bold transition"
            >
              <FiGrid size={16} /> Dashboard
            </Link>

            <Link
              href="/admin/artworks"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F8F4EE] text-[#4D3024] font-bold transition"
            >
              <FiPackage size={16} /> Artworks
            </Link>

            <Link
              href="/admin/artists/add"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 hover:bg-[#F8F4EE] hover:text-[#22211B] transition"
            >
              <FiUsers size={16} /> Artists
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 hover:bg-[#F8F4EE] hover:text-[#22211B] transition"
            >
              <FiShoppingBag size={16} /> Orders
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 hover:bg-[#F8F4EE] hover:text-[#22211B] transition"
            >
              <FiFolder size={16} /> Categories
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 hover:bg-[#F8F4EE] hover:text-[#22211B] transition"
            >
              <FiUserCheck size={16} /> Customers
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 hover:bg-[#F8F4EE] hover:text-[#22211B] transition"
            >
              <FiStar size={16} /> Featured
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 hover:bg-[#F8F4EE] hover:text-[#22211B] transition"
            >
              <FiSettings size={16} /> Settings
            </Link>
          </nav>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 border-t border-[#E8E2D5] bg-[#FAF7F0] shrink-0">
          <Link
            href="/admin/add-product"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#22211B] py-2.5 text-xs font-semibold text-white hover:bg-[#4D3024] transition shadow-xs"
          >
            <FiPlus size={14} /> Add Artwork
          </Link>
        </div>
      </aside>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#E8E2D5] bg-white px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div className="relative w-full max-w-md">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="text"
              placeholder="Search or type command..."
              className="w-full bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl pl-10 pr-12 py-2 text-xs focus:outline-none focus:border-[#22211B] transition"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-[#E8E2D5]">
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-9 w-9 rounded-xl border border-[#E8E2D5] bg-[#FAF7F0] text-gray-600 hover:text-[#22211B] flex items-center justify-center transition">
              <FiMoon size={15} />
            </button>
            <button className="relative h-9 w-9 rounded-xl border border-[#E8E2D5] bg-[#FAF7F0] text-gray-600 hover:text-[#22211B] flex items-center justify-center transition">
              <FiBell size={15} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#4D3024]" />
            </button>

            <div className="h-6 w-[1px] bg-[#E8E2D5]" />

            {/* Interactive Admin User Dropdown */}
            <AdminUserMenu user={user} />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}