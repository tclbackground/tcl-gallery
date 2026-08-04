import Image from "next/image";
import Link from "next/link";
import { FiFilter, FiHeart, FiShoppingCart } from "react-icons/fi";

const products = [
  {
    id: 1,
    title: "Golden Horizon",
    artist: "Joan Karle",
    price: "₹18,500",
    image: "/images/shop/product1.jpg",
  },
  {
    id: 2,
    title: "Autumn Reflection",
    artist: "Joan Karle",
    price: "₹22,000",
    image: "/images/shop/product2.jpg",
  },
  {
    id: 3,
    title: "Morning Mist",
    artist: "Joan Karle",
    price: "₹15,900",
    image: "/images/shop/product3.jpg",
  },
  {
    id: 4,
    title: "Blue Serenity",
    artist: "Joan Karle",
    price: "₹28,000",
    image: "/images/shop/product4.jpg",
  },
  {
    id: 5,
    title: "Nature's Whisper",
    artist: "Joan Karle",
    price: "₹19,500",
    image: "/images/shop/product5.jpg",
  },
  {
    id: 6,
    title: "Mountain Escape",
    artist: "Joan Karle",
    price: "₹24,000",
    image: "/images/shop/product6.jpg",
  },
];

export default function ShopPage() {
  return (
    <main className="bg-[#faf9f6]">

      {/* Hero */}
      <section className="relative h-[350px] md:h-[450px] overflow-hidden">

        <Image
          src="/images/shop/shop-banner.jpg"
          alt="Shop Banner"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">

          <p className="uppercase tracking-[5px] text-sm">
            Fine Art Collection
          </p>

          <h1 className="mt-4 text-5xl font-serif">
            Shop Artworks
          </h1>

          <p className="mt-6 max-w-xl text-center text-lg opacity-90">
            Discover museum quality fine art photography and paintings,
            carefully curated to elevate every living space.
          </p>
        </div>
      </section>

      {/* Top Filter */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>
            <h2 className="text-3xl font-serif">
              Featured Collection
            </h2>

            <p className="mt-2 text-gray-500">
              Showing {products.length} artworks
            </p>
          </div>

          <div className="flex gap-4">

            <button className="flex items-center gap-2 rounded-full border px-6 py-3 hover:bg-black hover:text-white transition">
              <FiFilter />
              Filters
            </button>

            <select className="rounded-full border px-6 py-3 outline-none">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Popular</option>
            </select>

          </div>

        </div>

      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {products.map((item) => (

            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition"
            >

              <div className="relative h-[420px] overflow-hidden">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover duration-700 group-hover:scale-110"
                />

                <button className="absolute right-5 top-5 rounded-full bg-white p-3 shadow-lg">
                  <FiHeart />
                </button>

                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3 opacity-0 duration-300 group-hover:opacity-100">

                  <button className="rounded-full bg-white px-6 py-3 shadow-lg hover:bg-black hover:text-white transition">
                    View
                  </button>

                  <button className="rounded-full bg-[#7B8F50] p-4 text-white">
                    <FiShoppingCart />
                  </button>

                </div>

              </div>

              <div className="p-6">

                <p className="text-sm uppercase tracking-widest text-gray-400">
                  {item.artist}
                </p>

                <h3 className="mt-2 text-2xl font-serif">
                  {item.title}
                </h3>

                <div className="mt-6 flex items-center justify-between">

                  <span className="text-xl font-semibold">
                    {item.price}
                  </span>

                  <Link
                    href={`/shop/${item.id}`}
                    className="font-medium text-[#7B8F50]"
                  >
                    Details →
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}