"use client";
import React, { useEffect, useState } from "react";
import { getSessionUser, SessionUser } from "../session";
import { useSessionUserStore } from "../store";
import { BounceLoader } from "react-spinners";

type Props = {
  children: React.ReactNode;
};

const UserProvider = ({ children }: Props) => {
  const { setUser } = useSessionUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getSessionUser();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate sleep for 1 second
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, [setUser]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center">
        <BounceLoader className="my-auto" />
      </div>
    ); // You can replace this with a proper loading spinner or component
  }

  return <>{children}</>;
};

export default UserProvider;
