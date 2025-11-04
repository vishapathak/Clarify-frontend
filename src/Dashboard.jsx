import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Card from "./components/Card";

// Sample data for LineChart
const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 7000 },
];

// Summary stats
const stats = [
  { title: "Users", value: "1K+", link: "#" },
  { title: "Orders", value: "250+", link: "#" },
  { title: "Revenue", value: "₹50K", link: "#" },
  { title: "Products", value: "45+", link: "#" },
];

// Sample data for PieChart
const userData = [
  { name: "Active", value: 70 },
  { name: "Inactive", value: 30 },
];

const COLORS = ["#2563eb", "#93c5fd"];

// Dummy records for tabs
const dummyData = {
  invoices: [
    { id: "INV001", date: "2025-02-01", amount: "₹12,500", status: "Paid" },
    { id: "INV002", date: "2025-02-12", amount: "₹8,300", status: "Pending" },
    { id: "INV003", date: "2025-03-03", amount: "₹15,200", status: "Paid" },
    { id: "INV004", date: "2025-03-18", amount: "₹6,900", status: "Pending" },
    { id: "INV005", date: "2025-04-02", amount: "₹10,000", status: "Paid" },
  ],
  bills: [
    { id: "BILL001", date: "2025-01-05", amount: "₹4,000", status: "Paid" },
    { id: "BILL002", date: "2025-01-22", amount: "₹2,800", status: "Overdue" },
    { id: "BILL003", date: "2025-02-10", amount: "₹3,600", status: "Paid" },
    { id: "BILL004", date: "2025-03-02", amount: "₹1,900", status: "Pending" },
    { id: "BILL005", date: "2025-04-15", amount: "₹2,400", status: "Paid" },
  ],
  quotations: [
    { id: "QUO001", date: "2025-01-15", amount: "₹5,000", status: "Sent" },
    { id: "QUO002", date: "2025-02-05", amount: "₹7,200", status: "Accepted" },
    { id: "QUO003", date: "2025-02-22", amount: "₹4,300", status: "Declined" },
    { id: "QUO004", date: "2025-03-11", amount: "₹6,800", status: "Accepted" },
    { id: "QUO005", date: "2025-03-29", amount: "₹9,000", status: "Sent" },
  ],
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("invoices");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              value={item.value}
              link={item.link}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Monthly Sales Trend
            </h2>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              User Distribution
            </h2>
            <div className="w-full h-64 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {userData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Your Records
            </h2>
            <div className="flex lg:justify-end gap-1 lg:gap-3 ">
              {["invoices", "bills", "quotations"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 lg:px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyData[activeTab].map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-3 font-medium text-gray-800">{item.id}</td>
                    <td className="p-3 text-gray-600">{item.date}</td>
                    <td className="p-3 text-gray-800">{item.amount}</td>
                    <td
                      className={`p-3 font-semibold ${
                        item.status === "Paid" || item.status === "Accepted"
                          ? "text-green-600"
                          : item.status === "Pending" || item.status === "Sent"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
