import React, { useState, useEffect } from "react";
import "./orders.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // Fetch past orders
        const response = await axios.get(
          "https://snapmart-9loi.onrender.com/pastOrders",
          {
            withCredentials: true,
          }
        );
        console.log(response.data.message);
        if (response.data.orders === null || []) {
          setOrders([]);
          console.log("no orders");
          setLoading(false);
          return;
        }

        const ordersWithDetails = await Promise.all(
          response.data.pastOrders.map(async (orderProduct) => {
            const productResponse = await fetch(
              `https://dummyjson.com/products/${orderProduct.id}`
            );
            const productData = await productResponse.json();
            return {
              ...productData,
              orderDate: orderProduct.orderDate,
              status: orderProduct.status,
              address: orderProduct.address,
            };
          })
        );

        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <p id="orders-info">No orders yet</p>
        <button className="order-btn" onClick={() => navigate("/home")}>
          Order now
        </button>
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
