document.getElementById("logout-yes").addEventListener("click", function() {
    console.log("Logout button clicked");
    fetch("logout1.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ You have been logged out successfully.");
            window.location.href = "login.html"; // Redirect user after logout
        } else {
            console.error("Logout failed:", data.error);
        }
    })
    .catch(error => console.error("Error:", error));
});