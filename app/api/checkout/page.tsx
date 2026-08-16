// app/checkout/page.tsx
"use client";

import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const total = 20720; // Ensure total is a valid number

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Check if Razorpay script is loaded on window
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // 2. Call backend order creation
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount: total }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        alert("Error creating order: " + orderData.message);
        setLoading(false);
        return;
      }

      // 3. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TCL Gallery",
        description: "Fine Art Print Order",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                customer: {
                  firstName: "Collector",
                  lastName: "Customer",
                  email: "collector@example.com",
                  phone: "9876543210",
                  address: "Bengaluru",
                  city: "Bengaluru",
                  state: "Karnataka",
                  postalCode: "560058",
                },
                items: [],
                total: total,
                paymentMethod: "UPI",
              },
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/checkout/success?orderId=${verifyData.orderNumber}`);
          } else {
            alert("Verification failed.");
          }
        },
        theme: { color: "#22211B" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <form onSubmit={handlePayment}>
        {/* Your checkout form inputs */}
        
        {/* Button must have type="submit" */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#22211B] py-4 text-sm font-bold text-white transition hover:bg-[#4D3024] disabled:opacity-50"
        >
          {loading ? "Processing..." : `PAY ₹${total.toLocaleString()}`}
        </button>
      </form>
    </>
  );
}