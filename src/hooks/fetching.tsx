import { cookies } from "next/headers";

type typeCache = "force-cache" | "no-cache" | "no-store";
type revalidate = { revalidate: false | number | undefined };

interface fetchingProps {
  url: string;
  type?: { cache: typeCache } | { next: revalidate };
  token?: string;
}

export async function fetchingData({
  url,
  type = undefined,
  token,
}: fetchingProps) {
  const cookieStore = await cookies();
  const baseApi = cookieStore.get("baseApi")?.value;
  const fullUrl = `${baseApi}${process.env.NEXT_PUBLIC_LAST_ROUTE_API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...type,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      return { data: null, status: response.status, isSuccess: false };
    }

    const data = await response.json();

    return {
      data,
      status: response.status,
      isSuccess: true,
    };
  } catch (error) {
    return { data: null, status: 500, isSuccess: false, error };
  }
}
