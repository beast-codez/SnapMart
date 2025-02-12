import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import Signup from "./Signup/Signup";
import Home from "./Home/Home";
import Product from "./Product/Product";
import Cart from "./Cart/Cart";
import Orders from "./orders/Orders";
import Contact from "./contact/Contact"
import Buy from "./Buy/Buy";
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
 const [isLoading, setIsLoading] = useState(true);


useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();

      if (isTokenExpired) {
        console.log("Token expired");
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
    }
  } else {
    setIsAuthenticated(false);
  }
}, []);


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <Signup setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home
                sidebar={sidebar}
                setSidebar={setSidebar}
                category={category}
                setCategory={setCategory}
                search={search}
                setSearch={setSearch}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/product/:id"
          element={
            isAuthenticated ? (
              <Product
                sidebar={sidebar}
                setSidebar={setSidebar}
                category={category}
                setCategory={setCategory}
                search={search}
                setSearch={setSearch}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isAuthenticated ? (
              <Cart
                sidebar={sidebar}
                setSidebar={setSidebar}
                category={category}
                setCategory={setCategory}
                search={search}
                setSearch={setSearch}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/your-orders"
          element={
            isAuthenticated ? (
              <Orders
                sidebar={sidebar}
                setSidebar={setSidebar}
                category={category}
                setCategory={setCategory}
                search={search}
                setSearch={setSearch}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/contact"
          element={
            isAuthenticated ? (
              <Contact
                sidebar={sidebar}
                setSidebar={setSidebar}
                category={category}
                setCategory={setCategory}
                search={search}
                setSearch={setSearch}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/buy"
          element={
            isAuthenticated ? (
              <Buy
                sidebar={sidebar}
                setSidebar={setSidebar}
                category={category}
                setCategory={setCategory}
                search={search}
                setSearch={setSearch}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
