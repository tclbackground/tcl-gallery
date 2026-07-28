"use client";

interface MegaMenuProps {
  menu: {
    title: string;
    children: string[];
  };
}

export default function MegaMenu({ menu }: MegaMenuProps) {
  return (
    <div className="absolute left-0 top-full w-full bg-white border-t shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-10 py-8">

        <h2 className="text-2xl font-semibold mb-6">
          {menu.title}
        </h2>

        <div className="grid grid-cols-4 gap-5">

          {menu.children.map((item) => (
            <button
              key={item}
              className="text-left py-2 hover:text-[#C4A892] transition-colors"
            >
              {item}
            </button>
          ))}

        </div>

      </div>
    </div>
  );
}