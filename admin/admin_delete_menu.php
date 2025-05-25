<?php
header('Content-Type: application/json');
include 'db_config.php';

$id = $_POST['id'] ?? '';

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Missing menu item ID']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM menu WHERE menu_id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Menu item deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Delete failed']);
}

$stmt->close();
$conn->close();
?>