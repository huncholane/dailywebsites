"use client";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { toast, ToastContainer } from "react-toast";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const contractAddress = "0x1234567890";
  return (
    <div className="fortnite-background p-8">
      <h1 className="w-full text-center">Sun Nite</h1>
      <h3 className="w-full text-center mb-7">
        Official fortnite coin on Tron created by Soulja boy
      </h3>
      <div className="flex w-full justify-center mb-3">
        <iframe
          width="315"
          height="560"
          src="https://www.youtube.com/embed/dNnSMY8qQ-I"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
      <div className="mx-auto justify-center w-96">
        <div className="w-full text-center">Contract Address</div>
        <div className="h-12 bg-primary p-2 rounded border border-border flex">
          <div className="my-auto w-full mr-7">{contractAddress}</div>
          <FaCopy
            className="-ml-5 my-auto text-secondary hover:text-secondary-dark cursor-pointer"
            onClick={(e) => {
              navigator.clipboard.writeText(contractAddress);
              toast.success("Copied to clipboard");
            }}
          />
        </div>
      </div>
      <div className="mt-8">
        <h1 className="w-full text-center">Tokenomics</h1>
        <h3 className="w-full text-center">No sales tax</h3>
      </div>
      <ToastContainer />
    </div>
  );
}
