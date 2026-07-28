import TopBar from "./TopBar";
import MainNavbar from "./MainNavbar";
import CategoryNavbar from "./CategoryNavbar";
import MobileNavbar from "./MobileNavbar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* Top Announcement Bar */}
      <TopBar />

      {/* Main Header */}
      <MainNavbar />

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <CategoryNavbar />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavbar />
      </div>

    </header>
  );
}