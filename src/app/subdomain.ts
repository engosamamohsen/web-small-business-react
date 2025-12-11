import { headers } from "next/headers";

async function getSubdomain() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  console.log("host", host);
  return `https://${host}`;
  // return "https://emend.cashierthru.com";
}

export default getSubdomain;
