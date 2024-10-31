"use client";

// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import styles from "../components/main.module.css"


// type ExpenseChartData = {
//   name: string;
//   uv: number;
// };

// type ExpenseChartProps = {
//   expenseChartData: ExpenseChartData[];
// };

// export default function ExpenseChart({ expenseChartData }: ExpenseChartProps) {
//   return (
//     <>
//       <div className={styles.chartContainer}>
//         <AreaChart
//           width={430}
//           height={250}
//           data={expenseChartData}
//           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//         >
//           <defs>
//             <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
//               <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <XAxis dataKey="name" />
//           <YAxis />
//           <CartesianGrid strokeDasharray="3 3" />
//           <Tooltip />
//           <Area
//             type="monotone"
//             dataKey="uv"
//             stroke="#8884d8"
//             fillOpacity={1}
//             fill="url(#colorUv)"
//           />
//         </AreaChart>
//       </div>
//     </>
//   );
// }





import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type ExpenseChartData = {
  name: string;
  value: number;
};

type ExpenseChartProps = {
  expenseChartData: ExpenseChartData[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Main ExpenseChart component class
export default class ExpenseChart extends PureComponent<ExpenseChartProps> {
  render() {
    const { expenseChartData } = this.props;

    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={expenseChartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {expenseChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}




