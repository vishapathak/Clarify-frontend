import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";
import InvoiceForm from "./components/InvoiceForm";
import axios from "axios";
import { IoMdMore } from "react-icons/io";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);
  const dropdownRef = useRef(null);
  const invoicesPerPage = 8;

  // ✅ Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const user = localStorage.getItem("user");

        if (!token || !user) {
          console.warn("Missing auth token or email");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/invoice/list`,
          { email: JSON.parse(user).email },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (response.data.success) {
          setInvoices(response.data.invoices || []);
        } else {
          console.error("Error fetching invoices:", response.data.message);
          setInvoices([]);
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // ✅ Create or Edit Invoice
  const handleSubmit = async (data, total) => {
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail");

      if (!token || !email) {
        alert("User not authenticated.");
        setSubmitLoading(false);
        return;
      }

      const url = editInvoice
        ? `${process.env.REACT_APP_BACKEND_URL}/invoice/edit/${editInvoice._id}`
        : `${process.env.REACT_APP_BACKEND_URL}/invoice/create`;

      const response = await axios.post(
        url,
        { ...data, total, email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        if (editInvoice) {
          // Update edited invoice in list
          setInvoices((prev) =>
            prev.map((inv) =>
              inv._id === editInvoice._id ? response.data.invoice : inv
            )
          );
        } else {
          // Add new invoice
          setInvoices((prev) => [response.data.invoice, ...prev]);
        }

        setIsOpen(false);
        setEditInvoice(null);
      } else {
        alert(response.data.message || "Failed to save invoice.");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ Delete invoice
  const handleDelete = async (invoiceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/invoice/delete/${invoiceId}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        setInvoices((prev) => prev.filter((inv) => inv._id !== invoiceId));
      } else {
        alert(response.data.message || "Failed to delete invoice.");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice. Please try again.");
    } finally {
      setDropdownOpen(null);
    }
  };

  // ✅ Handle Edit
  const handleEdit = (invoice) => {
    setEditInvoice(invoice);
    setIsOpen(true);
    setDropdownOpen(null);
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Pagination
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Your Invoices
          </h1>
          <button
            onClick={() => {
              setIsOpen(true);
              setEditInvoice(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Invoice
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              You haven’t created any invoices yet.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create New Invoice
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto min-h-[50vh]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left text-sm">
                    <th className="py-3 px-4 font-medium">Invoice ID</th>
                    <th className="py-3 px-4 font-medium">Client</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoices.map((invoice, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {invoice.invoiceNumber || invoice._id}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {invoice?.clientDetails?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{invoice.date}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        ₹{invoice.total}
                      </td>
                      <td className="py-3 px-4 text-green-600 font-semibold">Paid</td>
                      <td className="py-3 px-4 relative" ref={dropdownRef}>
                        <div
                          className="cursor-pointer text-gray-600 hover:text-gray-800"
                          onClick={() =>
                            setDropdownOpen(
                              dropdownOpen === invoice._id ? null : invoice._id
                            )
                          }
                        >
                          <IoMdMore size={20} />
                        </div>

                        {dropdownOpen === invoice._id && (
                          <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                            <button
                              onClick={() => handleEdit(invoice)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(invoice._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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

      {/* Modal for create/edit invoice */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditInvoice(null);
        }}
        title={editInvoice ? "Edit Invoice" : "Create Invoice"}
      >
        <InvoiceForm
          onSubmit={handleSubmit}
          submitLoading={submitLoading}
          initialData={editInvoice}
        />
      </Modal>
    </div>
  );
};

export default Invoices;
