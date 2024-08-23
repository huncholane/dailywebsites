"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      router.push("/profile");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="h-full flex flex-col justify-center">
      <form
        className="flex flex-col justify-between gap-4 mx-auto w-96 p-8 border shadow-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="w-full text-center">Log In</h1>
        <div className="h-1 border-b"></div>
        <input
          type="email"
          name="email"
          placeholder="Email or Username"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit" className="w-28 mx-auto">
          Login
        </button>
        <Link href="/register" className="mx-auto">
          Not Registered? Create Account
        </Link>
      </form>
    </div>
  );
}
