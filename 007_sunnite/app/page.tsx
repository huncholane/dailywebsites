"use client";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { toast, ToastContainer } from "react-toast";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const contractAddress = "0x1234567890";
  return (
    <div>
      <div className="w-full mb-2 justify-center flex gap-3">
        <a className="big-button">Telegram</a>
        <a className="big-button">Buy Now</a>
      </div>
      <div className="mb-8 w-full justify-center flex gap-3">
        <a className="big-button">Twitter</a>
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
      <ToastContainer />
    </div>
  );
}
