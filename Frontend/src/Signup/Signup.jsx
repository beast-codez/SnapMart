import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import Animation from "../animation/Animation";
import Cookies from "js-cookie";
function Signup({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const handlesignup = async (e) => {
    e.preventDefault();
    const user = {
      username,
      email,
      address,
      password,
    };

    console.log("User data being sent:", user); // Log the data

    try {
      const response = await axios.post(
        "https://snap-mart.netlify.app/signup",
        user,
        { withCredentials: true }
      );
      console.log("Signup response:", response.data);

      if (response.data.message === "Signup successful") {
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        setMessage(response.data.message);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (err) {
      setMessage("An internal error occured! Try again later..");
    }
  };

  return (
    <div className="outer-container">
      <div className="container">
        <div className="login-container">
          <h2>Signup</h2>
          <form id="login-form" onSubmit={handlesignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button id="btn" type="submit">
              Signup
            </button>
            <div className={message ? "message" : "hidden"}>
              <p id="message">{message}</p>
            </div>
            <a id="login" href="/login">
              Login instead?
            </a>
          </form>
        </div>
        <Animation />
      </div>
    </div>
  );
}

export default Signup;
