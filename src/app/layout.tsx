import type { Metadata } from "next";
import { Cabin, Roboto } from "next/font/google";
import "./globals.css";

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Replacement estimate | Webster Air Conditioning & Heating",
  description:
    "A six-step replacement range for Orlando homes. Placeholder pricing for Webster Air Conditioning & Heating, ready to swap for the real price book.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cabin.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f6fafb] font-sans text-ink">{children}</body>
    </html>
  );
}
