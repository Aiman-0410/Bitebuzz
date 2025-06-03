<?php
include 'db_config.php';
header('Content-Type: application/json');

// ✅ Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ Fetch orders with required columns
$stmt = $conn->prepare("SELECT order_id, customer_name, customer_phone, order_summary, payment_method, status FROM orders");
$stmt->execute();
$result = $stmt->get_result();
$orders = [];

while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

$totalOrders = count($orders); // ✅ Add total count

$stmt->close();
$conn->close();

// ✅ Send data as JSON including totalOrders
echo json_encode([
  "success" => true,
  "totalOrders" => $totalOrders,
  "data" => $orders
]);
?>