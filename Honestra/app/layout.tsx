import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honestra Teleology Firewall",
  description: "Teleology Integrity demo powered by a shared teleology engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

