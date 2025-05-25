<?php
header('Content-Type: application/json');
include 'db_config.php';

$id = $_POST['id'] ?? '';
$item_name = $_POST['item_name'] ?? '';
$restaurant_name = $_POST['restaurant_name'] ?? '';
$price = $_POST['price'] ?? '';
$image_url = '';

// ✅ Validate input
if (!$id || !$item_name || !$restaurant_name || !$price) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// ✅ Convert restaurant name into restaurant ID
$stmt = $conn->prepare("SELECT restaurant_id FROM restaurant WHERE name = ?");
$stmt->bind_param("s", $restaurant_name);
$stmt->execute();
$result = $stmt->get_result();

if (!$result || $result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid restaurant name']);
    exit;
}

$restaurant_id = $result->fetch_assoc()['restaurant_id'];
$stmt->close();

// ✅ Handle image upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $fileExt = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $imgName = uniqid("menu_") . '.' . $fileExt;
    $targetDir = __DIR__ . '/images/';
    $targetFile = $targetDir . $imgName;

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $image_url = 'images/' . $imgName;
    } else {
        echo json_encode(['success' => false, 'message' => 'Image upload failed']);
        exit;
    }
}

// ✅ Update menu item
if ($image_url) {
    $stmt = $conn->prepare("UPDATE menu SET restaurant_id = ?, item_name = ?, price = ?, image_url = ? WHERE menu_id = ?");
    $stmt->bind_param("isssi", $restaurant_id, $item_name, $price, $image_url, $id);
} else {
    $stmt = $conn->prepare("UPDATE menu SET restaurant_id = ?, item_name = ?, price = ? WHERE menu_id = ?");
    $stmt->bind_param("issi", $restaurant_id, $item_name, $price, $id);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Menu item updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}

$stmt->close();
$conn->close();
?>