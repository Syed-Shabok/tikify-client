"use client";

import { Card } from "@heroui/react";
import { FaTicketAlt, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Project specific colors for the pie chart
const PIE_COLORS = ["#00ADB5", "#AAFFC7", "#67C090", "#1a3d61", "#452C20"];

export default function RevenueClient({ stats }) {
  const { totalTicketsAdded, totalTicketsSold, totalRevenue, chartData } =
    stats;

  // Custom Tooltip component for Recharts to match Glassmorphism theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#102226]/90 backdrop-blur-xl border border-[#1a3d61] p-4 rounded-xl shadow-xl">
          <p className="text-zinc-300 font-bold text-xs mb-2 uppercase tracking-wider">
            {label || payload[0].name}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm font-black"
              style={{ color: entry.color || "#00ADB5" }}
            >
              {entry.name}:{" "}
              {entry.name.includes("Revenue")
                ? `৳${entry.value.toLocaleString()}`
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#102226]/40 backdrop-blur-xl border border-[#1a3d61] p-6 rounded-3xl shadow-xl flex flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <FaTicketAlt size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">
              Total Listed
            </p>
            <p className="text-3xl font-black text-white">
              {totalTicketsAdded}
            </p>
          </div>
        </Card>

        <Card className="bg-[#102226]/40 backdrop-blur-xl border border-[#1a3d61] p-6 rounded-3xl shadow-xl flex flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#AAFFC7]/10 border border-[#AAFFC7]/20 flex items-center justify-center text-[#AAFFC7] shrink-0">
            <FaChartLine size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">
              Tickets Sold
            </p>
            <p className="text-3xl font-black text-white">{totalTicketsSold}</p>
          </div>
        </Card>

        <Card className="bg-[#102226]/40 backdrop-blur-xl border border-[#1a3d61] p-6 rounded-3xl shadow-xl flex flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00ADB5]/10 border border-[#00ADB5]/20 flex items-center justify-center text-[#00ADB5] shrink-0">
            <FaMoneyBillWave size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">
              Total Revenue
            </p>
            <p className="text-3xl font-black text-[#00ADB5]">
              ৳{totalRevenue.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Bar Chart */}
          <Card className="bg-[#102226]/40 backdrop-blur-xl border border-[#1a3d61] p-6 rounded-3xl shadow-xl">
            <h3 className="text-sm font-black uppercase text-zinc-300 tracking-widest mb-6">
              Revenue by Route
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1a3d61"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#52525b"
                    fontSize={10}
                    tickFormatter={(value) => value.substring(0, 10) + "..."}
                  />
                  <YAxis
                    stroke="#52525b"
                    fontSize={10}
                    tickFormatter={(value) => `৳${value}`}
                  />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#1a3d61", opacity: 0.4 }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#00ADB5"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Sales Distribution Pie Chart */}
          <Card className="bg-[#102226]/40 backdrop-blur-xl border border-[#1a3d61] p-6 rounded-3xl shadow-xl">
            <h3 className="text-sm font-black uppercase text-zinc-300 tracking-widest mb-6">
              Sales Volume Distribution
            </h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="ticketsSold"
                    nameKey="name"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-[#1a3d61] rounded-3xl bg-[#124170]/5 h-[400px]">
          <p className="text-zinc-400 font-bold uppercase tracking-widest">
            No Sales Data Yet
          </p>
          <p className="text-sm text-zinc-500 font-medium mt-2">
            Charts will generate automatically once tickets are sold.
          </p>
        </div>
      )}
    </div>
  );
}
