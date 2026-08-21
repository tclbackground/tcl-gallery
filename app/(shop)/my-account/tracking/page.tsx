import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const steps = [
  "ORDER_PLACED",
  "PAYMENT_CONFIRMED",
  "ARTWORK_PREPARATION",
  "FRAMING",
  "QUALITY_CHECK",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const labels: Record<string, string> = {
  ORDER_PLACED: "Order Confirmed",
  PAYMENT_CONFIRMED: "Payment Received",
  ARTWORK_PREPARATION: "Artwork Preparation",
  FRAMING: "Framing",
  QUALITY_CHECK: "Quality Check",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/my-account/tracking");
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

  const selectedOrder = orderId
    ? orders.find((order: any) => order.id === orderId)
    : orders[0];

  return (
    <main className="min-h-screen bg-[#f7f6f3] px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/my-account"
          className="text-sm font-medium text-gray-600"
        >
          ← Back to My Account
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            TCL Gallery
          </p>

          <h1 className="mt-3 text-5xl font-semibold">
            Track Your Order
          </h1>

          <p className="mt-4 text-gray-600">
            Follow your artwork from confirmation to delivery.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-2xl font-semibold">
              No orders available
            </h2>

            <p className="mt-3 text-gray-600">
              Your artwork tracking information will appear here once you place an order.
            </p>
          </div>
        ) : (
          <>
            {/* ORDER SELECTOR */}

            <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-semibold">
                Select Order
              </h2>

              <div className="mt-5 flex flex-wrap gap-3">
                {orders.map((order: any) => (
                  <Link
                    key={order.id}
                    href={`/my-account/tracking?order=${order.id}`}
                    className={`rounded-lg border px-5 py-3 text-sm font-semibold ${
                      selectedOrder?.id === order.id
                        ? "border-[#2d2d2b] bg-[#2d2d2b] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    #{order.orderNumber}
                  </Link>
                ))}
              </div>
            </div>

            {selectedOrder && (
              <>
                {/* CURRENT STATUS */}

                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        ORDER #{selectedOrder.orderNumber}
                      </p>

                      <h2 className="mt-2 text-3xl font-semibold">
                        {labels[selectedOrder.status]}
                      </h2>
                    </div>

                    <span className="rounded-full bg-[#efeee9] px-5 py-3 text-sm font-semibold">
                      {selectedOrder.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>

                {/* TIMELINE */}

                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
                  <h2 className="text-2xl font-semibold">
                    Production & Delivery Timeline
                  </h2>

                  <div className="mt-8 space-y-6">
                    {steps.map((step, index) => {
                      const currentIndex = steps.indexOf(
                        selectedOrder.status
                      );

                      const completed = index <= currentIndex;

                      return (
                        <div
                          key={step}
                          className="flex items-center gap-5"
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                              completed
                                ? "bg-[#2d2d2b] text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {completed ? "✓" : index + 1}
                          </div>

                          <div>
                            <p className="font-semibold">
                              {labels[step]}
                            </p>

                            {step === selectedOrder.status && (
                              <p className="mt-1 text-sm text-gray-500">
                                Current status of your order.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SHIPPING */}

                {selectedOrder.trackingNumber && (
                  <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
                    <h2 className="text-2xl font-semibold">
                      Shipment Information
                    </h2>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">
                          Courier Partner
                        </p>

                        <p className="mt-2 text-lg font-semibold">
                          {selectedOrder.courier || "Not assigned"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Tracking Number
                        </p>

                        <p className="mt-2 text-lg font-semibold">
                          {selectedOrder.trackingNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}