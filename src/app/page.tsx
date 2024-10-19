"use client";

import ExpenseForm from "@/components/expenseTracker";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <ExpenseForm router={router} />
    </>
  );
}
