<?php
header('Content-Type: application/json');
include 'db_config.php';

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$location = $_POST['location'] ?? '';
$contact = $_POST['contact'] ?? '';
$cuisine = $_POST['cuisine'] ?? '';
$rating = $_POST['rating'] ?? '';
$price_range = $_POST['price_range'] ?? '';
$image_url = null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Missing restaurant ID']);
    exit;
}

// ✅ Handle image upload (optional)
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $newName = "restaurant_" . time() . ".$ext";
    $uploadDir = "uploads/";
    $uploadPath = $uploadDir . $newName;

    // Make sure uploads directory exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
        $image_url = $uploadPath;
    }
}

// ✅ Build SQL dynamically
if ($image_url) {
    $stmt = $conn->prepare("UPDATE restaurant SET name=?, location=?, contact=?, cuisine=?, rating=?, price_range=?, image_url=? WHERE restaurant_id=?");
    $stmt->bind_param("sssssssi", $name, $location, $contact, $cuisine, $rating, $price_range, $image_url, $id);
} else {
    $stmt = $conn->prepare("UPDATE restaurant SET name=?, location=?, contact=?, cuisine=?, rating=?, price_range=? WHERE restaurant_id=?");
    $stmt->bind_param("ssssssi", $name, $location, $contact, $cuisine, $rating, $price_range, $id);
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