import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoachList from "./pages/CoachList.jsx";
import CoachForm from "./pages/CoachForm.jsx";

function App() {
  return (
    <Router>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        {/* <h1 style={{ textAlign: "center", color: "#333" }}>
          Cricket Coach Management
        </h1> */}
        <Routes>
          <Route path="/" element={<CoachList />} />
          <Route path="/add" element={<CoachForm />} />
          <Route path="/edit/:id" element={<CoachForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
