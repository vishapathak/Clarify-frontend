import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";
import QuotationForm from "./components/QuotationForm";
import { IoMdMore } from "react-icons/io";
import axios from "axios";

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const quotationsPerPage = 8;

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

  // ✅ Fetch quotations from backend
  const fetchQuotations = async () => {
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
        `${process.env.REACT_APP_BACKEND_URL}/quotation/list`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        setQuotations(response.data.quotations || []);
      } else {
        console.error("Failed to fetch quotations:", response.data.message);
        setQuotations([]);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // ✅ Create new quotation
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
        `${process.env.REACT_APP_BACKEND_URL}/quotation/create`,
        { ...data, total, email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        console.log("Quotation created successfully:", response.data.quotation);
        setQuotations((prev) => [response.data.quotation, ...prev]);
        setIsOpen(false);
      } else {
        alert(response.data.message || "Failed to create quotation.");
      }
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Failed to create quotation. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ Edit quotation
  const handleEdit = async (quotationId, updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const email = userData ? JSON.parse(userData).email : null;

      if (!token || !email) {
        alert("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/quotation/${quotationId}`,
        { ...updatedData, email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        console.log("Quotation updated successfully:", response.data.quotation);
        // Update the quotation in the local state
        setQuotations(prevQuotations =>
          prevQuotations.map(quotation =>
            quotation._id === quotationId ? response.data.quotation : quotation
          )
        );
        setEditingQuotation(null);
        setDropdownOpen(null);
        setIsOpen(false);
      } else {
        alert(response.data.message || "Failed to update quotation.");
      }
    } catch (error) {
      console.error("Error updating quotation:", error);
      alert("Failed to update quotation. Please try again.");
    }
  };

  // ✅ Delete quotation
  const handleDelete = async (quotationId) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) {
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
        `${process.env.REACT_APP_BACKEND_URL}/quotation/${quotationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          data: { email },
        }
      );

      if (response.data.success) {
        console.log("Quotation deleted successfully");
        // Remove the quotation from the local state
        setQuotations(prevQuotations => 
          prevQuotations.filter(quotation => quotation._id !== quotationId)
        );
        setDropdownOpen(null);
      } else {
        alert(response.data.message || "Failed to delete quotation.");
      }
    } catch (error) {
      console.error("Error deleting quotation:", error);
      alert("Failed to delete quotation. Please try again.");
    }
  };

  // ✅ Open edit modal with quotation data
  const openEditModal = (quotation) => {
    setEditingQuotation(quotation);
    setIsOpen(true);
    setDropdownOpen(null);
  };

  // ✅ Handle form submission for both create and edit
  const handleFormSubmit = async (data, total) => {
    if (editingQuotation) {
      await handleEdit(editingQuotation._id, { ...data, total });
    } else {
      await handleSubmit(data, total);
    }
  };

  // ✅ Close modal and reset editing state
  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingQuotation(null);
  };

  // ✅ Toggle dropdown
  const toggleDropdown = (quotationId) => {
    setDropdownOpen(dropdownOpen === quotationId ? null : quotationId);
  };

  // ✅ Pagination logic
  const indexOfLastQuotation = currentPage * quotationsPerPage;
  const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;
  const currentQuotations = quotations.slice(indexOfFirstQuotation, indexOfLastQuotation);
  const totalPages = Math.ceil(quotations.length / quotationsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Your Quotations
          </h1>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Quotation
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading quotations...</p>
        ) : quotations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              You haven't created any quotations yet.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create New Quotation
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto min-h-[50vh]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left text-sm">
                    <th className="py-3 px-4 font-medium">Quotation ID</th>
                    <th className="py-3 px-4 font-medium">Client</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQuotations.map((quotation, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {quotation.quotationNumber || quotation.id}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {quotation.clientDetails?.name || quotation.client || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{quotation.date}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">₹{quotation.total}</td>
                      <td
                        className={`py-3 px-4 font-semibold ${
                          quotation.status === "Approved"
                            ? "text-green-600"
                            : quotation.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {quotation.status || "Pending"}
                      </td>
                      <td className="py-3 px-4 relative" ref={dropdownRef}>
                        <button
                          onClick={() => toggleDropdown(quotation._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <IoMdMore className="text-gray-600" />
                        </button>
                        
                        {dropdownOpen === quotation._id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => openEditModal(quotation)}
                              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition rounded-t-lg"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(quotation._id)}
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

            {/* Pagination Controls */}
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
        title={editingQuotation ? "Edit Quotation" : "Create Quotation"}
      >
        <QuotationForm 
          onSubmit={handleFormSubmit} 
          submitLoading={submitLoading}
          editData={editingQuotation}
        />
      </Modal>
    </div>
  );
};

export default Quotations;