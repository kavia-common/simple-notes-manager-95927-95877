import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notes",
  description: "A simple, modern notes application.",
  applicationName: "Notes",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
