"use client";

import { useState } from "react";

export default function TeacherOnboardingPage() {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    preferredName: "",
    dob: "",
    gender: "",
    mobile: "",
    whatsapp: "",
    email: "",
    city: "",
    address: "",

    professionalTitle: "",
    bio: "",
    yearsExperience: "",
    organisation: "",
    website: "",
    instagram: "",

    primaryArtForm: "",
    specialisation: "",
    skillLevel: "",
    ageGroups: [] as string[],
    teachingMode: "",

    qualification: "",
    artQualification: "",
    institution: "",
    qualificationYear: "",
    certifications: "",

    teachingExperience: "",
    previousInstitutions: "",
    subjectsTaught: "",
    onlineExperience: "",
    offlineExperience: "",
    workshopExperience: "",

    portfolio: "",
    sampleWork: "",

    teachingDays: [] as string[],
    teachingTime: "",
    hoursPerWeek: "",
    availabilityType: "",
    preferredLocation: "",

    teachingPhilosophy: "",
    beginnerApproach: "",
    teachingStyle: "",
    studentLearning: "",

    courseName: "",
    courseArtForm: "",
    courseAgeGroup: "",
    courseLevel: "",
    courseDuration: "",
    sessions: "",
    sessionDuration: "",
    minStudents: "",
    idealStudents: "",
    maxStudents: "",
    learningOutcomes: "",
    materialsRequired: "",
    materialsProvided: "",

    engagementModel: "",
    teachingFee: "",
    workshopFee: "",

    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",

    declaration: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxGroup = (
    name: "ageGroups" | "teachingDays",
    value: string
  ) => {
    setFormData((prev) => {
      const current = prev[name];

      return {
        ...prev,
        [name]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.declaration) {
      alert("Please accept the declaration before submitting.");
      return;
    }

    console.log("Teacher Onboarding Form:", formData);

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm md:p-14">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">
              ✓
            </div>

            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
              TCL Gallery
            </p>

            <h1 className="font-serif text-4xl text-gray-900">
              Thank You
            </h1>

            <p className="mx-auto mt-5 max-w-lg leading-7 text-gray-600">
              Your teacher onboarding form has been submitted successfully.
              Our team will review your profile and portfolio and get back to
              you shortly.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Submit Another Form
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0]">
      {/* Header */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
              TCL Gallery
            </p>

            <h1 className="font-serif text-4xl leading-tight text-gray-900 md:text-6xl">
      Maison De Meraki
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Teacher Onboarding Form
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              We would love to learn more about your artistic practice,
              teaching experience and the courses you would like to offer at
              TCL Gallery.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12"
      >
        {/* Personal Details */}
        <Section
          number="01"
          title="Personal Details"
          description="Basic information to help us get to know you."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input
              label="Preferred Name"
              name="preferredName"
              value={formData.preferredName}
              onChange={handleChange}
            />

            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                "Prefer not to say",
                "Female",
                "Male",
                "Other",
              ]}
            />

            <Input
              label="Mobile Number"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

            <Input
              label="WhatsApp Number"
              name="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Current City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <div className="md:col-span-2">
              <Textarea
                label="Residential Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </Section>

        {/* Professional Profile */}
        <Section
          number="02"
          title="Artist & Professional Profile"
          description="Tell us about your artistic practice and professional background."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Professional Title"
              placeholder="Artist / Art Educator / Illustrator"
              name="professionalTitle"
              value={formData.professionalTitle}
              onChange={handleChange}
              required
            />

            <Input
              label="Years of Professional Experience"
              name="yearsExperience"
              type="number"
              value={formData.yearsExperience}
              onChange={handleChange}
              min="0"
            />

            <Input
              label="Current Organisation / Studio"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
            />

            <Input
              label="Website / Portfolio Link"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
            />

            <Input
              label="Instagram / Social Media"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Short Bio / About Yourself"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us briefly about yourself, your artistic journey and your work."
                required
              />
            </div>
          </div>
        </Section>

        {/* Art Specialisation */}
        <Section
          number="03"
          title="Art & Teaching Specialisation"
          description="Help us understand what you would like to teach."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Primary Art Form"
              name="primaryArtForm"
              value={formData.primaryArtForm}
              onChange={handleChange}
              required
              options={[
                "Drawing",
                "Sketching",
                "Painting",
                "Watercolour",
                "Acrylic",
                "Oil Painting",
                "Charcoal",
                "Digital Art",
                "Photography",
                "Sculpture",
                "Mixed Media",
                "Craft",
                "Other",
              ]}
            />

            <Select
              label="Preferred Teaching Level"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              options={[
                "Beginner",
                "Intermediate",
                "Advanced",
                "Beginner to Advanced",
              ]}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Specialisation / Techniques"
                name="specialisation"
                value={formData.specialisation}
                onChange={handleChange}
                rows={4}
                placeholder="Mention your specific techniques, mediums and areas of expertise."
              />
            </div>

            <div>
              <Label>Age Groups You Can Teach</Label>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  "4–6 years",
                  "7–10 years",
                  "11–14 years",
                  "15–18 years",
                  "Adults",
                  "All Age Groups",
                ].map((item) => (
                  <CheckBox
                    key={item}
                    label={item}
                    checked={formData.ageGroups.includes(item)}
                    onChange={() =>
                      handleCheckboxGroup("ageGroups", item)
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Teaching Mode</Label>

              <div className="mt-3 space-y-3">
                {["Offline", "Online", "Both"].map((item) => (
                  <Radio
                    key={item}
                    label={item}
                    name="teachingMode"
                    value={item}
                    checked={formData.teachingMode === item}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Education */}
        <Section
          number="04"
          title="Education & Certifications"
          description="Academic and professional qualifications related to your work."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Highest Educational Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
            />

            <Input
              label="Art / Fine Arts Qualification"
              name="artQualification"
              value={formData.artQualification}
              onChange={handleChange}
            />

            <Input
              label="Institution / University"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
            />

            <Input
              label="Year of Completion"
              name="qualificationYear"
              type="number"
              value={formData.qualificationYear}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Relevant Certifications / Awards / Recognitions"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
        </Section>

        {/* Teaching Experience */}
        <Section
          number="05"
          title="Teaching Experience"
          description="Tell us about your experience as an educator."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Total Teaching Experience"
              name="teachingExperience"
              placeholder="e.g. 5 years"
              value={formData.teachingExperience}
              onChange={handleChange}
            />

            <Input
              label="Previous Art Schools / Institutions"
              name="previousInstitutions"
              value={formData.previousInstitutions}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Subjects / Art Forms Taught"
                name="subjectsTaught"
                value={formData.subjectsTaught}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <Textarea
              label="Online Teaching Experience"
              name="onlineExperience"
              value={formData.onlineExperience}
              onChange={handleChange}
              rows={3}
            />

            <Textarea
              label="Offline Teaching Experience"
              name="offlineExperience"
              value={formData.offlineExperience}
              onChange={handleChange}
              rows={3}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Workshop / Masterclass Experience"
                name="workshopExperience"
                value={formData.workshopExperience}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </Section>

        {/* Portfolio */}
        <Section
          number="06"
          title="Portfolio"
          description="Share your artwork and previous work with us."
        >
          <div className="grid gap-5">
            <Input
              label="Portfolio Website"
              name="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://"
            />

            <Input
              label="Google Drive / PDF / Artwork Link"
              name="sampleWork"
              type="url"
              value={formData.sampleWork}
              onChange={handleChange}
              placeholder="https://"
            />

            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-800">
                Portfolio Requirement
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Please share 5–10 representative artwork samples through a
                portfolio link, website or PDF.
              </p>
            </div>
          </div>
        </Section>

        {/* Availability */}
        <Section
          number="07"
          title="Availability"
          description="Tell us when you are available to teach."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>Preferred Teaching Days</Label>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <CheckBox
                    key={day}
                    label={day}
                    checked={formData.teachingDays.includes(day)}
                    onChange={() =>
                      handleCheckboxGroup("teachingDays", day)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <Input
                label="Preferred Teaching Time"
                name="teachingTime"
                placeholder="e.g. 4 PM – 7 PM"
                value={formData.teachingTime}
                onChange={handleChange}
              />

              <Input
                label="Hours Available Per Week"
                name="hoursPerWeek"
                type="number"
                value={formData.hoursPerWeek}
                onChange={handleChange}
              />

              <Select
                label="Availability Type"
                name="availabilityType"
                value={formData.availabilityType}
                onChange={handleChange}
                options={[
                  "Weekdays",
                  "Weekends",
                  "Weekdays & Weekends",
                  "Flexible",
                ]}
              />

              <Input
                label="Preferred Teaching Location"
                name="preferredLocation"
                placeholder="e.g. TCL Gallery / Bengaluru"
                value={formData.preferredLocation}
                onChange={handleChange}
              />
            </div>
          </div>
        </Section>

        {/* Teaching Approach */}
        <Section
          number="08"
          title="Teaching Approach"
          description="We want to understand your approach to teaching and students."
        >
          <div className="grid gap-5">
            <Textarea
              label="What is your teaching philosophy?"
              name="teachingPhilosophy"
              value={formData.teachingPhilosophy}
              onChange={handleChange}
              rows={4}
            />

            <Textarea
              label="How do you approach beginners?"
              name="beginnerApproach"
              value={formData.beginnerApproach}
              onChange={handleChange}
              rows={4}
            />

            <Textarea
              label="What makes your teaching style different?"
              name="teachingStyle"
              value={formData.teachingStyle}
              onChange={handleChange}
              rows={4}
            />

            <Textarea
              label="What should students be able to learn / achieve?"
              name="studentLearning"
              value={formData.studentLearning}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </Section>

        {/* Course Proposal */}
        <Section
          number="09"
          title="Course Proposal"
          description="If you have a course idea, please share the details below."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Proposed Course Name"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
            />

            <Select
              label="Course Art Form"
              name="courseArtForm"
              value={formData.courseArtForm}
              onChange={handleChange}
              options={[
                "Drawing",
                "Painting",
                "Sketching",
                "Photography",
                "Sculpture",
                "Mixed Media",
                "Craft",
                "Other",
              ]}
            />

            <Select
              label="Target Age Group"
              name="courseAgeGroup"
              value={formData.courseAgeGroup}
              onChange={handleChange}
              options={[
                "Children",
                "Teens",
                "Adults",
                "Children & Teens",
                "All Age Groups",
              ]}
            />

            <Select
              label="Course Level"
              name="courseLevel"
              value={formData.courseLevel}
              onChange={handleChange}
              options={[
                "Beginner",
                "Intermediate",
                "Advanced",
                "All Levels",
              ]}
            />

            <Input
              label="Course Duration"
              name="courseDuration"
              placeholder="e.g. 4 weeks"
              value={formData.courseDuration}
              onChange={handleChange}
            />

            <Input
              label="Number of Sessions"
              name="sessions"
              type="number"
              value={formData.sessions}
              onChange={handleChange}
            />

            <Input
              label="Duration of Each Session"
              name="sessionDuration"
              placeholder="e.g. 90 minutes"
              value={formData.sessionDuration}
              onChange={handleChange}
            />
          </div>

          {/* Class Size */}
          <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-8">
            <div className="mb-5">
              <h3 className="font-serif text-2xl text-gray-900">
                Preferred Class Size
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Help us understand the ideal number of students for your
                course.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Input
                label="Minimum Students"
                name="minStudents"
                type="number"
                value={formData.minStudents}
                onChange={handleChange}
                min="1"
              />

              <Input
                label="Ideal Students"
                name="idealStudents"
                type="number"
                value={formData.idealStudents}
                onChange={handleChange}
                min="1"
              />

              <Input
                label="Maximum Students"
                name="maxStudents"
                type="number"
                value={formData.maxStudents}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-5">
            <Textarea
              label="Learning Outcomes"
              name="learningOutcomes"
              value={formData.learningOutcomes}
              onChange={handleChange}
              rows={5}
              placeholder="What will students learn by the end of the course?"
            />

            <Textarea
              label="Materials Required"
              name="materialsRequired"
              value={formData.materialsRequired}
              onChange={handleChange}
              rows={4}
              placeholder="Mention art materials required for the course."
            />

            <Textarea
              label="Materials Provided by Centre / Student"
              name="materialsProvided"
              value={formData.materialsProvided}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </Section>

        {/* Commercial */}
        <Section
          number="10"
          title="Commercial Details"
          description="Basic information about your preferred engagement model."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Preferred Engagement Model"
              name="engagementModel"
              value={formData.engagementModel}
              onChange={handleChange}
              options={[
                "Per Session",
                "Per Course",
                "Revenue Share",
                "Open to Discussion",
              ]}
            />

            <Input
              label="Expected Teaching Fee / Session"
              name="teachingFee"
              type="number"
              placeholder="₹"
              value={formData.teachingFee}
              onChange={handleChange}
            />

            <Input
              label="Expected Workshop Fee"
              name="workshopFee"
              type="number"
              placeholder="₹"
              value={formData.workshopFee}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-sm leading-6 text-gray-500">
            Payment details, PAN, GST and other financial documentation can
            be collected separately after the teacher is selected.
          </div>
        </Section>

        {/* Emergency Contact */}
        <Section
          number="11"
          title="Emergency Contact"
          description="Please provide a contact person we can reach if required."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Input
              label="Contact Name"
              name="emergencyName"
              value={formData.emergencyName}
              onChange={handleChange}
            />

            <Input
              label="Relationship"
              name="emergencyRelation"
              value={formData.emergencyRelation}
              onChange={handleChange}
            />

            <Input
              label="Contact Number"
              name="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={handleChange}
            />
          </div>
        </Section>

        {/* Declaration */}
        <section className="mt-8 rounded-3xl bg-black p-7 text-white md:p-10">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">
            Final Declaration
          </p>

          <h2 className="mt-3 font-serif text-3xl">
            Confirmation
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            I confirm that the information provided in this form is accurate
            and complete. I agree to follow the professional standards,
            policies, student safety guidelines and terms of engagement of TCL
            Gallery and its Art Learning Centre.
          </p>

          <label className="mt-7 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-white/30"
              required
            />

            <span className="text-sm leading-6 text-white/80">
              I agree to the above declaration and confirm that the information
              submitted by me is correct.
            </span>
          </label>
        </section>

        {/* Submit */}
        <div className="flex flex-col items-center justify-between gap-5 py-10 sm:flex-row">
          <p className="text-xs leading-5 text-gray-500">
            Your information will be used for teacher onboarding and
            programme planning.
          </p>

          <button
            type="submit"
            className="w-full rounded-full bg-black px-10 py-4 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
          >
            Submit Application
          </button>
        </div>
      </form>
    </main>
  );
}

/* -------------------------------------------------
   Reusable Components
------------------------------------------------- */

function Section({
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
    <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm md:p-9">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-start gap-4">
          <span className="mt-1 text-xs font-medium tracking-[0.2em] text-gray-400">
            {number}
          </span>

          <div>
            <h2 className="font-serif text-3xl text-gray-900 md:text-4xl">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-800">
      {children}
    </label>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      >
        <option value="">Select an option</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckBox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:border-gray-400">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300"
      />

      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function Radio({
  label,
  name,
  value,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4"
      />

      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}