import Image from "next/image";
import Link from "next/link";
// Import your existing Header component
// import Header from "@/components/Header";

export const metadata = {
  title: "About Us | TCL Gallery",
  description: "Luxury framing, fine art curation, museum-grade archival protection, and bespoke art advisory.",
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Bespoke Framing & Archival Protection",
      description:
        "Every masterpiece deserves preservation. We provide museum-grade archival glazing and custom hand-crafted framing engineered for longevity.",
      image: "/images/banner-1.png",
    },
    {
      title: "Exclusive Art & Photography Curation",
      description:
        "Connecting luxury homeowners, designers, and collectors with limited-edition photography prints and fine art pieces.",
      image: "/images/banner-2.png",
    },
    {
      title: "Virtual Viewing & AR Staging",
      description:
        "Experience art in your space before buying with our 3D frame visualization and high-touch augmented reality room preview technology.",
      image: "/images/banner-3.png",
    },
  ];

  const highlights = [
    { label: "Archival Quality", value: "Museum Grade" },
    { label: "Bespoke Framing", value: "Custom 3D Builder" },
    { label: "Client Services", value: "Private Art Advisory" },
    { label: "Viewing Rooms", value: "Virtual & AR Staging" },
  ];

  const team = [
    {
      name: "Prasanna Chinmayi",
      role: "Creative Director & Principal Curator",
      bio: "Spearheading high-end visual curation, cinematic photography, and gallery digital strategy.",
      image: "/images/1.png",
    },
    {
      name: "Master Artisan",
      role: "Head of Archival Framing",
      bio: "Over two decades of craftsmanship specializing in museum-standard preservation and bespoke wood finishes.",
      image: "/images/2.png",
    },
    {
      name: "Art Consultant",
      role: "Luxury Art Advisory",
      bio: "Assisting private collectors and interior architects in acquiring investment-grade fine art.",
      image: "/images/3.png",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-serif">
      {/* Place your existing Header here */}
      {/* <Header /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center bg-stone-100/70 border-b border-stone-200">
          <div className="max-w-4xl mx-auto space-y-5 relative z-10">
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-semibold text-amber-700">
              TCL Gallery
            </span>
            <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-stone-900">
              Where Fine Art Meets Museum-Grade Archival Excellence
            </h1>
            <p className="text-base sm:text-lg text-stone-600 font-sans max-w-2xl mx-auto font-light leading-relaxed">
              TCL Gallery is a premier destination for luxury fine art, photography, bespoke archival framing, and bespoke art advisory for private collectors and luxury interiors.
            </p>
          </div>
        </section>

        {/* Pillars / Gallery Offerings */}
        <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-light text-stone-900 tracking-wide">
              The TCL Standard
            </h2>
            <div className="w-12 h-0.5 bg-amber-600 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-600/40 transition-all duration-300"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 font-sans space-y-3">
                  <h3 className="text-xl font-serif text-stone-900">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Metrics / Features */}
        <section className="bg-stone-100 border-y border-stone-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {highlights.map((item, idx) => (
                <div key={idx} className="p-4 space-y-1">
                  <p className="text-2xl sm:text-3xl font-serif text-amber-700 font-medium">
                    {item.value}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-stone-500 font-sans">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership & Curation */}
        <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-light text-stone-900 tracking-wide">
              Curatorial Leadership
            </h2>
            <p className="text-stone-600 font-sans text-sm mt-2 font-light">
              Guiding luxury art acquisition and framing craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center font-sans">
                  <h3 className="text-lg font-serif text-stone-900">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mt-1 mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

     
    </div>
  );
}