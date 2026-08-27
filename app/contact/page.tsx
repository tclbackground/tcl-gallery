import Image from "next/image";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | TCL Gallery",
  description:
    "Get in touch with TCL Gallery for artwork, photography, custom framing, botanical installations, and project inquiries.",
};

export default function ContactPage() {
  const contactInfo = [
    {
      title: "General Inquiries",
      detail: "info@tclgallery.com",
      subtext:
        "For artwork, photography, paintings, products and general inquiries",
    },
    {
      title: "Custom Framing",
      detail: "info@tclgallery.com",
      subtext:
        "For custom framing, frame options and artwork requirements",
    },
    {
      title: "Projects & Installations",
      detail: "info@tclgallery.com",
      subtext:
        "For homes, offices, hotels, hospitals and commercial spaces",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-serif">
      <main className="flex-1">

        {/* HERO SECTION */}
        <section className="relative border-b border-stone-200 bg-stone-100/70 px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-4">

            <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
              Get In Touch
            </span>

            <h1 className="text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">
              Let&apos;s Create Something Beautiful
            </h1>

            <p className="mx-auto max-w-2xl font-sans text-base font-light leading-relaxed text-stone-600 sm:text-lg">
              Whether you are looking for artwork, photography, custom framing,
              botanical arrangements, or an installation for your space, our
              team is here to help.
            </p>

          </div>
        </section>


        {/* CONTACT SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

            {/* CONTACT FORM */}
            <div className="rounded-2xl border border-stone-200 bg-white p-8 font-sans shadow-sm sm:p-10 lg:col-span-7">

              <h2 className="mb-2 font-serif text-2xl text-stone-900">
                Send Us an Inquiry
              </h2>

              <p className="mb-8 text-xs font-light text-stone-500">
                Tell us what you are looking for and our team will get back to
                you as soon as possible.
              </p>

              <ContactForm />

            </div>


            {/* CONTACT INFORMATION */}
            <div className="space-y-8 lg:col-span-5">

              {/* DIRECT CONTACTS */}
              <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">

                <h3 className="font-serif text-xl text-stone-900">
                  Contact TCL Gallery
                </h3>

                <div className="space-y-6 font-sans">

                  {contactInfo.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-stone-100 pb-4 last:border-0 last:pb-0"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        {item.title}
                      </p>

                      <a
                        href={`mailto:${item.detail}`}
                        className="mt-1 block font-serif text-base text-stone-900 transition-colors hover:text-amber-700"
                      >
                        {item.detail}
                      </a>

                      <p className="mt-1 text-xs font-light text-stone-500">
                        {item.subtext}
                      </p>
                    </div>
                  ))}

                </div>

              </div>


              {/* FEATURE IMAGE */}
              <div className="group relative h-64 overflow-hidden rounded-2xl border border-stone-200">

                <Image
                  src="/images/banner-1.png"
                  alt="TCL Gallery artwork and interior installation"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent p-6">

                  <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                    TCL Gallery
                  </span>

                  <h4 className="mt-1 font-serif text-lg text-stone-100">
                    Art for Every Space
                  </h4>

                  <p className="mt-1 font-sans text-xs font-light text-stone-300">
                    Artwork, photography, custom framing and installations
                    designed to bring character and identity to your space.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}