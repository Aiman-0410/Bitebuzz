<?php
include 'db_config.php';

$id = $_POST['id'] ?? '';

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Restaurant ID missing']);
    exit;
}

// Ensure restaurant exists before deleting
$stmt_check = $conn->prepare("SELECT id FROM restaurants WHERE id = ?");
$stmt_check->bind_param("i", $id);
$stmt_check->execute();
$result = $stmt_check->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Restaurant not found']);
    exit;
}
$stmt_check->close();

// Delete the restaurant
$stmt_delete = $conn->prepare("DELETE FROM restaurants WHERE id = ?");
$stmt_delete->bind_param("i", $id);

if ($stmt_delete->execute()) {
    echo json_encode(['success' => true, 'message' => 'Restaurant deleted']);
} else {
    echo json_encode(['success' => false, 'message' => 'Deletion failed']);
}

$stmt_delete->close();
$conn->close();
?>