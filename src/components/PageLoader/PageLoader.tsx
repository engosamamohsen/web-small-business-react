import { cn } from "@/utils/utils";
import React from "react";

function PageLoader({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
    >
      <div className="flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">{text}</h2>
    </div>
  );
}

export default PageLoader;
