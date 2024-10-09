"use client";

import { auth, signOutUser } from "@/firebase/firebaseauth";
import { app } from "@/firebase/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import React from "react";
import styles from "../expenseList/main.module.css";

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
import { useRouter } from "next/navigation";
import Link from "next/link";

const db = getFirestore(app);

type userType = {
  email: string | null;
  uid: string;
  emailVerified: boolean;
};

export default function expenseListData() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const expenxeListRout = () => {
    router.push("/");
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [expenseList, setExpenseList] = useState<DocumentData[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user, setUser] = useState<null | userType>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const detchOnAuthSateListner = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchExpnseRealTime(currentUser.uid);
        setUser(currentUser);
        console.log(user)
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

  return (
    <>
      <html style={{ backgroundColor: "#eceff4" }}>
        <body data-theme={"nord"}>
          <div className={styles.hearder}>
            <h1 className={styles.h1}>Your Expense List</h1>
            <div className={styles.div}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  expenxeListRout();
                }}
              >
                Add Expense
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

          <br />
          <br />

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Title</th>
                  <th className={styles.th}>Amount</th>
                  <th className={styles.th}>Categories</th>
                  <th className={styles.th}>Optional Note</th>
                  <th className={styles.th}>Modified data</th>
                  <th className={styles.th}>Remove data</th>
                </tr>
              </thead>
              <tbody>
                {expenseList.length > 0 ? (
                  expenseList.map(
                    ({ title, amount, category, optionalNote, id }) => (
                      <tr className={styles.tr} key={category + id}>
                        <td className={styles.td}>{title}</td>
                        <td className={styles.td}>{amount}</td>
                        <td className={styles.td}>{category}</td>
                        <td className={styles.td}>{optionalNote}</td>
                        <td className={styles.td}>
                          <Link href={`/editexpense/${id}`}>
                            <button>Edited</button>
                          </Link>
                        </td>
                        <td className={styles.td}>
                          <button onClick={() => delectExpenseList(id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <>
                    <tr>
                      <td colSpan={6}>No expenses found.</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    </>
  );
}
