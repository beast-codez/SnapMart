import React, { useEffect, useRef, useState } from "react";
import "./Product.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Product({
  sidebar,
  setSidebar,
  category,
  setCategory,
  search,
  setSearch,
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [suggestionsList, setSuggestionsList] = useState([]);
  const { id } = useParams();
  const [close, setClose] = useState(false);
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [float, setFloat] = useState("");
  const handleClose = () => {
    setClose(!close);
  };
  const handleSuggestionClick = (id) => {
    console.log(`/product/${id}`);
    navigate(`/product/${id}`);
  };
  useEffect(() => {
    if (!isFirstRender.current) {
      if (category && product?.category && category !== product.category) {
        navigate("/home");
      }
    } else {
      isFirstRender.current = false;
    }
  }, [category, navigate, product?.category]);

  useEffect(() => {
    const closeSignElement = document.getElementById("close-sign");
    if (closeSignElement) {
      closeSignElement.innerHTML = close ? "&#60;" : "&#62;";
    }
  }, [close]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product data.");
      }
      const data = await res.json();
      await setProduct(data);
    } catch (err) {
      setError("Error occurred while fetching data...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);
  const handleBuy = async (id) => {
    navigate("/buy", { state: [id] });
  };
  const handlecart = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://snapmart-9loi.onrender.com/cart",
        { id },
        { withCredentials: true }
      );
      setFloat(response.data.message);
      setTimeout(() => {
        setFloat("");
      }, 3000);
    } catch (err) {
      setError("Error adding product to the cart");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!product || !category) setLoading(true);
  }, [product, category]);
  useEffect(() => {
    if (product) {
      const url = `${
        product.category
          ? `https://dummyjson.com/products/category/${product.category}`
          : "https://dummyjson.com/products"
      }`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const filteredProducts = data.products.filter(
            (prod) => prod.id !== product.id
          );
          setSuggestionsList(filteredProducts);
          setLoading(false);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [product]);
  if (error) {
    return (
      <div className="error">
        <p className="error-cont">{error}</p>
        <button id="retry" onClick={fetchProducts}>
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="loader"></div>;
  }

  if (!product) {
    return <p className="error-cont">No product available...</p>;
  }

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
        <div
          className={`product-details ${
            sidebar ? "with-sidebar" : "full-width"
          }`}
        >
          <div className="product-content">
            <div className="product-img">
              <img
                src={product.thumbnail || "/img/defaultimg.png"}
                alt={product.title || "N/A"}
              />
            </div>

            <h1 id="prod_title">{product.title}</h1>
            <p id="prod_description">{product.description}</p>
            <p id="prod_price">
              Price: ₹{Math.floor(product.price * 80)}{" "}
              <span className="discount">
                ({product.discountPercentage}% off)
              </span>
            </p>
            <p id="prod_availability">
              Availability: {product.availabilityStatus || "N/A"} (Stock:{" "}
              {product.stock || 0})
            </p>
            <p id="prod_rating">Rating: {product.rating} ⭐</p>

            <div className="product-actions">
              <button
                className="prod_btn"
                onClick={() => handlecart(product.id)}
              >
                Add to Cart
              </button>
              <button
                className="prod_btn"
                onClick={() => handleBuy(product.id)}
              >
                Buy Now
              </button>
            </div>
            {/* Product reviews */}
            <div className="reviews">
              <p id="reviews">Reviews</p>
              {product.reviews.map((review, index) => (
                <div className="comment" key={index}>
                  <div className="comment-first">
                    <p id="reviewerName">{review.reviewerName}</p>
                    <p id="date">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p id="reviewerEmail">{review.reviewerEmail}</p>
                  <div className="comment-second">
                    <p id="comment">{review.comment}</p>
                    <p id="rating">{review.rating} ⭐</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions Container */}
        <div className={`suggestions ${close ? "hidden" : ""}`}>
          <p id="sug_title">Similar Products for you</p>
          {suggestionsList.length > 0 ? (
            suggestionsList.map((item) => (
              <div
                className="suggestion_item"
                key={item.id}
                onClick={() => handleSuggestionClick(item.id)}
              >
                <div className="image-container">
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="details-container">
                    <p>{item.title}</p>
                    <p>{item.description.slice(0, 40)}...</p>
                    <p>{item.rating} ⭐</p>
                    <p>Price: ₹{Math.floor(item.price * 80)} </p>
                    <p>{item.availabilityStatus || "Available"}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-suggestions">No suggestions available...</p>
          )}
        </div>

        {/* Close Button */}
        <div
          className={`close ${close ? "hidden-close" : ""}`}
          onClick={handleClose}
        >
          {close ? <span>&lt;</span> : <span>&gt;</span>}
        </div>
      </div>
    </div>
  );
}

export default Product;
