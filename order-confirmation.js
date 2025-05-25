document.addEventListener("DOMContentLoaded", function () {
    const confirmOrderBtn = document.querySelector(".confirm-btn");

    confirmOrderBtn.addEventListener("click", async function (event) {
        event.preventDefault();
           
        // Show temporary loading message to user
        confirmOrderBtn.textContent = "Processing...";
        confirmOrderBtn.disabled = true;   

        try {
            console.log("Sending data to PHP:", {
                customer_name: document.getElementById("customer-name").value.trim(),
                customer_address: document.getElementById("customer-address").value.trim(),
                customer_phone: document.getElementById("customer-phone").value.trim(),
                payment_method: document.querySelector("input[name='payment-method']:checked")?.value
            });

            const customerName = document.getElementById("customer-name").value.trim();
            const customerAddress = document.getElementById("customer-address").value.trim();
            const customerPhone = document.getElementById("customer-phone").value.trim();
            const paymentMethodElement = document.querySelector("input[name='payment-method']:checked");

            if (!customerName || !customerAddress || !customerPhone || !paymentMethodElement) {
                alert("❌ Please fill out all fields before confirming the order.");
                confirmOrderBtn.textContent = "Confirm Order";
                confirmOrderBtn.disabled = false;
                return;
            }

            const paymentMethod = paymentMethodElement.value;

            const response = await fetch("order-confirmation.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_name: customerName,
                    customer_address: customerAddress,
                    customer_phone: customerPhone,
                    payment_method: paymentMethod
                })
            });

            const result = await response.json();

            if (result.status === "success") {
                alert(`✅ Order Placed Successfully!\nOrder ID: ${result.order_id}\nPayment Method: ${paymentMethod}`);
                //window.location.href = "order-success.html"; // Redirect after confirmation

                localStorage.setItem("latestOrderId", result.order_id); // ⭐ Store order ID for feedback
                // Clear cart data from frontend (localStorage)
                localStorage.removeItem("cartItems");

                // Update UI - Cart count to 0 and empty cart section
                document.querySelector("#cartCount").innerText = "0";
                document.querySelector("#cartContainer").innerHTML = "<p>Your cart is now empty.</p>";

                // Redirect to Order Success page (optional)
                // window.location.href = "order-success.html";
            } //else {
               // console.error("Backend Error:", result.message);
                //alert("Error placing order: " + result.message);
            //}
        } catch (error) {
            console.error("Order Confirmation Error:", error);
        } finally {
            confirmOrderBtn.textContent = "Confirm Order";
            confirmOrderBtn.disabled = false;
        }
    });
});