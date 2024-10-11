"use client";

import { auth, signOutUser } from "@/firebase/firebaseauth";
import { saveExpense } from "@/firebase/firebasestore";
import { useState } from "react";
import styles from "./main.module.css";
import React from "react";
import { useRouter } from "next/navigation";
import { authContextData } from "@/context/authContext";


export default function ExpenseForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [optionaNote, setOptionaNote] = useState("");

  const router = useRouter();

  const expenxeListRout = () => {
    router.push("/expenseList");
  };

  const { user } = authContextData()!;

  const handleClick = () => {
    if (user && user.uid) {
      router.push(`/expenseList`);
      console.log(user.uid);
    } else {
      alert("Please log in to view your expenses");
    }
  };

  if (isNaN(amount)) {
    console.log("enter amount", amount);
  }

  return (
    <>
      <html style={{backgroundColor: "#eceff4"}}>
        <body data-theme={"nord"}>
          <div className={styles.hearder}>
            <h1 className={styles.h1}>Expense Tracker</h1>
            <div className={styles.btn_div}>
              <button onClick={handleClick} className="btn btn-outline">
                Your Expense Data
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  signOutUser(auth);
                }}
              >
                Sigin Out
              </button>
            </div>
          </div>

          <div className={styles.second_div}>
            <form className={styles.form}>
              <label htmlFor="Expense">
                {" "}
                <br />
                Expense Name: <br />
                <input
                  className={styles.input_filed}
                  type="text"
                  id="Expense"
                  placeholder="Expense name"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  required
                />
              </label>

              <label htmlFor="number">
                {" "}
                <br />
                Amount: <br />
                <input
                  className={styles.input_filed}
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
            </form>
            <br />
            <br />
            <select
              className="dropdown dropdown-right"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              id="expense-category"
              required
            >
              <option
                tabIndex={0}
                role="button"
                className="btn m-1"
                value="Select Category"
              >
                Select Category
              </option>
              <option
                tabIndex={0}
                role="button"
                className="btn m-1"
                value="food"
              >
                Food
              </option>
              <option
                tabIndex={0}
                role="button"
                className="btn m-1"
                value="Transport"
              >
                Transport
              </option>
              <option
                tabIndex={0}
                role="button"
                className="btn m-1"
                value="Investments"
              >
                Investments
              </option>
              <option
                tabIndex={0}
                role="button"
                className="btn m-1"
                value="education"
              >
                Educations
              </option>
              <option
                tabIndex={0}
                role="button"
                className="btn m-1"
                value="luxuries"
              >
                Luxuries
              </option>
              <option
                tabIndex={0}
                role="button"
                className="btn m-1"
                value="bills"
              >
                Bills
              </option>
              <option
                tabIndex={0}
                role="button"
                className="btn m-1"
                value="Others"
              >
                Other
              </option>
            </select>
            <br />
            <br />
            Optional_note:
            <textarea
              value={optionaNote}
              onChange={(e) => {
                setOptionaNote(e.target.value);
              }}
              id="optinal_note"
              placeholder="Enter your note"
            />
            <br />
            <br />
            <button
              className="btn btn-outline"
              onClick={() => {
                saveExpense(title, amount, category, optionaNote);
                expenxeListRout();
              }}
            >
              Add Expense
            </button>
          </div>
        </body>
      </html>
    </>
  );
}
