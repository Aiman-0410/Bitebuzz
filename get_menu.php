<?php
include 'conf.php';
header('Content-Type: application/json');

$restaurant_id = isset($_GET['restaurant_id']) ? intval($_GET['restaurant_id']) : 0;
$category = isset($_GET['category']) ? $_GET['category'] : null;

// Build query to exclude category from user panel output
if ($restaurant_id > 0 && $category) {
    $stmt = $conn->prepare("SELECT menu_id, restaurant_id, item_name, description, price, image_url FROM menu WHERE restaurant_id = ? AND category = ?");
    $stmt->bind_param("is", $restaurant_id, $category);
    $stmt->execute();
    $result = $stmt->get_result();
} elseif ($restaurant_id > 0) {
    $stmt = $conn->prepare("SELECT menu_id, restaurant_id, item_name, description, price, image_url FROM menu WHERE restaurant_id = ?");
    $stmt->bind_param("i", $restaurant_id);
    $stmt->execute();
    $result = $stmt->get_result();
} elseif ($category) {
    $stmt = $conn->prepare("SELECT menu_id, restaurant_id, item_name, description, price, image_url FROM menu WHERE category = ?");
    $stmt->bind_param("s", $category);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query("SELECT menu_id, restaurant_id, item_name, description, price, image_url FROM menu");
}

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}
echo json_encode(['success' => true, 'data' => $items]);
$conn->close();
?>