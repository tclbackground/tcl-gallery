import { Mail } from "lucide-react";

export default function NewsletterBox() {
  return (
    <form className="flex flex-col md:flex-row">

      <div className="flex flex-1 items-center border border-[#C78A52] bg-transparent px-5">

        <Mail className="text-white mr-3" size={20} />

        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full bg-transparent py-5 outline-none text-white placeholder:text-white/60"
        />

      </div>

      <button
        className="bg-[#C78A52] hover:bg-[#B6763D]
        px-10 py-5 text-white uppercase tracking-[2px]
        transition"
      >
        Notify Me
      </button>

    </form>
  );
}