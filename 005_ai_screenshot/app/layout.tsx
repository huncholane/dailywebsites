import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import UserWidget from "./auth/components/UserWidget";
import UserProvider from "./auth/components/UserProvider";
import UserLoader from "./auth/components/UserLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Screenshot Formatter",
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
        <UserLoader />
        <div className="h-screen w-screen flex flex-col bg-background">
          <div className="w-full px-4 h-20 flex bg-secondary text-primary justify-between">
            <Link
              href="/"
              className="my-auto text-primary hover:text-primary-dark text-lg font-bold"
            >
              AI Screenshot Formatter
            </Link>
            <div className="my-auto">
              <UserWidget />
            </div>
          </div>
          <div className="overflow-auto h-full">{children}</div>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
