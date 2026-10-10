
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export async function POST(request: Request) {
  try {
    console.log("Enquiry API called");

    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      inquiryType,
      message,
    } = body;

    // VALIDATION
    if (
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof inquiryType !== "string" ||
      !inquiryType.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim();
    const cleanInquiryType = inquiryType.trim();
    const cleanMessage = message.trim();
    const cleanPhone =
      typeof phone === "string" && phone.trim()
        ? phone.trim()
        : null;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // CHECK EMAIL CONFIGURATION
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!emailUser || !emailPassword || !adminEmail) {
      console.error("Enquiry email environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Unable to process your enquiry right now. Please try again later.",
        },
        { status: 500 }
      );
    }

    // SAVE ENQUIRY TO EXISTING MONGODB COLLECTION
    console.log("Saving enquiry to MongoDB...");

    const db = await getDb();

    const enquiry = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      phone: cleanPhone,
      inquiryType: cleanInquiryType,
      message: cleanMessage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("Enquiry")
      .insertOne(enquiry);

    const enquiryId = result.insertedId.toString();

    console.log("Enquiry saved successfully:", enquiryId);

    // CREATE EMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // ESCAPE USER INPUT BEFORE INSERTING INTO HTML EMAILS
    const safeFirstName = escapeHtml(cleanFirstName);
    const safeLastName = escapeHtml(cleanLastName);
    const safeEmail = escapeHtml(cleanEmail);
    const safePhone = escapeHtml(cleanPhone || "Not provided");
    const safeInquiryType = escapeHtml(cleanInquiryType);
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, "<br>");

    // EMAIL TO TCL GALLERY
    await transporter.sendMail({
      from: `"TCL Gallery Website" <${emailUser}>`,
      to: adminEmail,
      replyTo: cleanEmail,
      subject: `New Enquiry from ${cleanFirstName} ${cleanLastName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:20px;">
          <h2 style="color:#002B5B;">New Website Enquiry</h2>
          <hr />
          <p><strong>Enquiry ID:</strong> ${escapeHtml(enquiryId)}</p>
          <p><strong>Name:</strong> ${safeFirstName} ${safeLastName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Inquiry Type:</strong> ${safeInquiryType}</p>
          <p><strong>Message:</strong></p>
          <div style="background:#f5f5f5;padding:20px;border-radius:8px;line-height:1.6;">
            ${safeMessage}
          </div>
          <p style="color:#777;font-size:12px;margin-top:24px;">
            This enquiry was submitted through the TCL Gallery website.
          </p>
        </div>
      `,
    });

    console.log("Admin email sent successfully");

    // AUTOMATIC REPLY TO CUSTOMER
    await transporter.sendMail({
      from: `"TCL Gallery" <${emailUser}>`,
      to: cleanEmail,
      subject: "We have received your enquiry | TCL Gallery",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:20px;color:#1A202C;">
          <h1 style="color:#002B5B;font-family:Georgia,serif;font-weight:normal;">
            Thank You for Contacting TCL Gallery
          </h1>
          <p>Dear ${safeFirstName},</p>
          <p>Thank you for getting in touch with TCL Gallery.</p>
          <p>We have successfully received your enquiry regarding:</p>
          <p style="font-weight:bold;color:#B45309;">${safeInquiryType}</p>
          <p>Our team has received your enquiry and will get back to you shortly.</p>
          <p>We look forward to speaking with you.</p>
          <br />
          <p>Warm regards,</p>
          <p style="font-weight:bold;">TCL Gallery Team</p>
          <hr />
          <p style="color:#777;font-size:12px;">Today Celebrate Life</p>
        </div>
      `,
    });

    console.log("Customer auto-reply sent successfully");

    return NextResponse.json(
      {
        success: true,
        message:
          "Your enquiry has been received successfully. We will get back to you shortly.",
        enquiryId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Enquiry Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
