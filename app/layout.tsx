import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VidKing - Stream Movies and TV Shows",
  description: "Watch your favorite movies and TV shows online for free",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="pt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
