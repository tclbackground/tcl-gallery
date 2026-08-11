"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiArrowRight,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import logoImg from "@/public/images/Logo.jpg"; // Update path as needed

const footerLinks = {
  shop: [
    { title: "Fine Art Paintings", href: "/shop?category=oil-paintings" },
    { title: "Sculptures & Decor", href: "/shop?category=sculptures" },
    { title: "Fine Art Photography", href: "/shop?category=photography" },
    { title: "Limited Editions", href: "/shop?category=limited-editions" },
    { title: "New Arrivals", href: "/shop?sort=newest" },
  ],
  maisonDeMeraki: [
    { title: "Beginner Foundations", href: "/maison-de-meraki/beginner" },
    { title: "Advanced Masterclasses", href: "/maison-de-meraki/masterclasses" },
    { title: "Weekend Workshops", href: "/maison-de-meraki/workshops" },
    { title: "Summer Residency 2026", href: "/maison-de-meraki/residency" },
    { title: "Faculty & Mentors", href: "/maison-de-meraki/faculty" },
  ],
  services: [
    { title: "Art Consultation", href: "/services/art-consultation" },
    { title: "Corporate Curation", href: "/services/corporate-curation" },
    { title: "Custom Framing", href: "/services/custom-framing" },
    { title: "Virtual Room Placement", href: "/services/virtual-placement" },
    { title: "Valuation & Appraisals", href: "/services/appraisal" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Gallery Artists", href: "/artists" },
    { title: "Journal & Inspiration", href: "/inspiration" },
    { title: "Artist Submissions", href: "/artists/apply" },
    { title: "Contact Us", href: "/contact" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#22211B] text-[#FBF9F0] border-t border-[#C4A892]/20">
      
      {/* ================= TOP NEWSLETTER & BRAND SECTION ================= */}
      <div className="border-b border-[#C4A892]/20 py-12 lg:py-16">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Brand Intro */}
         <div className="lg:col-span-6 space-y-4">
  <Link href="/" className="inline-block">
    <Image
      src="/images/Logo.jpg"
      alt="TCL Gallery Logo"
      width={130}
      height={65}
      priority
      className="h-auto w-[100px] lg:w-[120px] mix-blend-screen"
    />
  </Link>
  <p className="text-sm !text-[#E8DBCA]/80 max-w-lg leading-relaxed">
    TCL Gallery is a contemporary fine art institution and home to{" "}
    <strong className="text-[#FBF9F0] font-semibold">Maison de Meraki</strong>—our
    dedicated art learning center committed to fostering artistic mastery and curation.
  </p>
</div>
          {/* Newsletter Input */}
          <div className="lg:col-span-6 space-y-3 bg-[#4D3024]/40 p-6 sm:p-8 rounded-2xl border border-[#C4A892]/20">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C4A892]">
              The Collector Circle
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FBF9F0]">
              Subscribe for Exhibition Invites & Private Previews
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A892] text-sm" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded-full bg-[#22211B] pl-11 pr-5 py-3 text-xs text-[#FBF9F0] placeholder-[#E8DBCA]/40 outline-none border border-[#C4A892]/40 focus:border-[#C4A892]"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C4A892] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#22211B] hover:bg-[#E8DBCA] transition shadow-md whitespace-nowrap"
              >
                Join Circle <FiArrowRight />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ================= MAIN NAVIGATION LINKS ================= */}
      <div className="py-16 border-b border-[#C4A892]/20">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Gallery Shop */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#FBF9F0] border-b border-[#C4A892]/20 pb-2">
              The Gallery Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DBCA]/70">
              {footerLinks.shop.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-[#C4A892] transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Maison de Meraki */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#FBF9F0] border-b border-[#C4A892]/20 pb-2 flex items-center gap-2">
              Maison de Meraki
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DBCA]/70">
              {footerLinks.maisonDeMeraki.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-[#C4A892] transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#FBF9F0] border-b border-[#C4A892]/20 pb-2">
              Art Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DBCA]/70">
              {footerLinks.services.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-[#C4A892] transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: About & Organization */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#FBF9F0] border-b border-[#C4A892]/20 pb-2">
              About & Roster
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DBCA]/70">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-[#C4A892] transition">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Visit & Contact Information */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#FBF9F0] border-b border-[#C4A892]/20 pb-2">
              Visit Gallery
            </h4>
            <div className="space-y-3 text-xs text-[#E8DBCA]/70">
              <p className="flex items-start gap-2.5">
                <FiMapPin className="text-[#C4A892] text-sm flex-shrink-0 mt-0.5" />
                <span>L T Karle and Company 151, Industrial Suburb, opp. Metro Wholesale Road, Dr.Ambedkar Nagar, Yeswanthpur, Bengaluru, Karnataka 560022</span>
              </p>
              <p className="flex items-center gap-2.5">
                <FiPhone className="text-[#C4A892] text-sm flex-shrink-0" />
                <span>+91 990014886</span>
              </p>
              <p className="flex items-center gap-2.5">
                <FiMail className="text-[#C4A892] text-sm flex-shrink-0" />
                <span>info@tclgallery.com</span>
              </p>
              <div className="pt-2">
                <span className="block text-[10px] uppercase font-bold text-[#C4A892] tracking-wider mb-1">
                  Gallery Hours
                </span>
                <p>Tue – Sat: 10:00 AM – 6:00 PM</p>
                <p>Sun: By Appointment</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM BAR & SOCIAL LINKS ================= */}
      <div className="py-8">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <p className="text-xs text-[#E8DBCA]/60 text-center md:text-left">
            © {currentYear} TCL GALLERY. ALL RIGHTS RESERVED.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-sm text-[#E8DBCA]/80">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#C4A892] transition">
              <FiInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#C4A892] transition">
              <FiFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-[#C4A892] transition">
              <FiTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-[#C4A892] transition">
              <FiLinkedin />
            </a>
          </div>

          {/* Utility Links */}
          <div className="flex items-center gap-6 text-xs text-[#E8DBCA]/60">
            <Link href="/privacy" className="hover:text-[#C4A892] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#C4A892] transition">
              Terms of Service
            </Link>
            <Link href="/shipping-returns" className="hover:text-[#C4A892] transition">
              Shipping & Collector Policy
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}