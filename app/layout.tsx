import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M/03 — Senior Graphic Designer",
  description: "Independent art direction, brand systems, and editorial design.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
