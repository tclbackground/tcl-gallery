export const metadata = {
  title: "About Us | TCL Gallery",
  description:
    "Discover the philosophy behind TCL Gallery — celebrating life through art, creativity, and meaningful visual expression.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#22211B]">
      <main>
        {/* HERO */}
        <section className="px-6 py-28 sm:py-36 border-b border-[#EAE3D2]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#7B8F50]">
              About TCL Gallery
            </span>

            <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-tight">
              Today Celebrate Life
            </h1>

            <p className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-[#66635B] font-light leading-relaxed">
              Art should captivate, enrich, and become an integral part of
              everyday living.
            </p>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
          <div className="space-y-10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#7B8F50]">
                Our Philosophy
              </span>

              <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Art is more than what we see.
              </h2>
            </div>

            <div className="space-y-7 text-base sm:text-lg text-[#4A4843] font-light leading-relaxed">
              <p>
                Art is an expression of imagination, creativity, skill, and
                human vision. It transforms ideas, emotions, culture, and
                experiences into forms that inspire appreciation, curiosity,
                and personal interpretation.
              </p>

              <p>
                At TCL Gallery, we believe that art adds beauty, character,
                identity, and meaning to the spaces we live in. A carefully
                chosen artwork reflects personal taste while preserving
                memories, celebrating perspectives, and connecting us with
                the vision of the artist.
              </p>

              <p>
                For us, collecting and living with art is ultimately about
                celebrating life. It is about finding beauty in everyday
                moments and making our surroundings more meaningful.
              </p>
            </div>

            {/* CLOSING PHILOSOPHY */}
            <div className="border-l-2 border-[#7B8F50] pl-6 sm:pl-8 py-2">
              <p className="font-serif text-2xl sm:text-3xl italic leading-relaxed text-[#22211B]">
                “Collecting fine art strengthens our connection with people,
                culture, and visual expression while reminding us to find
                joy in ordinary moments.”
              </p>
            </div>
          </div>
        </section>

        {/* SIMPLE CLOSING */}
        <section className="bg-[#22211B] text-white px-6 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl leading-tight">
              Art that becomes part of life.
            </h2>

            <p className="mt-5 text-sm sm:text-base text-[#B0AAA0] font-light leading-relaxed">
              TCL Gallery is built around a simple philosophy  to bring
              meaningful art into everyday spaces and celebrate the beauty of
              life through visual expression.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}