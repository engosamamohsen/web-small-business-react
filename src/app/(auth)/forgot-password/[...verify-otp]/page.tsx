"use client";

import React from "react";
import { useParams } from "next/navigation";

import ResetPasswordForm from "./ResetPass";
import VerifyEmailPage from "./Verify";

const Page = () => {
  const params = useParams();
  const verifyOtp = params["verify-otp"];
  const userEmail = decodeURIComponent(verifyOtp?.[0] as string);
  const isReset = decodeURIComponent(verifyOtp?.[1] as string) === "reset";

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6">
      {isReset ? (
        <ResetPasswordForm userEmail={userEmail} />
      ) : (
        <VerifyEmailPage userEmail={userEmail} />
      )}
    </div>
  );
};

export default Page;
