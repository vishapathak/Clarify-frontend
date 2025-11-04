import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";
import InvoiceForm from "./components/InvoiceForm";

const Quotations = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 8;

  // Simulate API call (for now using dummy data)
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);

      // Simulate network delay
      setTimeout(() => {
        const dummyData = [
          { id: "QUO-001", client: "John Doe", date: "2025-11-04", amount: "₹5,000", status: "Paid" },
          { id: "QUO-002", client: "Aarav Patel", date: "2025-10-28", amount: "₹3,200", status: "Pending" },
          { id: "QUO-003", client: "Meera Sharma", date: "2025-10-10", amount: "₹7,800", status: "Overdue" },
          { id: "QUO-004", client: "Ravi Kumar", date: "2025-09-21", amount: "₹4,200", status: "Paid" },
          { id: "QUO-005", client: "Priya Mehta", date: "2025-09-12", amount: "₹2,500", status: "Pending" },
          { id: "QUO-006", client: "Rahul Singh", date: "2025-09-01", amount: "₹9,000", status: "Paid" },
          { id: "QUO-007", client: "Ananya Gupta", date: "2025-08-28", amount: "₹6,300", status: "Overdue" },
          { id: "QUO-008", client: "Aditi Verma", date: "2025-08-15", amount: "₹5,500", status: "Pending" },
          { id: "QUO-009", client: "Kunal Sharma", date: "2025-08-10", amount: "₹8,400", status: "Paid" },
          { id: "QUO-010", client: "Deepak Raj", date: "2025-07-29", amount: "₹3,900", status: "Paid" },
        ];

        setInvoices(dummyData);
        setLoading(false);
      }, 1000);
    };

    fetchInvoices();
  }, []);

  const handleSubmit = (data) => {
    console.log("Invoice Data:", data);
    setIsOpen(false);
  };

  // Pagination Logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Your Quotations
        </h1>
        <button  onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Create Quotation
        </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              You haven’t created any invoices yet.
            </p>
            <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Create New Invoice
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left text-sm">
                    <th className="py-3 px-4 font-medium">Invoice ID</th>
                    <th className="py-3 px-4 font-medium">Client</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoices.map((invoice, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {invoice.id}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {invoice.client}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {invoice.date}
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {invoice.amount}
                      </td>
                      <td
                        className={`py-3 px-4 font-semibold ${
                          invoice.status === "Paid"
                            ? "text-green-600"
                            : invoice.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {invoice.status}
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
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <InvoiceForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default Quotations;
