"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "Bespoke Framing & Archival Protection",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send your enquiry."
        );
      }

      setSuccessMessage(
        "Thank you for contacting TCL Gallery. We have received your enquiry and our team will get back to you shortly."
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        inquiryType: "Bespoke Framing & Archival Protection",
        message: "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* FIRST + LAST NAME */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-600">
            First Name *
          </label>

          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Jane"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-amber-700"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-600">
            Last Name *
          </label>

          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-amber-700"
          />
        </div>
      </div>

      {/* EMAIL + PHONE */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-600">
            Email Address *
          </label>

          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-amber-700"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-600">
            Phone Number
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-amber-700"
          />
        </div>
      </div>

      {/* INQUIRY TYPE */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-600">
          Inquiry Type
        </label>

        <select
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleChange}
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition-colors focus:border-amber-700"
        >
          <option value="Bespoke Framing & Archival Protection">
            Bespoke Framing & Archival Protection
          </option>

          <option value="Art Advisory & Acquisition">
            Art Advisory & Acquisition
          </option>

          <option value="Fine Art Purchase">
            Fine Art Purchase
          </option>

          <option value="Photography Purchase">
            Photography Purchase
          </option>

          <option value="Private Viewing Appointment">
            Private Viewing Appointment
          </option>

          <option value="General Gallery Inquiry">
            General Gallery Inquiry
          </option>
        </select>
      </div>

      {/* MESSAGE */}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-stone-600">
          Message *
        </label>

        <textarea
          rows={5}
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your artwork, framing requirements, or space..."
          className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-amber-700"
        />
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-amber-700 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending Inquiry..." : "Submit Inquiry"}
      </button>
    </form>
  );
}