"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  error: Error;
  reset: () => void;
}

const Error = ({ error, reset }: Props) => {
  const router = useRouter();
  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50">
      <h1 className="text-3xl text-red-700">{error.message}</h1>
      <div className="flex gap-2">
        <button
          className="rounded-md bg-blue-400 px-2 py-1 text-white"
          onClick={() => reset()}
        >
          Try again
        </button>
        <button
          className="rounded-md border border-blue-400 px-2 py-1 text-blue-600"
          onClick={() => router.push("/")}
        >
          Go home
        </button>
      </div>
    </div>
  );
};

export default Error;
