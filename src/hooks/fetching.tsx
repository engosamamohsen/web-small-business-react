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

  const CurrentToken = cookieStore.get("app_token");
  console.log("CurrentToken", CurrentToken);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...type,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : CurrentToken?.value
            ? { Authorization: `Bearer ${CurrentToken.value}` }
            : {}),
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
    console.log("error", error);
    return { data: null, status: 500, isSuccess: false };
  }
}
