import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});
const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nexugcapp.com"),
  title: "NexUGC — Test edeceğin her ürün için UGC reklam videosu",
  description:
    "Meta reklamlarında test etmek istediğin ürünler için dakikalar içinde UGC ve ürün tanıtım videoları. Çekim, influencer ve kargo yok.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "NexUGC",
    description: "Test edeceğin her ürün için UGC reklam videosu. Kazananı reklam söyler.",
    images: ["/showcase/og.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`h-full antialiased ${inter.variable} ${bricolage.variable} ${instrument.variable}`}>
      <body className="min-h-full bg-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
