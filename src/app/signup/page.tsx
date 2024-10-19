"use client";

import AuthForm from "@/components/authemticationForm";
import { SignupForm } from "@/firebase/firebaseauth";
import { useRouter } from "next/navigation";
// import styles from "../main.module.css";
import React, { useState } from "react";

export default function Home() {
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <>
      <AuthForm
        btnLabel={"Signup"}
        // btnFunc={SignupForm}
        errorMsg={error}
        btnFunc={(email, password) =>
          SignupForm(email, password, router, setError)
        }
        showText={"Already have an account? "}
        loginSignupText={"Login"}
        showMsg={"/login"}
        fogotPassword={""}
      />
    </>
  );
}
