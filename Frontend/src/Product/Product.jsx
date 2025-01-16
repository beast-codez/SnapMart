import React, { useEffect, useState } from "react";
import "./Product.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useParams } from "react-router-dom";

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
  const { id } = useParams();
  const [close, setClose] = useState(false);
  const handleClose = () => {
    setClose(!close);
  };
  
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
      setProduct(data);
    } catch (err) {
      setError("Error occurred while fetching data...");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

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
        {/* Ensure sidebar is always rendered */}
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
              <img src={product.thumbnail} alt={product.title} />
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
              Availability: {product.availabilityStatus} (Stock: {product.stock}
              )
            </p>
            <p id="prod_rating">Rating: {product.rating} ⭐</p>

            {/* Additional product information */}
            <div className="additional-info">
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Weight:</strong> {product.weight} g
              </p>
              <p>
                <strong>Dimensions:</strong> {product.dimensions.width} x{" "}
                {product.dimensions.height} x {product.dimensions.depth} cm
              </p>
              <p>
                <strong>Warranty:</strong> {product.warrantyInformation}
              </p>
              <p>
                <strong>Shipping:</strong> {product.shippingInformation}
              </p>
              <p>
                <strong>Return Policy:</strong> {product.returnPolicy}
              </p>
              <p>
                <strong>Minimum Order Quantity:</strong>{" "}
                {product.minimumOrderQuantity}
              </p>
            </div>

            <div className="product-actions">
              <button className="prod_btn">Add to Cart</button>
              <button className="prod_btn">Buy Now</button>
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
        <div className={`suggestions ${close ? "hidden" : ""}`}>


        </div>
        <div
          className={`close ${close ? "hidden-close" : ""}`}
          onClick={handleClose}
        >
          <p id="close-sign">&#62;</p>
        </div>
      </div>
    </div>
  );
}

export default Product;
