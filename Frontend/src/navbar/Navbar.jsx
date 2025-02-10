import React, { useState } from "react";
import "./navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Navbar = ({ setSidebar, setSearch, setCategory }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const location = useState("");
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://snapmart-9loi.onrender.com/logout",
        null,
        {
          withCredentials: true,
        }
      );
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const formattedQuery = query.replace(/\s+/g, "");
    setSearch(formattedQuery.trim());
    setQuery("");
    setCategory("");
    location.pathname !== "/home" && navigate("/home");
  };

  return (
    <nav>
      <div className="nav-left">
        <img
          src="/img/menuicon.png"
          alt="menu"
          onClick={() => setSidebar((prev) => !prev)}
        />
        <p id="title">SnapMart</p>
      </div>
      <div className="nav-middle">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <img
            src="/img/searchicon.png"
            alt="searchicon"
            onClick={handleSearch}
          />
        </form>
      </div>
      <div className="nav-right">
        <img src="/img/notificationicon.png" alt="notification" />
        <img id="profile-icon" src="/img/profileicon.png" alt="profile icon" />
        <img
          id="logout"
          src="/img/logout.png"
          alt="logout-icon"
          onClick={handleLogout}
        />
      </div>
    </nav>
  );
};

export default Navbar;
