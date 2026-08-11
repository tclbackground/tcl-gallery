"use client";

import { useState } from "react";
import { uploadArtist } from "@/app/actions/admin";

export default function AddArtistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await uploadArtist(formData);

    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-3xl border border-[#C4A892]/30 shadow-sm mx-auto my-10 text-[#22211B]">
      <h1 className="font-serif text-3xl font-bold mb-6">Upload New Artist</h1>

      {message && (
        <div
          className={`p-4 mb-6 rounded-xl text-sm font-medium ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">Artist Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Min-jun Park"
            className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] p-3 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">Specialty *</label>
          <input
            type="text"
            name="specialty"
            required
            placeholder="e.g. Fine Art Photography / Korean Ceramic Art"
            className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] p-3 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">Biography</label>
          <textarea
            name="bio"
            rows={4}
            placeholder="Artist background details..."
            className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] p-3 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">Profile Image</label>
          <input type="file" name="image" accept="image/*" className="text-xs" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#4D3024] text-white font-semibold rounded-full hover:bg-[#22211B] transition shadow-md disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Artist"}
        </button>
      </form>
    </div>
  );
}