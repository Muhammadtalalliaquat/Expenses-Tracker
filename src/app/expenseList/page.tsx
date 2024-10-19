"use client";

import { auth } from "@/firebase/firebaseauth";
import { app } from "@/firebase/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import React from "react";
import Navbar from "./../../components/navbarContext";

import {
  collection,
  DocumentData,
  getFirestore,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { delectExpenseList } from "@/firebase/firebasestore";
import Link from "next/link";

const db = getFirestore(app);

type userType = {
  email: string | null;
  uid: string;
  emailVerified: boolean;
};

export default function expenseListData() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [expenseList, setExpenseList] = useState<DocumentData[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user, setUser] = useState<null | userType>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [filterCategory, setFilterCategory] = useState("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [sortedExpenses, setSortedExpenses] = useState<DocumentData[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const detchOnAuthSateListner = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchExpnseRealTime(currentUser.uid);
        setUser(currentUser);
        console.log(user);
      } else {
        setUser(null);
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

  const fetchExpnseRealTime = (userId: string) => {
    const collectionRef = collection(db, "expenses");
    // const currentUser = auth.currentUser?.uid;
    const condition = where("uid", "==", userId);
    const q = query(collectionRef, condition);

    const allExpnseClone = [...expenseList];

    readRealTimeListner = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const expensesData = change.doc.data();
          expensesData.id = change.doc.id;
          allExpnseClone.push(expensesData);
          setExpenseList([...allExpnseClone]);
          console.log(change.type, allExpnseClone, "inside home");
        }
        if (change.type === "modified") {
          const expensesData = change.doc.data();
          expensesData.id = change.doc.id;

          const indexToUpdate = allExpnseClone.findIndex(
            (expense) => expense.id === expensesData.id
          );

          if (indexToUpdate !== -1) {
            allExpnseClone[indexToUpdate] = expensesData;
            setExpenseList([...allExpnseClone]);
          }
          console.log("Modified data", allExpnseClone);
        }

        if (change.type === "removed") {
          const expensesData = change.doc.data();
          expensesData.id = change.doc.id;

          const indexToRemove = allExpnseClone.findIndex(
            (expense) => expense.id === expensesData.id
          );

          if (indexToRemove !== -1) {
            allExpnseClone.splice(indexToRemove, 1);
            setExpenseList([...allExpnseClone]);
          }

          console.log("Removed data:", expensesData);
        }
      });
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const filtered = expenseList.filter((expense) =>
      filterCategory ? expense.category === filterCategory : true
    );
    setSortedExpenses(filtered);
    fetchData();
  }, [filterCategory, expenseList]);

  const sortByPrice = () => {
    const sorted = [...sortedExpenses].sort((a, b) => b.amount - a.amount);
    setSortedExpenses(sorted);
  };

  const totalAmount = expenseList.reduce((acc, expense) => {
    const amount = parseFloat(expense.amount) || 0;
    return acc + amount;
  }, 0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const TotalAmountFeature = () => {
    const userId = "user-id";
    const q = query(collection(db, "expenses"), where("uid", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenseList(expenses);
    });

    return () => unsubscribe();
  };

  const fetchData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div className="loader" style={{ fontSize: "24px" }}>
            Loading expenses...
          </div>
        </div>
      ) : (
        <html style={{ backgroundColor: "#212121" }}>
          <body data-theme={"halloween"}>
            <Navbar />

            <div
              style={{
                fontSize: "13px",
                width: "98%",
                margin: "0 auto",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <p
                style={{
                  backgroundColor: "yellow",
                  color: "grey",
                  padding: "5px",
                  borderRadius: "10px",
                }}
              >
                Total Amount{" "}
              </p>
              <strong style={{ padding: "5px" }}>
                {totalAmount.toFixed(2)}
              </strong>
            </div>
            <br />
            <div>
              <label
                style={{ marginLeft: "10px", fontWeight: "bolder" }}
                htmlFor="filterCategory"
              >
                Filter by Category:{" "}
              </label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="">All Categories</option>
                <option value="food">Food</option>
                <option value="Investments">Investments</option>
                <option value="Transport">Transport</option>
                <option value="education">Education</option>
                <option value="luxuries">Luxuries</option>
                <option value="bills">Bills</option>
                <option value="rent">Rent</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <br />

            <div style={{ marginLeft: "10px" }}>
              <button onClick={sortByPrice} className="btn btn-outline">
                Sort by Amount (High to Low)
              </button>
            </div>

            <br />

            <div
              className="expense-cards-container"
              style={{ width: "95%" , margin: "0 auto"}}
            >
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map(
                  ({ title, amount, category, optionalNote, id }, index) => (
                    <div
                      key={id}
                      className="expense-card"
                      style={{
                        backgroundColor: "#eceff4",
                        border: "1px solid grey",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        padding: "15px",
                        color: "black",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#e38109", paddingBottom: "10px" }}>
                          {index + 1}. Title {title}
                        </h3>
                        <span style={{ color: "#418247", fontWeight: "bold" }}>
                          ${amount}
                        </span>
                      </div>
                      <div style={{ marginTop: "5px", fontSize: "14px" }}>
                        <p>
                          <strong>Category:</strong> {category}
                        </p>
                        <p style={{marginTop: "9px"}}>
                          <strong>Note:</strong>{" "}
                          {optionalNote || "No additional notes"}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          gap: "6px",
                          marginTop: "10px",
                        }}
                      >
                        <Link href={`/editexpense/${id}`}>
                          <button
                            className="btn btn-outline btn-primary"
                            style={{ fontSize: "12px" }}
                          >
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => delectExpenseList(id)}
                          className="btn btn-outline btn-error"
                          style={{ fontSize: "12px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                  }}
                >
                  No expenses found for the selected category.
                </div>
              )}
            </div>

            {/* <div className="overflow-x-auto">
              <table
                style={{
                  textAlign: "center",
                  borderSpacing: "3px",
                  borderCollapse: "separate",
                  width: "99%",
                  margin: "0 auto",
                }}
                className="table table-xs table-pin-rows table-pin-cols"
              >
                <thead>
                  <tr style={{ border: "1px solid grey" }}>
                    <th style={{ border: "1px solid grey" }}>Sr. No.</th>
                    <th style={{ border: "1px solid grey" }}>Title</th>
                    <th style={{ border: "1px solid grey" }}>Amount</th>
                    <th style={{ border: "1px solid grey" }}>Categories</th>
                    <th style={{ border: "1px solid grey" }}>Optional Note</th>
                    <th style={{ border: "1px solid grey" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map(
                    ({ title, amount, category, optionalNote, id }, index) => (
                      <tr
                        key={id}
                        style={{
                          backgroundColor: "#eceff4",
                          borderBottom: "1px solid grey",
                          color: "black",
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>{title}</td>
                        <td style={{ color: "#418247" }}>{amount}</td>
                        <td>{category}</td>
                        <td>{optionalNote}</td>
                        <td>
                          <Link href={`/editexpense/${id}`}>
                            <button
                              className="btn btn-outline btn-primary"
                              style={{ margin: "4px", fontSize: "10px" }}
                            >
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => delectExpenseList(id)}
                            className="btn btn-outline btn-error"
                            style={{ fontSize: "10px" }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                  {sortedExpenses.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        No expenses found for the selected category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> */}
          </body>
        </html>
      )}
    </>
  );
}
