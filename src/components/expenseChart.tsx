"use client";

import React, { PureComponent } from 'react';
import { Tooltip, AreaChart, XAxis, YAxis, CartesianGrid, Area } from 'recharts';
import styles from "../components/main.module.css";

type ExpenseChartData = {
  name: string;
  value: number;
};

type ExpenseChartProps = {
  expenseChartData: ExpenseChartData[];
};

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
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
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
            label={renderCustomizedLabel}
          />
        </AreaChart>
      </div>
    );
  }
}





