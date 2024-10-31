"use client";

import ExpenseChart from "@/components/expenseChart";
import { auth } from "@/firebase/firebaseauth";
import { app } from "@/firebase/firebaseconfig";
import Navbar from "./../../components/navbarContext";

import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
const db = getFirestore(app);

type Expense = {
  id: string;
  title: string;
  amount: string; 
  category: string;
  optionalNote?: string;
};

type userType = {
  email: string | null;
  uid: string;
  emailVerified: boolean;
};

export default function expenseChartFetchData() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user, setUser] = useState<null | userType>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (user) {
      const collectionRef = collection(db, "expenses");
      const q = query(collectionRef, where("uid", "==", user.uid));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const expenses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];

        const formattedData = expenses.map((expense) => ({
          name: expense.category || "Unknown",
          value: parseFloat(expense.amount) || 0,
        }));

        setChartData(formattedData);
      });
      return () => unsubscribe();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <html style={{ backgroundColor: "#212121" }}>
        <body data-theme={"halloween"}>
          <Navbar />
          <div>
            <h1
              style={{
                fontWeight: "bolder",
                textAlign: "center",
                fontSize: "22px",
                margin: "35px",
              }}
            >
              Expense Chart
            </h1>
            {chartData.length > 0 ? (
              <ExpenseChart expenseChartData={chartData} />
            ) : (
              <p
                style={{
                  fontWeight: "bolder",
                  textAlign: "center",
                  fontSize: "10px",
                  margin: "35px",
                }}
              >
                No data available for chart.
              </p>
            )}
          </div>
        </body>
      </html>
    </>
  );
}


