function showAlert(message, type) {
    document.querySelectorAll('.alert').forEach(el => el.remove());
    const alertBox = document.createElement("div");
    alertBox.classList.add("alert", type || "info");
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function() {
    // Identify the current page
    const currentPage = window.location.pathname;

    /*const logoutMsg = localStorage.getItem('logoutMessage');
    if (logoutMsg) {
      showAlert(logoutMsg, "success");
      localStorage.removeItem('logoutMessage');
    }*/

    // --- Cart helper function ---
    function saveCartForUser(username, cartItems) {
        localStorage.setItem('cart_' + username, JSON.stringify(cartItems));
    }

    // (Optional) Helper to load cart for user
    /*function loadCartForUser(username) {
        return JSON.parse(localStorage.getItem('cart_' + username) || '[]');
    }*/
    function saveCart(cartItems) {
      const username = localStorage.getItem('currentUser');
      if (username) {
        saveCartForUser(username, cartItems);
      }
    }     


    console.log("Current Page:", currentPage); // Debug: Check which page is loaded

    // ✅ Handle Login Form (Only if login.html is Open)
    if (currentPage.includes("login.html")) {
        const loginForm = document.getElementById("login-form");
        const loginBtn = document.getElementById("login-btn");

        if (!loginForm) {
            console.error("Login form not found!");
            return;
        }

        if (!loginBtn) {
            console.error("Login button not found!");
            return;
        }

        loginBtn.addEventListener("click", function() {
            console.log("Login button clicked!");
        });

        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const loginData = {
                username: document.getElementById("username").value.trim(),
                password: document.getElementById("password").value.trim(),
            };

            try {
                const response = await fetch("http://localhost/bitebuzz/login.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                });

                const data = await response.json();

                if (data.success) {
                     const username = loginData.username; // or whatever variable holds the username
                     localStorage.setItem('currentUser', username);
                     localStorage.setItem('cart_' + username, JSON.stringify([])); // Clear cart for this user
                     // Optionally, clear guest cart too:
                     localStorage.setItem('cart_guest', JSON.stringify([]));
                     localStorage.removeItem("shoppingCart");
                     localStorage.removeItem("activeOrder");
                    showAlert("✅Login successful! Redirecting...");
                    setTimeout(function() {
                      window.location.href = data.redirect;
                    }, 1500);  
                } else {
                    showAlert(data.message, "error"); // Displays correct error (password/user issue)
                    loginForm.reset();
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        });
    }

    // ✅ Handle Signup Form (Only if index.html is Open)
    if (currentPage.includes("index.html")) {
        const signupForm = document.getElementById("signup-form");

        if (!signupForm) {
            console.error("Signup form not found!");
            return;
        }

        signupForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const userData = {
                username: document.getElementById("username").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                password: document.getElementById("password").value.trim(),
            };

            try {
                const response = await fetch("http://localhost/bitebuzz/signup.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();
                if (data.success) {
                    const username = userData.username; // or whatever variable holds the username
                    localStorage.setItem('cart_' + username, JSON.stringify([]));
                    localStorage.setItem('cart_guest', JSON.stringify([])); // optional
                    localStorage.removeItem("shoppingCart");
                    localStorage.removeItem("activeOrder");


                    //localStorage.setItem('currentUser', userData.username);
                    //saveCartForUser(userData.username, []); // Start with an empty cart for new user
                    showAlert("🎉Signup successful! Redirecting...");
                    setTimeout(function() {
                      window.location.href = 'homepage.html';
                    }, 1500);
                } else {
                    showAlert(data.message, "error"); // Displays correct error (username/phone issue)
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        });
    }

    console.log(document.getElementById('choose-order-section'));
});