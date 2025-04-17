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
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
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
    console.log("error", error);
    return { data: null, status: 500, isSuccess: false };
  }
}
