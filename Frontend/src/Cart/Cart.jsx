import React, { useEffect, useState } from "react";
import "./Cart.css";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import handleBuy from "../Buy/HandleBuy";
function Cart({
  sidebar,
  setSidebar,
  category,
  setCategory,
  search,
  setSearch,
}) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [floater, setFloater] = useState("");
  const [change, setChange] = useState([]);
  const [total, setTotal] = useState(0);
  const [buyItems, setBuyItems] = useState([]);
  const navigate = useNavigate();
  const handlePayment = (total) => {
    const amount = total * 100;
    const userDetails = {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "9876543210",
    };

    handleBuy(amount, userDetails, buyItems);
  };
  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/removeFromCart",
        { id },
        { withCredentials: true }
      );

      if (response.data.message === "error") {
        setFloater("Error occurred, try again later");
        return;
      }
      setChange(response.data.cart);
      setFloater("Successfully removed item");
    } catch (error) {
      console.error("Error removing item:", error);
      setFloater("Error occurred, try again later");
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);

      try {
        const response = await axios.get("http://localhost:5000/fetchcart", {
          withCredentials: true,
        });

        if (!response.data.cart || response.data.cart.length === 0) {
          setCart([]);
          setBuyItems([]);
          setLoading(false);
          return;
        }

        setBuyItems(response.data.cart);

        const productPromises = response.data.cart.map((id) =>
          fetch(`https://dummyjson.com/products/${id}`).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch product with ID: ${id}`);
            }
            return res.json();
          })
        );

        const products = await Promise.all(productPromises);
        setCart(products);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [change]);

  useEffect(() => {
    let total = 0;
    cart.forEach((prod) => {
      total += Math.floor(prod.price * 80);
    });
    setTotal(total);
  }, [cart]);

  if (loading) {
    return ;
  }

  

  return (
    <>
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
            <div className="cloader">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : !cart || cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty. Start shopping now!</p>
              <button
                className="shop-now-btn"
                onClick={() => navigate("/home")}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div
              className={`cart-details ${
                sidebar ? "with-sidebar" : "full-width"
              }`}
            >
              <p id="cart-title">Your cart</p>
              <div className="cart-items-cont">
                {cart.map((product) => (
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
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="buy-cart">
                <p id="total-items">Total items: {cart.length}</p>
                <p id="total-cost"> Total Amount: {total} rs</p>
                <button
                  className="checkout-btn"
                  onClick={() => handlePayment(total)}
                >
                  Buy now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
