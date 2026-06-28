import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NextThemeProvider from "@/providers/NextThemeProvider";
import ScrollProvider from "@/providers/ScrollProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "tikify",
  description:
    "Seamlessly reserve seats, track bookings, and experience premium travel across bus, train, flight, and launch vectors.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <NextThemeProvider>
          <ScrollProvider>
            <main>{children}</main>
            <Toaster position="top-right" reverseOrder={false} />
          </ScrollProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
