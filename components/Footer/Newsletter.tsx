"use client";

import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";

export default function Newsletter() {
  return (
    <section className="bg-[#171717] text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>

            <h2 className="text-4xl font-light mb-6">
              TCL Gallery
            </h2>

            <h3 className="text-2xl font-medium mb-5">
              Sign Up to Receive Exclusive Art Updates
            </h3>

            <p className="text-gray-300 leading-8 mb-8 max-w-lg">
              Discover museum-quality photography, paintings,
              fine art prints and curated collections delivered
              directly to your inbox every week.
            </p>

            {/* Email Input */}
            <div className="flex flex-col sm:flex-row overflow-hidden rounded-md border border-white/20">

              <input
                type="email"
                placeholder="Enter Email Address"
                className="flex-1 bg-white text-black px-5 py-4 outline-none"
              />

              <button className="bg-[#C7A852] hover:bg-[#b7923e] transition px-10 py-4 text-white font-medium">
                Subscribe
              </button>

            </div>

            <p className="text-sm text-gray-400 mt-5 leading-7 max-w-xl">
              By subscribing you agree to receive emails from TCL Gallery.
              You can unsubscribe at any time. Your information will never
              be shared with third parties.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-5 mt-10">

              <a
                href="#"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#C7A852] hover:border-[#C7A852] transition"
              >
                <FaInstagram size={22} />
              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#C7A852] hover:border-[#C7A852] transition"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#C7A852] hover:border-[#C7A852] transition"
              >
                <FaPinterestP size={18} />
              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#C7A852] hover:border-[#C7A852] transition"
              >
                <FaYoutube size={22} />
              </a>

            </div>

          </div>

          {/* Right Content */}
          <div className="grid grid-cols-2 gap-12">

            <div>
              <h3 className="text-xl font-semibold mb-6">
                Explore
              </h3>

              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-[#C7A852]">Photography</a></li>
                <li><a href="#" className="hover:text-[#C7A852]">Paintings</a></li>
                <li><a href="#" className="hover:text-[#C7A852]">Fine Art Prints</a></li>
                <li><a href="#" className="hover:text-[#C7A852]">Coffee Table Books</a></li>
                <li><a href="#" className="hover:text-[#C7A852]">Artists</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">
                Company
              </h3>

              <ul className="space-y-4 text-gray-300">
                <li><a href="#" className="hover:text-[#C7A852]">About</a></li>
                <li><a href="#" className="hover:text-[#C7A852]">Journal</a></li>
                <li><a href="#" className="hover:text-[#C7A852]">Contact</a></li>
                <li><a href="#" className="hover:text-[#C7A852]">Shipping</a></li>
                <li><a href="#" className="hover:text-[#C7A852]">Privacy Policy</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col lg:flex-row items-center justify-between gap-4">

          <p className="text-gray-400 text-sm">
            © 2026 TCL Gallery. All Rights Reserved.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-400">

            <a href="#" className="hover:text-[#C7A852]">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-[#C7A852]">
              Terms & Conditions
            </a>

            <a href="#" className="hover:text-[#C7A852]">
              Shipping Policy
            </a>

            <a href="#" className="hover:text-[#C7A852]">
              Refund Policy
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}