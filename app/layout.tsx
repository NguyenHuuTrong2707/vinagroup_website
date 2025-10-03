import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { GeistMono } from "geist/font/mono"
import { Merriweather, Lora, Roboto, Open_Sans, Nunito, Montserrat, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ChatWidget } from "@/components/chat-widget"
import { FirebaseProvider } from "@/components/firebase-provider"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.haohuatire.vn"),
  title: {
    default: "Haohua Tire - Sản Xuất Lốp Xe Cao Cấp",
    template: "%s | Haohua Tire",
  },
  description:
    "Nhà sản xuất lốp TBR và PCR chất lượng cao với mạng lưới phân phối toàn cầu và hỗ trợ 24/7.",
  keywords: [
    "lốp xe",
    "lốp TBR",
    "lốp PCR",
    "lốp xe tải",
    "lốp ô tô",
    "nhà máy lốp Việt Nam",
    "Haohua Tire",
  ],
  authors: [{ name: "Haohua Tire" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.haohuatire.vn/",
    title: "Haohua Tire - Sản Xuất Lốp Xe Cao Cấp",
    description:
      "Nhà sản xuất lốp TBR và PCR chất lượng cao với mạng lưới phân phối toàn cầu và hỗ trợ 24/7.",
    siteName: "Haohua Tire",
    locale: "vi_VN",
    images: [
      {
        url: "/modern-tire-manufacturing-facility.jpg",
        width: 1200,
        height: 630,
        alt: "Haohua Tire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haohua Tire - Sản Xuất Lốp Xe Cao Cấp",
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
            name: "Haohua Tire",
            url: "https://www.haohuatire.vn/",
            logo: "https://www.haohuatire.vn/placeholder-logo.png",
            sameAs: [
              "https://facebook.com/haohuatire",
              "https://linkedin.com/company/haohuatire",
              "https://youtube.com/haohuatire",
            ],
            address: {
              "@type": "PostalAddress",
              addressCountry: "VN",
            },
          })}
        </Script>
        <FirebaseProvider>
          <Suspense>
            {children}
            <ChatWidget />
            <Analytics />
          </Suspense>
        </FirebaseProvider>
      </body>
    </html>
  )
}
