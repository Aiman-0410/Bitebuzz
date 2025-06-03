<?php
// filepath: c:\xampp\htdocs\bitebuzz\get_order_status.php
include "conf.php";
header('Content-Type: application/json');

$order_id = intval($_GET['order_id'] ?? 0);

if ($order_id) {
    $stmt = $conn->prepare("SELECT status FROM orders WHERE order_id=?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $stmt->bind_result($status);
    if ($stmt->fetch()) {
        echo json_encode(['success' => true, 'status' => $status]);
    } else {
        echo json_encode(['success' => false, 'status' => null]);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'status' => null]);
}
$conn->close();
?>