import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mobiliq - Business Booking Software",
  description: "All-in-one booking and management platform for detailing businesses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
