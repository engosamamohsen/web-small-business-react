import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);

    console.log("logged in with google", response);
  } catch (error) {
    console.log("failed to login with google", error);
  }
};
