function getCartKey() {
    const username = localStorage.getItem('currentUser');
    return username ? 'cart_' + username : 'cart_guest';
}

function getCartItems() {
    return JSON.parse(localStorage.getItem(getCartKey()) || '[]');
}

function setCartItems(cartItems) {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
}



// Utility: Get the current user's cart key for localStorage
/*function getCurrentUserCartKey() {
  const username = localStorage.getItem("currentUser");
  return username ? `cart_${username}` : "cart_guest";
}*/

function loadCart() {
    const username = localStorage.getItem('currentUser');
    const cartKey = username ? 'cart_' + username : 'cart_guest';
    const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');

    // Update cart count
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = cartItems.length;

    // Update cart table
    const tbody = document.querySelector("#shoppingCartTable tbody");
    if (tbody) {
        tbody.innerHTML = "";
        cartItems.forEach(item => {
            // ...add rows for each item...
        });
    }

    // Update total price
    const totalPrice = document.getElementById("cart-total-price");
    if (totalPrice) {
        let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPrice.textContent = total.toFixed(2);
    }
}

// Save cart items for the current user to localStorage
/*function saveCart(cartItems) {
  const cartKey = getCurrentUserCartKey();
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
}*/
function clearCartUI() {
    // Clear cart table body
    const tbody = document.querySelector("#shoppingCartTable tbody");
    if (tbody) tbody.innerHTML = "";

    // Reset cart count
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = "0";

    // Reset total price
    const totalPrice = document.getElementById("cart-total-price");
    if (totalPrice) totalPrice.textContent = "0.00";
}

// Call loadCart() on page load
//document.addEventListener("DOMContentLoaded", loadCart);
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartCount();
});


document.getElementById('order-now-btn').addEventListener('click', async function () {
    if (cartItems.length === 0) {
        showAlert("🛒Your cart is empty. Please add items before placing an order.", "error");
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
            showAlert('✅Order processed successfully! Redirecting to payment...');
            setTimeout(function() {
              window.location.href = 'order-confirmation.html';
            }, 1500);
        } else {
            showAlert('❌Error processing order: ' + result.message);
            console.error("Backend Error:", result.message);
        }
      } catch (error) {
        console.error("JSON Parsing Error:", error);
        showAlert("❌Unexpected response from server. Check console for details.");
      }
    })
    .catch(error => {
      showAlert('❌Failed to process the order.');
      console.error("Fetch Error:", error);
    });
    // --- Alert function ---
    

});      