import axios from "axios";

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject("Razorpay SDK failed to load");

    document.body.appendChild(script);
  });
};

const handleBuy = async (amount, userDetails, buyItems) => {
  try {
    // Load Razorpay SDK
    await loadRazorpayScript();

    // Send amount and user details to the backend to create an order
    const { data } = await axios.post(
      "http://localhost:5000/api/payment/order",
      { amount },
      { withCredentials: true }
    );

    const { orderId, currency, key } = data;

    // Validate response
    if (!orderId || !key) {
      alert("Failed to create Razorpay order. Please try again.");
      return;
    }

    // Open Razorpay payment interface
    const options = {
      key, // Razorpay API Key
      amount: data.amount, // Amount in paise
      currency,
      name: "SanpMart",
      description: "Item purchase",
      order_id: orderId,
      handler: async function (response) {
        try {
          // Handle successful payment
          const verifyResponse = await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );

          if (verifyResponse.data.success) {
            await axios.post(
              "http://localhost:5000/addOrder",
              { buyItems },
              { withCredentials: true }
            );
            alert("Payment Successful!");
          } else {
            alert("Payment verification failed!");
          }
        } catch (verifyError) {
          console.error("Payment verification error:", verifyError);
          alert("Payment verification failed!");
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    // Handle payment failure or closure
    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert("Payment failed. Please try again.");
    });
  } catch (error) {
    console.error(
      "Payment Error:",
      error.response ? error.response.data : error.message
    );
    alert("Something went wrong. Please try again.");
  }
};

export default handleBuy;
