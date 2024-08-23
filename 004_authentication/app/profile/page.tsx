"use client";
import React, { useEffect, useState } from "react";
import { useSessionUserStore } from "../lib/store";
import { useRouter } from "next/navigation";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();
  const { user } = useSessionUserStore();
  const [loading, setLoading] = useState(true);

  const Header = (text: string) => {
    return <th className="p-2 text-left">{text}</th>;
  };
  const Info = (text: string) => {
    return <td className="p-2">{text}</td>;
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user && !loading) {
      return router.push("/login");
    }
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="pb-8">Edit your profile</h1>
      <table>
        <tbody>
          <tr>
            {Header("Username")}
            {Info(user?.username || "")}
          </tr>
          <tr>
            {Header("Email")}
            {Info(user?.email || "")}
          </tr>
          <tr>
            {Header("First Name")}
            {Info(user?.firstName || "")}
          </tr>
          <tr>
            {Header("Last Name")}
            {Info(user?.lastName || "")}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default page;
