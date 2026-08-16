// app/api/checkout/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment signature mismatch." },
        { status: 400 }
      );
    }

    const customOrderNumber = `TCL-${Math.floor(100000 + Math.random() * 900000)}`;

    // Save order in MongoDB via Prisma
    const savedOrder = await prisma.order.create({
      data: {
        orderNumber: customOrderNumber,
        customerName: `${orderDetails.customer.firstName} ${orderDetails.customer.lastName}`,
        customerEmail: orderDetails.customer.email,
        customerPhone: orderDetails.customer.phone,
        shippingAddress: orderDetails.customer.address,
        city: orderDetails.customer.city,
        state: orderDetails.customer.state,
        postalCode: orderDetails.customer.postalCode,
        totalAmount: orderDetails.total,
        currency: "INR",
        paymentMethod: orderDetails.paymentMethod,
        paymentStatus: "PAID",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        items: {
          create: orderDetails.items.map((item: any) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            size: item.size || "",
            frame: item.frame || "",
            imageUrl: item.image || "",
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: savedOrder.orderNumber,
    });
  } catch (error: any) {
    console.error("Order save verification error:", error);
    return NextResponse.json(
      { success: false, message: "Error recording order." },
      { status: 500 }
    );
  }
}