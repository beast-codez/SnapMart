import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate(); 

  const handlesignup = () => {
    navigate("/signup");
  };

  const handlelogin = () => {
    navigate("/login"); 
  };

  return (
    <div className="dash-container">
      <h3>
        <span>S</span>nap<span>M</span>art
      </h3>
      <div className="buttons">
        <button onClick={handlesignup}>Signup</button>
        <button onClick={handlelogin}>Login</button>
      </div>
    </div>
  );
}

export default Dashboard;
