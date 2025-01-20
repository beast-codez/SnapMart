import React, { useEffect, useRef, useState } from "react";
import "./Product.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";

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

  const handleClose = () => {
    setClose(!close);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      navigate("/home");
    }
  }, [category, navigate]);

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
      console.log(id);
      console.log(`https://dummyjson.com/products/${id}`);

      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product data.");
      }
      const data = await res.json();
      await setProduct(data);
      console.log(data.category);
    } catch (err) {
      setError("Error occurred while fetching data...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  useEffect(() => {
    if (!product || !category) 
    setLoading(true);
  }, [product, category]);
  useEffect(() => {
    if (product) {
      console.log("product " + product);
      const url = `${
        product.category
          ? `https://dummyjson.com/products/category/${product.category}`
          : "https://dummyjson.com/products"
      }`;
      console.log(url);
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
              <img src={product.thumbnail || ""} alt={product.title || "N/A"} />
            </div>

            <h1 id="prod_title">{product.title}</h1>
            <p id="prod_description">{product.description}</p>
            <p id="prod_price">
              Price: ${product.price}{" "}
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
              <button className="prod_btn">Add to Cart</button>
              <button className="prod_btn">Buy Now</button>
            </div>
          </div>
        </div>

        {/* Suggestions Container */}
        <div className={`suggestions ${close ? "hidden" : ""}`}>
          <p id="sug_title">Similar Products for you</p>
          {suggestionsList.length > 0 ? (
            suggestionsList.map((item) => (
              <div className="suggestion_item" key={item.id}>
                <div className="image-container">
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="details-container">
                    <p>{item.title}</p>
                    <p>{item.description.slice(0,40)}...</p>
                    <p>{item.rating} ⭐</p>
                    <p>${item.price}</p>
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
          {close ? <p id="close-sign">&#62</p>: <p id="close-sign">&#60</p>}
        </div>
      </div>
    </div>
  );
}

export default Product;
