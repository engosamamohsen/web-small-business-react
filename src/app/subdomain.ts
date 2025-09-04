import { headers } from "next/headers";
async function getSubdomain() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomainValue = host.split(".")[0];

  return subdomainValue;
}

export default getSubdomain;
