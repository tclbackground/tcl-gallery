import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    console.log("Enquiry API called");

    const body = await request.json();

    console.log("Received enquiry:", body);

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
      !firstName ||
      !lastName ||
      !email ||
      !inquiryType ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    // SAVE TO MONGODB
    console.log("Saving enquiry to MongoDB...");

    const enquiry = await prisma.enquiry.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        inquiryType,
        message,
      },
    });

    console.log(
      "Enquiry saved successfully:",
      enquiry.id
    );

    // CREATE EMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // EMAIL TO TCL GALLERY
    await transporter.sendMail({
      from: `"TCL Gallery Website" <${process.env.EMAIL_USER}>`,

      to: process.env.ADMIN_EMAIL,

      replyTo: email,

      subject: `New Enquiry from ${firstName} ${lastName}`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            padding: 20px;
          "
        >

          <h2 style="color: #002B5B;">
            New Website Enquiry
          </h2>

          <hr />

          <p>
            <strong>Name:</strong>
            ${firstName} ${lastName}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone || "Not provided"}
          </p>

          <p>
            <strong>Inquiry Type:</strong>
            ${inquiryType}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div
            style="
              background: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              line-height: 1.6;
            "
          >
            ${message}
          </div>

          <br />

          <p
            style="
              color: #777;
              font-size: 12px;
            "
          >
            This enquiry was submitted through the TCL Gallery website.
          </p>

        </div>
      `,
    });

    console.log("Admin email sent successfully");

    // AUTO REPLY TO CUSTOMER
    await transporter.sendMail({
      from: `"TCL Gallery" <${process.env.EMAIL_USER}>`,

      to: email,

      subject:
        "We have received your enquiry | TCL Gallery",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            padding: 20px;
            color: #1A202C;
          "
        >

          <h1
            style="
              color: #002B5B;
              font-family: Georgia, serif;
              font-weight: normal;
            "
          >
            Thank You for Contacting TCL Gallery
          </h1>

          <p>
            Dear ${firstName},
          </p>

          <p>
            Thank you for getting in touch with TCL Gallery.
          </p>

          <p>
            We have successfully received your enquiry regarding:
          </p>

          <p
            style="
              font-weight: bold;
              color: #B45309;
            "
          >
            ${inquiryType}
          </p>

          <p>
            Our team has received your enquiry and will get back
            to you shortly.
          </p>

          <p>
            We look forward to speaking with you.
          </p>

          <br />

          <p>
            Warm regards,
          </p>

          <p style="font-weight: bold;">
            TCL Gallery Team
          </p>

          <hr />

          <p
            style="
              color: #777;
              font-size: 12px;
            "
          >
            Today Celebrate Life
          </p>

        </div>
      `,
    });

    console.log("Customer auto-reply sent successfully");

    return NextResponse.json(
      {
        success: true,
        message:
          "Your enquiry has been received successfully. We will get back to you shortly.",
        enquiryId: enquiry.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Enquiry Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}