import Link from "next/link";
import React from "react";

const NotFoundPage = async () => {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50">
      <h1 className="text-3xl text-red-700">page not found</h1>
      <div className="flex gap-2">
        <Link
          href={"/"}
          className="rounded-md border border-blue-400 px-2 py-1 text-blue-600"
        >
          Go home
        </Link>{" "}
      </div>
    </div>
  );
};

export default NotFoundPage;
