import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "SQL Viewer",
  description: "A site that allows you to view a SQL database from the web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        {children}
      </body>
    </html>
  );
}
