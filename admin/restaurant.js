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
          <td>${r.restaurant_id}</td>
          <td>${r.name}</td>
          <td>${r.location}</td>
          <td>${r.contact}</td>
          <td><img src="${r.image_url}" alt="${r.name}" width="60"/></td>
          <td>${r.cuisine}</td>
          <td>${r.rating}</td>
          <td>${r.price_range}</td>
          <td>
            <button class="edit-btn" data-id="${r.restaurant_id}">Edit</button>
            <button class="delete-btn" data-id="${r.restaurant_id}">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      attachButtonListeners();
    })
    .catch(error => console.error("Fetch error:", error));
}

// Attach edit/delete listeners
function attachButtonListeners() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      console.log("Fetching restaurant ID: ${id}"); // ✅ Debugging step

      fetch(`admin_get_restaurants.php?id=${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("HTTP error! Status: ${res.status}");
          }
          return res.json();
        })
        .then(data => {
          console.log("Restaurant Data:", data); // ✅ Debugging step
          if (data.success && data.data) {
            openEditModal(data.data); // ✅ Open edit form
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch(err => {
          console.error("Fetch error:", err);
          alert("Failed to fetch restaurant details.");
        });
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      if (confirm("Are you sure you want to delete this restaurant?")) {
        fetch("admin_delete_restaurant.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `id=${encodeURIComponent(id)}`
        })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              alert("Restaurant deleted successfully!");
              loadRestaurants(); // ✅ Reload table after deletion
            } else {
              alert("Delete failed: " + result.message);
            }
          })
          .catch(err => console.error("Delete error:", err));
      }
    });
  });
}

// Open a modal for editing (form-based editing)
function openEditModal(data) {
  document.getElementById("restaurantId").value = data.restaurant_id;
  document.getElementById("editName").value = data.name;
  document.getElementById("editLocation").value = data.location;
  document.getElementById("editContact").value = data.contact;
  document.getElementById("editCuisine").value = data.cuisine;
  document.getElementById("editRating").value = data.rating;
  document.getElementById("editPrice").value = data.price_range;

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