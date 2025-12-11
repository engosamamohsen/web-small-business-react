import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    // Using remotePatterns instead of deprecated 'domains'
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "emend.cashierthru.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "staging.fawaterk.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        // Allow any subdomain of cashierthru.com
        protocol: "https",
        hostname: "*.cashierthru.com",
      },
    ],
  },
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzerConfig(nextConfig);