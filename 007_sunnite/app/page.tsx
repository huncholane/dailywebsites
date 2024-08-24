import Image from "next/image";
import { FaCopy } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      <div className="mb-8 w-full justify-center flex gap-3">
        <button className="big-button">Telegram</button>
        <button className="big-button">Buy Now</button>
      </div>
      <div className="w-96 mx-auto">
        <div className="w-full text-center">Contract Address</div>
        <div className="h-12 bg-primary rounded border border-border flex">
          <div className="my-auto w-full">asdfasdfasdfasdf</div>
          <FaCopy className="-ml-8 my-auto text-secondary hover:text-secondary-dark cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
