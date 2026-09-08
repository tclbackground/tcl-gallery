"use client";

import { useState } from "react";

const artMediums = [
  "Painting",
  "Drawing & Sketching",
  "Watercolour",
  "Acrylic Painting",
  "Oil Painting",
  "Charcoal",
  "Pencil Art",
  "Pastel",
  "Portrait Art",
  "Landscape Art",
  "Abstract Art",
  "Mixed Media",
  "Illustration",
  "Calligraphy",
  "Sculpture",
  "Photography",
  "Printmaking",
  "Textile Art",
  "Digital Art",
  "Craft",
  "Other",
];

const artCategories = [
  "Contemporary Art",
  "Traditional Art",
  "Abstract Art",
  "Figurative Art",
  "Landscape & Nature",
  "Portraiture",
  "Indian Art",
  "Modern Art",
  "Decorative Art",
  "Mixed Media",
  "Photography",
  "Sculpture",
  "Other",
];

const yearsOfPractice = [
  "Less than 2 years",
  "2–5 years",
  "5–10 years",
  "10–20 years",
  "20+ years",
];

const associationOptions = [
  "Exhibitions",
  "Art Sales",
  "Artist Representation",
  "Workshops",
  "Collaborations",
  "Commissions",
  "Other",
];

export default function ArtistRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    professionalName: "",
    email: "",
    phone: "",
    whatsapp: "",
    city: "",
    dateOfBirth: "",
    website: "",
    instagram: "",

    medium: "",
    category: "",
    yearsPractice: "",
    education: "",
    artistBio: "",
    artisticExperience: "",

    practiceDescription: "",
    materials: "",
    techniques: "",
    themes: "",
    currentProjects: "",

    exhibitions: "",
    galleries: "",
    awards: "",
    publications: "",

    portfolioUrl: "",
    artworkUrl: "",

    association: [] as string[],
    associationOther: "",
    galleryExpectation: "",

    availableWorks: "",
    artworkSizes: "",
    priceRange: "",
    numberOfWorks: "",
    customWork: "",

    additionalInformation: "",
    terms: false,
    promotionalConsent: false,
  });

  const [files, setFiles] = useState({
    cv: null as File | null,
    portfolio: null as File | null,
    artwork1: null as File | null,
    artwork2: null as File | null,
    artwork3: null as File | null,
  });

  const updateField = (
    field: keyof typeof form,
    value: string | boolean | string[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAssociation = (item: string) => {
    if (form.association.includes(item)) {
      updateField(
        "association",
        form.association.filter((value) => value !== item)
      );
    } else {
      updateField("association", [...form.association, item]);
    }
  };

  const handleFile = (
    field: keyof typeof files,
    file: File | null
  ) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.terms) {
      alert("Please accept the declaration before submitting.");
      return;
    }

    console.log("Artist Registration:", form);
    console.log("Files:", files);

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] flex items-center justify-center px-5 py-20 text-black">
        <div className="w-full max-w-2xl bg-white border border-black/10 p-10 md:p-16 text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white text-xl">
            ✓
          </div>

          <p className="text-[11px] tracking-[0.3em] uppercase text-black/45 mb-4">
            TCL Gallery
          </p>

          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-5">
            Registration Received
          </h1>

          <p className="text-sm md:text-base text-black/60 leading-7 max-w-lg mx-auto">
            Thank you for registering with TCL Gallery. Our team will review
            your artist profile and submitted material and contact you if there
            is an opportunity to work together.
          </p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-9 bg-black text-white px-7 py-3.5 text-sm hover:bg-black/80 transition"
          >
            Register Another Artist
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-black">
      {/* HERO */}
      <section className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
          <div className="max-w-5xl">
            <p className="text-[11px] md:text-xs tracking-[0.32em] uppercase text-black/45 mb-6">
              TCL Gallery · Artist Network
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[0.95] tracking-tight">
              Artist
              <br />
              Registration
            </h1>

            <p className="mt-8 max-w-3xl text-sm md:text-base leading-7 md:leading-8 text-black/60">
              We invite artists to register with TCL Gallery and share their
              artistic practice, portfolio and work with us. Your profile helps
              us understand your work and explore opportunities for exhibitions,
              sales, collaborations and other gallery initiatives.
            </p>

            <div className="mt-9 flex flex-wrap gap-2">
              <span className="border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.15em]">
                Artists
              </span>
              <span className="border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.15em]">
                Portfolio
              </span>
              <span className="border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.15em]">
                Collaborate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14 md:py-20"
      >
        <div className="w-full mb-14 md:mb-20">
          <p className="text-sm leading-7 text-black/55 max-w-4xl">
            Please provide accurate information about your artistic practice
            and portfolio. The information submitted through this form will be
            used by TCL Gallery to evaluate your profile for relevant gallery
            opportunities.
          </p>
        </div>

        <FormSection
          number="01"
          title="Artist Information"
          description="Tell us about yourself and how we can reach you."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" required value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
            <Input label="Professional / Artist Name" value={form.professionalName} onChange={(e) => updateField("professionalName", e.target.value)} />
            <Input label="Email Address" type="email" required value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            <Input label="Mobile Number" required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
            <Input label="WhatsApp Number" value={form.whatsapp} onChange={(e) => updateField("whatsapp", e.target.value)} />
            <Input label="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} />
            <Input label="Website" placeholder="https://..." value={form.website} onChange={(e) => updateField("website", e.target.value)} />
            <Input label="Instagram" placeholder="@username" value={form.instagram} onChange={(e) => updateField("instagram", e.target.value)} />
          </div>
        </FormSection>

        <FormSection
          number="02"
          title="Artistic Profile"
          description="Help us understand your medium, experience and artistic background."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Primary Art Medium" required value={form.medium} onChange={(e) => updateField("medium", e.target.value)} options={artMediums} />
            <Select label="Primary Art Category" value={form.category} onChange={(e) => updateField("category", e.target.value)} options={artCategories} />
            <Select label="Years of Artistic Practice" value={form.yearsPractice} onChange={(e) => updateField("yearsPractice", e.target.value)} options={yearsOfPractice} />
            <Input label="Art Education / Training" value={form.education} onChange={(e) => updateField("education", e.target.value)} />
          </div>

          <div className="mt-6 space-y-6">
            <Textarea label="Artist Bio" required placeholder="Tell us about your artistic journey, practice, interests and achievements." value={form.artistBio} onChange={(e) => updateField("artistBio", e.target.value)} />
            <Textarea label="Artistic Experience" placeholder="Exhibitions, commissions, residencies, projects, teaching or other relevant experience." value={form.artisticExperience} onChange={(e) => updateField("artisticExperience", e.target.value)} />
          </div>
        </FormSection>

        <FormSection
          number="03"
          title="Art Practice"
          description="Tell us more about the work you create and the ideas behind it."
        >
          <div className="space-y-6">
            <Textarea label="Description of Artistic Practice" required placeholder="Describe your artistic practice and what defines your work." value={form.practiceDescription} onChange={(e) => updateField("practiceDescription", e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea label="Materials / Media Used" placeholder="Canvas, paper, wood, metal, found objects, digital media etc." value={form.materials} onChange={(e) => updateField("materials", e.target.value)} />
              <Textarea label="Techniques" placeholder="Describe the techniques and processes used in your work." value={form.techniques} onChange={(e) => updateField("techniques", e.target.value)} />
            </div>
            <Textarea label="Themes / Subjects" placeholder="Nature, people, culture, memory, abstraction, architecture etc." value={form.themes} onChange={(e) => updateField("themes", e.target.value)} />
            <Textarea label="Current Projects" placeholder="Tell us about any ongoing or upcoming projects you would like to share." value={form.currentProjects} onChange={(e) => updateField("currentProjects", e.target.value)} />
          </div>
        </FormSection>

        <FormSection
          number="04"
          title="Exhibitions & Recognition"
          description="Share exhibitions, institutions, awards and publications that are relevant to your practice."
        >
          <div className="space-y-6">
            <Textarea label="Previous Exhibitions" placeholder="Mention solo and group exhibitions with year and location where possible." value={form.exhibitions} onChange={(e) => updateField("exhibitions", e.target.value)} />
            <Textarea label="Galleries / Institutions" placeholder="Mention galleries, museums, art spaces, institutions or organisations you have worked with." value={form.galleries} onChange={(e) => updateField("galleries", e.target.value)} />
            <Textarea label="Awards & Recognition" placeholder="Awards, grants, residencies, competitions or other recognition." value={form.awards} onChange={(e) => updateField("awards", e.target.value)} />
            <Textarea label="Publications / Media Features" placeholder="Books, magazines, newspapers, websites, interviews or other features." value={form.publications} onChange={(e) => updateField("publications", e.target.value)} />
          </div>
        </FormSection>

        <FormSection
          number="05"
          title="Portfolio & Documents"
          description="Upload your portfolio and supporting documents so our team can review your work."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FileUpload label="Artist CV / Resume" accept=".pdf,.doc,.docx" file={files.cv} onChange={(file) => handleFile("cv", file)} />
            <FileUpload label="Artist Portfolio" accept=".pdf,.doc,.docx" file={files.portfolio} onChange={(file) => handleFile("portfolio", file)} />
            <FileUpload label="Artwork Sample 01" accept="image/*,.pdf" file={files.artwork1} onChange={(file) => handleFile("artwork1", file)} />
            <FileUpload label="Artwork Sample 02" accept="image/*,.pdf" file={files.artwork2} onChange={(file) => handleFile("artwork2", file)} />
            <FileUpload label="Artwork Sample 03" accept="image/*,.pdf" file={files.artwork3} onChange={(file) => handleFile("artwork3", file)} />
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Portfolio Website / Link" placeholder="https://..." value={form.portfolioUrl} onChange={(e) => updateField("portfolioUrl", e.target.value)} />
            <Input label="Artwork / Online Gallery Link" placeholder="https://..." value={form.artworkUrl} onChange={(e) => updateField("artworkUrl", e.target.value)} />
          </div>
        </FormSection>

        <FormSection
          number="06"
          title="Gallery Association"
          description="Tell us what kind of opportunities you would like to explore with TCL Gallery."
        >
          <div>
            <label className="block text-sm font-medium mb-3">
              Areas of Interest
            </label>

            <div className="flex flex-wrap gap-2">
              {associationOptions.map((item) => {
                const selected = form.association.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAssociation(item)}
                    className={`px-4 py-2.5 border text-xs transition ${
                      selected
                        ? "bg-black text-white border-black"
                        : "bg-white border-black/15 hover:border-black"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {form.association.includes("Other") && (
            <div className="mt-6">
              <Input label="Please Specify" value={form.associationOther} onChange={(e) => updateField("associationOther", e.target.value)} />
            </div>
          )}

          <div className="mt-7">
            <Textarea label="What Are You Looking For From TCL Gallery?" placeholder="Tell us about the kind of association, opportunity or collaboration you would like to explore." value={form.galleryExpectation} onChange={(e) => updateField("galleryExpectation", e.target.value)} />
          </div>
        </FormSection>

        <FormSection
          number="07"
          title="Artwork Details"
          description="Share practical information about the works you currently have available."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Available Works" placeholder="Example: Paintings, sculptures, prints" value={form.availableWorks} onChange={(e) => updateField("availableWorks", e.target.value)} />
            <Input label="Number of Works Available" type="number" value={form.numberOfWorks} onChange={(e) => updateField("numberOfWorks", e.target.value)} />
            <Input label="Typical Artwork Sizes" placeholder="Example: 24 × 36 inches" value={form.artworkSizes} onChange={(e) => updateField("artworkSizes", e.target.value)} />
            <Input label="Typical Price Range" placeholder="₹" value={form.priceRange} onChange={(e) => updateField("priceRange", e.target.value)} />
          </div>

          <div className="mt-6">
            <Textarea label="Custom / Commissioned Work" placeholder="Mention whether you accept commissions and any relevant details." value={form.customWork} onChange={(e) => updateField("customWork", e.target.value)} />
          </div>
        </FormSection>

        <FormSection
          number="08"
          title="Additional Information"
          description="Share anything else you would like TCL Gallery to know about you or your work."
        >
          <Textarea label="Additional Information" placeholder="Any other information, links, achievements, ideas or notes you would like to share." value={form.additionalInformation} onChange={(e) => updateField("additionalInformation", e.target.value)} />
        </FormSection>

        <FormSection
          number="09"
          title="Declaration & Consent"
          description="Please confirm the following before submitting your artist registration."
        >
          <div className="space-y-5">
            <Checkbox
              checked={form.terms}
              onChange={(value) => updateField("terms", value)}
              label="I confirm that the information provided in this registration is accurate and complete."
            />

            <Checkbox
              checked={form.promotionalConsent}
              onChange={(value) => updateField("promotionalConsent", value)}
              label="I allow TCL Gallery to use my artist profile, submitted artwork and registration information for gallery evaluation and promotional purposes where appropriate."
            />
          </div>
        </FormSection>

        <div className="border-t border-black/10 pt-10 mt-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">
            <p className="text-xs leading-5 text-black/45 max-w-md">
              Registration does not guarantee exhibition, representation, sales
              or any other association with TCL Gallery. Each artist profile
              will be reviewed based on the gallery's requirements and
              opportunities.
            </p>

            <button
              type="submit"
              className="w-full md:w-auto bg-black text-white px-10 py-4 text-sm tracking-wide hover:bg-black/80 transition"
            >
              Register as Artist
            </button>
          </div>
        </div>
      </form>

      <footer className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row justify-between gap-3 text-xs text-black/45">
          <span>TCL Gallery</span>
          <span>Artist Registration · Bengaluru</span>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================
   FORM SECTION
   Section title is ABOVE the fields, not on the side.
============================================================ */

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-black/10 py-14 md:py-20">
      <div className="w-full mb-10 md:mb-14">
        <span className="block text-[11px] tracking-[0.25em] text-black/35">
          {number}
        </span>

        <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight break-words">
          {title}
        </h2>

        <p className="mt-5 max-w-2xl text-sm sm:text-base leading-7 text-black/45">
          {description}
        </p>
      </div>

      <div className="w-full min-w-0">
        {children}
      </div>
    </section>
  );
}

/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>

      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full max-w-full h-12 border border-black/15 bg-white px-4 text-sm outline-none focus:border-black transition placeholder:text-black/30"
      />
    </label>
  );
}

/* ============================================================
   TEXTAREA
============================================================ */

function Textarea({
  label,
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>

      <textarea
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={5}
        className="block w-full max-w-full border border-black/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-black transition resize-y placeholder:text-black/30"
      />
    </label>
  );
}

/* ============================================================
   SELECT
============================================================ */

function Select({
  label,
  required,
  value,
  onChange,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>

      <select
        required={required}
        value={value}
        onChange={onChange}
        className="block w-full max-w-full h-12 border border-black/15 bg-white px-4 text-sm outline-none focus:border-black transition"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ============================================================
   FILE UPLOAD
============================================================ */

function FileUpload({
  label,
  accept,
  file,
  onChange,
}: {
  label: string;
  accept?: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="block cursor-pointer min-w-0">
      <span className="block text-sm font-medium mb-2">{label}</span>

      <div className="border border-dashed border-black/20 bg-white p-6 hover:border-black transition">
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="hidden"
        />

        <div className="text-center">
          <div className="text-xl mb-2">↑</div>

          <p className="text-sm break-all">
            {file ? file.name : "Click to upload"}
          </p>

          <p className="text-[11px] text-black/35 mt-2">
            PDF, DOC, DOCX or image
          </p>
        </div>
      </div>
    </label>
  );
}

/* ============================================================
   CHECKBOX
============================================================ */

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-black shrink-0"
      />

      <span className="text-sm leading-6 text-black/60">{label}</span>
    </label>
  );
}
