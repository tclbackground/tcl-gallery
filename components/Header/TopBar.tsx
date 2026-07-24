import { FaStore } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function TopBar() {
  return (
    <div className="bg-[#ef6c35] text-white text-sm">
      <div className="max-w-[1400px] mx-auto h-10 flex items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-2">
          <FaStore className="text-base" />

          <span className="font-medium">
            Nearest Store -
          </span>

          <button className="flex items-center underline underline-offset-2 hover:no-underline">
            UL Store Chokli Circle
            <MdKeyboardArrowDown className="ml-1 text-lg" />
          </button>
        </div>

        {/* Center */}
        <div className="hidden lg:block">
          Additional up to ₹10,000 off. Use code
          <span className="font-semibold"> EXTRA10K </span>
          | Limited-time deal
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <button>Gift Cards</button>
          <button>Become a Franchisee</button>
          <button>Help</button>
        </div>

      </div>
    </div>
  );
}