import axios from "axios";

const handleBuy = async (amount, userDetails, buyItems) => {
  try {
    // Send amount and user details to the backend to create an order
    const { data } = await axios.post(
      "http://localhost:5000/api/payment/order",
      {
        amount,
        userDetails,
      }
    );

    const { orderId, currency, key } = data;

    // Open Razorpay payment interface
    const options = {
      key, // Razorpay API Key
      amount: data.amount, // Amount in paise
      currency,
      name: "SanpMart",
      description: "Item  purchase ",
      order_id: orderId,
      handler: async function (response) {
        // Handle successful payment
        const verifyResponse = await axios.post(
          "http://localhost:5000/api/payment/verify",
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }
        );

        if (verifyResponse.data.success) {
            const response = await axios.post('http://localhost:5000/addOrder', {buyItems})
          alert("Payment Successful!");
        } else {
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
  } catch (error) {
    console.error("Payment Error:", error);
  }
};

export default handleBuy;
