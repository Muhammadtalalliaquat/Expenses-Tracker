"use client";

import { authContextData } from "@/context/authContext";
import { auth, signOutUser } from "@/firebase/firebaseauth";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user } = authContextData()!;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const pathname = usePathname();

  
  const handleNavigate = () => {
    if (user) {
      if (pathname === "/") {
        router.push("/expenseList");
      } else if (pathname === "/expenseList") {
        router.push("/");
      } else {
        router.push("/");
      }
    } else {
      alert("Please log in to view your expenses");
    }
  };

  const expense_chart_Route = () => {
    if (user) {
      if (pathname === "/expense_chart") {
        router.push("/expenseList");
      } else {
        router.push("/expense_chart");
      }
    } else {
      alert("Please log in to view your expenses");
    }
  };

  return (
    <>
      <div data-theme={"nord"} className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={handleNavigate}>
                  {pathname === "/" ? "Your Expense List" : "Add Expense"}
                </a>
              </li>
              <li>
                <a onClick={expense_chart_Route}>
                  {pathname === "/expense_chart"
                    ? "Your Expense List"
                    : "Expense Graph"}
                </a>
              </li>

              {/* <li>
                <a>About</a>
              </li> */}
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">Expense Tracker</a>
        </div>
        <div className="navbar-end">
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
    </>
  );
}
