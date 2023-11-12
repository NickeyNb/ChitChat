import React from "react";
import Image from "next/image";
import logo from "@/../public/images/chitchatlogo.png";
import AuthForm from "./_components/AuthForm";

const Homepage = () => {
  return (
    <div
      className={
        "flex min-h-full flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8"
      }
    >
      <div className={"sm:mx-auto sm:w-full sm:max-w-md"}>
        <Image
          src={logo}
          alt="Messenger logo"
          height={"48"}
          width={"48"}
          className={"mx-auto w-auto"}
          priority
        />
        <h2
          className={
            "mt-6 text-center text-3xl font-bold tracking-tight text-gray-900"
          }
        >
          Sign in to your account
        </h2>
      </div>
      {/* AuthForm */}
      <AuthForm />
    </div>
  );
};

export default Homepage;
