import type { Metadata } from "next";
import { Ubuntu, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BackToTop } from "@/components/layout/BackToTop";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "QuickHire - Find your dream job",
  description: "Discover more than 5000+ Jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${ubuntu.variable} font-ubuntu antialiased`}
      >
        <Providers>
          {children}
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}

