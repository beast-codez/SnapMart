import React from "react";
import "./sidebar.css";

function Sidebar({ sidebar, setCategory,category,setSearch }) {
  return (
    <div className={`Sidebar ${sidebar ? "" : "hidesidebar"}`}>
      <div
        className={`side-links ${
          category === "" ? "highlight" : ""
        }`}
        onClick={() => {setCategory("");
          setSearch("");
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
          category === "smartphones" ? "highlight" : ""
        }`}
        onClick={() => setCategory("smartphones")}
      >
        <img src="/img/electronicsicon.png" alt="electronics" />
        <p className={`${sidebar ? "" : "hidden"}`}>Smartphones</p>
      </div>
      <div
        className={`side-links ${category === "fragrances" ? "highlight" : ""}`}
        onClick={() => setCategory("fragrances")}
      >
        <img src="/img/fragrances.svg" alt="fashion" />
        <p className={`${sidebar ? "" : "hidden"}`}>Fragrances</p>
      </div>
      <div
        className={`side-links ${category === "furniture" ? "highlight" : ""}`}
        onClick={() => setCategory("furniture")}
      >
        <img src="/img/furnitureicon.png" alt="home and furniture" />
        <p className={`${sidebar ? "" : "hidden"}`}>Furniture</p>
      </div>
      <div
        className={`side-links ${category === "beauty" ? "highlight" : ""}`}
        onClick={() => setCategory("beauty")}
      >
        <img src="/img/beautyicon.png" alt="Beauty" />
        <p className={`${sidebar ? "" : "hidden"}`}>Beauty</p>
      </div>
      <div
        className={`side-links ${
          category === "sports-acccessories" ? "highlight" : ""
        }`}
        onClick={() => setCategory("sports-accessories")}
      >
        <img src="/img/sportsicon.png" alt="sports" />
        <p className={`${sidebar ? "" : "hidden"}`}>sports</p>
      </div>
      <div
        className={`side-links ${category === "laptops" ? "highlight" : ""}`}
        onClick={() => setCategory("laptops")}
      >
        <img src="/img/laptop.png" alt="books" />
        <p className={`${sidebar ? "" : "hidden"}`}>Laptops</p>
      </div>
      <p className={`${sidebar ? "hr" : "hidden"}`}>___________________</p>
      <p className={`${!sidebar ? "hiddenhr" : "hidden"}`}>___</p>
      <div className="side-links">
        <img src="/img/carticon.png" alt="cart" />
        <p className={`${sidebar ? "" : "hidden"}`}>Cart</p>
      </div>
      <div className="side-links">
        <img src="/img/ordersicon.png" alt="your orders" />
        <p className={`${sidebar ? "" : "hidden"}`}>Your Orders</p>
      </div>
      <div className="side-links">
        <img src="/img/contactusicon.png" alt="contact us" />
        <p className={`${sidebar ? "" : "hidden"}`}>Contact us</p>
      </div>
    </div>
  );
}

export default Sidebar;
