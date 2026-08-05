import TopBar from "./TopBar";
import MainNavbar from "./MainNavbar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#C4A892]/30 bg-[#FBF9F0]">
      <TopBar />
      <MainNavbar />
    </header>
  );
}