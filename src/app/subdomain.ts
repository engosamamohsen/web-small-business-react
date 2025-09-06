import { headers } from "next/headers";
async function getSubdomain() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
  // return process.env.NEXT_PUBLIC_BASE_URL;
}

export default getSubdomain;
