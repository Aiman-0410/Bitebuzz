// Load menu items
function loadMenuItems() {
  fetch("admin_get_menu.php")
    .then(res => res.json())
    .then(json => {
      if (!json.success) {
        console.error("Fetch failed:", json.message);
        return;
      }

      const tbody = document.querySelector("#menuTable tbody");
      tbody.innerHTML = "";
      json.data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.menu_id}</td>
          <td>${item.item_name}</td>
          <td>${item.restaurant_name}</td>
          <td>${item.price}</td>
          <td><img src="${item.image_url}" width="60" /></td>
          <td>
            <button class="edit-menu-btn" 
              data-id="${item.menu_id}"
              data-name="${item.item_name}"
              data-restaurant="${item.restaurant_name}"
              data-price="${item.price}">
              Edit
            </button>
            <button class="delete-menu-btn" data-id="${item.menu_id}">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      attachMenuListeners();
    })
    .catch(err => console.error("Menu fetch error:", err));
}

// Attach Edit/Delete
function attachMenuListeners() {
  document.querySelectorAll(".edit-menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      document.getElementById("menuModalTitle").innerText = "Edit Menu Item";
      document.getElementById("menuId").value = id;
      document.getElementById("menuName").value = btn.dataset.name;
      document.getElementById("menuRestaurant").value = btn.dataset.restaurant;
      document.getElementById("menuPrice").value = btn.dataset.price;
      document.getElementById("menuImage").value = "";

      document.getElementById("menuModal").style.display = "block";
    });
  });

  document.querySelectorAll(".delete-menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (!confirm("Are you sure to delete this item?")) return;
      fetch("admin_delete_menu.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${encodeURIComponent(id)}`
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert("Deleted successfully!");
            loadMenuItems();
          } else {
            alert("Delete failed: " + result.message);
          }
        })
        .catch(() => alert("Error deleting item."));
    });
  });
}

// Open Add Modal
document.getElementById("addMenuBtn")?.addEventListener("click", () => {
  document.getElementById("menuModalTitle").innerText = "Add Menu Item";
  document.getElementById("menuId").value = "";
  document.getElementById("menuName").value = "";
  document.getElementById("menuRestaurant").value = "";
  document.getElementById("menuPrice").value = "";
  document.getElementById("menuImage").value = "";

  document.getElementById("menuModal").style.display = "block";
});

// Handle Submit (Add or Edit)
document.getElementById("menuForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const id = document.getElementById("menuId").value;

  const url = id ? "admin_edit_menu.php" : "admin_add_menu.php";

  fetch(url, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert(id ? "Updated successfully!" : "Added successfully!");
        document.getElementById("menuModal").style.display = "none";
        loadMenuItems();
      } else {
        alert(result.message || "Operation failed.");
      }
    })
    .catch(() => alert("Request failed."));
});
// ✅ Fetch total menu count
// ✅ Fetch total menu count from menu data array
function fetchTotalMenuItems() {
  fetch("admin_get_menu.php")
    .then(response => response.json())
    .then(data => {
      if (data.success && Array.isArray(data.data)) {
        document.getElementById("totalMenuItems").textContent = data.data.length;
      } else {
        document.getElementById("totalMenuItems").textContent = "0";
      }
    })
    .catch(() => {
      document.getElementById("totalMenuItems").textContent = "Error";
    });
}

// Load on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  fetchTotalMenuItems();
  loadMenuItems();
});