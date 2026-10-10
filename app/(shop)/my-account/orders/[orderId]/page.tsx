
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ObjectId, type Document } from "mongodb";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type OrderDocument = Document & {
  _id: ObjectId;
  userId?: string | ObjectId;
  orderNumber?: string | number;
  createdAt?: Date | string;
  totalAmount?: number | string;
  status?: string;
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/my-account/orders");
  }

  const userId = (session.user as { id?: string }).id;

  if (!userId) {
    redirect("/login?callbackUrl=/my-account/orders");
  }

  const { orderId } = await params;

  if (!ObjectId.isValid(orderId)) {
    notFound();
  }

  const db = await getDb();

  const userIdCandidates: (string | ObjectId)[] = [userId];

  if (ObjectId.isValid(userId)) {
    userIdCandidates.push(new ObjectId(userId));
  }

  const order = await db.collection<OrderDocument>("Order").findOne({
    _id: new ObjectId(orderId),
    userId: { $in: userIdCandidates },
  });

  if (!order) {
    notFound();
  }

  const orderNumber = order.orderNumber ?? order._id.toString();
  const status = String(order.status ?? "PENDING").replaceAll("_", " ");
  const totalAmount = Number(order.totalAmount ?? 0);

  const createdAt = order.createdAt
    ? new Date(order.createdAt)
    : null;

  const formattedDate =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Date unavailable";

  return (
    <main className="min-h-screen bg-[#f7f6f3] px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/my-account/orders"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to My Orders
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            TCL Gallery
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-[#2d2d2b] md:text-5xl">
            Order Details
          </h1>

          <p className="mt-4 text-gray-600">
            Review the details of your artwork order.
          </p>
        </div>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">ORDER NUMBER</p>
              <h2 className="mt-1 text-2xl font-semibold">
                #{orderNumber}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Placed on {formattedDate}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">ORDER STATUS</p>
              <span className="mt-2 inline-block rounded-full bg-[#efeee9] px-4 py-2 text-sm font-semibold">
                {status}
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">TOTAL AMOUNT</p>
            <p className="mt-1 text-3xl font-semibold text-[#2d2d2b]">
              ₹
              {Number.isFinite(totalAmount)
                ? totalAmount.toLocaleString("en-IN")
                : "0"}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/my-account/tracking?order=${order._id.toString()}`}
              className="rounded-lg bg-[#2d2d2b] px-5 py-3 text-sm font-semibold text-white"
            >
              Track Order
            </Link>

            <Link
              href="/my-account/orders"
              className="rounded-lg border border-[#2d2d2b] px-5 py-3 text-sm font-semibold"
            >
              All Orders
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
