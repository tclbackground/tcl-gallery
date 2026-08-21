import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/my-account/orders");
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

  return (
    <main className="min-h-screen bg-[#f7f6f3] px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/my-account"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to My Account
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            TCL Gallery
          </p>

          <h1 className="mt-3 text-5xl font-semibold text-[#2d2d2b]">
            My Orders
          </h1>

          <p className="mt-4 text-gray-600">
            View and manage all your artwork orders.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-3xl font-semibold">
              No orders found
            </h2>

            <p className="mt-3 text-gray-600">
              You have not placed any orders yet.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-lg bg-[#2d2d2b] px-6 py-3 font-semibold text-white"
            >
              Explore Artwork
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      ORDER NUMBER
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold">
                      #{order.orderNumber}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Placed on{" "}
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

                  <div>
                    <p className="text-sm text-gray-500">
                      TOTAL AMOUNT
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      ORDER STATUS
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-[#efeee9] px-4 py-2 text-sm font-semibold">
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/my-account/orders/${order.id}`}
                      className="rounded-lg border border-[#2d2d2b] px-5 py-3 text-sm font-semibold"
                    >
                      View Details
                    </Link>

                    <Link
                      href={`/my-account/tracking?order=${order.id}`}
                      className="rounded-lg bg-[#2d2d2b] px-5 py-3 text-sm font-semibold text-white"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}