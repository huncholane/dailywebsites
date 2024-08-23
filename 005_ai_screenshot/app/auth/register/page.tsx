"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { register } from "./actions";

type Props = {};

const page = (props: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [valid, setValid] = useState(false);

  const isEmailValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (
      password === confirmPassword &&
      password.length > 0 &&
      username.length > 0 &&
      isEmailValid(email)
    ) {
      console.log("valid");
      setValid(true);
    } else {
      setValid(false);
    }
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await register(username, email, password);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error("Username or email not available");
    }
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <form
        className="flex flex-col gap-4 mx-auto w-96 p-8 border shadow-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="w-full text-center">Register</h1>
        <div className="h-1 border-b"></div>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className={"w-28 mx-auto" + (valid ? "" : " opacity-50")}
        >
          Register
        </button>
        <Link href="/login" className="mx-auto">
          Already have an account? Login...
        </Link>
      </form>
    </div>
  );
};

export default page;
