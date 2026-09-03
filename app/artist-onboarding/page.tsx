"use client";

import { useState } from "react";

type Artwork = {
  title: string;
  category: string;
  medium: string;
  year: string;
  width: string;
  height: string;
  depth: string;
  framing: string;
  frameType: string;
  artworkType: string;
  editionNumber: string;
  quantity: string;
  artistPrice: string;
  retailPrice: string;
  description: string;
};

const emptyArtwork: Artwork = {
  title: "",
  category: "",
  medium: "",
  year: "",
  width: "",
  height: "",
  depth: "",
  framing: "",
  frameType: "",
  artworkType: "",
  editionNumber: "",
  quantity: "",
  artistPrice: "",
  retailPrice: "",
  description: "",
};

export default function ArtistCollaborationPage() {
  const [submitted, setSubmitted] = useState(false);

  const [artworks, setArtworks] = useState<Artwork[]>([
    { ...emptyArtwork },
  ]);

  const [formData, setFormData] = useState({
    // Artist Details
    fullName: "",
    artistName: "",
    mobile: "",
    whatsapp: "",
    email: "",
    city: "",
    address: "",
    instagram: "",
    website: "",

    // Artist Profile
    artistCategory: "",
    primaryMedium: "",
    yearsOfPractice: "",
    artistBio: "",
    artisticStyle: "",

    // Gallery Collaboration
    numberOfArtworks: "",
    collaborationModel: "",
    exclusivity: "",
    artistShare: "",
    minimumSellingPrice: "",
    consignmentPeriod: "",

    // Logistics
    artworkLocation: "",
    deliveryResponsibility: "",
    packagingAvailable: "",
    pickupRequired: "",
    specialHandling: "",
    returnRequirement: "",

    // Rights
    authenticityConfirmed: false,
    displayPermission: false,
    salePermission: false,
    photographyPermission: false,
    marketingPermission: false,
    socialMediaPermission: false,
    websitePermission: false,

    // Declaration
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

  const updateArtwork = (
    index: number,
    field: keyof Artwork,
    value: string
  ) => {
    setArtworks((prev) =>
      prev.map((artwork, i) =>
        i === index
          ? {
              ...artwork,
              [field]: value,
            }
          : artwork
      )
    );
  };

  const addArtwork = () => {
    setArtworks((prev) => [
      ...prev,
      { ...emptyArtwork },
    ]);
  };

  const removeArtwork = (index: number) => {
    if (artworks.length === 1) return;

    setArtworks((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.authenticityConfirmed) {
      alert(
        "Please confirm that the artworks are authentic and that you have the right to offer them for sale."
      );
      return;
    }

    if (!formData.declaration) {
      alert("Please accept the final declaration.");
      return;
    }

    const finalData = {
      ...formData,
      artworks,
    };

    console.log(
      "TCL Gallery Artist Application:",
      finalData
    );

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
          <div className="rounded-[32px] bg-white p-10 text-center shadow-sm md:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">
              ✓
            </div>

            <p className="mt-7 text-xs uppercase tracking-[0.3em] text-gray-400">
              TCL Gallery
            </p>

            <h1 className="mt-3 font-serif text-4xl text-gray-900 md:text-5xl">
              Thank You
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-600">
              Your artwork submission has been received
              successfully. Our team will review your artist
              profile and submitted artworks and contact you
              regarding the next steps.
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-8 rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Submit Another Application
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
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-gray-400">
              TCL Gallery
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight text-gray-900 md:text-6xl">
              Artist Collaboration
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Submit your artworks for collaboration with
              TCL Gallery.
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              We work with artists to showcase and sell
              selected artworks through TCL Gallery. Please
              share your artist profile and artwork details
              below.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12"
      >
        {/* =====================================================
            01 ARTIST DETAILS
        ===================================================== */}

        <Section
          number="01"
          title="Artist Details"
          description="Tell us a little about yourself."
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
              label="Artist / Professional Name"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
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
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <div className="md:col-span-2">
              <Textarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <Input
              label="Instagram / Social Media"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@username"
            />

            <Input
              label="Website / Portfolio"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://"
            />
          </div>
        </Section>

        {/* =====================================================
            02 ARTIST PROFILE
        ===================================================== */}

        <Section
          number="02"
          title="Artist Profile"
          description="Help us understand your artistic practice."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Artist Category"
              name="artistCategory"
              value={formData.artistCategory}
              onChange={handleChange}
              required
              options={[
                "Painter",
                "Photographer",
                "Sculptor",
                "Illustrator",
                "Mixed Media Artist",
                "Digital Artist",
                "Printmaker",
                "Ceramic Artist",
                "Textile Artist",
                "Other",
              ]}
            />

            <Input
              label="Primary Medium"
              name="primaryMedium"
              value={formData.primaryMedium}
              onChange={handleChange}
              placeholder="e.g. Acrylic, Oil, Photography"
              required
            />

            <Input
              label="Years of Artistic Practice"
              name="yearsOfPractice"
              type="number"
              min="0"
              value={formData.yearsOfPractice}
              onChange={handleChange}
            />

            <Input
              label="Artistic Style / Specialisation"
              name="artisticStyle"
              value={formData.artisticStyle}
              onChange={handleChange}
              placeholder="e.g. Abstract, Botanical, Landscape"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Short Artist Bio"
                name="artistBio"
                value={formData.artistBio}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us briefly about your artistic journey and practice."
                required
              />
            </div>
          </div>
        </Section>

        {/* =====================================================
            03 ARTWORK SUBMISSION
        ===================================================== */}

        <Section
          number="03"
          title="Artwork Submission"
          description="Please provide details of the artworks you would like TCL Gallery to consider."
        >
          <div className="mb-7">
            <Input
              label="Number of Artworks Being Submitted"
              name="numberOfArtworks"
              type="number"
              min="1"
              value={formData.numberOfArtworks}
              onChange={handleChange}
              placeholder="e.g. 10"
              required
            />
          </div>

          <div className="space-y-7">
            {artworks.map((artwork, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-gray-200 bg-[#fafafa] p-5 md:p-8"
              >
                {/* Artwork Header */}
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Artwork{" "}
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-1 font-serif text-2xl text-gray-900">
                      Artwork Details
                    </h3>
                  </div>

                  {artworks.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeArtwork(index)
                      }
                      className="rounded-full border border-gray-200 px-4 py-2 text-xs text-gray-500 transition hover:border-red-300 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <ArtworkInput
                    label="Artwork Title"
                    value={artwork.title}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "title",
                        value
                      )
                    }
                    required
                  />

                  <ArtworkInput
                    label="Artwork Category"
                    value={artwork.category}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "category",
                        value
                      )
                    }
                    placeholder="e.g. Landscape, Abstract"
                  />

                  <ArtworkInput
                    label="Medium"
                    value={artwork.medium}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "medium",
                        value
                      )
                    }
                    placeholder="e.g. Acrylic on Canvas"
                    required
                  />

                  <ArtworkInput
                    label="Year Created"
                    value={artwork.year}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "year",
                        value
                      )
                    }
                  />

                  {/* SIZE */}
                  <div className="md:col-span-2">
                    <Label>Artwork Dimensions</Label>

                    <div className="mt-2 grid gap-3 sm:grid-cols-3">
                      <DimensionInput
                        label="Width"
                        value={artwork.width}
                        onChange={(value) =>
                          updateArtwork(
                            index,
                            "width",
                            value
                          )
                        }
                        placeholder="Width"
                      />

                      <DimensionInput
                        label="Height"
                        value={artwork.height}
                        onChange={(value) =>
                          updateArtwork(
                            index,
                            "height",
                            value
                          )
                        }
                        placeholder="Height"
                      />

                      <DimensionInput
                        label="Depth"
                        value={artwork.depth}
                        onChange={(value) =>
                          updateArtwork(
                            index,
                            "depth",
                            value
                          )
                        }
                        placeholder="Depth"
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Please mention dimensions in inches or
                      centimetres.
                    </p>
                  </div>

                  <ArtworkSelect
                    label="Framing"
                    value={artwork.framing}
                    options={[
                      "Framed",
                      "Unframed",
                      "Both Available",
                    ]}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "framing",
                        value
                      )
                    }
                  />

                  <ArtworkInput
                    label="Frame Type"
                    value={artwork.frameType}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "frameType",
                        value
                      )
                    }
                    placeholder="e.g. Wooden, Metal, Float"
                  />

                  <ArtworkSelect
                    label="Artwork Type"
                    value={artwork.artworkType}
                    options={[
                      "Original",
                      "Limited Edition",
                      "Open Edition",
                      "Print",
                      "Other",
                    ]}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "artworkType",
                        value
                      )
                    }
                  />

                  <ArtworkInput
                    label="Edition Number"
                    value={artwork.editionNumber}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "editionNumber",
                        value
                      )
                    }
                    placeholder="e.g. 3 / 25"
                  />

                  <ArtworkInput
                    label="Available Quantity"
                    value={artwork.quantity}
                    onChange={(value) =>
                      updateArtwork(
                        index,
                        "quantity",
                        value
                      )
                    }
                    placeholder="e.g. 1"
                  />

                  {/* PRICING */}
                  <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gray-400">
                      Pricing
                    </p>

                    <div className="grid gap-5 md:grid-cols-2">
                      <ArtworkInput
                        label="Artist Price / Expected Payout"
                        value={artwork.artistPrice}
                        onChange={(value) =>
                          updateArtwork(
                            index,
                            "artistPrice",
                            value
                          )
                        }
                        placeholder="₹"
                      />

                      <ArtworkInput
                        label="Suggested Retail Price"
                        value={artwork.retailPrice}
                        onChange={(value) =>
                          updateArtwork(
                            index,
                            "retailPrice",
                            value
                          )
                        }
                        placeholder="₹"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <ArtworkTextarea
                      label="Artwork Description"
                      value={artwork.description}
                      onChange={(value) =>
                        updateArtwork(
                          index,
                          "description",
                          value
                        )
                      }
                      placeholder="Briefly describe the artwork, concept or story behind it."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADD ARTWORK */}
          <button
            type="button"
            onClick={addArtwork}
            className="mt-7 w-full rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-5 text-sm font-medium text-gray-700 transition hover:border-gray-500 hover:bg-gray-50"
          >
            + Add Another Artwork
          </button>
        </Section>

        {/* =====================================================
            04 GALLERY COLLABORATION
        ===================================================== */}

        <Section
          number="04"
          title="Gallery Collaboration"
          description="Tell us about your preferred commercial arrangement with TCL Gallery."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <ChoiceCard
              title="Preferred Collaboration Model"
              name="collaborationModel"
              value={formData.collaborationModel}
              options={[
                "Commission / Revenue Share",
                "Consignment",
                "Open to Discussion",
              ]}
              onChange={handleChange}
            />

            <ChoiceCard
              title="Exclusivity"
              name="exclusivity"
              value={formData.exclusivity}
              options={[
                "Exclusive to TCL Gallery",
                "Non-Exclusive",
                "Open to Discussion",
              ]}
              onChange={handleChange}
            />

            <Input
              label="Expected Artist Share"
              name="artistShare"
              value={formData.artistShare}
              onChange={handleChange}
              placeholder="e.g. 60%"
            />

            <Input
              label="Minimum Selling Price"
              name="minimumSellingPrice"
              value={formData.minimumSellingPrice}
              onChange={handleChange}
              placeholder="₹"
            />

            <Input
              label="Preferred Consignment Period"
              name="consignmentPeriod"
              value={formData.consignmentPeriod}
              onChange={handleChange}
              placeholder="e.g. 6 months"
            />

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-medium text-gray-800">
                Commercial Terms
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Final selling price, commission percentage,
                artist payout, consignment period and other
                commercial terms will be mutually agreed
                before the artwork is accepted.
              </p>
            </div>
          </div>
        </Section>

        {/* =====================================================
            05 LOGISTICS
        ===================================================== */}

        <Section
          number="05"
          title="Artwork Logistics"
          description="Information required to receive and safely handle your artworks."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Current Artwork Location"
              name="artworkLocation"
              value={formData.artworkLocation}
              onChange={handleChange}
              placeholder="City / Location"
              required
            />

            <ChoiceCard
              title="Who will arrange delivery to TCL Gallery?"
              name="deliveryResponsibility"
              value={formData.deliveryResponsibility}
              options={[
                "Artist",
                "TCL Gallery",
                "Courier / Transporter",
                "To Be Discussed",
              ]}
              onChange={handleChange}
            />

            <ChoiceCard
              title="Is suitable packaging available?"
              name="packagingAvailable"
              value={formData.packagingAvailable}
              options={[
                "Yes",
                "No",
                "Partially",
              ]}
              onChange={handleChange}
            />

            <ChoiceCard
              title="Is artwork pickup required?"
              name="pickupRequired"
              value={formData.pickupRequired}
              options={[
                "Yes",
                "No",
                "To Be Discussed",
              ]}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Special Handling Requirements"
                name="specialHandling"
                value={formData.specialHandling}
                onChange={handleChange}
                rows={4}
                placeholder="Mention if the artwork requires special handling, fragile packaging, temperature control, etc."
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Return Requirement for Unsold Artwork"
                name="returnRequirement"
                value={formData.returnRequirement}
                onChange={handleChange}
                rows={4}
                placeholder="Mention any specific requirements regarding return of unsold artwork."
              />
            </div>
          </div>
        </Section>

        {/* =====================================================
            06 RIGHTS & PERMISSIONS
        ===================================================== */}

        <Section
          number="06"
          title="Rights & Permissions"
          description="Please confirm the permissions required for TCL Gallery to display and promote your artworks."
        >
          {/* Authenticity */}
          <div className="mb-7 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="authenticityConfirmed"
                checked={
                  formData.authenticityConfirmed
                }
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm leading-6 text-gray-700">
                I confirm that the artworks submitted are
                authentic and that I am the original creator
                or authorised owner and have the right to
                offer these artworks for sale.
              </span>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Permission
              label="Display my artworks in the gallery"
              name="displayPermission"
              checked={formData.displayPermission}
              onChange={handleChange}
            />

            <Permission
              label="Offer my artworks for sale"
              name="salePermission"
              checked={formData.salePermission}
              onChange={handleChange}
            />

            <Permission
              label="Photograph my artworks"
              name="photographyPermission"
              checked={formData.photographyPermission}
              onChange={handleChange}
            />

            <Permission
              label="Use artwork images for marketing"
              name="marketingPermission"
              checked={formData.marketingPermission}
              onChange={handleChange}
            />

            <Permission
              label="Use artwork images on social media"
              name="socialMediaPermission"
              checked={formData.socialMediaPermission}
              onChange={handleChange}
            />

            <Permission
              label="Use artwork images on TCL Gallery website"
              name="websitePermission"
              checked={formData.websitePermission}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-800">
              Copyright
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Copyright ownership remains with the artist
              unless otherwise agreed in writing. Any
              reproduction, licensing or extended usage will
              be subject to mutually agreed terms.
            </p>
          </div>
        </Section>

        {/* =====================================================
            07 DECLARATION
        ===================================================== */}

        <section className="mt-8 rounded-[32px] bg-black p-7 text-white md:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Final Declaration
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Artist Confirmation
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/70">
            I confirm that the information and artwork
            details provided by me are accurate. I confirm
            that I have the necessary rights and authority to
            offer the submitted artworks for sale through TCL
            Gallery. I understand that final artwork
            acceptance, pricing, commission, payment,
            consignment period, logistics and other commercial
            terms will be mutually agreed upon before the
            artwork is accepted by TCL Gallery.
          </p>

          <label className="mt-7 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              required
              className="mt-1 h-4 w-4 rounded border-white/30"
            />

            <span className="text-sm leading-6 text-white/80">
              I agree to the above declaration and confirm
              that the information submitted by me is correct.
            </span>
          </label>
        </section>

        {/* =====================================================
            SUBMIT
        ===================================================== */}

        <div className="flex flex-col items-center justify-between gap-5 py-10 sm:flex-row">
          <div>
            <p className="text-xs leading-5 text-gray-500">
              Your information will be used for artist
              evaluation, artwork review and gallery
              collaboration.
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-400">
              PAN, GST and bank details will be collected
              separately after approval.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-black px-10 py-4 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
          >
            Submit Artwork
          </button>
        </div>
      </form>
    </main>
  );
}

/* =========================================================
   SECTION
========================================================= */

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
    <section className="mb-6 rounded-[30px] bg-white p-6 shadow-sm md:p-9">
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

/* =========================================================
   LABEL
========================================================= */

function Label({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-gray-800">
      {children}

      {required && (
        <span className="ml-1 text-red-500">*</span>
      )}
    </label>
  );
}

/* =========================================================
   INPUT
========================================================= */

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
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>

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

/* =========================================================
   TEXTAREA
========================================================= */

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

/* =========================================================
   SELECT
========================================================= */

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
      <Label required={required}>{label}</Label>

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

/* =========================================================
   CHOICE CARD
========================================================= */

function ChoiceCard({
  title,
  name,
  value,
  options,
  onChange,
}: {
  title: string;
  name: string;
  value: string;
  options: string[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div>
      <Label>{title}</Label>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition ${
              value === option
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              className="sr-only"
            />

            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   PERMISSION
========================================================= */

function Permission({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 transition hover:border-gray-400">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300"
      />

      <span className="text-sm text-gray-700">
        {label}
      </span>
    </label>
  );
}

/* =========================================================
   ARTWORK INPUT
========================================================= */

function ArtworkInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      />
    </div>
  );
}

/* =========================================================
   ARTWORK SELECT
========================================================= */

function ArtworkSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

/* =========================================================
   ARTWORK TEXTAREA
========================================================= */

function ArtworkTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      />
    </div>
  );
}

/* =========================================================
   DIMENSION INPUT
========================================================= */

function DimensionInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-gray-500">
        {label}
      </p>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
      />
    </div>
  );
}