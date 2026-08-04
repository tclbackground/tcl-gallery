const topCategories = [
  "Photography",
  "Paintings",
  "Fine Art Prints",
  "Sculptures",
  "Artists",
  "Coffee Table Books",
];

const collectors = [
  "Art Advisory",
  "Corporate Projects",
  "Custom Framing",
  "Museum Quality Prints",
  "Shipping Information",
  "Gift Cards",
];

const services = [
  "Interior Designers",
  "Hotels",
  "Hospitals",
  "Commercial Projects",
  "Office Décor",
  "Hospitality",
];

const company = [
  "About",
  "Journal",
  "Contact",
  "Careers",
  "Privacy Policy",
  "Terms & Conditions",
];

export default function FooterLinks() {
  return (
    <>
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap gap-8 justify-center">

          <h3 className="font-semibold">
            TOP CATEGORIES
          </h3>

          {topCategories.map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-[#C7A852] transition"
            >
              {item}
            </a>
          ))}

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-4 gap-12">

        <div />

        <div>
          <h3 className="font-semibold text-xl mb-6">
            For Collectors
          </h3>

          <ul className="space-y-4">
            {collectors.map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#C7A852]">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-xl mb-6">
            Services
          </h3>

          <ul className="space-y-4">
            {services.map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#C7A852]">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-xl mb-6">
            TCL Gallery
          </h3>

          <ul className="space-y-4">
            {company.map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#C7A852]">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  );
}