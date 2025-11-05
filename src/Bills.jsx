import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";
import BillForm from "./components/BillForm";
import axios from "axios";
import { IoMdMore } from "react-icons/io";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBill, setEditingBill] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const billsPerPage = 8;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Fetch bills from backend API
  const fetchBills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const email = userData ? JSON.parse(userData).email : null;

      if (!token || !email) {
        console.warn("Missing auth token or user email");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/bill/list`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        setBills(response.data.bills || []);
      } else {
        console.error("Failed to fetch bills:", response.data.message);
        setBills([]);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ✅ Create new bill
  const handleSubmit = async (data, total) => {
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const email = userData ? JSON.parse(userData).email : null;

      if (!token || !email) {
        alert("User not authenticated.");
        setSubmitLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/bill/create`,
        { ...data, total, email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        console.log("Bill created successfully:", response.data.bill);
        setBills((prev) => [response.data.bill, ...prev]);
        setIsOpen(false);
      } else {
        alert(response.data.message || "Failed to create bill.");
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Failed to create bill. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ Edit bill
  const handleEdit = async (billId, updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const email = userData ? JSON.parse(userData).email : null;

      if (!token || !email) {
        alert("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/bill/update/${billId}`,
        { ...updatedData, email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        console.log("Bill updated successfully:", response.data.bill);
        // Update the bill in the local state
        setBills(prevBills =>
          prevBills.map(bill =>
            bill._id === billId ? response.data.bill : bill
          )
        );
        setEditingBill(null);
        setDropdownOpen(null);
      } else {
        alert(response.data.message || "Failed to update bill.");
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      alert("Failed to update bill. Please try again.");
    }
  };

  // ✅ Delete bill
  const handleDelete = async (billId) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const email = userData ? JSON.parse(userData).email : null;

      if (!token || !email) {
        alert("User not authenticated.");
        return;
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/bill/delete/${billId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          data: { email },
        }
      );

      if (response.data.success) {
        console.log("Bill deleted successfully");
        // Remove the bill from the local state
        setBills(prevBills => prevBills.filter(bill => bill._id !== billId));
        setDropdownOpen(null);
      } else {
        alert(response.data.message || "Failed to delete bill.");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("Failed to delete bill. Please try again.");
    }
  };

  // ✅ Open edit modal with bill data
  const openEditModal = (bill) => {
    setEditingBill(bill);
    setIsOpen(true);
    setDropdownOpen(null);
  };

  // ✅ Handle form submission for both create and edit
  const handleFormSubmit = async (data, total) => {
    if (editingBill) {
      await handleEdit(editingBill._id, { ...data, total });
    } else {
      await handleSubmit(data, total);
    }
  };

  // ✅ Close modal and reset editing state
  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingBill(null);
  };

  // ✅ Toggle dropdown
  const toggleDropdown = (billId) => {
    setDropdownOpen(dropdownOpen === billId ? null : billId);
  };

  // ✅ Pagination
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(bills.length / billsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Bills</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Bill
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading bills...</p>
        ) : bills.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">You haven't created any bills yet.</p>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create New Bill
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto min-h-[50vh]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left text-sm">
                    <th className="py-3 px-4 font-medium">Bill ID</th>
                    <th className="py-3 px-4 font-medium">Client</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBills.map((bill, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {bill.billNumber || bill.id}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {bill.clientDetails?.name || bill.client || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{bill.date}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">₹{bill.total}</td>
                      <td
                        className={`py-3 px-4 font-semibold ${
                          bill.status === "Paid"
                            ? "text-green-600"
                            : bill.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {bill.status || "Pending"}
                      </td>
                      <td className="py-3 px-4 relative" ref={dropdownRef}>
                        <button
                          onClick={() => toggleDropdown(bill._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <IoMdMore className="text-gray-600" />
                        </button>
                        
                        {dropdownOpen === bill._id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => openEditModal(bill)}
                              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition rounded-t-lg"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(bill._id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition rounded-b-lg"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={handleCloseModal} 
        title={editingBill ? "Edit Bill" : "Create Bill"}
      >
        <BillForm 
          onSubmit={handleFormSubmit} 
          submitLoading={submitLoading}
          editData={editingBill}
        />
      </Modal>
    </div>
  );
};

export default Bills;