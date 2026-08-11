import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiShield, FiEye, FiAward } from "react-icons/fi";

export const metadata = {
  title: "About Us | TCL Gallery",
  description:
    "Luxury framing, fine art curation, museum-grade archival protection, and bespoke art advisory at TCL Gallery.",
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Bespoke Framing & Preservation",
      subtitle: "Museum-Grade Archival Materials",
      description:
        "Combining exceptional artistry with museum-quality production, archival glazing, and custom hand-crafted framing engineered for lasting preservation.",
      image: "/images/banner-1.png",
      icon: FiShield,
    },
    {
      title: "Exclusive Art & Curation",
      subtitle: "Originality & Distinction",
      description:
        "Connecting luxury homeowners, interior architects, and collectors with limited-edition fine art and photography pieces embodying visual impact.",
      image: "/images/banner-2.png",
      icon: FiAward,
    },
    {
      title: "Virtual Viewing & AR Staging",
      subtitle: "Immersive Spatial Previews",
      description:
        "Experience art in your physical environment before acquisition with high-touch 3D frame visualization and augmented reality room staging.",
      image: "/images/banner-3.png",
      icon: FiEye,
    },
  ];

  const highlights = [
    { label: "Archival Quality", value: "Museum Grade", sub: "UV & Acid-Free" },
    { label: "Craftsmanship", value: "Custom Framing", sub: "Hand-finished Wood" },
    { label: "Client Services", value: "Private Advisory", sub: "Tailored Curation" },
    { label: "Preview Tech", value: "Virtual & AR", sub: "Spatial Staging" },
  ];

  const team = [
    {
      name: "Prasanna Chinmayi",
      role: "Creative Director & Principal Curator",
      bio: "Spearheading high-end visual curation, cinematic photography aesthetics, and gallery digital strategy.",
      image: "/images/1.png",
    },
    {
      name: "Master Artisan",
      role: "Head of Archival Framing",
      bio: "Over two decades of master craftsmanship specializing in museum preservation and bespoke finishes.",
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#22211B] selection:bg-[#7B8F50] selection:text-white">
      <main>
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF8F5] to-[#F5F2EA] border-b border-[#EAE3D2]/60 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
            <span className="inline-block rounded-full bg-[#7B8F50]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#7B8F50] border border-[#7B8F50]/20">
              TCL Gallery &bull; 
            </span>
            
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#22211B] leading-[1.12]">
              Where Fine Art Meets <br className="hidden sm:inline" />
              <span className="italic font-light text-[#7B8F50]">Archival Excellence</span>
            </h1>
            
            <p className="font-sans text-base sm:text-xl text-[#55534E] max-w-3xl mx-auto font-light leading-relaxed pt-2">
              A premier destination for luxury fine art, photography, bespoke archival framing, and high-touch art advisory for collectors and refined spaces.
            </p>
          </div>
        </section>

        {/* METRICS & HIGHLIGHTS STRIP */}
        <section className="bg-white border-b border-[#EAE3D2] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE3D2]/60">
            {highlights.map((item, idx) => (
              <div key={idx} className={`pt-4 lg:pt-0 ${idx !== 0 ? "lg:pl-8" : ""} text-center lg:text-left space-y-1`}>
                <p className="font-serif text-2xl sm:text-3xl font-medium text-[#7B8F50]">
                  {item.value}
                </p>
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#22211B]">
                  {item.label}
                </p>
                <p className="font-sans text-xs text-[#88847C] font-light">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* EDITORIAL ESSAY / BRAND PHILOSOPHY */}
        <section className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Sticky Editorial Title */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#7B8F50]">
                Our Philosophy
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#22211B] leading-tight">
                Today Celebrate Life
              </h2>
              <p className="font-sans text-sm text-[#77736C] leading-relaxed font-light">
                Art should captivate, enrich, and become an integral element of daily living.
              </p>
              <div className="w-16 h-0.5 bg-[#7B8F50] mt-4" />
            </div>

            {/* Right Prose Content */}
            <div className="lg:col-span-8 space-y-10 font-sans text-[#4A4843] leading-relaxed text-base sm:text-lg font-light">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE3D2] shadow-sm space-y-6">
                <h3 className="font-serif text-2xl text-[#22211B]">The Expression of Vision & Heritage</h3>
                <p>
                  Art is the expression of imagination, creativity, skill, and human vision. It transforms ideas, emotions, culture, and experiences into forms that inspire appreciation, curiosity, and personal interpretation, enriching life with beauty, character, and creative expression.
                </p>
                <p>
                  A carefully chosen artwork reflects personal taste while adding identity, depth, and distinction to a space. It preserves history, celebrates diverse perspectives, and showcases the vision of the artist.
                </p>
              </div>

              {/* Highlight Quote Box */}
              <div className="bg-[#FAF8F5] border-l-4 border-[#7B8F50] p-8 rounded-r-3xl border-y border-r border-[#EAE3D2]">
                <p className="font-serif text-xl sm:text-2xl italic text-[#22211B] leading-relaxed">
                  &ldquo;Collecting fine art strengthens the connection between people, culture, and visual expression. More importantly, it reminds us to find joy in ordinary moments and make everyday life richer.&rdquo;
                </p>
              </div>

              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE3D2] shadow-sm space-y-6">
                <h3 className="font-serif text-2xl text-[#22211B]">Uncompromising Quality & Craftsmanship</h3>
                <p>
                  What distinguishes TCL Gallery is our commitment to combining exceptional artistry with museum-quality production, archival materials, and expertly handcrafted framing. Meticulous attention to detail preserves the richness, character, and integrity of each work.
                </p>
                <ul className="space-y-3 text-sm text-[#22211B] font-medium pt-2">
                  <li className="flex items-center gap-3">
                    <FiCheckCircle className="text-[#7B8F50] shrink-0" /> Archival Museum Glazing & Conservation Mounts
                  </li>
                  <li className="flex items-center gap-3">
                    <FiCheckCircle className="text-[#7B8F50] shrink-0" /> Hand-Finished Custom Wooden Mouldings
                  </li>
                  <li className="flex items-center gap-3">
                    <FiCheckCircle className="text-[#7B8F50] shrink-0" /> Curated Works for Private, Commercial & Public Spaces
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* THREE PILLARS CARDS */}
        <section className="bg-[#FAF8F5] border-y border-[#EAE3D2] py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#7B8F50]">
                Core Pillars
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#22211B]">
                The TCL Standard
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="group bg-white rounded-3xl border border-[#EAE3D2] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#7B8F50]/50 transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-64 w-full overflow-hidden bg-[#ECE9E2]">
                        <Image
                          src={pillar.image}
                          alt={pillar.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#7B8F50] shadow-sm">
                          <IconComponent className="text-lg" />
                        </div>
                      </div>

                      <div className="p-8 space-y-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#7B8F50]">
                          {pillar.subtitle}
                        </span>
                        <h3 className="font-serif text-2xl text-[#22211B]">
                          {pillar.title}
                        </h3>
                        <p className="font-sans text-sm text-[#66635B] leading-relaxed font-light">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TEAM & CURATORS */}
        <section className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#7B8F50]">
              Expertise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#22211B]">
              Curatorial Leadership
            </h2>
            <p className="font-sans text-sm text-[#66635B] font-light">
              Guiding luxury art acquisition and framing craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-[#EAE3D2] shadow-sm hover:shadow-md transition-shadow p-4 space-y-4"
              >
                <div className="relative h-72 w-full rounded-2xl overflow-hidden bg-[#ECE9E2]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-2 pb-2 text-center space-y-2">
                  <h3 className="font-serif text-2xl text-[#22211B]">
                    {member.name}
                  </h3>
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#7B8F50]">
                    {member.role}
                  </p>
                  <p className="font-sans text-xs text-[#66635B] font-light leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EDITORIAL CALL TO ACTION */}
        <section className="bg-[#22211B] text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-bold text-[#7B8F50]">
              Discover Excellence
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight">
              Curate Your Space with Timeless Art
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#B0AAA0] font-light leading-relaxed">
              Explore collections distinguished by originality, elegance, and enduring artistic value.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#7B8F50] px-8 py-4 text-xs font-sans font-bold uppercase tracking-wider text-white transition hover:bg-[#687a41] shadow-lg"
              >
                Explore Collection <FiArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}