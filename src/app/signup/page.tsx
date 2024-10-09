"use client";

import AuthForm from "@/components/authemticationForm";
import { SignupForm } from "@/firebase/firebaseauth";
// import styles from "../main.module.css";
import React from "react";


export default function Home() {

  return (
    <>
        <AuthForm 
        btnLabel={"Signup"}
        btnFunc={SignupForm}
        showText={"Already have an account? "}
        loginSignupText={"Login"}
        showMsg={"/login"} 
        fogotPassword={""}  /> 
    </>
  );
}