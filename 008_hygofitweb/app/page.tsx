"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [devices, setDevices] = useState([] as string[]);

  return (
    <div className="flex w-full justify-center h-full">
      {isVerified ? (
        <form
          className="flex flex-col gap-4"
          action={async (formData) => {
            // Send a message to apn
            try {
              const response = await axios.post("/api/message", {
                message: formData.get("message"),
              });
              const { deviceIds } = response.data;
              toast.success("Message sent");
              setDevices(deviceIds || []);
            } catch {
              toast.error("Failed to send message");
            }
          }}
        >
          <h1 className="mx-auto">Send a message to the app users</h1>
          <input className="mx-auto" type="text" name="message" />
          <button className="mx-auto" type="submit">
            Send
          </button>
          <div>{`Sent to ${devices.length} devices`}</div>
        </form>
      ) : (
        <form
          className="flex flex-col gap-4"
          action={async (formData) => {
            try {
              await axios.post("/api/guess", { guess: formData.get("guess") });
              toast.success("Correct guess");
              setIsVerified(true);
            } catch {
              toast.error("Incorrect guess");
            }
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
