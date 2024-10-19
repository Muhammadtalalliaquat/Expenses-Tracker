"use client";

import { saveExpense } from "@/firebase/firebasestore";
import { useState } from "react";
import React from "react";
// import { useRouter } from "next/navigation";
import Navbar from "./navbarContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import styles from "../components/main.module.css";


export default function ExpenseForm({ router }: { router: AppRouterInstance }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [optionaNote, setOptionaNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title || !amount || !category) {
      setError("Make sure to fill in all the necessary fields.");
      console.log("Error: All fields are required.");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      console.log("Error: Invalid amount");
      return;
    }

    setError(null);

    saveExpense(title, amount, category, optionaNote);
    router.push("/expenseList");
  };

  

  return (
    <>
      <html style={{ backgroundColor: "#212121" }}>
        <body data-theme={"halloween"}>
          <Navbar /> 
          <br />
          <h1 style={{fontWeight:  "bolder" , fontSize: "15px" , textAlign: "center"}}>Add Expense</h1>
          <br />
          <div className={styles.conatiner} >
          <div className="flex items-center flex-col">
            <form>
              Title:{" "}
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  id="Expense"
                  placeholder="Expense name"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <br />
              Amount:{" "}
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="number"
                  id="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(parseFloat(e.target.value));
                  }}
                  required
                />
              </label>
              <br />
              Categories:
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                id="expense-category"
                required
                className="select select-bordered w-full max-w-xs"
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="food">Food</option>
                <option value="Investments">Investments</option>
                <option value="Transport">Transport</option>
                <option value="education">Education</option>
                <option value="luxuries">Luxuries</option>
                <option value="bills">Bills</option>
                <option value="rent">Rent</option>
                <option value="Others">Others</option>
              </select>
              <br />
              <br />
              <textarea
                value={optionaNote}
                onChange={(e) => {
                  setOptionaNote(e.target.value);
                }}
                id="optinal_note"
                style={{ width: "100%" }}
                className="textarea input-bordered"
                placeholder="Optional_Note"
              ></textarea>
              <br />
              {error && <p style={{ color: "red" , textAlign: "center" , fontSize: "13px" }}>{error}</p>}
              <br />
              <button
                type="button"
                style={{ width: "100%" }}
                className="btn btn-outline"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Add Expense
              </button>
            </form>
          </div>
          </div>
        </body>
      </html>
    </>
  );
}
