import Image from "next/image";
import Link from "next/link";
// Import your existing Header component
// import Header from "@/components/Header";

export const metadata = {
  title: "Contact Us | TCL Gallery",
  description: "Get in touch with TCL Gallery for private art advisory, bespoke framing inquiries, and virtual viewing consultations.",
};

export default function ContactPage() {
  const contactInfo = [
    {
      title: "Gallery Inquiries",
      detail: "curator@tclgallery.com",
      subtext: "For art consultations, acquisitions & private viewings",
    },
    {
      title: "Bespoke Framing",
      detail: "framing@tclgallery.com",
      subtext: "Archival protection, 3D custom frame builder support",
    },
    {
      title: "Private Appointments",
      detail: "By Appointment Only",
      subtext: "Available for private collectors & interior architects",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-serif">
      {/* Place your existing Header here */}
      {/* <Header /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center bg-stone-100/70 border-b border-stone-200">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-semibold text-amber-700">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-stone-900">
              Connect With Our Curators
            </h1>
            <p className="text-base sm:text-lg text-stone-600 font-sans max-w-2xl mx-auto font-light leading-relaxed">
              Whether you are looking for custom archival framing, fine art advisory, or a private viewing room consultation, we are here to assist.
            </p>
          </div>
        </section>

        {/* Contact Form & Information Grid */}
        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Form (8 cols on lg) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-sm font-sans">
              <h2 className="text-2xl font-serif text-stone-900 mb-2">Send an Inquiry</h2>
              <p className="text-xs text-stone-500 font-light mb-8">
                Fill out the form below and our curatorial team will respond within 24 hours.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-700 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-700 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-700 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium mb-2">
                    Inquiry Type
                  </label>
                  <select className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:border-amber-700 transition-colors">
                    <option value="framing">Bespoke Framing & Archival Protection</option>
                    <option value="advisory">Art Advisory & Acquisition</option>
                    <option value="viewing">Virtual Viewing Room / AR Consultation</option>
                    <option value="other">General Gallery Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us about your artwork, framing requirements, or space..."
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-amber-700 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-6 rounded-lg text-sm tracking-wider uppercase transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>

            {/* Gallery Info Sidebar (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Direct Details Card */}
              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <h3 className="text-xl font-serif text-stone-900">Direct Contacts</h3>
                <div className="space-y-6 font-sans">
                  {contactInfo.map((item, idx) => (
                    <div key={idx} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                      <p className="text-xs uppercase tracking-wider font-semibold text-amber-700">
                        {item.title}
                      </p>
                      <p className="text-base font-serif text-stone-900 mt-1">{item.detail}</p>
                      <p className="text-xs text-stone-500 font-light mt-0.5">{item.subtext}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Feature Showcase Card */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 h-64 group">
                <Image
                  src="/images/banner-1.png"
                  alt="TCL Gallery Framing Exhibition"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-sans font-semibold">
                    Museum Grade
                  </span>
                  <h4 className="text-lg font-serif text-stone-100 mt-1">
                    Custom 3D Frame Visualization
                  </h4>
                  <p className="text-xs font-sans text-stone-300 font-light mt-1">
                    Experience archival framing mockups designed directly for your collection.
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