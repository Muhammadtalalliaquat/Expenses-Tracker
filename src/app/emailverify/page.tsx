"use client";

import { useEffect } from "react";
import styles from "../main.module.css";
import { auth } from "@/firebase/firebaseauth";
import { useRouter } from "next/navigation";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/firebase/firebaseconfig";
import { authContextData } from "@/context/authContext";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import React from "react";
import Link from "next/link";
const db = getFirestore(app);

export default function emailVerification() {
  const { user } = authContextData()!;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  // useEffect(() => {
  //     const checkEmailVerification = () => {
  //         const user = auth.currentUser;
  //         if (user) {
  //             user.reload().then(() => {
  //                 if (user.emailVerified) {
  //                     router.push("/");
  //                 }
  //             });
  //         }
  //     };

  //     const intervalId = setInterval(checkEmailVerification, 2000);

  //     return () => clearInterval(intervalId);
  // }, [auth, router]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const detchOnAuthSateListner = onAuthStateChanged(auth, (user) => {
      if (user) {
        userVerify();
      }
    });

    return () => {
      if (readRealTimeListner) {
        console.log("Component Unmount");
        readRealTimeListner();
        detchOnAuthSateListner();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let readRealTimeListner: Unsubscribe;

  const userVerify = () => {
    const collectionRef = collection(db, "users");
    const currentUser = auth.currentUser?.uid;
    const condition = where("uid", "==", currentUser);

    const q = query(collectionRef, condition);

    readRealTimeListner = onSnapshot(q, (UserSnapshot) => {
      UserSnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
        }
        if (change.doc.exists()) {
          const userData = change.doc.data();
          if (userData.emailVerified) {
            // Redirect to home page
            // router.push("/");
            router.push("/expenseList");

          }
        }
        if (change.type === "removed") {
        }
      });
    });
  };

  return (
    <>
      <div className={styles.div}>
        <h2>Check Your Inbox!</h2>
        <br />
        <p>Please verify your email</p>
        <span style={{color: "blue"}}><Link href="https://mail.google.com/mail/u/0/#inbox">{user?.email}</Link></span>
      </div>
    </>
  );
}
