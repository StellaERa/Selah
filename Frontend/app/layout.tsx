import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
    weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Selah — Scripture study and discipleship",
  description:
    "Selah connects learners with teachers and groups, and provides cited Scripture study on the Stellar network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${instrumentSerif.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
