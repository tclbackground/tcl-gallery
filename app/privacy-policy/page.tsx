"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Eye,
  Database,
  Lock,
  Cookie,
  Share2,
  UserCheck,
  Mail,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#2d2a26]">
      {/* ================= HERO ================= */}

      <section className="border-b border-[#d9d4ca] px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#5a3825] transition-colors duration-300 hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#8a755f]">
              TCL GALLERY
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#69635c] sm:text-lg">
              At TCL Gallery, we respect your privacy and are committed to
              protecting the personal information you share with us when
              browsing our website, making an enquiry, or purchasing artwork.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            {/* ================= SIDEBAR ================= */}

            <aside className="lg:sticky lg:top-10 lg:h-fit">
              <div className="rounded-2xl border border-[#ded8ce] bg-white p-6">
                <p className="mb-5 text-xs font-bold tracking-[0.16em] text-[#8a755f]">
                  PRIVACY INFORMATION
                </p>

                <nav className="space-y-4 text-sm text-[#625d56]">
                  <a
                    href="#information"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Information We Collect
                  </a>

                  <a
                    href="#usage"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    How We Use Information
                  </a>

                  <a
                    href="#sharing"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Information Sharing
                  </a>

                  <a
                    href="#security"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Data Security
                  </a>

                  <a
                    href="#cookies"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Cookies
                  </a>

                  <a
                    href="#rights"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Your Choices
                  </a>

                  <a
                    href="#contact"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Contact Us
                  </a>
                </nav>
              </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}

            <div className="space-y-14">
              {/* INTRODUCTION */}

              <section>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5a3825] text-white">
                    <ShieldCheck size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Our Commitment to Privacy
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  TCL Gallery values the trust you place in us. This Privacy
                  Policy explains how we collect, use, store, and protect
                  information provided through our website, enquiries, artwork
                  purchases, and other interactions with our gallery.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  By using our website or services, you acknowledge that you
                  have read and understood this Privacy Policy.
                </p>
              </section>

              {/* INFORMATION COLLECTION */}

              <section id="information">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <Database size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Information We Collect
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  Depending on how you interact with TCL Gallery, we may
                  collect information that you voluntarily provide to us.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <h3 className="font-semibold">
                      Personal Information
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      This may include your name, email address, phone number,
                      billing address, and delivery address.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <h3 className="font-semibold">
                      Order Information
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      Information related to artworks, products, services, and
                      orders that you enquire about or purchase.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <h3 className="font-semibold">
                      Communication Information
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      Messages, enquiries, feedback, or other communications
                      you send to TCL Gallery.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <h3 className="font-semibold">
                      Website Information
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      Basic information related to your use of our website,
                      including browser, device, and website interaction data.
                    </p>
                  </div>
                </div>
              </section>

              {/* HOW WE USE */}

              <section id="usage">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <Eye size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    How We Use Your Information
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  Information collected by TCL Gallery may be used for purposes
                  related to providing and improving our services.
                </p>

                <div className="mt-6 rounded-2xl border border-[#ded8ce] bg-white p-6">
                  <ul className="space-y-3 text-sm leading-7 text-[#625d56]">
                    <li>• To respond to your enquiries and requests.</li>

                    <li>
                      • To process and manage artwork purchases and orders.
                    </li>

                    <li>
                      • To arrange delivery, shipping, and customer support.
                    </li>

                    <li>
                      • To communicate important information regarding your
                      order.
                    </li>

                    <li>
                      • To improve our website, services, and customer
                      experience.
                    </li>

                    <li>
                      • To maintain records required for business and
                      operational purposes.
                    </li>
                  </ul>
                </div>
              </section>

              {/* SHARING */}

              <section id="sharing">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <Share2 size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Information Sharing
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  TCL Gallery does not sell your personal information to third
                  parties.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  In certain situations, limited information may be shared with
                  trusted service providers where necessary to fulfil your
                  order or provide our services.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <h3 className="font-semibold">
                      Delivery Partners
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      To deliver artworks and orders to your specified address.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <h3 className="font-semibold">
                      Payment Providers
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      To securely process payments where applicable.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <h3 className="font-semibold">
                      Service Providers
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      Where required for website operations and business
                      services.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECURITY */}

              <section id="security">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <Lock size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Data Security
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  We take reasonable measures to help protect personal
                  information against unauthorised access, misuse, loss, or
                  disclosure.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  However, no method of transmitting information over the
                  internet or storing electronic data can be guaranteed to be
                  completely secure. While we work to protect your information,
                  absolute security cannot be guaranteed.
                </p>
              </section>

              {/* COOKIES */}

              <section id="cookies">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <Cookie size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Cookies and Website Technologies
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  Our website may use cookies or similar technologies to help
                  improve functionality, understand website usage, and provide
                  a better browsing experience.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  You may be able to manage or disable cookies through your
                  browser settings. Please note that disabling certain cookies
                  may affect the functionality of parts of our website.
                </p>
              </section>

              {/* USER RIGHTS */}

              <section id="rights">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <UserCheck size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Your Choices
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  You may contact TCL Gallery if you wish to update or correct
                  personal information that you have provided to us, subject to
                  applicable requirements and our legitimate business or legal
                  obligations.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  If you no longer wish to receive non-essential promotional
                  communications from us, you may contact us to request that
                  such communications be stopped.
                </p>
              </section>

              {/* POLICY CHANGES */}

              <section>
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  Changes to This Privacy Policy
                </h2>

                <p className="mt-5 leading-8 text-[#625d56]">
                  TCL Gallery may update this Privacy Policy from time to time
                  to reflect changes in our business, website, services, or
                  applicable requirements. Any updated version will be
                  published on this page.
                </p>
              </section>

              {/* CONTACT */}

              <section
                id="contact"
                className="rounded-2xl bg-[#2d2925] p-7 text-white sm:p-10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#5b554e]">
                  <Mail size={20} />
                </div>

                <p className="mt-6 text-xs font-bold tracking-[0.18em] text-[#b9aa99]">
                  PRIVACY QUESTIONS
                </p>

                <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                  Contact TCL Gallery
                </h2>

                <p className="mt-4 max-w-xl leading-8 text-[#d0c8be]">
                  If you have any questions regarding this Privacy Policy or
                  how your information is handled, please contact our team.
                </p>

                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold tracking-[0.12em] text-[#2d2925] transition-all duration-300 hover:bg-[#d8d0c5] hover:text-black"
                >
                  CONTACT TCL GALLERY
                  <ArrowLeft size={16} className="rotate-180" />
                </Link>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}