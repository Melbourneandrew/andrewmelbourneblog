import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BLOG_URL || "https://localhost:3000"),
  title: process.env.NEXT_PUBLIC_BLOG_TITLE || "Supa Blog",
  description: process.env.NEXT_PUBLIC_BLOG_DESCRIPTION || "A simple blog starter kit built with Supabase and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
