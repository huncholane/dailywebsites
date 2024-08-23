"use client";
import React, { useEffect } from "react";
import { SessionUser } from "./session";
import axios from "axios";
import { useSessionUserStore } from "./store";

type Props = {};

const UserProvider = (props: Props) => {
  const { user, setUser } = useSessionUserStore();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("/api/user");
      const user = response.data as SessionUser | null;
      setUser(user);
    };
    fetchUser();
  }, []);
  return <></>;
};

export default UserProvider;
