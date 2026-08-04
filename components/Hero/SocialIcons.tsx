import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";

export default function SocialIcons() {
  return (
    <div className="flex flex-wrap items-center gap-5">

      <span className="text-white text-lg">
        Follow us for updates
      </span>

      <div className="w-px h-8 bg-white/40" />

      {[FaInstagram, FaFacebookF, FaYoutube].map((Icon, index) => (
        <div
          key={index}
          className="w-12 h-12 rounded-full
          border border-white/60
          flex items-center justify-center
          hover:bg-[#C78A52]
          hover:border-[#C78A52]
          transition
          cursor-pointer"
        >
          <Icon className="text-white" size={20} />
        </div>
      ))}

      {/* Pinterest */}

      <div
        className="w-12 h-12 rounded-full
        border border-white/60
        flex items-center justify-center
        hover:bg-[#C78A52]
        hover:border-[#C78A52]
        transition"
      >
        <span className="text-white font-bold text-lg">P</span>
      </div>

    </div>
  );
}