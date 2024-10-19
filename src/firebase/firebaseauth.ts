import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  Auth,
  User,
} from "firebase/auth";
import { app } from "@/firebase/firebaseconfig";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import saveUser from "./firebasestore";

export const auth = getAuth(app);

export function SignupForm(
  email: string,
  password: string,
  router: AppRouterInstance,
  setError: (message: string) => void
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // const user = userCredential.user;
      const { email, uid, emailVerified } = userCredential.user;
      sendEmailVerification(auth.currentUser as User);
      console.log("user created successfully.");
      saveUser({ email: email as string, uid, emailVerified });
      if (emailVerified) {
        router.push("/expenseList");
      } else {
        router.push("/emailverify");
      }

      // ...
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      }
      console.error("Error during signup:", error.message);
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // console.error(errorMessage, "invild email or password.");
      // alert("invild email or password.");
      // ..
    });
}

export function loginForm(
  email: string,
  password: string,
  router: AppRouterInstance,
  setError: (message: string) => void
) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);

      if (user.emailVerified) {
        router.push("/expenseList");
        console.log("Email is verified. User can log in.");
      } else {
        console.log("Email is not verified. Please verify your email.");
        router.push("/emailverify");
      }
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (errorCode === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } 
      // else if (errorCode === "auth/invalid-email") {
      //   setError("incorrect email address.");
      // }
      const errorMessage = error.message;
      console.error(errorMessage, "incorrect email or password account.");
      alert("incorrect email or password account.");
    });
}

export function emailVerification() {
  const auth = getAuth(app);
  sendEmailVerification(auth.currentUser as User).then((success) => {
    // Email verification sent!
    console.log(success, "Email verifcation send successfully");
    // ...
  });
}

export function signOutUser(auth: Auth) {
  signOut(auth)
    .then(() => {
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      console.log(error, " An error happened");
      alert("already signin out");
    });
}
