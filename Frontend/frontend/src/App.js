import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar_";
import Home from "./pages/Home";
import History from "./pages/History";

function App() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
