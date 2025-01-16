import react from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./Login.css";
import Animation from "../animation/Animation";
const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      if (response.data.message === "Login successful") {
        Cookies.set("authToken", response.data.token, { expires: 1 });
        setIsAuthenticated(true);
      } else {
        setMessage(response.data.message);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="outer-container">
      <div className="container">
        <div className="login-container">
          <h2>Login</h2>
          <form id="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Login
            </button>
            <div className={message ? "message" : "hidden"}>
              <p id="message">{message}</p>
            </div>
          </form>
          <a id="login" href="/signup">
            Signunp instead?
          </a>
        </div>
        <Animation />
      </div>
    </div>
  );
};
export default Login;
