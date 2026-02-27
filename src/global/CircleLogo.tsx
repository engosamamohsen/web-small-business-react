"use client";

import Image from "@/components/common/Image";

interface CircleLogoProps {
  src: string;
  alt?: string;
  size?: number; // default 80px
  className?: string;
}

export default function CircleLogo({
  src,
  alt = "شعار الموقع",
  size = 80,
  className = "",
}: CircleLogoProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
