import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BLOG_URL || "https://localhost:3000"),
  title: process.env.NEXT_PUBLIC_BLOG_TITLE || "Andrew Melbourne's Blog",
  description: process.env.NEXT_PUBLIC_BLOG_DESCRIPTION || "Andrew Melbourne's development blog",
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
