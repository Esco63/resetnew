import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "reset. Schwerin – Auflösen · Entrümpeln · Neuanfangen",
  description:
    "reset. Schwerin: Haushaltsauflösung, Entrümpelung, Umzüge, Fahrzeugvermietung & Gebäudereinigung – zuverlässig, versichert & zum fairen Festpreis.",
  keywords: [
    "Haushaltsauflösung Schwerin",
    "Entrümpelung Schwerin",
    "Umzug Schwerin",
    "Fahrzeugvermietung mit Fahrer",
    "reset Service",
  ],
  openGraph: {
    title: "reset. Schwerin – Auflösen · Entrümpeln · Neuanfangen",
    description:
      "Professionelle Haushaltsauflösung, Entrümpelung, Umzug & Fahrzeugvermietung in Schwerin und Umgebung.",
    url: "https://reset-service.de",
    siteName: "reset. Schwerin",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "reset. Schwerin – Auflösen · Entrümpeln · Neuanfangen",
    description:
      "Haushaltsauflösungen, Entrümpelungen, Umzüge, Gebäudereinigung & mehr in Schwerin.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
