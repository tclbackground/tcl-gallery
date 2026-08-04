import Newsletter from "./Newsletter";
import FooterLinks from "./FooterLinks";
import BottomFooter from "./BottomFooter";

export default function Footer() {
  return (
      <footer className="bg-[#C4A892] text-white mt-24">

      {/* <FooterLinks /> */}

      <div className="border-t border-white/10">
        <Newsletter />
      </div>

      {/* <BottomFooter /> */}

    </footer>
  );
}