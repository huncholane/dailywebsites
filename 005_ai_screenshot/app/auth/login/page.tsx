"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "react-toastify";
import { useSessionUserStore } from "../store";
import { login } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useSessionUserStore();

  if (user) {
    router.push("/auth");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login(email as string, password as string);
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
        <Link href="./register" className="mx-auto">
          Not Registered? Create Account
        </Link>
      </form>
    </div>
  );
}
