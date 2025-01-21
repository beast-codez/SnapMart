import React, { useEffect, useState } from "react";
import "./feed.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Feed({ sidebar, category, search }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [float, setFloat] = useState("");
  const navigate = useNavigate();
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    let url = "https://dummyjson.com/products";
    if (category) {
      url = `https://dummyjson.com/products/category/${category}`;
    } else if (search) {
      url = `https://dummyjson.com/products/search?q=${search}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
      console.log(data.products);
    } catch (err) {
      setError("Error occurred while fetching data...");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handlecart = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/cart", { id } , {withCredentials : true});
      setFloat(response.data.message);
      setTimeout(() => {
        setFloat('')
      }, 3000);
    } catch (err) {
      setError("Error adding product to the cart");
      console.log(err);
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [category, search]);

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

  if (!loading && products.length === 0) {
    return <p className="error-cont">No products available...</p>;
  }
  const handleproduct = (id) => {
    navigate(`/product/:${id}`);
  };
  return (
    <div className="feed">
      <div className={`floater ${float ? "" : "hidden"}`}>{float}</div>
      {products.map((product) => (
        <div
          key={product.id}
          className={`product ${sidebar ? "half" : "full"}`}
        >
          <img
            src={product.images[0]}
            alt={product.title}
            onClick={() => navigate(`/product/${product.id}`)}
          />
          <p id="title">
            {product.title.length > 15
              ? product.title.slice(0, 15) + "..."
              : product.title}
          </p>
          <p id="description">{product.description.slice(0, 20)}...</p>
          <div id="details">
            <p id="rating">{product.rating} ⭐</p>
            <p id="stock">{product.availabilityStatus}</p>
          </div>
          <p id="price">Price : ₹{Math.round(product.price * 80)}</p>
          <button
            className="btn"
            onClick={() => {
              handlecart(product.id);
            }}
          >
            {loading ? "..." : "Add to cart"}
          </button>
          <button className="btn">Buy now</button>
        </div>
      ))}
    </div>
  );
}

export default Feed;
