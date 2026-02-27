import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

import { addUserToDatabase } from "@/hooks/auth/apiAuth";

export const loginWithGoogle = async ({
  action = () => { },
}: {
  action?: () => void;
}) => {
  try {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);
    const user: any = response.user;
    console.log("logged in with google", user);
    // document.cookie = `app_token=${user?.accessToken}; path=/; max-age=86400`; // 1 day
    await addUserToDatabase(user, action);
  } catch (error) {
    console.log("failed to login with google", error);
  }
};
