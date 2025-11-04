import React from 'react'

const AboutUs = () => {
  return (
    <div className="p-8 bg-white rounded shadow-md max-w-6xl mx-auto mt-10" id="about">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">About Us</h2>
      <p className="text-lg mb-6 text-gray-700">
        Welcome to Clarify, your modern accounting platform designed to help you overcome the pain of traditional ledger-based accounting systems. We believe accounting should be simple, efficient, and stress-free.
      </p>
      <ul className="list-disc pl-6 mb-6 text-gray-700">
        <li>Empowered with easy invoice, bill, and quotation generation</li>
        <li>Comprehensive history keeping for all your transactions</li>
        <li>Track payment status and stay on top of your finances</li>
      </ul>
      <p className="text-lg text-gray-700">
        Our mission is to streamline your accounting process, giving you more time to focus on what matters most—growing your business. Say goodbye to manual ledgers and embrace the future of accounting with Clarify.
      </p>
    </div>
  )
}

export default AboutUs
