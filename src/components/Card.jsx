import React from "react";
import { Link } from "react-router-dom";

const Card = ({ title, value, link }) => {
  return (
    <Link
      to={link || "#"}
      className="flex flex-col justify-center items-center h-32 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
    >
      <h1 className="text-3xl font-bold text-blue-600">{value}</h1>
      <p className="text-gray-600 mt-2">{title}</p>
    </Link>
  );
};

export default Card;
