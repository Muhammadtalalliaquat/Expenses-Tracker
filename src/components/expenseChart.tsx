"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "../components/main.module.css"


type ExpenseChartData = {
  name: string;
  uv: number;
};

type ExpenseChartProps = {
  expenseChartData: ExpenseChartData[];
};
export default function ExpenseChart({ expenseChartData }: ExpenseChartProps) {
  return (
    <>
      <div className={styles.chartContainer}>
        <AreaChart
          width={430}
          height={250}
          data={expenseChartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </div>
    </>
  );
}
