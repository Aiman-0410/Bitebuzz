<?php
require 'db_config.php'; // ✅ Your DB connection file

header('Content-Type: application/json');

// Safely fetch POST values
$order_id = $_POST['order_id'] ?? '';
$status = $_POST['status'] ?? '';

if (empty($order_id) || empty($status)) {
    echo json_encode(['success' => false, 'message' => 'Missing order ID or status']);
    exit;
}

// Validate allowed statuses to prevent injection
//$allowed_statuses = ['Order Placed', 'Preparing', 'Delivered'];
//if (!in_array($status, $allowed_statuses)) {
  //  echo json_encode(['success' => false, 'message' => 'Invalid status value']);
    //exit;
//}

// Prepare and execute update query
$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE order_id = ?");
$stmt->bind_param("si", $status, $order_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database update failed']);
}

$stmt->close();
$conn->close();
?>