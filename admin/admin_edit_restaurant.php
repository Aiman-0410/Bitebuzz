<?php
header('Content-Type: application/json');
include 'db_config.php';

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$cuisine = $_POST['cuisine'] ?? '';
$rating = $_POST['rating'] ?? '';
$price_range = $_POST['price_range'] ?? '';
$review_count = $_POST['review_count'] ?? 0;
$review_1 = $_POST['review_1'] ?? '';
$review_2 = $_POST['review_2'] ?? '';
$review_3 = $_POST['review_3'] ?? '';
$image_url = null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Missing restaurant ID']);
    exit;
}

// ✅ Handle image upload (optional)
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $newName = "restaurant_" . time() . ".$ext";
    $uploadDir = dirname(__DIR__) . '/images/';
    $uploadPath = $uploadDir . $newName;

    // Make sure uploads directory exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
        $image_url = 'images/' . $newName;
    }
}

// ✅ Build SQL dynamically
if ($image_url) {
    $stmt = $conn->prepare("UPDATE restaurants SET name=?, image_url=?, rating=?, cuisine=?, price_range=?, review_count=?, review_1=?, review_2=?, review_3=? WHERE id=?");
    $stmt->bind_param("sssssisssi", $name, $image_url, $rating, $cuisine, $price_range, $review_count, $review_1, $review_2, $review_3, $id);
} else {
    $stmt = $conn->prepare("UPDATE restaurants SET name=?, rating=?, cuisine=?, price_range=?, review_count=?, review_1=?, review_2=?, review_3=? WHERE id=?");
    $stmt->bind_param("ssssisssi", $name, $rating, $cuisine, $price_range, $review_count, $review_1, $review_2, $review_3, $id);
}

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes made']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}

$stmt->close();
$conn->close();