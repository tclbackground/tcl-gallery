import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | TCL Gallery",
  description:
    "Get in touch with TCL Gallery for artwork, photography, paintings, and project inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-serif">
      <main>

        {/* =====================================================
            HERO SECTION
        ===================================================== */}

        <section
          className="
            border-b
            border-stone-200
            bg-stone-100/70
            px-4
            py-16
            text-center
            sm:px-6
            sm:py-24
            lg:px-8
          "
        >
          <div className="mx-auto max-w-4xl space-y-4">

            <span
              className="
                font-sans
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-amber-700
              "
            >
              Get In Touch
            </span>

            <h1
              className="
                text-4xl
                font-light
                tracking-tight
                text-stone-900
                sm:text-5xl
              "
            >
              Let&apos;s Create Something Beautiful
            </h1>

            <p
              className="
                mx-auto
                max-w-2xl
                font-sans
                text-base
                font-light
                leading-relaxed
                text-stone-600
                sm:text-lg
              "
            >
              Whether you are looking for artwork, photography,
              paintings, or an art solution for your space, our
              team is here to help.
            </p>

          </div>
        </section>


        {/* =====================================================
            CONTACT SECTION
        ===================================================== */}

        <section
          className="
            mx-auto
            max-w-7xl
            px-4
            py-16
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              grid
              grid-cols-1
              gap-10
              lg:grid-cols-12
            "
          >

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div
              className="
                rounded-2xl
                border
                border-stone-200
                bg-white
                p-8
                font-sans
                shadow-sm
                sm:p-10
                lg:col-span-7
              "
            >

              <h2
                className="
                  mb-2
                  font-serif
                  text-2xl
                  text-stone-900
                "
              >
                Send Us an Inquiry
              </h2>

              <p
                className="
                  mb-8
                  text-xs
                  font-light
                  leading-relaxed
                  text-stone-500
                "
              >
                Tell us what you are looking for and our team
                will get back to you as soon as possible.
              </p>

              <ContactForm />

            </div>


            {/* =================================================
                RIGHT SIDE
                GOOGLE MAP ONLY
            ================================================= */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-stone-200
                bg-white
                shadow-sm
                lg:col-span-5
              "
            >

              <div
                className="
                  relative
                  h-[420px]
                  w-full
                  sm:h-[500px]
                  lg:h-full
                  lg:min-h-[620px]
                "
              >

                <iframe
                  title="TCL Gallery Location"
                  src="https://www.google.com/maps?q=YOUR_TCL_GALLERY_ADDRESS&output=embed"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

              </div>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}