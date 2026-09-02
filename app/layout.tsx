import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REVIVE - Revenue Recovery",
  description: "AI-powered revenue recovery for merchants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* We removed the Google Font loader and are using standard sans-serif */}
      <body className="antialiased bg-[#0a0a0a] text-neutral-50 font-sans">
        {children}
      </body>
    </html>
  );
}