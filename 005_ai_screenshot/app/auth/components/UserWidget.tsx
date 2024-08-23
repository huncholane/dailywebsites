"use client";
import Link from "next/link";
import React, { Suspense } from "react";
import { RxAvatar } from "react-icons/rx";
import { useSessionUserStore } from "../store";
import { ClipLoader } from "react-spinners";

type Props = {};

const UserWidget = (props: Props) => {
  const { user } = useSessionUserStore();
  const linkClasses =
    "flex justify-between hover:bg-secondary-dark w-52 h-14 border border-border rounded p-2";
  if (!user) {
    return <ClipLoader />;
  }
  return (
    <Link href="/auth" className={linkClasses}>
      {user.id ? (
        <>
          <div className="my-auto">{user.username}</div>
          <RxAvatar className="my-auto text-4xl text-white" />
        </>
      ) : (
        <>
          <div className="my-auto">Login</div>
          <RxAvatar className="my-auto text-4xl text-white" />
        </>
      )}
    </Link>
  );
};

export default UserWidget;
