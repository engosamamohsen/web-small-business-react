/**
 * Firebase Configuration - Astro
 *
 * Initializes Firebase app with environment variables
 * Used for Google social login
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { fetchHook } from './fetch-hook';

const firebaseConfig = {
  apiKey:
    import.meta.env.PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyBgikvsur0oHXH3al8oa8sQwKQ58FHPwMY',
  authDomain:
    import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'cashier-thru.firebaseapp.com',
  databaseURL:
    import.meta.env.PUBLIC_FIREBASE_DATABASE_URL ||
    'https://cashier-thru-default-rtdb.firebaseio.com',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || 'cashier-thru',
  storageBucket:
    import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'cashier-thru.firebasestorage.app',
  messagingSenderId:
    import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '675561190760',
  appId:
    import.meta.env.PUBLIC_FIREBASE_APP_ID ||
    '1:675561190760:web:1d0cc394c3bc113aa452dd',
  measurementId:
    import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-C5EM0V4EH6',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * Add user to database after social login
 * Matches Next.js addUserToDatabase behavior
 */
async function addUserToDatabase(user: any, action: () => void) {
  try {
    // Create FormData to match Next.js behavior
    const formData = new FormData();
    formData.append('register_type', '2');
    formData.append('social_id', user.uid);
    if (user.displayName) {
      formData.append('name', user.displayName);
    }
    if (user.email) {
      formData.append('email', user.email);
    }
    if (user.photoURL) {
      formData.append('image', user.photoURL);
    }

    const response = await fetchHook({
      url: 'register-social',
      init: {
        method: 'POST',
        body: formData,
        headers: {}, // Remove Content-Type to let browser set multipart boundary
      },
    });

    if (response.data?.data?.status !== 200 && response.data?.data?.api_token) {
      Cookies.set('app_token', response.data.data.api_token, {
        expires: 1,
        path: '/',
      });
      toast.success('تم تسجيل الدخول بنجاح!');
      action();
    } else if (response.data?.data?.api_token) {
      Cookies.set('app_token', response.data.data.api_token, {
        expires: 1,
        path: '/',
      });
      toast.success('تم تسجيل الدخول بنجاح!');
      action();
    } else {
      toast.error(
        response.data?.message || response.error || 'فشل تسجيل الدخول'
      );
    }
  } catch (error: any) {
    console.error('Failed to add user to database:', error);
    toast.error(`فشل تسجيل الدخول: ${error?.message || 'حدث خطأ'}`);
  }
}

/**
 * Login with Google using Firebase popup
 */
export const loginWithGoogle = async ({
  action = () => {},
}: {
  action?: () => void;
}) => {
  try {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);
    const user: any = response.user;
    console.log('Logged in with Google:', user);
    await addUserToDatabase(user, action);
  } catch (error) {
    console.error('Failed to login with Google:', error);
    toast.error('فشل في تسجيل الدخول بـ Google');
  }
};
