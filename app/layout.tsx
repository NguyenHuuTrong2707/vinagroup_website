import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { GeistMono } from "geist/font/mono"
import { Merriweather, Lora, Roboto, Open_Sans, Nunito, Montserrat, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { FirebaseProvider } from "@/components/firebase-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"
import { ConditionalChatWidget } from "@/components/conditional-chat-widget"
import { PDFViewerProvider } from "@/lib/contexts/pdf-viewer-context"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.viettires.com"),
  title: {
    default: "VINAGROUP - Phân Phối Lốp Xe Chất Lượng Cao",
    template: "%s",
  },
  description:
    "Nhà sản xuất lốp TBR và PCR chất lượng cao với mạng lưới phân phối toàn cầu và hỗ trợ 24/7.",
  keywords: [
    "lốp xe",
    "lốp TBR",
    "lốp PCR",
    "lốp xe tải",
    "lốp ô tô",
    "nhà phân phối lốp Việt Nam",
    "VINAGROUP",
  ],
  authors: [{ name: "VINAGROUP" }],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  
  openGraph: {
    type: "website",
    url: "https://www.viettires.com/",
    title: "VINAGROUP - Phân Phối Lốp Xe Chất Lượng Cao",
    description:
      "Nhà sản xuất lốp TBR và PCR chất lượng cao với mạng lưới phân phối toàn cầu và hỗ trợ 24/7.",
    siteName: "VINAGROUP",
    locale: "vi_VN",
    images: [
      {
        url: "/modern-tire-manufacturing-facility.jpg",
        width: 1200,
        height: 630,
        alt: "VINAGROUP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VINAGROUP - Phân Phối Lốp Xe Chất Lượng Cao",
    description:
      "Nhà sản xuất lốp TBR và PCR chất lượng cao với mạng lưới phân phối toàn cầu và hỗ trợ 24/7.",
    images: ["/modern-tire-manufacturing-facility.jpg"],
  },
  generator: "developer by me",
}

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
})

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lora",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-open-sans",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nunito",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body
        className={`font-sans ${inter.variable} ${montserrat.variable} ${openSans.variable} ${roboto.variable} ${nunito.variable} ${merriweather.variable} ${lora.variable} ${GeistMono.variable}`}
      >
        {/* Cấu trúc dữ liệu JSON-LD (Organization) */}
        <Script id="ld-org" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "VINAGROUP",
            url: "https://www.viettires.com/",
            logo: "https://www.viettires.com/placeholder-logo.png",
            sameAs: [
              "https://facebook.com/viettires",
            ],
            address: {
              "@type": "PostalAddress",
              addressCountry: "VN",
            },
          })}
        </Script>
        <FirebaseProvider>
          <PDFViewerProvider>
            <Suspense>
              {children}
              <ConditionalChatWidget />
              <Analytics />
            </Suspense>
            <Toaster />
          </PDFViewerProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}
