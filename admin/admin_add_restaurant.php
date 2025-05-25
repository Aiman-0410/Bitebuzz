<?php
// filepath: c:\xampp\htdocs\bitebuzz\admin\admin_add_restaurant.php
include 'db_config.php';

$name = $_POST['name'] ?? '';
$location = $_POST['location'] ?? '';
$contact = $_POST['contact'] ?? '';
$cuisine = $_POST['cuisine'] ?? '';
$rating = $_POST['rating'] ?? '';
$price_range = $_POST['price_range'] ?? '';
$image_url = '';

// ✅ Ensure correct image upload handling
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $fileExt = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION); // Get file extension
    $imgName = uniqid("restaurant_") . '.' . $fileExt; // ✅ Unique file name
    $targetDir = __DIR__ . '/images/'; // ✅ Correct directory path
    $targetFile = $targetDir . $imgName;

    // ✅ Ensure images directory exists before saving
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $image_url = 'images/' . $imgName; // ✅ Store relative path correctly
    } else {
        echo json_encode(['success' => false, 'message' => 'Image upload failed']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Image required']);
    exit;
}

// ✅ Improved database insertion
$stmt = $conn->prepare("INSERT INTO restaurant (name, location, contact, image_url, cuisine, rating, price_range) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $name, $location, $contact, $image_url, $cuisine, $rating, $price_range);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Restaurant added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'DB Error']);
}

$stmt->close();
$conn->close();
?>