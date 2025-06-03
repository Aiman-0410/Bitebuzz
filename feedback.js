document.addEventListener("DOMContentLoaded", function () {
    const feedbackForm = document.getElementById("feedbackForm");

    feedbackForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const review = document.getElementById("feedback").value.trim();

        if (!username || !rating || !review) {
            showAlert("❌ Please provide your name, a rating, and a review.");
            return;
        }

        try {
            const response = await fetch("submit-feedback.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    rating: rating,
                    review: review
                })
            });

            const result = await response.json();

            if (result.success) {
                showAlert("✅ Thank you for your feedback! 😊");
                feedbackForm.reset();
            } else {
                showAlert("❌ " + result.message);
            }
        } catch (error) {
            console.error("Feedback Submission Error:", error);
            showAlert("❌ Failed to submit feedback.");
        }
    });
});