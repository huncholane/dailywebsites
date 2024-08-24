"use client";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { toast, ToastContainer } from "react-toast";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const contractAddress = "0x1234567890";
  return (
    <div>
      <div className="flex w-full justify-center">
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
      <ToastContainer />
    </div>
  );
}
