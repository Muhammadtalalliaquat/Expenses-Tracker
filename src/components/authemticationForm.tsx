"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseauth";
// import dbUser from "@/firebase/firebasestore";
import React from "react";

type btnLabelType = {
  btnLabel: string;
  showText: string;
  showMsg: string;
  loginSignupText: string;
  fogotPassword: string;
  btnFunc: (email: string, password: string) => void;
};

export default function AuthForm({
  btnLabel,
  showMsg,
  loginSignupText,
  showText,
  fogotPassword,
  btnFunc,
}: btnLabelType) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  // const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = [];

    if (!email.includes("@")) {
      newErrors.push("Please enter a valid email.");
    }
    if (password.length < 6) {
      newErrors.push("Password must be at least 6 characters.");
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (newErrors.length === 0) {
      console.log("Form submitted successfully!");
      setErrors([]);
    } else {
      setErrors(newErrors);
    }
  };

  const linkPush = () => {
    router.push(showMsg);
  };

  const handleResetPassword = () => {
    try {
      sendPasswordResetEmail(auth, email);
      setMessage("Password reset! Check your inbox.");
      // setError("");
    } catch (error) {
      setMessage("");
      // setError("Failed to send password reset email. Please try again.");
      console.error("Error sending password reset email:", error);
    }
  };

  return (
    <>
      <html data-theme={"light"}>
        <body>
          <div className="main-container">
            <div className="container">
              <h1 className="h1-heedaing">{btnLabel}</h1>

              <form onSubmit={handleSubmit} className="form">
                <label htmlFor="email">
                  Email:
                  <br />{" "}
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                </label>

                <br />

                <label htmlFor="password">
                  Password:
                  <br />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                </label>
                {errors.length > 0 && (
                  <ul className="error">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
                <span
                  style={{
                    color: "grey",
                    margin: "5px",
                    fontSize: "11px",
                    textAlign: "center",
                  }}
                >
                  {message}
                </span>
                <a
                  className="resetPasswordtext"
                  onClick={handleResetPassword}
                  href="#"
                >
                  {" "}
                  {fogotPassword}
                </a>

                <p className="show-text">
                  {showText}{" "}
                  <a href="#" onClick={linkPush}>
                    {loginSignupText}
                  </a>
                </p>

                <button
                  type="submit"
                  className="funct-btn"
                  onClick={() => {
                    btnFunc(email, password);
                  }}
                >
                  {btnLabel}
                </button>
              </form>
            </div>
          </div>
        </body>
      </html>
    </>
  );
}
