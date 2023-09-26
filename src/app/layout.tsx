import { BASE_SITE_TITLE } from "@/constants";
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: BASE_SITE_TITLE,
  description: BASE_SITE_TITLE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <!-- This doesn't have an NPM package --> */}
      <Script
        src="https://w.soundcloud.com/player/api.js"
        type="text/javascript"
      ></Script>

      <body>{children}</body>
    </html>
  );
}
