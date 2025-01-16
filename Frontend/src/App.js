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
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    // Check if the user is authenticated on page load
    const token = Cookies.get("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsAuthenticated(!!token);
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
      </Routes>
    </Router>
  );
};

export default App;
