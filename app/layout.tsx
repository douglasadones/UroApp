import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import PWAInstaller from "@/components/pwa-installer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UroHPB - Assistente para Hiperplasia Prostática Benigna",
  description: "Aplicativo para auxílio no manejo de hiperplasia prostática benigna",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "UroHPB",
    startupImage: [
      {
        url: "/icon-512x512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "UroHPB",
    "application-name": "UroHPB",
    "msapplication-TileColor": "#f97316",
    "msapplication-tap-highlight": "no",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#f97316" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* PWA Meta Tags */}
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192x192.png" />

        {/* Splash screens para iOS */}
        <link rel="apple-touch-startup-image" href="/icon-512x512.png" />

        {/* Prevent zoom on iOS */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="min-h-screen min-h-[100dvh] bg-gray-50">{children}</div>
        <PWAInstaller />
      </body>
    </html>
  )
}
