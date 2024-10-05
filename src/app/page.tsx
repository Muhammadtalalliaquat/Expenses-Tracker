"use client";

import { authContextData } from "@/context/authContext";
import { useRouter } from "next/navigation";
import styles from "./main.module.css";
import { auth, signOutUser } from "@/firebase/firebaseauth";

export default function Home() {

    const{ user} = authContextData()!;
    const router = useRouter();

    
  return (
    <>
        <div className={styles.container}>
                <h1 className={styles.h1}>Welcome to our website!</h1>
                <button onClick={()=>{signOutUser(auth)}}>Signin out</button> 
        </div>
    </>
  );
}
