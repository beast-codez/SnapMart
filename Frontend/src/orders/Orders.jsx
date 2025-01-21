import React, { useState, useEffect } from "react";
import "./orders.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

const Orders = ({
  sidebar,
  setSidebar,
  category,
  setCategory,
  search,
  setSearch,
}) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setLoading(true);
    const orderProduct = {
      id: "1",
      orderDate: "21-01-2025",
      status: "Ordered",
      address: "Tirupati, Andhra Pradesh",
    };

    fetch(`https://dummyjson.com/products/${orderProduct.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders([
          {
            ...data,
            orderDate: orderProduct.orderDate,
            status: orderProduct.status,
            address: orderProduct.address,
          },
        ]);
        setLoading(false);
      })
      .catch(() => setLoading(false)); // Handle potential errors gracefully.
  }, []);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <p id="orders-info">No orders yet</p>
        <button className="order-btn">Order now</button>
      </div>
    );
  }

  return (
    <div className="whole-cont">
      <Navbar
        setSidebar={setSidebar}
        setSearch={setSearch}
        setCategory={setCategory}
      />
      <div className="order-cont">
        <div className={sidebar ? "sidebar-visible" : "sidebar-hidden"}>
          <Sidebar
            sidebar={sidebar}
            setCategory={setCategory}
            category={category}
            setSearch={setSearch}
          />
        </div>
        <div
          className={`order-details ${sidebar ? "with-sidebar" : "full-width"}`}
        >
            <p id="heading">Your orders</p>
          {orders.map((order) => (
            <div className="order-products" key={order.id}>
              <img
                src={order.images[0]}
                alt={order.title}
                className="order-image"
              />
              <div className="order-info">
                <p id="title">{order.title}</p>
                <p id="date">Order Date: {order.orderDate}</p>
                <p id="status">Status: {order.status}</p>
                <p id="address">Address: {order.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
