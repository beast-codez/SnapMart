import React from "react";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Sidebar({ sidebar, setCategory, category, setSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className={`Sidebar ${sidebar ? "" : "hidesidebar"}`}>
      <div
        className={`side-links ${
          category === "" && location.pathname === "/home" ? "highlight" : ""
        }`}
        onClick={() => {
          setCategory("");
          setSearch("");
          location.pathname !== "/home" && navigate("/home");
        }}
      >
        <img src="/img/homeicon.png" alt="homeicon" />
        <p className={`${sidebar ? "" : "hidden"}`}>Home</p>
      </div>
      <p className={`${sidebar ? "hr" : "hidden"}`}>____________________</p>
      <p className={`${!sidebar ? "hiddenhr" : "hidden"}`}>___</p>
      <p id="categories" className={`${sidebar ? "" : "hidden"}`}>
        Categories
      </p>
      <div
        className={`side-links ${
          category === "smartphones" && location.pathname === "/home"
            ? "highlight"
            : ""
        }`}
        onClick={() => {
          setCategory("smartphones");
          location.pathname !== "/home" && navigate("/home");
        }}
      >
        <img src="/img/electronicsicon.png" alt="electronics" />
        <p className={`${sidebar ? "" : "hidden"}`}>Smartphones</p>
      </div>
      <div
        className={`side-links ${
          category === "fragrances" && location.pathname === "/home"
            ? "highlight"
            : ""
        }`}
        onClick={() => {
          setCategory("fragrances");
          location.pathname !== "/home" && navigate("/home");
        }}
      >
        <img src="/img/fragrances.svg" alt="fashion" />
        <p className={`${sidebar ? "" : "hidden"}`}>Fragrances</p>
      </div>
      <div
        className={`side-links ${
          category === "furniture" && location.pathname === "/home"
            ? "highlight"
            : ""
        }`}
        onClick={() => {
          setCategory("furniture");
          location.pathname !== "/home" && navigate("/home");
        }}
      >
        <img src="/img/furnitureicon.png" alt="home and furniture" />
        <p className={`${sidebar ? "" : "hidden"}`}>Furniture</p>
      </div>
      <div
        className={`side-links ${
          category === "beauty" && location.pathname === "/home"
            ? "highlight"
            : ""
        }`}
        onClick={() => {
          setCategory("beauty");
          location.pathname !== "/home" && navigate("/home");
        }}
      >
        <img src="/img/beautyicon.png" alt="Beauty" />
        <p className={`${sidebar ? "" : "hidden"}`}>Beauty</p>
      </div>
      <div
        className={`side-links ${
          category === "sports-acccessories" && location.pathname === "/home"
            ? "highlight"
            : ""
        }`}
        onClick={() => {
          setCategory("sports-accessories");
          location.pathname !== "/home" && navigate("/home");
        }}
      >
        <img src="/img/sportsicon.png" alt="sports" />
        <p className={`${sidebar ? "" : "hidden"}`}>sports</p>
      </div>
      <div
        className={`side-links ${
          category === "laptops" && location.pathname === "/home"
            ? "highlight"
            : ""
        }`}
        onClick={() => {
          setCategory("laptops");
          location.pathname !== "/home" && navigate("/home");
        }}
      >
        <img src="/img/laptop.png" alt="books" />
        <p className={`${sidebar ? "" : "hidden"}`}>Laptops</p>
      </div>
      <p className={`${sidebar ? "hr" : "hidden"}`}>___________________</p>
      <p className={`${!sidebar ? "hiddenhr" : "hidden"}`}>___</p>
      <div
        className={`side-links ${
          location.pathname === "/cart" ? "highlight" : ""
        }`}
        onClick={() => {
          navigate("/cart");
        }}
      >
        <img src="/img/carticon.png" alt="cart" />
        <p className={`${sidebar ? "" : "hidden"}`}>Cart</p>
      </div>
      <div
        className={`side-links ${
          location.pathname === "/your-orders" ? "highlight" : ""
        }`}
        onClick={() => navigate("/your-orders")}
      >
        <img src="/img/ordersicon.png" alt="your orders" />
        <p className={`${sidebar ? "" : "hidden"}`}>Your Orders</p>
      </div>
      <div
        className={`side-links ${
          location.pathname === "/contact" ? "highlight" : ""
        }`}
        onClick={() => navigate("/contact")}
      >
        <img src="/img/contactusicon.png" alt="contact us" />
        <p className={`${sidebar ? "" : "hidden"}`}>Contact us</p>
      </div>
    </div>
  );
}

export default Sidebar;
