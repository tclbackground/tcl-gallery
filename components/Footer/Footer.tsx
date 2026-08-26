"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiInstagram,
  FiFacebook,
  FiMail,
  FiArrowRight,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#C4A892]/20 bg-[#22211B] text-[#FBF9F0]">
      {/* ================= MAIN FOOTER ================= */}

      <div className="mx-auto max-w-[1800px] px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* ================= BRAND ================= */}

          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/Logo.jpg"
                alt="TCL Gallery Logo"
                width={130}
                height={65}
                priority
                className="h-auto w-[110px] mix-blend-screen"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#E8DBCA]/70">
              TCL Gallery presents fine art, photography and collectible works
              created to bring meaningful art into everyday spaces.
            </p>

            {/* SOCIAL ICONS */}

            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-lg text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
              >
                <FiInstagram />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-lg text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
              >
                <FiFacebook />
              </a>
            </div>
          </div>

          {/* ================= EXPLORE ================= */}

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#C4A892]">
              Explore
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
                >
                  Shop Art
                </Link>
              </li>

              <li>
                <Link
                  href="/collections"
                  className="text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
                >
                  Collections
                </Link>
              </li>

              <li>
                <Link
                  href="/artists"
                  className="text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
                >
                  Artists
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= INFORMATION ================= */}

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#C4A892]">
              Information
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/shipping-returns"
                  className="text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
                >
                  Shipping & Returns
                </Link>
              </li>

              <li>
                <Link
                  href="/refund-policy"
                  className="text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
                >
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= CONTACT ================= */}

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#C4A892]">
              Contact
            </h4>

            <div className="space-y-4 text-sm text-[#E8DBCA]/70">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 shrink-0 text-[#C4A892]" />

                <p>
                  L T Karle and Company,
                  <br />
                  Industrial Suburb, Yeshwanthpur,
                  <br />
                  Bengaluru, Karnataka 560022
                </p>
              </div>

              <a
                href="tel:+91990014886"
                className="flex items-center gap-3 text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
              >
                <FiPhone className="shrink-0 text-[#C4A892]" />

                <span>+91 99001 48886</span>
              </a>

              <a
                href="mailto:info@tclgallery.com"
                className="flex items-center gap-3 text-[#E8DBCA]/70 transition-colors hover:!text-[#C4A892]"
              >
                <FiMail className="shrink-0 text-[#C4A892]" />

                <span>info@tclgallery.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* ================= COMPACT NEWSLETTER ================= */}

        <div className="mt-10 border-t border-[#C4A892]/20 pt-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C4A892]">
                Stay Connected
              </p>

              <h3 className="mt-2 text-lg font-semibold text-[#FBF9F0]">
                Get updates on new artworks and exhibitions.
              </h3>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#C4A892]" />

                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-full border border-[#C4A892]/30 bg-transparent py-3 pl-11 pr-5 text-sm text-[#FBF9F0] outline-none placeholder:text-[#E8DBCA]/40 focus:border-[#C4A892]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C4A892] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#22211B] transition-colors hover:bg-[#FBF9F0]"
              >
                Subscribe
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}

      <div className="border-t border-[#C4A892]/20">
        <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-between gap-4 px-5 py-5 text-xs sm:px-8 md:flex-row lg:px-12">
          <p className="text-[#E8DBCA]/55">
            © {currentYear} TCL GALLERY. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy-policy"
              className="text-[#E8DBCA]/55 transition-colors hover:!text-[#C4A892]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-[#E8DBCA]/55 transition-colors hover:!text-[#C4A892]"
            >
              Terms
            </Link>

            <Link
              href="/refund-policy"
              className="text-[#E8DBCA]/55 transition-colors hover:!text-[#C4A892]"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}