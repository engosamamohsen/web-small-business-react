export function getGlobalData() {
  const data = {
    mainBackground: "#ffff", // main background color like header and footer
    secondBackground: "#0946b3",
    mainFontColor: "#FC7643",
    secondFontColor: "black",
    fontColor: "#ffff",
    mainColor: "#FC7643", // main color like bt ond hover
    secondColor: "#0946b3",
    app_name: "مطعم الطعام العربي",
    logo: "https://cdn.pixabay.com/photo/2015/10/20/21/05/mcdonald-998495_1280.png",
  };
  return data;
}

export const cookieConsent = {
  cookies: {
    consent: {
      required: true,
      defaultAccepted: false,
      types: ["necessary", "analytics", "marketing"],
      maxAge: 365,
      httpOnly: false, // Allows client-side JavaScript to access the cookie
      path: "/",
      secure: true,
    },
    preferences: {
      theme: "light",
      language: "ar",
    },
  },
};

export function handleStringifyResponse(
  response?: string | null,
): Record<string, any> | null {
  // If response is undefined or null, return null
  if (response == null) return null;

  try {
    const parsedResponse = JSON.parse(response);

    if (typeof parsedResponse !== "object" || parsedResponse === null) {
      console.error("الاستجابة ليست كائنًا صالحًا");
      return null;
    }

    return parsedResponse;
  } catch (error) {
    console.error("خطأ في تحليل JSON:", error);
    return null;
  }
}

export function transformSelectData({
  data,
  idKey,
  valueKey,
}: {
  data: any[];
  idKey: string;
  valueKey: string;
}): { value: number; name: string }[] {
  const TargetData = data.map((item) => ({
    value: item[idKey],
    name: item[valueKey],
  }));
  return TargetData;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
};
