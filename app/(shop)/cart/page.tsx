import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import CartItems from "./CartItems";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  // NOT LOGGED IN
  if (!session?.user) {
    return (
      <main className="min-h-[70vh] bg-[#FBF9F0]">
        <section className="bg-[#22211B] px-6 py-10">
          <div className="mx-auto max-w-[1400px]">
            <h1 className="font-serif text-4xl text-white sm:text-5xl">
              Shopping Cart
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-[#C4A892]/30 bg-white px-6 text-center">
            <FiShoppingBag
              size={48}
              strokeWidth={1.2}
              className="mb-6 text-[#C4A892]"
            />

            <h2 className="font-serif text-3xl text-[#22211B] sm:text-4xl">
              Login to view your cart
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#22211B]/60">
              Please login to access your shopping cart
              and continue with your purchase.
            </p>

            <Link
              href="/account/login?callbackUrl=/cart"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4D3024] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#22211B]"
            >
              Login to Continue
              <FiArrowRight />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const userId = (session.user as any)?.id;

  // NO USER ID
  if (!userId) {
    return (
      <main className="min-h-[70vh] bg-[#FBF9F0] px-4 py-16">
        <div className="mx-auto max-w-[1400px] text-center">
          <h1 className="font-serif text-3xl text-[#22211B]">
            Unable to load cart
          </h1>

          <p className="mt-3 text-sm text-[#22211B]/60">
            Your session is missing the user ID.
            Please login again.
          </p>

          <Link
            href="/account/login?callbackUrl=/cart"
            className="mt-6 inline-block rounded-lg bg-[#4D3024] px-7 py-3 text-sm uppercase tracking-wider text-white"
          >
            Login Again
          </Link>
        </div>
      </main>
    );
  }

  // GET CART
  let cartItems: any[] = [];

  try {
    cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Cart database error:", error);
  }

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#FBF9F0]">
        <section className="bg-[#22211B] px-6 py-10">
          <div className="mx-auto max-w-[1400px]">
            <h1 className="font-serif text-4xl text-white sm:text-5xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-white/60">
              0 items
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-[#C4A892]/30 bg-white px-6 text-center">
            <FiShoppingBag
              size={50}
              strokeWidth={1.2}
              className="mb-6 text-[#C4A892]"
            />

            <h2 className="font-serif text-3xl text-[#22211B] sm:text-4xl">
              Your cart is empty
            </h2>

            <p className="mt-4 text-sm text-[#22211B]/60">
              Explore our collection and find an artwork
              you love.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4D3024] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#22211B]"
            >
              Explore Collection
              <FiArrowRight />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // PREPARE DATA FOR CLIENT COMPONENT
  const items = cartItems.map((item) => ({
    id: item.id,
    quantity: Number(item.quantity || 1),
    price: Number(item.price || 0),
    size: item.size || null,
    frame: item.frame || null,

    product: {
      id: item.product.id,
      title: item.product.title || null,
      location: item.product.location || null,
      imageUrl: item.product.imageUrl || null,
    },
  }));

  return (
    <main className="min-h-screen bg-[#FBF9F0]">
      <section className="bg-[#22211B] px-6 py-10">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="font-serif text-4xl text-white sm:text-5xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Review your selected artworks before checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <CartItems items={items} />
      </section>
    </main>
  );
}