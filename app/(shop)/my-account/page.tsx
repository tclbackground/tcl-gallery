import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/my-account");
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalOrders = orders.length;

  const processingOrders = orders.filter((order: any) =>
    [
      "ORDER_PLACED",
      "PAYMENT_CONFIRMED",
      "ARTWORK_PREPARATION",
      "FRAMING",
      "QUALITY_CHECK",
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
    ].includes(order.status)
  ).length;

  const deliveredOrders = orders.filter(
    (order: any) => order.status === "DELIVERED"
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f6f3] px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            TCL Gallery
          </p>

          <h1 className="text-5xl font-semibold text-[#2d2d2b] md:text-6xl">
            My Account
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Welcome back, {session.user.name || "Collector"}.
          </p>
        </div>

        {/* ACCOUNT CARDS */}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              My Orders
            </p>

            <p className="mt-4 text-5xl font-semibold text-[#2d2d2b]">
              {totalOrders}
            </p>

            <Link
              href="/my-account/orders"
              className="mt-6 inline-block text-sm font-semibold text-[#2d2d2b] underline underline-offset-4"
            >
              View all orders
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Processing
            </p>

            <p className="mt-4 text-5xl font-semibold text-[#2d2d2b]">
              {processingOrders}
            </p>

            <Link
              href="/my-account/orders"
              className="mt-6 inline-block text-sm font-semibold text-[#2d2d2b] underline underline-offset-4"
            >
              View orders
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Delivered
            </p>

            <p className="mt-4 text-5xl font-semibold text-[#2d2d2b]">
              {deliveredOrders}
            </p>

            <Link
              href="/my-account/orders"
              className="mt-6 inline-block text-sm font-semibold text-[#2d2d2b] underline underline-offset-4"
            >
              View history
            </Link>
          </div>
        </div>

        {/* QUICK LINKS */}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Link
            href="/profile"
            className="rounded-2xl border border-gray-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-2xl font-semibold text-[#2d2d2b]">
              My Profile
            </h2>

            <p className="mt-3 text-gray-600">
              Manage your name, email address and personal details.
            </p>

            <span className="mt-6 inline-block font-semibold">
              Manage Profile →
            </span>
          </Link>

          <Link
            href="/my-account/orders"
            className="rounded-2xl border border-gray-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-2xl font-semibold text-[#2d2d2b]">
              My Orders
            </h2>

            <p className="mt-3 text-gray-600">
              View your artwork purchases and order history.
            </p>

            <span className="mt-6 inline-block font-semibold">
              View Orders →
            </span>
          </Link>

          <Link
            href="/my-account/tracking"
            className="rounded-2xl border border-gray-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-2xl font-semibold text-[#2d2d2b]">
              Track Order
            </h2>

            <p className="mt-3 text-gray-600">
              Follow artwork preparation, framing and delivery.
            </p>

            <span className="mt-6 inline-block font-semibold">
              Track Order →
            </span>
          </Link>
        </div>

        {/* RECENT ORDERS */}

        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-[#2d2d2b]">
              Recent Orders
            </h2>

            <Link
              href="/my-account/orders"
              className="text-sm font-semibold underline underline-offset-4"
            >
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <h3 className="text-2xl font-semibold">
                No orders yet
              </h3>

              <p className="mt-3 text-gray-600">
                Your purchased artworks will appear here.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-block rounded-lg bg-[#2d2d2b] px-6 py-3 font-semibold text-white"
              >
                Explore Artwork
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {orders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 border-b border-gray-100 p-6 last:border-0 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#2d2d2b]">
                      Order #{order.orderNumber}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
                      {order.status.replaceAll("_", " ")}
                    </span>

                    <Link
                      href={`/my-account/orders/${order.id}`}
                      className="rounded-lg border border-[#2d2d2b] px-4 py-2 text-sm font-semibold"
                    >
                      View Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}