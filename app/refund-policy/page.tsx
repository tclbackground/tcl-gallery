import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Package,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#2f2f2f]">
      {/* ================= HERO ================= */}

      <section className="border-b border-[#d9d2c8] bg-[#ede9e0]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <Link
            href="/"
            className="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#5a3825] transition-colors hover:text-black"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Home
          </Link>

          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5a3825] text-white">
                <RefreshCcw size={20} />
              </div>

              <p className="text-xs font-bold tracking-[0.2em] text-[#8a6a4a] sm:text-sm">
                TCL GALLERY
              </p>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#292722] sm:text-5xl lg:text-7xl">
              Refund &amp; Cancellation Policy
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-[#696158] sm:text-lg">
              We take great care in producing, handling, packaging, and
              delivering every artwork. Please read our policy carefully before
              placing an order with TCL Gallery.
            </p>

            <p className="mt-6 text-sm font-medium text-[#81796f]">
              Last Updated: August 25, 2026
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[280px_1fr]">
          {/* ================= SIDEBAR ================= */}

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[20px] border border-[#ddd6cb] bg-[#faf9f6] p-6 shadow-sm">
              <p className="mb-5 text-xs font-bold tracking-[0.16em] text-[#8a6a4a]">
                ON THIS PAGE
              </p>

              <nav className="space-y-1 text-sm">
                <a
                  href="#custom-artworks"
                  className="block rounded-lg px-3 py-2.5 text-[#5e574e] transition hover:bg-[#ede9e0] hover:text-[#5a3825]"
                >
                  Made-to-Order Artworks
                </a>

                <a
                  href="#cancellation"
                  className="block rounded-lg px-3 py-2.5 text-[#5e574e] transition hover:bg-[#ede9e0] hover:text-[#5a3825]"
                >
                  Order Cancellation
                </a>

                <a
                  href="#damaged-products"
                  className="block rounded-lg px-3 py-2.5 text-[#5e574e] transition hover:bg-[#ede9e0] hover:text-[#5a3825]"
                >
                  Damaged or Incorrect Products
                </a>

                <a
                  href="#returns"
                  className="block rounded-lg px-3 py-2.5 text-[#5e574e] transition hover:bg-[#ede9e0] hover:text-[#5a3825]"
                >
                  Return Eligibility
                </a>

                <a
                  href="#non-returnable"
                  className="block rounded-lg px-3 py-2.5 text-[#5e574e] transition hover:bg-[#ede9e0] hover:text-[#5a3825]"
                >
                  Non-Returnable Items
                </a>

                <a
                  href="#refund-processing"
                  className="block rounded-lg px-3 py-2.5 text-[#5e574e] transition hover:bg-[#ede9e0] hover:text-[#5a3825]"
                >
                  Refund Processing
                </a>

                <a
                  href="#delivery"
                  className="block rounded-lg px-3 py-2.5 text-[#5e574e] transition hover:bg-[#ede9e0] hover:text-[#5a3825]"
                >
                  Shipping &amp; Delivery
                </a>

                <a
                  href="#contact"
                  className="block rounded-lg px-3 py-2.5 text-[#5e574e] transition hover:bg-[#ede9e0] hover:text-[#5a3825]"
                >
                  Contact Us
                </a>
              </nav>
            </div>
          </aside>

          {/* ================= POLICY CONTENT ================= */}

          <div className="max-w-4xl space-y-6">
            {/* INTRO */}

            <div className="rounded-[20px] border border-[#ddd6cb] bg-[#faf9f6] p-6 sm:p-8">
              <div className="flex gap-4">
                <ShieldCheck
                  className="mt-1 shrink-0 text-[#8a6a4a]"
                  size={24}
                />

                <div>
                  <h2 className="text-xl font-semibold text-[#292722] sm:text-2xl">
                    Our Commitment
                  </h2>

                  <p className="mt-3 leading-8 text-[#696158]">
                    At TCL Gallery, every artwork is treated as a fine-art
                    product. Many of our artworks are printed, framed, prepared,
                    or customised specifically after an order is placed.
                  </p>
                </div>
              </div>
            </div>

            {/* 1 */}

            <PolicySection
              id="custom-artworks"
              number="01"
              icon={<FileText size={22} />}
              title="Made-to-Order & Customised Artworks"
            >
              <p>
                Many products offered by TCL Gallery are created, printed,
                framed, or customised specifically after an order is placed.
              </p>

              <p className="mt-5 font-semibold text-[#403b35]">
                This may include:
              </p>

              <PolicyList
                items={[
                  "Fine-art photography prints",
                  "Framed photographs",
                  "Fine-art paintings",
                  "Custom print sizes",
                  "Custom frames",
                  "Canvas prints",
                  "Limited-edition artworks",
                  "Made-to-order artworks",
                  "Personalised or specially commissioned products",
                ]}
              />

              <p className="mt-6">
                Because these products are prepared specifically for the
                customer, returns, exchanges, or refunds may not be available
                once production has commenced, except in cases covered under
                this policy.
              </p>
            </PolicySection>

            {/* 2 */}

            <PolicySection
              id="cancellation"
              number="02"
              icon={<RefreshCcw size={22} />}
              title="Order Cancellation"
            >
              <p>
                You may request cancellation of your order before production,
                printing, framing, or customisation has started.
              </p>

              <p className="mt-5 font-semibold text-[#403b35]">
                To request cancellation, please provide:
              </p>

              <PolicyList
                items={[
                  "Order number",
                  "Customer name",
                  "Registered email address or phone number",
                  "Reason for cancellation",
                ]}
              />

              <p className="mt-6">
                If production has not yet started, TCL Gallery will review the
                cancellation request and process any eligible refund.
              </p>

              <p className="mt-4">
                Once an artwork has entered the printing, framing,
                customisation, or dispatch process, cancellation may not be
                possible.
              </p>
            </PolicySection>

            {/* 3 */}

            <PolicySection
              id="damaged-products"
              number="03"
              icon={<Package size={22} />}
              title="Damaged or Incorrect Products"
            >
              <p>
                We carefully inspect and package every artwork before dispatch.
                However, if your order arrives damaged, defective, or
                incorrect, please contact TCL Gallery promptly after delivery.
              </p>

              <p className="mt-5 font-semibold text-[#403b35]">
                Please provide:
              </p>

              <PolicyList
                items={[
                  "Your order number",
                  "Clear photographs of the outer packaging",
                  "Clear photographs of the damaged or incorrect product",
                  "A brief description of the issue",
                ]}
              />

              <p className="mt-6">
                Please retain the original packaging until the issue has been
                reviewed and resolved.
              </p>

              <div className="mt-6 rounded-xl bg-[#ede9e0] p-5">
                <p className="font-semibold text-[#403b35]">
                  After verification, TCL Gallery may:
                </p>

                <PolicyList
                  items={[
                    "Arrange a replacement",
                    "Repair or restore the artwork where appropriate",
                    "Provide a replacement of the same artwork",
                    "Offer another suitable resolution",
                    "Process a refund where applicable",
                  ]}
                />
              </div>
            </PolicySection>

            {/* 4 */}

            <PolicySection
              id="returns"
              number="04"
              icon={<CheckCircle2 size={22} />}
              title="Return Eligibility"
            >
              <p>
                Returns will only be considered in eligible cases, including:
              </p>

              <PolicyList
                items={[
                  "The product received is materially different from the item ordered",
                  "The wrong product was delivered",
                  "The artwork was damaged during transit",
                  "The product has a manufacturing or production defect",
                ]}
              />

              <p className="mt-6">
                Each request will be reviewed individually. TCL Gallery may
                require additional photographs, videos, or other information to
                assess the issue.
              </p>
            </PolicySection>

            {/* 5 */}

            <PolicySection
              id="non-returnable"
              number="05"
              icon={<Package size={22} />}
              title="Non-Returnable Items"
            >
              <p>
                Unless the product is damaged, defective, or incorrect, the
                following items are generally not eligible for return or refund:
              </p>

              <PolicyList
                items={[
                  "Custom-sized artworks",
                  "Custom-framed artworks",
                  "Made-to-order prints",
                  "Personalised artworks",
                  "Commissioned artworks",
                  "Limited-edition works where applicable",
                  "Products damaged due to improper handling after delivery",
                  "Products damaged after removal from protective packaging due to customer handling",
                  "Items showing normal variation in colour, texture, finish, or material characteristics",
                ]}
              />

              <div className="mt-6 rounded-xl border border-[#ddd6cb] bg-[#f4f1ea] p-5">
                <p className="text-sm leading-7 text-[#696158]">
                  <strong className="text-[#403b35]">Please note:</strong>{" "}
                  Colours displayed on screens may vary depending on monitor,
                  mobile device, brightness settings, and display calibration.
                  Minor colour variations between digital previews and the
                  final physical artwork do not necessarily constitute a defect.
                </p>
              </div>
            </PolicySection>

            {/* 6 */}

            <PolicySection
              id="return-approval"
              number="06"
              icon={<ShieldCheck size={22} />}
              title="Return Approval"
            >
              <p>
                Do not send an artwork back without prior approval from TCL
                Gallery.
              </p>

              <p className="mt-5">
                If your return request is approved, we will provide instructions
                regarding the return process.
              </p>

              <p className="mt-5 font-semibold text-[#403b35]">
                Where required, the artwork must be returned:
              </p>

              <PolicyList
                items={[
                  "In its original packaging, where reasonably possible",
                  "With all accompanying materials",
                  "Adequately protected to prevent further damage during transit",
                ]}
              />

              <p className="mt-6">
                TCL Gallery reserves the right to decline a refund or
                replacement if the returned product does not meet the approved
                return conditions.
              </p>
            </PolicySection>

            {/* 7 */}

            <PolicySection
              id="refund-processing"
              number="07"
              icon={<Wallet size={22} />}
              title="Refund Processing"
            >
              <p>
                Once an eligible refund has been approved, the refund will be
                processed to the original payment method, wherever possible.
              </p>

              <p className="mt-5">
                Refund processing times may vary depending on:
              </p>

              <PolicyList
                items={[
                  "Payment method",
                  "Bank or card provider",
                  "Payment gateway",
                  "Verification requirements",
                ]}
              />

              <p className="mt-6">
                Any applicable deductions, including non-refundable services or
                production costs where legally permitted, will be communicated
                before the refund is processed.
              </p>
            </PolicySection>

            {/* 8 */}

            <PolicySection
              id="delivery"
              number="08"
              icon={<Truck size={22} />}
              title="Shipping & Delivery Issues"
            >
              <p>
                If your package appears visibly damaged at the time of delivery,
                please document the condition of the package and contact TCL
                Gallery as soon as possible.
              </p>

              <p className="mt-5">
                For artworks damaged during transit, timely reporting helps us
                investigate the issue with the relevant delivery or logistics
                partner.
              </p>

              <p className="mt-5 font-semibold text-[#403b35]">
                We may request photographs of:
              </p>

              <PolicyList
                items={[
                  "The outer carton or packaging",
                  "Internal protective packaging",
                  "The damaged artwork",
                  "Any shipping labels",
                ]}
              />
            </PolicySection>

            {/* 9 */}

            <PolicySection
              id="undeliverable"
              number="09"
              icon={<Package size={22} />}
              title="Refused or Undeliverable Orders"
            >
              <p>
                If an order is returned because of an incorrect delivery
                address, recipient unavailability, unsuccessful delivery
                attempts, or refusal of delivery for reasons unrelated to
                product damage or an incorrect item, additional shipping
                charges may apply for re-delivery.
              </p>

              <p className="mt-5">
                Refund eligibility in such cases will be reviewed based on the
                production status and condition of the returned artwork.
              </p>
            </PolicySection>

            {/* CONTACT */}

            <section
              id="contact"
              className="rounded-[24px] bg-[#5a3825] p-7 text-white sm:p-10"
            >
              <p className="text-xs font-bold tracking-[0.18em] text-[#d8c1a7]">
                NEED ASSISTANCE?
              </p>

              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Contact TCL Gallery
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-[#f1e7dc]">
                For cancellation, return, replacement, or refund-related
                enquiries, please contact our team and include your order number
                to help us assist you more quickly.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <a
                  href="tel:+919900148816"
                  className="rounded-xl border border-white/20 bg-white/10 p-5 transition hover:bg-black hover:text-white"
                >
                  <p className="text-xs font-bold tracking-[0.15em] text-[#d8c1a7]">
                    PHONE
                  </p>

                  <p className="mt-2 font-medium">
                    +91 9900148816
                  </p>
                </a>

                <a
                  href="mailto:info@tclgallery.com"
                  className="rounded-xl border border-white/20 bg-white/10 p-5 transition hover:bg-black hover:text-white"
                >
                  <p className="text-xs font-bold tracking-[0.15em] text-[#d8c1a7]">
                    EMAIL
                  </p>

                  <p className="mt-2 font-medium">
                    info@tclgallery.com
                  </p>
                </a>
              </div>
            </section>

            {/* FINAL NOTE */}

            <section className="border-t border-[#d9d2c8] pt-10">
              <h2 className="text-2xl font-semibold text-[#292722]">
                Important Note
              </h2>

              <p className="mt-4 leading-8 text-[#696158]">
                Each artwork sold by TCL Gallery is handled as a fine-art
                product. Many artworks are printed, framed, or prepared
                specifically for each customer. We encourage customers to
                carefully review the artwork, dimensions, frame selection,
                finish, and other product specifications before completing their
                purchase.
              </p>

              <p className="mt-5 leading-8 text-[#696158]">
                By placing an order with TCL Gallery, you acknowledge that you
                have read and agreed to this Refund &amp; Cancellation Policy.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= POLICY SECTION ================= */

function PolicySection({
  id,
  number,
  icon,
  title,
  children,
}: {
  id: string;
  number: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-[20px] border border-[#ddd6cb] bg-[#faf9f6] p-6 shadow-sm sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex items-center gap-3 sm:flex-col sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ede9e0] text-[#5a3825]">
            {icon}
          </div>

          <span className="text-xs font-bold tracking-[0.16em] text-[#a38f79]">
            {number}
          </span>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold tracking-tight text-[#292722] sm:text-3xl">
            {title}
          </h2>

          <div className="mt-5 leading-8 text-[#696158]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= LIST ================= */

function PolicyList({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3"
        >
          <CheckCircle2
            size={18}
            className="mt-1 shrink-0 text-[#8a6a4a]"
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}