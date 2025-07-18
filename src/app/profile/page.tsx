import React from "react";
import Profile from "@/components/Profile/Index";

function page() {
  return <Profile />;
}

export default page;

// async function ProfileServer(): Promise<{
//   profileData: any;
// }> {
//   try {
//     const response = await fetchingData({
//       url: `v1/profile`,
//       type: { next: { revalidate: revalidateTime } },
//       token: Cookies.get("app_token"),
//     });

//     const productData = response?.data?.data;
//     if (!productData) {
//       return {
//         productData: {},
//       };
//     }

//     return {
//       productData,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       productData: {},
//     };
//   }
// }
