type typeCache = "force-cache" | "no-cache" | "no-store";
type revalidate = { revalidate: false | number | undefined };
interface fetchingProps {
  url: string;
  type?: { cache: typeCache } | { next: revalidate };
}
export async function fetchingData({ url, type = undefined }: fetchingProps) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      type
    );
    if (!response.ok) {
      return { data: null, status: response.status, isSuccess: false };
    }
    const data = await response.json();
    return {
      data: data,
      status: response.status,
      isSuccess: true,
    };
  } catch (error) {
    console.log("error", error);
  }
}
