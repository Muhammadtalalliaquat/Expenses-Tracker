"use client";

import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { app } from "@/firebase/firebaseconfig";
import Navbar from "@/components/navbarContext";
import styles from "../../../components/main.module.css"

const db = getFirestore(app);

type ExpenseType = {
  title: string;
  amount: number;
  category: string;
  optionalNote: string;
  lastEditedAt?: Date;
};

export default function aditExpneseData({
  params: { id },
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [expense, setExpense] = useState<ExpenseType | null>(null);
  // const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [title, setTitle] = useState<string>("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [amount, setAmount] = useState<number>(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [category, setCategory] = useState("None");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [optionalNote, setOptionalNote] = useState<string>("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [msgError, setMsgError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (id) {
      const fetchExpense = async () => {
        try {
          const expenseRef = doc(db, "expenses", id as string);
          const expenseSnap = await getDoc(expenseRef);
          if (expenseSnap.exists()) {
            const expenseData = expenseSnap.data() as ExpenseType; 
            setExpense(expenseData);
            setTitle(expenseData.title);
            setAmount(expenseData.amount);
            setCategory(expenseData.category);
            setOptionalNote(expenseData.optionalNote || "");
            console.log(expenseData);
          } else {
            setError("Expense not found");
            console.log(error, "Expense not found");
          }
        } catch (error) {
          setError("Failed to fetch expense");
          console.error(error, "Failed to fetch expense");
        } finally {
          // setLoading(false);
        }
      };

      fetchExpense();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    if (!title || !amount || !category) {
      setMsgError("Make sure to fill in all the necessary fields.");
      console.log(msgError, "Error: All fields are required.");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      console.log("Error: Invalid amount");
      return;
    }
    setMsgError(null);
    e.preventDefault();
    setIsSubmitting(true);
    if (title && amount && category !== "Select" && optionalNote) {
      if (expense) {
        try {
          const expenseRef = doc(db, "expenses", id as string);
          await updateDoc(expenseRef, {
            title,
            amount,
            category,
            optionalNote,
            lastEditedAt: serverTimestamp(),
          });
          console.log("Expense updated successfully");
          router.push("/expenseList");
        } catch (error) {
          // setError("Failed to update expense");
          console.error(error, "Failed to update expense");
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      console.log("Please enter full information");
      setIsSubmitting(false);
    }
  }

  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>{error}</p>;

  return (
    <>
      <html style={{ backgroundColor: "#212121" }}>
        <body data-theme={"halloween"}>
          <Navbar />
          <br />
          <h1 style={{fontWeight:  "bolder" , fontSize: "15px", textAlign: "center"}}>Edit Expense</h1>
          <div className={styles.conatiner}>
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
                value={optionalNote}
                onChange={(e) => {
                  setOptionalNote(e.target.value);
                }}
                id="optinal_note"
                style={{ width: "100%" }}
                className="textarea input-bordered"
                placeholder="Optional_Note"
              ></textarea>
              <br />
              <br />
              <button
                style={{ width: "100%" }}
                onClick={handleSubmit}
                className="btn btn-outline"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Expense"}
              </button>
            </form>
          </div>
          </div>
        </body>
      </html>
    </>
  );
}
