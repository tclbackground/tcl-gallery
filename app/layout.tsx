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
    <html
      lang="en"
      className="h-full w-full overflow-x-hidden antialiased"
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />

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

      <body
        className="
          m-0
          flex
          min-h-screen
          w-full
          min-w-0
          flex-col
          overflow-x-hidden
          bg-[#FBF9F0]
          p-0
          text-[#22211B]
        "
      >
        <SessionProviderWrapper>
          <div className="w-full min-w-0 max-w-none">
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </div>

          <WhatsAppChat />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}