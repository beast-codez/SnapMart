import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Buy.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import handleBuy from "./HandleBuy";
const currentDate = new Date();
const Buy = ({
  sidebar,
  setSidebar,
  category,
  setCategory,
  search,
  setSearch,
}) => {
  const [buyItems, setBuyItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);
  const { state } = useLocation();
  const futureDate = new Date(currentDate);
  futureDate.setDate(futureDate.getDate() + 2);
  const handlePayment = (total) => {
    const amount = total; 
    const userDetails = {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "9876543210",
    };

    handleBuy(amount, userDetails, buyItems);
  };
  useEffect(() => {
    let k = 0;
    buyItems.map((prod) => {
      k += Math.floor(prod.price * 80);
    });
    setTotal(k);
  }, [buyItems]);

  useEffect(() => {
    setLoading(true);
    const products = state || [];
    products.map((prod) => {
      fetch(`https://dummyjson.com/products/${prod}`)
        .then((res) => res.json())
        .then((data) => {
          setBuyItems([...buyItems, data]);
        });
    });
    setLoading(false);
    const resp = axios.post('http://localhost:5000/addOrder',{ buyItems}, {withCredentials: true});
  }, []);
  return (
    <div className="whole-cont">
      <Navbar
        setSidebar={setSidebar}
        setSearch={setSearch}
        setCategory={setCategory}
      />
      <div className="product-cont">
        <div className={sidebar ? "sidebar-visible" : "sidebar-hidden"}>
          <Sidebar
            sidebar={sidebar}
            setCategory={setCategory}
            category={category}
            setSearch={setSearch}
          />
        </div>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div
            className={`buy-details ${sidebar ? "with-sidebar" : "full-width"}`}
          >
            <p id="buy-items">Buy Now</p>
            <div className="cart-items-cont">
              {buyItems.map((product) => (
                <div className="cart-item" key={product.id}>
                  <img
                    src={product.images[0] || "/img/defaultimg.png"}
                    alt={product.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h3>{product.title}</h3>
                    <p>Price: Rs.{Math.floor(product.price * 80)}</p>
                    <p>Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="buy-cart">
              <p id="total-items">Total items: {buyItems.length}</p>
              <p id="total-cost"> Total Amount:{total} rs</p>
              <p id="deliver-date">{futureDate.toDateString()}</p>
              <button className="checkout-btn" onClick={()=>handlePayment(total)}>Buy now</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy;
