<?php
include 'db_config.php';
header('Content-Type: application/json');

$stmt = $conn->prepare("
    SELECT m.menu_id, m.item_name, m.price, m.image_url, r.name AS restaurant_name 
    FROM menu m 
    JOIN restaurant r ON m.restaurant_id = r.restaurant_id
    ORDER BY m.menu_id ASC
");
$stmt->execute();
$result = $stmt->get_result();
$menuItems = [];

while ($row = $result->fetch_assoc()) {
    $menuItems[] = $row;
}

$stmt->close();

// ✅ Fetch total menu items count separately
$countStmt = $conn->prepare("SELECT COUNT(*) AS totalMenuItems FROM menu");
$countStmt->execute();
$countResult = $countStmt->get_result();
$totalMenuCount = $countResult->fetch_assoc()['totalMenuItems'];
$countStmt->close();

$conn->close();

// ✅ Return both menu items and total count correctly
echo json_encode(['success' => true, 'data' => $menuItems, 'totalMenuItems' => $totalMenuCount]);
?>