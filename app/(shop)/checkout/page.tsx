// app/checkout/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  frame?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");

  const [cartItems] = useState<CartItem[]>([
    {
      id: "prod-1",
      title: "Silent Horizon",
      artist: "Aarav Sharma",
      price: 18500,
      quantity: 1,
      image: "/images/products/artwork-1.jpg",
      size: "24 x 36 in",
      frame: "Natural Teakwood",
    },
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 15000 ? 0 : 750;
  const tax = Math.round(subtotal * 0.12); // 12% GST
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customer: {
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        address: String(formData.get("address") || ""),
        city: String(formData.get("city") || ""),
        state: String(formData.get("state") || ""),
        postalCode: String(formData.get("postalCode") || ""),
      },
      items: cartItems,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
    };

    // 1. Cash on Delivery Handling
    if (paymentMethod === "cod") {
      try {
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: `COD_${Date.now()}`,
            razorpay_payment_id: "COD_PAYMENT",
            razorpay_signature: "COD_EXEMPT",
            orderDetails: orderData,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          router.push(`/checkout/success?orderId=${verifyData.orderNumber}`);
        } else {
          setErrorMessage(verifyData.message || "Failed to record COD order.");
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Razorpay Flow (Card / UPI)
    try {
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay checkout SDK is loading. Please try again in a moment.");
      }

      // Create Order on server
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount: total }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Could not initialize payment.");
      }

      // Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "TCL Gallery",
        description: "Archival Print Order",
        order_id: data.orderId,
        prefill: {
          name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
          email: orderData.customer.email,
          contact: orderData.customer.phone,
        },
        theme: { color: "#22211B" },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: orderData,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push(`/checkout/success?orderId=${verifyData.orderNumber}`);
            } else {
              setErrorMessage("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            setErrorMessage("Error recording order confirmation.");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      console.error("Checkout error:", error);
      setErrorMessage(error.message || "Payment initiation failed.");
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <main className="min-h-screen bg-[#FAF8F5] px-4 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {/* Header Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Link href="/cart" className="hover:text-[#4D3024]">
              Cart
            </Link>
            <span>/</span>
            <span className="text-[#22211B]">Checkout</span>
          </nav>

          <h1 className="font-serif text-3xl font-bold text-[#22211B] md:text-4xl">
            Complete Your Order
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Archival prints are custom produced and carefully packaged in museum-grade crates.
          </p>

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-12">
            {/* Left Column: Delivery & Payment Details */}
            <div className="space-y-8 lg:col-span-7">
              {/* Contact Details */}
              <section className="rounded-2xl border border-[#C4A892]/30 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-[#22211B]">
                  1. Contact Information
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase text-[#4D3024]">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="collector@example.com"
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase text-[#4D3024]">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="rounded-2xl border border-[#C4A892]/30 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-[#22211B]">
                  2. Shipping Address
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-[#4D3024]">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-[#4D3024]">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase text-[#4D3024]">
                      Street Address / Apartment
                    </label>
                    <input
                      name="address"
                      type="text"
                      required
                      placeholder="House No, Suite, Landmark"
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-[#4D3024]">
                      City
                    </label>
                    <input
                      name="city"
                      type="text"
                      required
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-[#4D3024]">
                      State
                    </label>
                    <input
                      name="state"
                      type="text"
                      required
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase text-[#4D3024]">
                      Postal / PIN Code
                    </label>
                    <input
                      name="postalCode"
                      type="text"
                      required
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="rounded-2xl border border-[#C4A892]/30 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-[#22211B]">
                  3. Payment Selection
                </h2>

                <div className="mt-4 space-y-3">
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      paymentMethod === "card"
                        ? "border-[#7B8F50] bg-[#FAF8F5]"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="accent-[#7B8F50]"
                      />
                      <span className="text-sm font-semibold text-[#22211B]">
                        Credit / Debit Card (Razorpay)
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      paymentMethod === "upi"
                        ? "border-[#7B8F50] bg-[#FAF8F5]"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="accent-[#7B8F50]"
                      />
                      <span className="text-sm font-semibold text-[#22211B]">
                        UPI (Google Pay / PhonePe / Paytm / QR)
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      paymentMethod === "cod"
                        ? "border-[#7B8F50] bg-[#FAF8F5]"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-[#7B8F50]"
                      />
                      <span className="text-sm font-semibold text-[#22211B]">
                        Cash on Delivery (Advance token required)
                      </span>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-8 rounded-2xl border border-[#C4A892]/30 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-[#22211B]">
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="mt-6 divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#ECE9E2]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-bold text-[#22211B]">{item.title}</h3>
                        <p className="text-[10px] text-gray-500">{item.artist}</p>
                        {item.size && (
                          <p className="mt-0.5 text-[10px] text-gray-400">
                            {item.size} • {item.frame}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#4D3024]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-4 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Museum-grade Packaging & Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax (GST 12%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-sm font-bold text-[#22211B]">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 rounded-xl bg-[#FAF8F5] p-3 text-[11px] text-gray-600">
                  <p className="font-semibold text-[#4D3024]">✓ Certificate of Authenticity</p>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Every print is signed, numbered, and shipped with tamper-evident archival documentation.
                  </p>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full cursor-pointer rounded-full bg-[#22211B] py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#4D3024] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}