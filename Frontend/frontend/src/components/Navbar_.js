import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex gap-6">
      <Link to="/" className="text-white hover:text-yellow-300 font-semibold">
        Home
      </Link>
      <Link
        to="/history"
        className="text-white hover:text-yellow-300 font-semibold"
      >
        History
      </Link>
    </nav>
  );
}

export default Navbar;
