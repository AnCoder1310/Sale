import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "VinFast Sales Coach — VFO2O-20",
  description: "VinFast AI Sales Enablement Coach for Automotive Advisors - Team P-043",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/VinFast_logo.svg/512px-VinFast_logo.svg.png", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg" />
      </head>
      <body 
        className="antialiased min-h-screen bg-[#F8FAFC] text-[#0F172A]"
        suppressHydrationWarning
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
