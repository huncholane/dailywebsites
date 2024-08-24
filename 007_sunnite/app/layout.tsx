import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen w-screen">
          <div className="h-20 w-full flex justify-center shadow bg-primary">
            <h1 className="my-auto">Sun Nite</h1>
          </div>
        </div>
      </body>
    </html>
  );
}
