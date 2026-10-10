
import { NextResponse } from "next/server";
import crypto from "crypto";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  frame?: string;
  image?: string;
};

type OrderDetails = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  total: number;
  paymentMethod: string;
  items: CheckoutItem[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function generateOrderNumber(): string {
  return `TCL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay environment variables are missing.");

      return NextResponse.json(
        { success: false, message: "Payment verification is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      orderDetails?: OrderDetails;
    };

    if (
      !isNonEmptyString(razorpay_order_id) ||
      !isNonEmptyString(razorpay_payment_id) ||
      !isNonEmptyString(razorpay_signature) ||
      !orderDetails ||
      !orderDetails.customer ||
      !Array.isArray(orderDetails.items) ||
      orderDetails.items.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid checkout details." },
        { status: 400 }
      );
    }

    // 1. Verify the Razorpay signature using constant-time comparison.
    const signatureBody =
      `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signatureBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      !/^[a-fA-F0-9]{64}$/.test(razorpay_signature) ||
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return NextResponse.json(
        { success: false, message: "Payment signature mismatch." },
        { status: 400 }
      );
    }

    // 2. Verify the payment directly with Razorpay.
    const razorpayResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(
        razorpay_payment_id
      )}`,
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
        },
        cache: "no-store",
      }
    );

    if (!razorpayResponse.ok) {
      console.error(
        "Unable to verify payment with Razorpay:",
        razorpayResponse.status
      );

      return NextResponse.json(
        { success: false, message: "Unable to verify payment status." },
        { status: 502 }
      );
    }

    const payment = await razorpayResponse.json();

    if (
      payment.id !== razorpay_payment_id ||
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      payment.currency !== "INR"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment is not captured or does not match the order.",
        },
        { status: 400 }
      );
    }

    // 3. Validate the submitted order details.
    const customer = orderDetails.customer;

    if (
      !isNonEmptyString(customer.firstName) ||
      !isNonEmptyString(customer.lastName) ||
      !isNonEmptyString(customer.email) ||
      !isNonEmptyString(customer.phone) ||
      !isNonEmptyString(customer.address) ||
      !isNonEmptyString(customer.city) ||
      !isNonEmptyString(customer.state) ||
      !isNonEmptyString(customer.postalCode) ||
      !Array.isArray(orderDetails.items) ||
      !Number.isFinite(orderDetails.total) ||
      orderDetails.total <= 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid customer or order details." },
        { status: 400 }
      );
    }

    for (const item of orderDetails.items) {
      if (
        !isNonEmptyString(item.id) ||
        !isNonEmptyString(item.title) ||
        !Number.isFinite(item.price) ||
        item.price <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid order item." },
          { status: 400 }
        );
      }
    }

    // Verify the amount paid matches the submitted total.
    // Razorpay amount is expressed in paise.
    const submittedAmountPaise = Math.round(orderDetails.total * 100);

    if (payment.amount !== submittedAmountPaise) {
      return NextResponse.json(
        { success: false, message: "Payment amount does not match the order." },
        { status: 400 }
      );
    }

    // 4. Save the order and its items to existing MongoDB collections.
    const db = await getDb();
    const orders = db.collection("Order");
    const orderItems = db.collection("OrderItem");

    // Idempotency check: don't create the same payment twice.
    const existingOrder = await orders.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderNumber: existingOrder.orderNumber,
      });
    }

    const now = new Date();
    const orderNumber = generateOrderNumber();
    const orderId = new ObjectId();

    const orderDocument = {
      _id: orderId,
      orderNumber,
      customerName:
        `${customer.firstName.trim()} ${customer.lastName.trim()}`,
      customerEmail: customer.email.trim().toLowerCase(),
      customerPhone: customer.phone.trim(),
      shippingAddress: customer.address.trim(),
      city: customer.city.trim(),
      state: customer.state.trim(),
      postalCode: customer.postalCode.trim(),
      totalAmount: orderDetails.total,
      currency: "INR",
      paymentMethod: orderDetails.paymentMethod || "RAZORPAY",
      paymentStatus: "PAID",
      status: "ORDER_PLACED",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      createdAt: now,
      updatedAt: now,
    };

    await orders.insertOne(orderDocument);

    try {
      const itemDocuments = orderDetails.items.map((item) => ({
        orderId: orderId.toString(),
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "",
        frame: item.frame || "",
        imageUrl: item.image || "",
        createdAt: now,
      }));

      await orderItems.insertMany(itemDocuments, {
        ordered: true,
      });
    } catch (itemError) {
      // Avoid leaving an order that appears complete without its items.
      await orders.deleteOne({ _id: orderId });

      throw itemError;
    }

    return NextResponse.json({
      success: true,
      orderNumber,
    });
  } catch (error) {
    console.error("Order save verification error:", error);

    return NextResponse.json(
      { success: false, message: "Error recording order." },
      { status: 500 }
    );
  }
}
