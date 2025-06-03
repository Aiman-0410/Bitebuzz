window.showAlert = function(message, type) {
      document.querySelectorAll('.alert').forEach(el => el.remove());
      const alertBox = document.createElement("div");
      alertBox.classList.add("alert", type);
      alertBox.textContent = message;
      document.body.appendChild(alertBox);
      setTimeout(() => {
        alertBox.remove();
      }, 3000);
    }

document.getElementById("logout-yes").addEventListener("click", function() {
    console.log("Logout button clicked");
    fetch("logout1.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const username = localStorage.getItem('currentUser');
            saveCart(cartItems); // Save current cart for this user
            localStorage.removeItem('currentUser');
            showAlert("👋You have been logged out successfully.");
            setTimeout (function() {
              window.location.href = "login.html"; // Redirect user after logout
            }, 1500);
        } else {
            console.error("Logout failed:", data.error);
        }
    })
    .catch(error => console.error("Error:", error));
});