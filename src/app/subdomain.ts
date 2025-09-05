import { headers } from "next/headers";
async function getSubdomain() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomainValue = host.split(".")[0];

  return process.env.NEXT_PUBLIC_BASE_URL ?? subdomainValue;
}

export default getSubdomain;
