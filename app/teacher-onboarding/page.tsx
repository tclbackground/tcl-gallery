"use client";

import { useState } from "react";

const artMediums = [
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
  "Digital Art",
  "Photography",
  "Art & Craft",
  "Other",
];

const studentLevels = [
  "Complete Beginners",
  "Beginners",
  "Intermediate",
  "Advanced",
  "Mixed Level",
];

const ageGroups = [
  "Kids – 4 to 7 Years",
  "Kids – 8 to 12 Years",
  "Teens – 13 to 17 Years",
  "Adults – 18+",
  "All Age Groups",
];

const courseFormats = [
  "Regular Weekly Class",
  "4-Week Course",
  "6-Week Course",
  "8-Week Course",
  "12-Week Course",
  "Weekend Workshop",
  "One-Day Workshop",
  "Masterclass",
  "Holiday / Summer Camp",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ArtistWorkshopPage() {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    artistName: "",
    professionalName: "",
    email: "",
    phone: "",
    whatsapp: "",
    city: "",
    website: "",
    instagram: "",
    bio: "",

    education: "",
    artisticExperience: "",
    teachingExperience: "",
    previousInstitutions: "",

    classTitle: "",
    medium: "",
    classDescription: "",
    learningOutcome: "",
    studentProject: "",
    level: "",
    ageGroup: "",
    format: "",
    sessions: "",
    duration: "",
    minStudents: "",
    maxStudents: "",

    weekdays: [] as string[],
    preferredTime: "",
    availableFrom: "",

    materialsRequired: "",
    materialsProvided: "",
    equipmentRequired: "",
    materialCost: "",

    paymentModel: "",
    expectedFee: "",
    minimumGuarantee: "",
    otherRequirements: "",

    portfolio: "",
    references: "",

    terms: false,
    promotionalConsent: false,
  });

  const [files, setFiles] = useState({
    cv: null as File | null,
    portfolio: null as File | null,
    artwork: null as File | null,
    lessonPlan: null as File | null,
  });

  const updateField = (
    field: keyof typeof form,
    value: string | boolean | string[]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDay = (day: string) => {
    if (form.weekdays.includes(day)) {
      updateField(
        "weekdays",
        form.weekdays.filter((item) => item !== day)
      );
    } else {
      updateField("weekdays", [...form.weekdays, day]);
    }
  };

  const handleFile = (
    field: keyof typeof files,
    file: File | null
  ) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.terms) {
      alert("Please accept the declaration before submitting.");
      return;
    }

    console.log("Artist Application:", form);
    console.log("Files:", files);

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] flex items-center justify-center px-5 py-20">
        <div className="w-full max-w-2xl bg-white border border-black/10 p-10 md:p-16 text-center">

          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white text-xl">
            ✓
          </div>

          <p className="text-[11px] tracking-[0.3em] uppercase text-black/45 mb-4">
            TCL Gallery
          </p>

          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-5">
            Application Received
          </h1>

          <p className="text-sm md:text-base text-black/60 leading-7 max-w-lg mx-auto">
            Thank you for your interest in teaching at TCL Gallery.
            Our team will review your artist profile and proposed
            class/workshop. We will contact shortlisted artists.
          </p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-9 bg-black text-white px-7 py-3.5 text-sm hover:bg-black/80 transition"
          >
            Submit Another Application
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-black">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">

          <div className="max-w-4xl">

            <p className="text-[11px] md:text-xs tracking-[0.32em] uppercase text-black/45 mb-6">
              TCL Gallery · Art Learning Centre
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[0.95] tracking-tight">
              Artist Workshop
              <br />
              & Instructor Application
            </h1>

            <p className="mt-8 max-w-2xl text-sm md:text-base leading-7 md:leading-8 text-black/60">
              We are looking for artists, art educators and creative
              professionals who can create meaningful learning
              experiences for our students.
            </p>

            <div className="mt-9 flex flex-wrap gap-2">
              <span className="border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.15em]">
                Teach
              </span>

              <span className="border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.15em]">
                Create
              </span>

              <span className="border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.15em]">
                Inspire
              </span>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14 md:py-20"
      >

        <div className="max-w-3xl ml-auto mb-12">
          <p className="text-sm leading-7 text-black/55">
            Please provide details about your artistic practice,
            teaching experience and the class or workshop you would
            like to conduct at TCL Gallery. Each proposal is reviewed
            based on artistic quality, teaching experience, student
            relevance and course potential.
          </p>
        </div>


        {/* =====================================================
            01
        ===================================================== */}

        <FormSection
          number="01"
          title="Artist Information"
          description="Tell us about yourself and your artistic practice."
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Input
              label="Full Name"
              required
              value={form.artistName}
              onChange={(e) =>
                updateField("artistName", e.target.value)
              }
            />

            <Input
              label="Professional / Artist Name"
              value={form.professionalName}
              onChange={(e) =>
                updateField("professionalName", e.target.value)
              }
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
            />

            <Input
              label="Mobile Number"
              required
              value={form.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
            />

            <Input
              label="WhatsApp Number"
              value={form.whatsapp}
              onChange={(e) =>
                updateField("whatsapp", e.target.value)
              }
            />

            <Input
              label="City"
              value={form.city}
              onChange={(e) =>
                updateField("city", e.target.value)
              }
            />

            <Input
              label="Website / Portfolio URL"
              value={form.website}
              onChange={(e) =>
                updateField("website", e.target.value)
              }
            />

            <Input
              label="Instagram"
              placeholder="@username"
              value={form.instagram}
              onChange={(e) =>
                updateField("instagram", e.target.value)
              }
            />

          </div>

          <div className="mt-6">
            <Textarea
              label="Artist Bio"
              required
              placeholder="Tell us about your artistic journey, practice, interests and achievements."
              value={form.bio}
              onChange={(e) =>
                updateField("bio", e.target.value)
              }
            />
          </div>

        </FormSection>


        {/* =====================================================
            02
        ===================================================== */}

        <FormSection
          number="02"
          title="Professional & Teaching Experience"
          description="Help us understand your background and experience."
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Textarea
              label="Art Education / Qualifications"
              value={form.education}
              onChange={(e) =>
                updateField("education", e.target.value)
              }
            />

            <Textarea
              label="Artistic Experience"
              placeholder="Exhibitions, galleries, awards, commissions, residencies etc."
              value={form.artisticExperience}
              onChange={(e) =>
                updateField(
                  "artisticExperience",
                  e.target.value
                )
              }
            />

            <Textarea
              label="Teaching Experience"
              required
              placeholder="Years of teaching, subjects taught, student age groups etc."
              value={form.teachingExperience}
              onChange={(e) =>
                updateField(
                  "teachingExperience",
                  e.target.value
                )
              }
            />

            <Textarea
              label="Previous Institutions / Art Centres"
              placeholder="Where have you previously taught or conducted workshops?"
              value={form.previousInstitutions}
              onChange={(e) =>
                updateField(
                  "previousInstitutions",
                  e.target.value
                )
              }
            />

          </div>

        </FormSection>


        {/* =====================================================
            03 - FIXED LAYOUT
        ===================================================== */}

        <FormSection
          number="03"
          title="Proposed Class / Workshop"
          description="Tell us about the class or workshop you would like to conduct."
        >

          {/* CLASS TITLE */}

          <Input
            label="Proposed Class / Workshop Title"
            required
            placeholder="Example: Contemporary Watercolour for Beginners"
            value={form.classTitle}
            onChange={(e) =>
              updateField("classTitle", e.target.value)
            }
          />

          {/* DROPDOWNS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">

            <Select
              label="Primary Art Medium"
              required
              value={form.medium}
              onChange={(e) =>
                updateField("medium", e.target.value)
              }
              options={artMediums}
            />

            <Select
              label="Student Level"
              required
              value={form.level}
              onChange={(e) =>
                updateField("level", e.target.value)
              }
              options={studentLevels}
            />

            <Select
              label="Target Age Group"
              required
              value={form.ageGroup}
              onChange={(e) =>
                updateField("ageGroup", e.target.value)
              }
              options={ageGroups}
            />

            <Select
              label="Course / Workshop Format"
              required
              value={form.format}
              onChange={(e) =>
                updateField("format", e.target.value)
              }
              options={courseFormats}
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mt-6 space-y-6">

            <Textarea
              label="Class Description"
              required
              placeholder="Describe the class and what makes it interesting for students."
              value={form.classDescription}
              onChange={(e) =>
                updateField(
                  "classDescription",
                  e.target.value
                )
              }
            />

            <Textarea
              label="What Will Students Learn?"
              required
              placeholder="Mention techniques, concepts, skills and knowledge students will gain."
              value={form.learningOutcome}
              onChange={(e) =>
                updateField(
                  "learningOutcome",
                  e.target.value
                )
              }
            />

            <Textarea
              label="What Will Students Create?"
              placeholder="Describe the artwork or project students will complete."
              value={form.studentProject}
              onChange={(e) =>
                updateField(
                  "studentProject",
                  e.target.value
                )
              }
            />

          </div>

        </FormSection>


        {/* =====================================================
            04
        ===================================================== */}

        <FormSection
          number="04"
          title="Course Structure"
          description="Provide the proposed structure of your class."
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <Input
              label="Number of Sessions"
              type="number"
              placeholder="Example: 6"
              value={form.sessions}
              onChange={(e) =>
                updateField("sessions", e.target.value)
              }
            />

            <Input
              label="Duration Per Session"
              placeholder="Example: 2 Hours"
              value={form.duration}
              onChange={(e) =>
                updateField("duration", e.target.value)
              }
            />

            <Input
              label="Minimum Students"
              type="number"
              value={form.minStudents}
              onChange={(e) =>
                updateField(
                  "minStudents",
                  e.target.value
                )
              }
            />

            <Input
              label="Maximum Students"
              type="number"
              value={form.maxStudents}
              onChange={(e) =>
                updateField(
                  "maxStudents",
                  e.target.value
                )
              }
            />

          </div>

        </FormSection>


        {/* =====================================================
            05
        ===================================================== */}

        <FormSection
          number="05"
          title="Availability"
          description="Tell us when you are available to teach."
        >

          <div>

            <label className="block text-sm font-medium mb-3">
              Preferred Teaching Days
            </label>

            <div className="flex flex-wrap gap-2">

              {days.map((day) => {

                const selected =
                  form.weekdays.includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2.5 border text-xs transition ${
                      selected
                        ? "bg-black text-white border-black"
                        : "bg-white border-black/15 hover:border-black"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">

            <Input
              label="Preferred Time"
              placeholder="Example: 4:00 PM – 6:00 PM"
              value={form.preferredTime}
              onChange={(e) =>
                updateField(
                  "preferredTime",
                  e.target.value
                )
              }
            />

            <Input
              label="Available From"
              type="date"
              value={form.availableFrom}
              onChange={(e) =>
                updateField(
                  "availableFrom",
                  e.target.value
                )
              }
            />

          </div>

        </FormSection>


        {/* =====================================================
            06
        ===================================================== */}

        <FormSection
          number="06"
          title="Materials & Studio Requirements"
          description="Let us know what is required for your class."
        >

          <div className="space-y-6">

            <Textarea
              label="Materials Required"
              placeholder="List all materials students will need."
              value={form.materialsRequired}
              onChange={(e) =>
                updateField(
                  "materialsRequired",
                  e.target.value
                )
              }
            />

            <Textarea
              label="Materials Provided By Artist"
              placeholder="Mention any materials you will provide."
              value={form.materialsProvided}
              onChange={(e) =>
                updateField(
                  "materialsProvided",
                  e.target.value
                )
              }
            />

            <Textarea
              label="Equipment / Studio Requirements"
              placeholder="Easels, tables, projector, sink, lighting, special equipment etc."
              value={form.equipmentRequired}
              onChange={(e) =>
                updateField(
                  "equipmentRequired",
                  e.target.value
                )
              }
            />

            <Input
              label="Estimated Material Cost Per Student"
              placeholder="₹"
              value={form.materialCost}
              onChange={(e) =>
                updateField(
                  "materialCost",
                  e.target.value
                )
              }
            />

          </div>

        </FormSection>


        {/* =====================================================
            07
        ===================================================== */}

        <FormSection
          number="07"
          title="Commercial Proposal"
          description="Please provide your expected teaching fee or preferred payment model."
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Select
              label="Preferred Payment Model"
              value={form.paymentModel}
              onChange={(e) =>
                updateField(
                  "paymentModel",
                  e.target.value
                )
              }
              options={[
                "Fixed Fee Per Class",
                "Fixed Course Fee",
                "Per Student",
                "Revenue Share",
                "Open to Discussion",
              ]}
            />

            <Input
              label="Expected Fee"
              placeholder="₹"
              value={form.expectedFee}
              onChange={(e) =>
                updateField(
                  "expectedFee",
                  e.target.value
                )
              }
            />

            <Input
              label="Minimum Guarantee, If Any"
              placeholder="₹"
              value={form.minimumGuarantee}
              onChange={(e) =>
                updateField(
                  "minimumGuarantee",
                  e.target.value
                )
              }
            />

          </div>

          <div className="mt-6">

            <Textarea
              label="Other Commercial / Professional Requirements"
              value={form.otherRequirements}
              onChange={(e) =>
                updateField(
                  "otherRequirements",
                  e.target.value
                )
              }
            />

          </div>

        </FormSection>


        {/* =====================================================
            08
        ===================================================== */}

        <FormSection
          number="08"
          title="Portfolio & Documents"
          description="Upload documents that help us evaluate your application."
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FileUpload
              label="Artist CV / Resume"
              accept=".pdf,.doc,.docx"
              file={files.cv}
              onChange={(file) =>
                handleFile("cv", file)
              }
            />

            <FileUpload
              label="Teaching / Course Portfolio"
              accept=".pdf,.doc,.docx"
              file={files.portfolio}
              onChange={(file) =>
                handleFile("portfolio", file)
              }
            />

            <FileUpload
              label="Sample Artwork"
              accept="image/*,.pdf"
              file={files.artwork}
              onChange={(file) =>
                handleFile("artwork", file)
              }
            />

            <FileUpload
              label="Sample Lesson Plan / Syllabus"
              accept=".pdf,.doc,.docx"
              file={files.lessonPlan}
              onChange={(file) =>
                handleFile("lessonPlan", file)
              }
            />

          </div>

          <div className="mt-7">

            <Input
              label="Portfolio / Previous Workshop Link"
              placeholder="https://..."
              value={form.portfolio}
              onChange={(e) =>
                updateField(
                  "portfolio",
                  e.target.value
                )
              }
            />

          </div>

          <div className="mt-6">

            <Textarea
              label="Professional References"
              placeholder="Name, organization and contact details of previous institutions / references."
              value={form.references}
              onChange={(e) =>
                updateField(
                  "references",
                  e.target.value
                )
              }
            />

          </div>

        </FormSection>


        {/* =====================================================
            09
        ===================================================== */}

        <FormSection
          number="09"
          title="Declaration & Consent"
          description="Please confirm the following before submitting."
        >

          <div className="space-y-5">

            <Checkbox
              checked={form.terms}
              onChange={(value) =>
                updateField("terms", value)
              }
              label="I confirm that the information provided in this application is accurate and complete."
            />

            <Checkbox
              checked={form.promotionalConsent}
              onChange={(value) =>
                updateField(
                  "promotionalConsent",
                  value
                )
              }
              label="I allow TCL Gallery to use my artist profile, artwork and workshop information for promotional purposes if selected."
            />

          </div>

        </FormSection>


        {/* =====================================================
            SUBMIT
        ===================================================== */}

        <div className="border-t border-black/10 pt-10 mt-2">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">

            <p className="text-xs leading-5 text-black/45 max-w-md">
              Submission of this application does not guarantee
              selection. TCL Gallery will review each proposal and
              contact shortlisted artists.
            </p>

            <button
              type="submit"
              className="w-full md:w-auto bg-black text-white px-10 py-4 text-sm tracking-wide hover:bg-black/80 transition"
            >
              Submit Artist Application
            </button>

          </div>

        </div>

      </form>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-black/10">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row justify-between gap-3 text-xs text-black/45">

          <span>
            TCL Gallery
          </span>

          <span>
            Art Learning Centre · Bengaluru
          </span>

        </div>

      </footer>

    </main>
  );
}


/* ============================================================
   FORM SECTION
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
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <label className="block min-w-0">

      <span className="block text-sm font-medium mb-2">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </span>

      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          block
          w-full
          max-w-full
          h-12
          border
          border-black/15
          bg-white
          px-4
          text-sm
          outline-none
          focus:border-black
          transition
          placeholder:text-black/30
        "
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
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <label className="block min-w-0">

      <span className="block text-sm font-medium mb-2">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </span>

      <textarea
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={5}
        className="
          block
          w-full
          max-w-full
          border
          border-black/15
          bg-white
          px-4
          py-3
          text-sm
          leading-6
          outline-none
          focus:border-black
          transition
          resize-y
          placeholder:text-black/30
        "
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
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  options: string[];
}) {
  return (
    <label className="block min-w-0">

      <span className="block text-sm font-medium mb-2">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </span>

      <select
        required={required}
        value={value}
        onChange={onChange}
        className="
          block
          w-full
          max-w-full
          h-12
          border
          border-black/15
          bg-white
          px-4
          text-sm
          outline-none
          focus:border-black
          transition
        "
      >

        <option value="">
          Select an option
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
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

      <span className="block text-sm font-medium mb-2">
        {label}
      </span>

      <div className="border border-dashed border-black/20 bg-white p-6 hover:border-black transition">

        <input
          type="file"
          accept={accept}
          onChange={(e) =>
            onChange(
              e.target.files?.[0] || null
            )
          }
          className="hidden"
        />

        <div className="text-center">

          <div className="text-xl mb-2">
            ↑
          </div>

          <p className="text-sm break-all">
            {file
              ? file.name
              : "Click to upload"}
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
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="mt-1 h-4 w-4 accent-black shrink-0"
      />

      <span className="text-sm leading-6 text-black/60">
        {label}
      </span>

    </label>
  );
}