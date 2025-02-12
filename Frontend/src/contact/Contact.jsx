import React, { useEffect, useState } from "react";
import "./contact.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
function Cart({
  sidebar,
  setSidebar,
  category,
  setCategory,
  search,
  setSearch,
}) {
  const [cart, setCart] = useState([]);
  useEffect(() => {}, []);
  return (
    <>
      <div className="whole-cont">
        <Navbar
          setSidebar={setSidebar}
          setSearch={setSearch}
          setCategory={setCategory}
        />
        <div className="contact-cont">
          <div className={sidebar ? "sidebar-visible" : "sidebar-hidden"}>
            <Sidebar
              sidebar={sidebar}
              setCategory={setCategory}
              category={category}
              setSearch={setSearch}
            />
          </div>
          <div
            className={`contact-details ${
              sidebar ? "with-sidebar" : "full-width"
            }`}
          >
            <div className="contact-us-container">
              <h1 className="contact-us-title">Contact Us</h1>
              <p className="contact-us-subtitle">
                We’d love to hear from you! Reach out to us using the details
                below.
              </p>

              <div
                className={`contact-details ${
                  sidebar ? "with-sidebar" : "full-width"
                } ${window.innerWidth <= 768 ? "mobile" : ""}`}
              >
                {/* Contact Email */}
                <div className="contact-item">
                  <h2>Email Us</h2>
                  <p>support@snapmart.com</p>
                </div>

                {/* Social Media */}
                <div className="contact-item">
                  <h2>Follow Us</h2>
                  <p>
                    <strong>Facebook:</strong>{" "}
                    <a
                      href="https://facebook.com/snapmart"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      facebook.com/snapmart
                    </a>
                  </p>
                  <p>
                    <strong>Instagram:</strong>{" "}
                    <a
                      href="https://instagram.com/snapmart"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      instagram.com/snapmart
                    </a>
                  </p>
                </div>

                {/* Contact Numbers */}
                <div className="contact-item">
                  <h2>Call Us</h2>
                  <p>+1 (123) 456-7890</p>
                  <p>+1 (987) 654-3210</p>
                </div>

                {/* Headquarters Address */}
                <div className="contact-item">
                  <h2>Our Headquarters</h2>
                  <p>
                    Snap Mart HQ <br />
                    123 Market Street, <br />
                    San Francisco, CA 94103 <br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Cart;
