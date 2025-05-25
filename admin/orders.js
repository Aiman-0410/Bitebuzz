function loadOrders() {
  fetch('admin_get_orders.php')
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        console.error("Failed to fetch orders:", data.message);
        return;
      }

      const managementTbody = document.querySelector("#ordersTable tbody");
      const dashboardTbody = document.querySelector("#dashboardOrdersTable tbody");

      if (!managementTbody || !dashboardTbody) {
        console.error("One or both orders table bodies not found.");
        return;
      }

      managementTbody.innerHTML = '';
      dashboardTbody.innerHTML = '';

      if (!Array.isArray(data.data) || data.data.length === 0) {
        const emptyRow = '<tr><td colspan="6">No orders available.</td></tr>';
        managementTbody.innerHTML = emptyRow;
        dashboardTbody.innerHTML = emptyRow;
        return;
      }

      data.data.forEach(order => {
        const createRow = (order) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.customer_name}</td>
            <td>${order.customer_phone}</td>
            <td>${order.payment_method}</td>
            <td class="order-status-cell">${order.status}</td>
            <td><button class="edit-order-btn">Edit</button></td>
          `;
          return row;
        };

        const mgmtRow = createRow(order);
        const dashRow = createRow(order);

        managementTbody.appendChild(mgmtRow);
        dashboardTbody.appendChild(dashRow);
      });

      attachOrderEditListeners();
    })
    .catch(error => console.error("Error loading orders:", error));
}

function attachOrderEditListeners() {
  document.querySelectorAll(".edit-order-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const statusCell = row.querySelector('.order-status-cell');

      if (btn.textContent === "Edit") {
        const currentStatus = statusCell.textContent.trim();
        const select = document.createElement("select");
        select.className = "status-select";

        ["Order Placed", "Preparing", "Delivered"].forEach(status => {
          const option = document.createElement("option");
          option.value = status;
          option.textContent = status;
          if (status === currentStatus) option.selected = true;
          select.appendChild(option);
        });

        statusCell.innerHTML = '';
        statusCell.appendChild(select);
        btn.textContent = "Save";
      } else {
        const select = statusCell.querySelector("select");
        const newStatus = select?.value;
        const orderId = row.children[0]?.textContent.trim();

        if (!orderId || !newStatus) {
          alert("Missing order ID or status!");
          return;
        }

        fetch("update_order_status.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent(newStatus)}`
        })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              alert("Order status updated successfully.");
              loadOrders(); // Refresh both tables
              fetchTotalOrders(); // ✅ Update totalOrders after status change
            } else {
              alert("Failed to update order: " + result.message);
            }
          })
          .catch(() => alert("Error updating order."));
      }
    });
  });
}

function fetchTotalOrders() {
  fetch("admin_get_orders.php") 
    .then(response => response.json())
    .then(data => {
      console.log("Orders Count Response:", data);

      if (!data.success || typeof data.totalOrders === "undefined") {
        document.getElementById("totalOrders").textContent = "Error";
        return;
      }

      document.getElementById("totalOrders").textContent = data.totalOrders;
    })
    .catch(error => {
      document.getElementById("totalOrders").textContent = "Error";
      console.error("Order count fetch error:", error);
    });
}

// ✅ Combined DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  fetchTotalOrders();
  loadOrders();
});

// ✅ Reload when Orders button is clicked
document.getElementById("ordersBtn").addEventListener("click", (e) => {
  e.preventDefault();
  showSectionById("ordersSection", "ordersBtn", loadOrders);
});
