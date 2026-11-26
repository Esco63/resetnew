import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/business";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "reset. Schwerin - Haushaltsauflösung & Entrümpelung",
    template: "%s | reset. Schwerin",
  },
  description:
    "reset. Schwerin: Haushaltsauflösung, Entrümpelung, Umzüge, Fahrzeugvermietung, Gebäudereinigung und Hausmeisterservice - zuverlässig, versichert und zum fairen Festpreis.",
  keywords: [
    "Haushaltsauflösung Schwerin",
    "Entrümpelung Schwerin",
    "Umzug Schwerin",
    "Fahrzeugvermietung mit Fahrer",
    "Gebäudereinigung Schwerin",
    "Hausmeisterservice Schwerin",
    "reset Service",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "reset. Schwerin - Haushaltsauflösung & Entrümpelung",
    description:
      "Professionelle Haushaltsauflösung, Entrümpelung, Umzug, Reinigung und Hausmeisterservice in Schwerin und Umgebung.",
    url: business.siteUrl,
    siteName: "reset. Schwerin",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "reset. Schwerin Service in Schwerin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "reset. Schwerin - Haushaltsauflösung & Entrümpelung",
    description:
      "Haushaltsauflösungen, Entrümpelungen, Umzüge, Gebäudereinigung und mehr in Schwerin.",
    images: ["/hero.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
