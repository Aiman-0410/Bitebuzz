<?php
session_start();
include "conf.php";
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);
error_log("Received Data: " . json_encode($data));

if (empty($data) || !isset($data['customer_name'], $data['customer_address'], $data['customer_phone'], $data['payment_method'])) {
    die(json_encode(["status" => "error", "message" => "Invalid order data received", "debug" => json_encode($data)]));
}

$response = ["status" => "error", "message" => "Something went wrong"];

// Ensure user is logged in
$username = $_SESSION['username'] ?? null;
if (!$username) {
    die(json_encode(["status" => "error", "message" => "User not logged in"]));
}

// Fetch user_id from users table
$user_sql = "SELECT user_id FROM user WHERE username = ?";
$user_stmt = $conn->prepare($user_sql);
$user_stmt->bind_param("s", $username);
$user_stmt->execute();
$user_result = $user_stmt->get_result();

if ($user_row = $user_result->fetch_assoc()) {
    $user_id = $user_row['user_id'];
} else {
    die(json_encode(["status" => "error", "message" => "User not found"]));
}

// Validate input fields
$customer_name = trim($data['customer_name']);
$customer_address = trim($data['customer_address']);
$customer_phone = trim($data['customer_phone']);
$payment_method = $data['payment_method'];
$status = "Order Placed";
$order_date = date("Y-m-d H:i:s");

// Insert order into the orders table (without `total_amount`)
$order_sql = "INSERT INTO orders (user_id, customer_name, customer_address, customer_phone, payment_method, status, order_date) 
              VALUES (?, ?, ?, ?, ?, ?, ?)";
$order_stmt = $conn->prepare($order_sql);
$order_stmt->bind_param("issssss", $user_id, $customer_name, $customer_address, $customer_phone, $payment_method, $status, $order_date);

if ($order_stmt->execute()) {
    $order_id = $order_stmt->insert_id;
    $response = ["status" => "success", "message" => "Order placed successfully", "order_id" => $order_id, "status" => $status];
} else {
    $response = ["status" => "error", "message" => "Failed to process order"];
}

$order_stmt->close();
$user_stmt->close();
$conn->close();

echo json_encode($response);
?>