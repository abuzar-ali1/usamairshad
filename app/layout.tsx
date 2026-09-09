import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Usama Irshad — Brand & Motion Designer",
  description: "Usama Irshad is a senior brand and motion designer based in Lahore. 8+ years building brand identities, packaging, and visuals with meaning. Open to remote projects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body>
    </html>
  );
}
