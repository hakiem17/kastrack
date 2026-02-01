import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Using Inter as standard font
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { RegisterSW } from "@/components/pwa/RegisterSW";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KasBidang",
  description: "Aplikasi KasBidang - Kelola keuangan dan dompet",
  manifest: "/manifest.json",
  icons: { apple: "/favicon.ico" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KasBidang",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="kasbidang-theme">
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <RegisterSW />
        </ThemeProvider>
      </body>
    </html>
  );
}
