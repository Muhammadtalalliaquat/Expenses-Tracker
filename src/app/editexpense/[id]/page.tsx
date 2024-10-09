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
import styles from "../../../components/main.module.css";
import { auth, signOutUser } from "@/firebase/firebaseauth";
// import { saveExpense } from "@/firebase/firebasestore";

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
  // const [error, setError] = useState<string | null>(null);
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
  const router = useRouter();

  if (isNaN(amount)) {
    console.log("enter amount", amount);
  }
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
            // setError("Expense not found");
            console.log("Expense not found");
          }
        } catch (error) {
          // setError("Failed to fetch expense");
          console.error(error, "Failed to fetch expense");
        } finally {
          // setLoading(false);
        }
      };

      fetchExpense();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
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
      <html style={{ backgroundColor: "#eceff4" }}>
        <body data-theme={"nord"}>
          <div>
            <div className={styles.hearder} data-theme={"nord"}>
              <h1 className={styles.h1}>Expense Tracker</h1>
              <button
                className="btn btn-outline"
                onClick={() => {
                  signOutUser(auth);
                }}
              >
                Sigin Out
              </button>
            </div>
            <div className={styles.second_div}>
              <form className={styles.form} action="">
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
                  disabled
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
                value={optionalNote}
                onChange={(e) => {
                  setOptionalNote(e.target.value);
                }}
                id="optinal_note"
                placeholder="Enter your note"
              />
              <br />
              <br />
              <button
                onClick={handleSubmit}
                className="btn btn-outline"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Expense"}
              </button>
            </div>
          </div>
        </body>
      </html>
    </>
  );
}
