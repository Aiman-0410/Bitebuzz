// Fetch and display restaurants
function loadRestaurants() {
  fetch("admin_get_restaurants.php")
    .then(response => response.json())
    .then(json => {
      if (!json.success) {
        console.error("Failed to fetch restaurants:", json.message);
        return;
      }

      const tbody = document.querySelector("#restaurantTable tbody");
      tbody.innerHTML = "";

      json.data.forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${r.id}</td>
          <td>${r.name}</td>
          <td><img src="/bitebuzz/${r.image_url}" alt="${r.name}" width="60"/></td>
          <td>${r.rating}</td>
          <td>${r.cuisine}</td>
          <td>${r.price_range}</td>
          <td>${r.review_count}</td>
          <td>${r.review_1 || ''}</td>
          <td>${r.review_2 || ''}</td>
          <td>${r.review_3 || ''}</td>
          <td>
            <button class="edit-btn" data-id="${r.id}">Edit</button>
            <button class="delete-btn" data-id="${r.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      //attachButtonListeners();
    })
    .catch(error => console.error("Fetch error:", error));
}

document.addEventListener('DOMContentLoaded', function () {
  // Delegate click events for edit and delete buttons in the restaurant table
  document.querySelector('#restaurantTable tbody').addEventListener('click', function (e) {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    // Edit Restaurant
    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      fetch(`admin_get_restaurants.php?id=${id}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            const data = result.data;
            // Fill modal fields
            document.getElementById("restaurantId").value = data.id;
            document.getElementById("editName").value = data.name;
            document.getElementById("editCuisine").value = data.cuisine;
            document.getElementById("editRating").value = data.rating;
            document.getElementById("editPriceRange").value = data.price_range;
            document.getElementById("editReviewCount").value = data.review_count;
            document.getElementById("editReview1").value = data.review_1 || '';
            document.getElementById("editReview2").value = data.review_2 || '';
            document.getElementById("editReview3").value = data.review_3 || '';
            if (data.image_url) {
              document.getElementById("currentImage").src = data.image_url;
              document.getElementById("currentImage").style.display = "block";
            }
            document.getElementById("editModal").style.display = "block";
          } else {
            alert("Failed to load restaurant data.");
          }
        });
    }
    
    // Delete Restaurant
    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      if (confirm("Are you sure you want to delete this restaurant?")) {
        fetch('admin_delete_restaurant.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `id=${encodeURIComponent(id)}`
        })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              alert("Restaurant deleted successfully!");
              // Reload the restaurant table
              if (typeof loadRestaurants === "function") loadRestaurants();
            } else {
              alert(result.message || "Failed to delete restaurant.");
            }
          });
      }
    }
  });

  // Close Edit Modal
  document.querySelector("#editModal .close").addEventListener("click", function () {
    document.getElementById("editModal").style.display = "none";
    document.getElementById("editForm").reset();
    document.getElementById("currentImage").style.display = "none";
  });

  // Handle Edit Form Submission
  document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('admin_edit_restaurant.php', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          alert("Restaurant updated successfully!");
          document.getElementById("editModal").style.display = "none";
          if (typeof loadRestaurants === "function") loadRestaurants();
        } else {
          alert(result.message || "Failed to update restaurant.");
        }
      });
  });
});
// Open a modal for editing (form-based editing)
function openEditModal(data) {
  document.getElementById("restaurantId").value = data.id;
  document.getElementById("editName").value = data.name;
  document.getElementById("editCuisine").value = data.cuisine;
  document.getElementById("editRating").value = data.rating;
  document.getElementById("editPriceRange").value = data.price_range;
  document.getElementById("editReviewCount").value = data.review_count;
  document.getElementById("editReview1").value = data.review_1 || '';
  document.getElementById("editReview2").value = data.review_2 || '';
  document.getElementById("editReview3").value = data.review_3 || '';
  // Show current image if needed
  if (data.image_url) {
    document.getElementById("currentImage").src = data.image_url;
    document.getElementById("currentImage").style.display = "block";
  }
  document.getElementById("editModal").style.display = "block";
}

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
});

// Handle form submission
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  console.log("Sending edit request with:", Object.fromEntries(formData.entries())); // ✅ Debugging step

  fetch("admin_edit_restaurant.php", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(result => {
      console.log("Edit response:", result); // ✅ Debugging step

      if (result.success) {
        alert("Restaurant updated successfully!");
        document.getElementById("editModal").style.display = "none";
        loadRestaurants(); // ✅ Reload table after editing
      } else {
        alert("Update failed: " + result.message);
      }
    })
    .catch(err => console.error("Edit error:", err));
});
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("editModal").style.display = "none";
    });
  }
});

// Ensure script runs when the page loads
document.addEventListener("DOMContentLoaded", loadRestaurants);