"use client";
import React, { useEffect } from "react";
import { useSessionUserStore } from "../store";
import { getSessionUser } from "../session";

type Props = {};

const UserLoader = (props: Props) => {
  const { setUser } = useSessionUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getSessionUser();
      setUser(user);
    };
    fetchUser();
  }, [setUser]);
  return <></>;
};

export default UserLoader;
