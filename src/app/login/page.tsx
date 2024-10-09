"use client";

import AuthForm from "@/components/authemticationForm";
import { loginForm } from "@/firebase/firebaseauth";
// import styles from "../main.module.css";
import React from "react";


export default function Home() {


  return (
    <>
        <AuthForm 
        btnLabel={"Login"}
        btnFunc={loginForm}
        showText={"Doest not have an account?"}
        loginSignupText={"Signup"}
        showMsg={"/signup"}
        fogotPassword={"forgot Password"}
        /> 
    </>
  );
}