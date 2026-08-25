"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  Mail,
} from "lucide-react";

export default function ShippingPolicyPage() {
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
              Shipping Policy
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#69635c] sm:text-lg">
              We take great care in preparing, packaging, and delivering every
              artwork from TCL Gallery to ensure it reaches you safely.
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
                  SHIPPING INFORMATION
                </p>

                <nav className="space-y-4 text-sm text-[#625d56]">
                  <a
                    href="#processing"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Order Processing
                  </a>

                  <a
                    href="#packaging"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Artwork Packaging
                  </a>

                  <a
                    href="#delivery"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Delivery & Shipping
                  </a>

                  <a
                    href="#timelines"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Delivery Timelines
                  </a>

                  <a
                    href="#tracking"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Order Tracking
                  </a>

                  <a
                    href="#damages"
                    className="block transition-colors duration-300 hover:text-black"
                  >
                    Damaged Deliveries
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
              {/* ================= ORDER PROCESSING ================= */}

              <section id="processing">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#5a3825] text-white">
                    <Package size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Order Processing
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  Once your order is confirmed, our team carefully prepares the
                  artwork for dispatch. Processing time may vary depending on
                  the artwork, framing requirements, availability, and delivery
                  location.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  For made-to-order, framed, customised, or specially prepared
                  artworks, additional processing time may be required before
                  dispatch.
                </p>
              </section>

              {/* ================= PACKAGING ================= */}

              <section id="packaging">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <ShieldCheck size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Artwork Packaging
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  Every artwork is carefully packed to provide appropriate
                  protection during transit. Packaging methods may vary
                  depending on the size, weight, frame, medium, and fragility
                  of the artwork.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <Package
                      size={20}
                      className="text-[#5a3825]"
                    />

                    <h3 className="mt-4 font-semibold">
                      Protective Packaging
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      Artworks are packed using suitable protective materials
                      to minimise the risk of damage during transportation.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#ded8ce] bg-white p-5">
                    <ShieldCheck
                      size={20}
                      className="text-[#5a3825]"
                    />

                    <h3 className="mt-4 font-semibold">
                      Frame Protection
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#69635c]">
                      Framed artworks receive additional protection around
                      vulnerable areas to help ensure safe handling and
                      delivery.
                    </p>
                  </div>
                </div>
              </section>

              {/* ================= DELIVERY ================= */}

              <section id="delivery">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <Truck size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Delivery & Shipping
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  TCL Gallery works with suitable logistics and delivery
                  partners to transport artworks safely to their destination.
                  The delivery method may vary depending on the size and nature
                  of the artwork and the delivery location.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  Shipping availability, charges, and delivery arrangements may
                  differ based on your location and the specific artwork being
                  purchased.
                </p>

                <div className="mt-6 rounded-2xl border border-[#ded8ce] bg-white p-6">
                  <div className="flex items-start gap-4">
                    <MapPin
                      size={22}
                      className="mt-1 shrink-0 text-[#5a3825]"
                    />

                    <div>
                      <h3 className="font-semibold">
                        Delivery Address
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-[#69635c]">
                        Please ensure that the shipping address and contact
                        details provided during the order process are complete
                        and accurate. TCL Gallery may not be responsible for
                        delays resulting from incorrect or incomplete delivery
                        information.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= DELIVERY TIMELINES ================= */}

              <section id="timelines">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <Clock size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Delivery Timelines
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  Delivery timelines may vary based on the artwork, order
                  processing requirements, destination, courier availability,
                  weather conditions, and other logistical factors.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  Any estimated delivery period provided by TCL Gallery is an
                  estimate and should not be considered a guaranteed delivery
                  date. We will make reasonable efforts to ensure your artwork
                  is dispatched and delivered within the expected timeframe.
                </p>
              </section>

              {/* ================= TRACKING ================= */}

              <section id="tracking">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <Truck size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Order Tracking
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  Where tracking information is available, it may be shared
                  with you after your order has been dispatched. Tracking
                  availability depends on the delivery service used for your
                  shipment.
                </p>

                <p className="mt-4 leading-8 text-[#625d56]">
                  If you require an update regarding your artwork delivery,
                  please contact TCL Gallery with your order or artwork
                  reference details.
                </p>
              </section>

              {/* ================= DAMAGES ================= */}

              <section id="damages">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d9d2c8] bg-white">
                    <AlertCircle size={20} />
                  </div>

                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    Damaged Deliveries
                  </h2>
                </div>

                <p className="leading-8 text-[#625d56]">
                  Although every effort is made to package artworks securely,
                  damage may occasionally occur during transit.
                </p>

                <div className="mt-6 rounded-2xl border border-[#d8c8bd] bg-[#fbf8f4] p-6">
                  <h3 className="font-semibold">
                    If Your Artwork Arrives Damaged
                  </h3>

                  <ul className="mt-4 space-y-3 text-sm leading-7 text-[#625d56]">
                    <li>
                      • Please take clear photographs of the outer packaging
                      and the damaged artwork.
                    </li>

                    <li>
                      • Retain all original packaging materials until the issue
                      has been reviewed.
                    </li>

                    <li>
                      • Contact TCL Gallery as soon as possible with your order
                      details and photographs.
                    </li>

                    <li>
                      • Our team will review the situation and advise you on
                      the next steps.
                    </li>
                  </ul>
                </div>
              </section>

              {/* ================= CONTACT ================= */}

              <section
                id="contact"
                className="rounded-2xl bg-[#2d2925] p-7 text-white sm:p-10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#5b554e]">
                  <Mail size={20} />
                </div>

                <p className="mt-6 text-xs font-bold tracking-[0.18em] text-[#b9aa99]">
                  SHIPPING SUPPORT
                </p>

                <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                  Need Help With Your Delivery?
                </h2>

                <p className="mt-4 max-w-xl leading-8 text-[#d0c8be]">
                  If you have any questions about shipping, delivery,
                  packaging, or your artwork order, our team will be happy to
                  assist you.
                </p>

                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold tracking-[0.12em] text-[#2d2925] transition-all duration-300 hover:bg-[#d8d0c5] hover:text-black"
                >
                  CONTACT TCL GALLERY

                  <ArrowRight size={16} />
                </Link>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}