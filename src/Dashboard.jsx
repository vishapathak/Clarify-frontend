import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import axios from "axios";
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

// Chart constants
const COLORS = ["#2563eb", "#93c5fd"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [records, setRecords] = useState({
    invoices: [],
    bills: [],
    quotations: [],
  });
  const [loading, setLoading] = useState(false);

  // Dummy chart + summary data
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 7000 },
  ];
  const stats = [
    { title: "Users", value: "1K+", link: "#" },
    { title: "Orders", value: "250+", link: "#" },
    { title: "Revenue", value: "₹50K", link: "#" },
    { title: "Products", value: "45+", link: "#" },
  ];
  const userData = [
    { name: "Active", value: 70 },
    { name: "Inactive", value: 30 },
  ];

  // ✅ Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail"); // or from context

      try {
        const base = process.env.REACT_APP_BACKEND_URL;
        const [invoiceRes, billRes, quotationRes] = await Promise.all([
          axios.post(`${base}/invoice/list`, { email }, { headers: { Authorization: token } }),
          axios.post(`${base}/bill/list`, { email }, { headers: { Authorization: token } }),
          axios.post(`${base}/quotation/list`, { email }, { headers: { Authorization: token } }),
        ]);

        setRecords({
          invoices: invoiceRes.data.invoices || [],
          bills: billRes.data.bills || [],
          quotations: quotationRes.data.quotations || [],
        });
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentTabData = records[activeTab] || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => (
            <Card key={index} title={item.title} value={item.value} link={item.link} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Sales Trend</h2>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Pie */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">User Distribution</h2>
            <div className="w-full h-64 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 lg:mb-0">Your Records</h2>
            <div className="flex gap-2">
              {["invoices", "bills", "quotations"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
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

          {/* Table */}
          {loading ? (
            <p className="text-center text-gray-500 py-6">Loading data...</p>
          ) : currentTabData.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No records found for {activeTab}.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3">ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTabData.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition duration-150">
                      <td className="p-3 font-medium text-gray-800">{item.invoiceNumber || item.billNumber || item.quotationNumber}</td>
                      <td className="p-3 text-gray-600">{item.date || "N/A"}</td>
                      <td className="p-3 text-gray-800">₹{item.total || item.amount}</td>
                      <td className="p-3 font-semibold text-blue-600">{item.status || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
