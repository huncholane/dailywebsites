"use client";
import Link from "next/link";
import React from "react";
import { useSessionUserStore } from "../lib/store";

type Props = {
  children?: React.ReactNode;
};

const Skeleton = (props: Props) => {
  const { user } = useSessionUserStore();
  return (
    <div className="fixed h-screen w-screen">
      <div className="h-full w-full flex flex-col">
        <div className="h-20 px-4 bg-secondary flex justify-between">
          <Link href="/" className="my-auto">
            Home
          </Link>
          {user ? (
            <Link href="/profile" className="my-auto">
              {user.username}
            </Link>
          ) : (
            <Link href="/login" className="my-auto">
              Login
            </Link>
          )}
        </div>
        <div className="overflow-auto h-full">{props.children}</div>
      </div>
    </div>
  );
};

export default Skeleton;
