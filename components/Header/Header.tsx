import TopBar from "./TopBar";
import MainNavbar from "./MainNavbar";

export default function Header() {
  return (
    <header className="w-full">
      <TopBar />
      <MainNavbar />
    </header>
  );
}