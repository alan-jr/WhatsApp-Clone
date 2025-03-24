import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WhatsAppProvider } from "@/context/whatsapp-context"
import "@/app/globals.css"

export const metadata = {
  title: "WhatsApp Clone",
  description: "A WhatsApp clone built with Next.js and Tailwind CSS",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <WhatsAppProvider>
            {children}
            <Toaster />
          </WhatsAppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
