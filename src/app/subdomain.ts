import { headers } from "next/headers";
async function getSubdomain() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

export default getSubdomain;
