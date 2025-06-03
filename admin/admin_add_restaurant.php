<?php
include 'db_config.php';

$name = $_POST['name'] ?? '';
$cuisine = $_POST['cuisine'] ?? '';
$rating = $_POST['rating'] ?? '';
$price_range = $_POST['price_range'] ?? '';
$review_count = $_POST['review_count'] ?? 0;
$review_1 = $_POST['review_1'] ?? '';
$review_2 = $_POST['review_2'] ?? '';
$review_3 = $_POST['review_3'] ?? '';
$image_url = '';

// ✅ Ensure correct image upload handling
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $fileExt = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $imgName = uniqid("restaurant_") . '.' . $fileExt;
    $targetDir = dirname(__DIR__) . '/images/';
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
} else {
    echo json_encode(['success' => false, 'message' => 'Image required']);
    exit;
}
  
// ✅ Improved database insertion
$stmt = $conn->prepare("INSERT INTO restaurants (name, image_url, cuisine, rating, price_range, review_count, review_1, review_2, review_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssisss", $name, $image_url, $cuisine, $rating, $price_range, $review_count, $review_1, $review_2, $review_3);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Restaurant added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'DB Error']);
}

$stmt->close();
$conn->close();
?>