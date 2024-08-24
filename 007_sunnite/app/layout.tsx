import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toast";
import { BsTelegram, BsTwitter } from "react-icons/bs";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SunNite",
  description: "Legendary Fortnite memecoin",
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
          <div className="h-20 w-full flex justify-between shadow bg-primary p-4 sun-background">
            <h1 className="my-auto flex gap-2">
              <img src="/favicon.ico" alt="" className="h-12" />
              <div className="flex">
                <div className="my-auto">SunNite</div>
              </div>
            </h1>
            <div className="flex gap-4">
              <a
                className="my-auto text-accent hover:text-accent-dark"
                target="_blank"
                href="https://x.com/SunNite_TRX"
              >
                <BsTwitter className="text-3xl" />
              </a>
              <a
                className="my-auto text-accent mr-2 hover:text-accent-dark"
                target="_blank"
                href="https://t.me/SunNite_TRX"
              >
                <BsTelegram className="text-3xl" />
              </a>
              <a
                href="https://sunpump.meme/token/TLepEDCmQi3oyK9DnPHmqJaN5FW5zZjcEu"
                target="_blank"
                className="my-auto text-accent hover:text-accent-dark bg-secondary no-underline border h-12 w-24 text-center flex justify-center rounded-lg"
              >
                <div className="my-auto ">Buy Now</div>
              </a>
            </div>
          </div>
          <div className="h-full w-full overflow-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
