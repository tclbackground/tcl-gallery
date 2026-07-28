import { FaMapMarkerAlt } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="bg-[#C4A892] text-[#3E2F24] text-sm">
      <div className="max-w-[1500px] mx-auto h-11 flex items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt />

          <button className="hover:underline">
            Visit Our Gallery • Bengaluru
          </button>
        </div>

        {/* Center */}
        <div className="hidden lg:block font-medium">
          Free Shipping Across India | Museum Quality Fine Art Prints
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-8">

          <button className="hover:text-black">
            Art Advisory
          </button>

          <button className="hover:text-black">
            Corporate Projects
          </button>

          <button className="hover:text-black">
            Help
          </button>

        </div>

      </div>
    </div>
  );
}