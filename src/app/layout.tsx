import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

// Force rebuild: CSS cache invalidation

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://privacyhub.in'),
  title: "Privacy Policy Analyser for India | PrivacyHub.in - DPDP Act 2023 Compliance",
  description: "India's first DPDP Act 2023 compliance checker. Analyze privacy policies of Indian apps and websites for Digital Personal Data Protection Act compliance. AI-powered privacy analysis for Indian users.",
  keywords: "privacy policy analyser India, DPDP Act 2023 compliance, data privacy India, personal data protection India, Indian privacy law, digital privacy India, privacy education India, Data Protection Board, Data Fiduciary, Data Principal rights, privacy policy checker India, data security India",
  authors: [{ name: "PrivacyHub.in" }],
  creator: "PrivacyHub.in",
  publisher: "PrivacyHub.in",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://privacyhub.in",
    siteName: "PrivacyHub.in",
    title: "Privacy Policy Analyser for India | DPDP Act 2023 Compliance",
    description: "India's first DPDP Act 2023 compliance checker. Analyze privacy policies for Digital Personal Data Protection Act compliance. AI-powered privacy analysis for Indian users.",
    images: [
      {
        url: 'https://privacyhub.in/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'PrivacyHub - India Privacy Policy Analyser for DPDP Act 2023',
        type: 'image/png',
      }
    ],
    countryName: 'India',
  },
  twitter: {
    card: "summary_large_image",
    site: "@privacyhubin",
    creator: "@privacyhubin",
    title: "Privacy Policy Analyser for India | DPDP Act 2023",
    description: "India's first DPDP Act 2023 compliance checker. Analyze privacy policies for Digital Personal Data Protection Act compliance. AI-powered analysis for Indian users.",
    images: ['https://privacyhub.in/android-chrome-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://privacyhub.in',
  },
  category: 'technology',
  classification: 'Privacy Analysis Tools',
};

export function generateViewport() {
  return {
    themeColor: '#1e293b',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for rich results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PrivacyHub.in",
    "description": "India's first DPDP Act 2023 compliance checker. Analyze privacy policies for Digital Personal Data Protection Act compliance.",
    "url": "https://privacyhub.in",
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "100"
    },
    "author": {
      "@type": "Organization",
      "name": "PrivacyHub.in",
      "url": "https://privacyhub.in"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${poppins.variable} font-sans antialiased min-h-screen bg-white`}>
        <GoogleAnalytics measurementId="G-Y6PVP4X0SN" />
        <SmoothScrollProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
