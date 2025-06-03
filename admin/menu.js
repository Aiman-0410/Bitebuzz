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
          <td>${item.category || ''}</td>
          <td>${item.restaurant_name}</td>
          <td>${item.price}</td>
          <td>${item.description || ''}</td>
          <td><img src="/bitebuzz/${item.image_url}" width="60" /></td>
          <td>
            <button class="edit-menu-btn" 
              data-id="${item.menu_id}"
              data-name="${item.item_name}"
              data-category="${item.category || ''}"
              data-restaurant="${item.restaurant_name}"
              data-price="${item.price}"
              data-description="${item.description || ''}">
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

async function populateRestaurantOptions(selectedName = "") {
  const response = await fetch('admin_get_restaurants.php');
  const data = await response.json();
  const select = document.getElementById('menuRestaurant');
  select.innerHTML = '<option value="">Select Restaurant</option>';
  if (data.success && Array.isArray(data.data)) {
    data.data.forEach(r => {
      const option = document.createElement('option');
      option.value = r.name;
      option.textContent = r.name;
      if (r.name === selectedName) option.selected = true;
      select.appendChild(option);
    });
  }
}

// Attach Edit/Delete
function attachMenuListeners() {
  document.querySelectorAll(".edit-menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // Populate dropdown and then set other fields
      populateRestaurantOptions(btn.dataset.restaurant).then(() => {
        document.getElementById("menuModalTitle").innerText = "Edit Menu Item";
        document.getElementById("menuId").value = btn.dataset.id;
        document.getElementById("menuName").value = btn.dataset.name;
        document.getElementById("menuCategory").value = btn.dataset.category || "";
        document.getElementById("menuPrice").value = btn.dataset.price;
        document.getElementById("menuDescription").value = btn.dataset.description || "";
        document.getElementById("menuImage").value = "";
        document.getElementById("menuModal").style.display = "block";
      });
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
  populateRestaurantOptions().then(() => {
    document.getElementById("menuModalTitle").innerText = "Add Menu Item";
    document.getElementById("menuId").value = "";
    document.getElementById("menuName").value = "";
    document.getElementById("menuCategory").value = "";
    document.getElementById("menuRestaurant").value = "";
    document.getElementById("menuPrice").value = "";
    document.getElementById("menuDescription").value = "";
    document.getElementById("menuImage").value = "";
    document.getElementById("menuModal").style.display = "block";
  });
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