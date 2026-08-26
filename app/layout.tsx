import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import LayoutWrapper from "@/components/LayoutWrapper";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import WhatsAppChat from "@/components/UI/WhatsAppChat";

export const metadata: Metadata = {
  title: "TCL Gallery",
  description: "Fine Art Photography & Gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZDRPBH901N"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            gtag("js", new Date());

            gtag("config", "G-ZDRPBH901N");
          `}
        </Script>
      </head>

      <body className="min-h-screen flex flex-col bg-[#FBF9F0] text-[#22211B]">
        <SessionProviderWrapper>
          <LayoutWrapper>{children}</LayoutWrapper>

          <WhatsAppChat />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}