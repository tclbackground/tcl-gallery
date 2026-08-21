// app/checkout/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";

interface CartItem {
  cartItemId?: string;

  // Your product page may use productId or id
  productId?: string;
  id?: string;

  title: string;

  // Support both imageUrl and image
  imageUrl?: string;
  image?: string;

  artist?: string;
  artistName?: string;

  price: number;
  quantity: number;

  size?: string;
  medium?: string;
  frame?: string;

  totalPrice?: number;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [cartLoaded, setCartLoaded] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "upi" | "cod"
  >("card");

  // ==========================================
  // LOAD SELECTED PRODUCTS FROM LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("tcl-cart");

      if (!savedCart) {
        setCartItems([]);
        return;
      }

      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        setCartItems(parsedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartItems([]);
    } finally {
      setCartLoaded(true);
    }
  }, []);

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const subtotal = cartItems.reduce((acc, item) => {
    const itemTotal =
      typeof item.totalPrice === "number"
        ? item.totalPrice
        : Number(item.price || 0) *
          Number(item.quantity || 1);

    return acc + itemTotal;
  }, 0);

  const shipping = subtotal > 15000 ? 0 : 750;

  const tax = Math.round(subtotal * 0.12);

  const total = subtotal + shipping + tax;

  // ==========================================
  // CHECKOUT SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setErrorMessage(
        "Your cart is empty. Please add an artwork before checkout."
      );

      return;
    }

    setLoading(true);

    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    const orderData = {
      customer: {
        firstName: String(
          formData.get("firstName") || ""
        ),

        lastName: String(
          formData.get("lastName") || ""
        ),

        email: String(
          formData.get("email") || ""
        ),

        phone: String(
          formData.get("phone") || ""
        ),

        address: String(
          formData.get("address") || ""
        ),

        city: String(
          formData.get("city") || ""
        ),

        state: String(
          formData.get("state") || ""
        ),

        postalCode: String(
          formData.get("postalCode") || ""
        ),
      },

      items: cartItems,

      paymentMethod,

      subtotal,

      shipping,

      tax,

      total,
    };

    // ==========================================
    // CASH ON DELIVERY
    // ==========================================

    if (paymentMethod === "cod") {
      try {
        const verifyRes = await fetch(
          "/api/checkout/verify",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              razorpay_order_id: `COD_${Date.now()}`,

              razorpay_payment_id: "COD_PAYMENT",

              razorpay_signature: "COD_EXEMPT",

              orderDetails: orderData,
            }),
          }
        );

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          // Clear cart after successful order
          localStorage.removeItem("tcl-cart");

          router.push(
            `/checkout/success?orderId=${verifyData.orderNumber}`
          );
        } else {
          setErrorMessage(
            verifyData.message ||
              "Failed to record COD order."
          );
        }
      } catch (err: any) {
        console.error("COD order error:", err);

        setErrorMessage(
          err.message || "Something went wrong."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // ==========================================
    // RAZORPAY CARD / UPI
    // ==========================================

    try {
      if (
        typeof window === "undefined" ||
        !(window as any).Razorpay
      ) {
        throw new Error(
          "Razorpay checkout SDK is loading. Please try again in a moment."
        );
      }

      // Create Razorpay order
      const res = await fetch(
        "/api/checkout/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            totalAmount: total,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Could not initialize payment."
        );
      }

      // ==========================================
      // RAZORPAY OPTIONS
      // ==========================================

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: data.currency || "INR",

        name: "TCL Gallery",

        description: "Fine Art Order",

        order_id: data.orderId,

        prefill: {
          name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,

          email: orderData.customer.email,

          contact: orderData.customer.phone,
        },

        theme: {
          color: "#22211B",
        },

        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              "/api/checkout/verify",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  orderDetails: orderData,
                }),
              }
            );

            const verifyData =
              await verifyRes.json();

            if (verifyData.success) {
              // Clear cart after successful payment
              localStorage.removeItem("tcl-cart");

              router.push(
                `/checkout/success?orderId=${verifyData.orderNumber}`
              );
            } else {
              setErrorMessage(
                verifyData.message ||
                  "Payment verification failed. Please contact support."
              );

              setLoading(false);
            }
          } catch (err) {
            console.error(
              "Payment verification error:",
              err
            );

            setErrorMessage(
              "Error recording order confirmation."
            );

            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new (
        window as any
      ).Razorpay(options);

      razorpayInstance.open();
    } catch (error: any) {
      console.error("Checkout error:", error);

      setErrorMessage(
        error.message ||
          "Payment initiation failed."
      );

      setLoading(false);
    }
  };

  // ==========================================
  // LOADING CART
  // ==========================================

  if (!cartLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Loading your selected artwork...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4">
        <div className="max-w-md rounded-2xl border border-[#C4A892]/30 bg-white p-10 text-center shadow-sm">
          <h1 className="font-serif text-3xl font-bold text-[#22211B]">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Please select an artwork before
            proceeding to checkout.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-[#22211B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#4D3024]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // MAIN CHECKOUT PAGE
  // ==========================================

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <main className="min-h-screen bg-[#FAF8F5] px-4 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">

          {/* BREADCRUMBS */}

          <nav className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Link
              href="/cart"
              className="hover:text-[#4D3024]"
            >
              Cart
            </Link>

            <span>/</span>

            <span className="text-[#22211B]">
              Checkout
            </span>
          </nav>

          {/* PAGE TITLE */}

          <h1 className="font-serif text-3xl font-bold text-[#22211B] md:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Your selected artwork will be carefully
            prepared, framed and packaged for safe delivery.
          </p>

          {/* ERROR MESSAGE */}

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-10 grid gap-10 lg:grid-cols-12"
          >

            {/* ======================================
                LEFT COLUMN
            ====================================== */}

            <div className="space-y-8 lg:col-span-7">

              {/* CONTACT INFORMATION */}

              <section className="rounded-2xl border border-[#C4A892]/30 bg-white p-6 shadow-sm md:p-8">
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

              {/* SHIPPING ADDRESS */}

              <section className="rounded-2xl border border-[#C4A892]/30 bg-white p-6 shadow-sm md:p-8">
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

              {/* PAYMENT METHOD */}

              <section className="rounded-2xl border border-[#C4A892]/30 bg-white p-6 shadow-sm md:p-8">

                <h2 className="font-serif text-xl font-bold text-[#22211B]">
                  3. Payment Selection
                </h2>

                <div className="mt-4 space-y-3">

                  {/* CARD */}

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
                        checked={
                          paymentMethod === "card"
                        }
                        onChange={() =>
                          setPaymentMethod("card")
                        }
                        className="accent-[#7B8F50]"
                      />

                      <span className="text-sm font-semibold text-[#22211B]">
                        Credit / Debit Card (Razorpay)
                      </span>

                    </div>
                  </label>

                  {/* UPI */}

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
                        checked={
                          paymentMethod === "upi"
                        }
                        onChange={() =>
                          setPaymentMethod("upi")
                        }
                        className="accent-[#7B8F50]"
                      />

                      <span className="text-sm font-semibold text-[#22211B]">
                        UPI (Google Pay / PhonePe / Paytm / QR)
                      </span>

                    </div>
                  </label>

                  {/* COD */}

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
                        checked={
                          paymentMethod === "cod"
                        }
                        onChange={() =>
                          setPaymentMethod("cod")
                        }
                        className="accent-[#7B8F50]"
                      />

                      <span className="text-sm font-semibold text-[#22211B]">
                        Cash on Delivery
                      </span>

                    </div>
                  </label>

                </div>
              </section>

            </div>

            {/* ======================================
                RIGHT COLUMN - ORDER SUMMARY
            ====================================== */}

            <div className="lg:col-span-5">

              <div className="sticky top-8 rounded-2xl border border-[#C4A892]/30 bg-white p-6 shadow-sm md:p-8">

                <h2 className="font-serif text-xl font-bold text-[#22211B]">
                  Order Summary
                </h2>

                {/* ITEMS */}

                <div className="mt-6 divide-y divide-gray-100">

                  {cartItems.map((item, index) => {
                    const imageSource =
                      item.imageUrl ||
                      item.image ||
                      "/images/products/placeholder.jpg";

                    const itemTotal =
                      typeof item.totalPrice ===
                      "number"
                        ? item.totalPrice
                        : Number(item.price || 0) *
                          Number(
                            item.quantity || 1
                          );

                    return (
                      <div
                        key={
                          item.cartItemId ||
                          item.productId ||
                          item.id ||
                          index
                        }
                        className="flex gap-4 py-4 first:pt-0"
                      >

                        {/* IMAGE */}

                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#ECE9E2]">

                          <Image
                            src={imageSource}
                            alt={
                              item.title ||
                              "Artwork"
                            }
                            fill
                            unoptimized
                            className="object-cover"
                          />

                        </div>

                        {/* DETAILS */}

                        <div className="flex-1">

                          <h3 className="text-xs font-bold text-[#22211B]">
                            {item.title}
                          </h3>

                          {(item.artist ||
                            item.artistName) && (
                            <p className="mt-1 text-[10px] text-gray-500">
                              {item.artist ||
                                item.artistName}
                            </p>
                          )}

                          {item.size && (
                            <p className="mt-1 text-[10px] text-gray-400">
                              Size: {item.size}
                            </p>
                          )}

                          {item.medium && (
                            <p className="mt-0.5 text-[10px] text-gray-400">
                              Medium: {item.medium}
                            </p>
                          )}

                          {item.frame && (
                            <p className="mt-0.5 text-[10px] text-gray-400">
                              Frame: {item.frame}
                            </p>
                          )}

                          <p className="mt-1 text-[10px] text-gray-500">
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                        </div>

                        {/* PRICE */}

                        <span className="text-xs font-bold text-[#4D3024]">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>
                    );
                  })}

                </div>

                {/* PRICE BREAKDOWN */}

                <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-4 text-xs">

                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>

                    <span>
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>
                      Museum-grade Packaging & Shipping
                    </span>

                    <span>
                      {shipping === 0
                        ? "Free"
                        : `₹${shipping.toLocaleString(
                            "en-IN"
                          )}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>
                      Estimated Tax (GST 12%)
                    </span>

                    <span>
                      ₹
                      {tax.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-3 text-sm font-bold text-[#22211B]">

                    <span>Total Amount</span>

                    <span>
                      ₹
                      {total.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>

                {/* SECURITY */}

                <div className="mt-6 rounded-xl bg-[#FAF8F5] p-3 text-[11px] text-gray-600">

                  <p className="font-semibold text-[#4D3024]">
                    ✓ Certificate of Authenticity
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Every artwork is carefully prepared
                    and packaged for safe delivery.
                  </p>

                </div>

                {/* PLACE ORDER */}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full cursor-pointer rounded-full bg-[#22211B] py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#4D3024] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "cod"
                    ? `Place Order • ₹${total.toLocaleString(
                        "en-IN"
                      )}`
                    : `Pay ₹${total.toLocaleString(
                        "en-IN"
                      )}`}
                </button>

              </div>

            </div>

          </form>

        </div>
      </main>
    </>
  );
}