// Utility: Get the current user's cart key for localStorage
function getCurrentUserCartKey() {
  const username = localStorage.getItem("currentUser");
  return username ? `cart_${username}` : "cart_guest";
}

// Load cart items for the current user from localStorage
function loadCart() {
  const cartKey = getCurrentUserCartKey();
  const cartData = localStorage.getItem(cartKey);
  let cartItems = [];
  if (cartData) {
    cartItems = JSON.parse(cartData);
  }
  // TODO: Populate your cart UI/table with cartItems here
  // Example: renderCartItems(cartItems);
  window.cartItems = cartItems; // Make cartItems available globally for order-now-btn
}

// Save cart items for the current user to localStorage
function saveCart(cartItems) {
  const cartKey = getCurrentUserCartKey();
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
}

// Call loadCart() on page load
document.addEventListener("DOMContentLoaded", loadCart);



document.getElementById('order-now-btn').addEventListener('click', async function () {
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }  

    console.log("Cart Data Sent:", JSON.stringify(cartItems)); // Debugging check

    fetch('cart1.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartItems),
      credentials: 'include' // Include credentials for session management
    })
    .then(response => response.text()) // Use `.text()` for raw debugging
    .then(data => {
      console.log("Response received:", data); // Logs raw response
      try {
        const result = JSON.parse(data); // Ensure JSON format
        console.log("Parsed Response:", result);
        if (result.status === "success") {
            alert('Order processed successfully! Redirecting to payment...');
            window.location.href = 'order-confirmation.html';
        } else {
            alert('Error processing order: ' + result.message);
            console.error("Backend Error:", result.message);
        }
      } catch (error) {
        console.error("JSON Parsing Error:", error);
        alert("Unexpected response from server. Check console for details.");
      }
    })
    .catch(error => {
      alert('Failed to process the order.');
      console.error("Fetch Error:", error);
    });
});      