<?php
include 'db_config.php';
header('Content-Type: application/json');

$item_name = $_POST['item_name'] ?? '';
$restaurant_name = $_POST['restaurant_name'] ?? ''; // ✅ Name entered by user
$price = $_POST['price'] ?? '';
$image_url = '';

// ✅ Validate required fields
if (!$item_name || !$restaurant_name || !$price) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// ✅ Convert restaurant name into restaurant ID
$stmt = $conn->prepare("SELECT restaurant_id FROM restaurant WHERE name = ?");
$stmt->bind_param("s", $restaurant_name);
$stmt->execute();
$result = $stmt->get_result();
$restaurant = $result->fetch_assoc();

if (!$restaurant) {
    echo json_encode(['success' => false, 'message' => 'Invalid restaurant name']);
    exit;
}

$restaurant_id = $restaurant['restaurant_id']; // ✅ Get actual restaurant ID

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

// ✅ Insert into menu table using restaurant_id
$stmt = $conn->prepare("INSERT INTO menu (restaurant_id, item_name, price, image_url) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $restaurant_id, $item_name, $price, $image_url);

if ($stmt->execute()) {
    $menu_id = $stmt->insert_id; // Get the last inserted ID
    echo json_encode(['success' => true, 'message' => 'Menu item added successfully', 'menu_id' => $menu_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add menu item']);
}

$stmt->close();
$conn->close();
?>