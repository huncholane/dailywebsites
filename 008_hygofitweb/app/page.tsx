"use client";

import { useState } from "react";
import { verifyGuess } from "./actions";

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  return (
    <div className="flex w-full justify-center h-full">
      {isVerified ? (
        <form
          className="flex flex-col gap-4"
          action={() => {
            // Send a message to apn
          }}
        >
          <h1 className="mx-auto">Send a message to the app users</h1>
          <input className="mx-auto" type="text" name="message" />
          <button className="mx-auto" type="submit">
            Send
          </button>
        </form>
      ) : (
        <form
          className="flex flex-col gap-4"
          action={(formData) => {
            verifyGuess(formData.get("guess") as string) && setIsVerified(true);
          }}
        >
          <h1 className="mx-auto">Guess the secret phrases</h1>
          <input className="mx-auto" type="password" name="guess" />
          <button className="mx-auto" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
