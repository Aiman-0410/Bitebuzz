// ✅ Fetch and display user list dynamically
function loadUsers() {
  fetch("admin_get_users.php")
    .then(response => response.text()) // ✅ Fetch as text first to catch errors
    .then(text => {
      try {
        const data = JSON.parse(text); // ✅ Try converting to JSON
        console.log("User Data Received:", data);

        if (!data.success) {
          console.error("Failed to fetch users:", data.message);
          return;
        }

        const tbody = document.querySelector("#usersTable tbody");
        tbody.innerHTML = "";

        if (data.data.length === 0) {
          console.warn("No users found!");
          return;
        }

        data.data.forEach(user => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${user.user_id}</td>
            <td>${user.username}</td> <!-- ✅ Uses username instead of name -->
            <td>${user.phone}</td>
            <td>
              <button class="delete-user-btn" data-id="${user.user_id}">Delete</button>
            </td>
          `;
          tbody.appendChild(row);
        });

        attachUserButtonListeners();
      } catch (error) {
        console.error("Invalid JSON Response:", text); // ✅ Debugging output
      }
    })
    .catch(error => console.error("User fetch error:", error));
}

// ✅ Attach listeners for Disable/Delete buttons
function attachUserButtonListeners() {
 /* document.querySelectorAll(".disable-user-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      fetch("admin_toggle_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${encodeURIComponent(id)}`
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert("User account ${result.message}!");
            loadUsers(); // ✅ Refresh user list after toggle
          } else {
            alert("Failed to toggle user account.");
          }
        })
        .catch(() => alert("Error toggling user account."));
    });
  });*/

  document.querySelectorAll(".delete-user-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (confirm("Are you sure you want to delete this user permanently?")) {
        fetch("admin_delete_user.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `id=${encodeURIComponent(id)}`
        })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              alert("User deleted successfully!");
              loadUsers(); // ✅ Refresh user list after deletion
            } else {
              alert("Delete failed: " + result.message);
            }
          })
          .catch(() => alert("Error deleting user."));
      }
    });
  });
}
// ✅ Fetch total user count and update the dashboard
function fetchTotalUsers() {
  fetch("admin_get_users.php") // ✅ Fetch user data & total user count
    .then(response => response.json())
    .then(data => {
      console.log("User Count Response:", data); // ✅ Debugging output

      if (!data.success) {
        document.getElementById("totalUsers").textContent = "Error";
        console.error("Failed to fetch user count:", data.message);
        return;
      }

      document.getElementById("totalUsers").textContent = data.totalUsers; // ✅ Update total count
    })
    .catch(error => {
      document.getElementById("totalUsers").textContent = "Error";
      console.error("User fetch error:", error);
    });
}

// ✅ Ensure total user count updates when the page loads
document.addEventListener("DOMContentLoaded", fetchTotalUsers);
// ✅ Ensure users load when the page opens
document.addEventListener("DOMContentLoaded", loadUsers);