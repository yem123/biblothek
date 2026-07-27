import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import CategoryTabs from "@/components/CategoryTabs";
import { getPdfTree } from "@/lib/pdfs";
import type { PdfFolderNode } from "@/lib/pdfs";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bibliothek — German Learning Library",
  description:
    "A library of German dialogues, stories, and audio for learning German.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pdfs = await getPdfTree();
  const sections = pdfs.filter((n): n is PdfFolderNode => n.type === "folder");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        <div className="flex h-screen">
          <Sidebar pdfs={pdfs} />

          <div className="flex flex-1 flex-col overflow-hidden">
            <MobileMenu pdfs={pdfs} />
            <CategoryTabs sections={sections} />

            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
