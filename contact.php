<?php
header('Content-Type: application/json');

include 'conf.php'; // Include database connection

// Fetching form data
$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

// Validate input
if (empty($username) || empty($email) || empty($message)) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

// Get user ID based on username
$stmt = $conn->prepare("SELECT user_id FROM user WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $user_id = $row['user_id'];

    // Insert into contact_us table
    $insert = $conn->prepare("INSERT INTO contact_us (user_id, email, message) VALUES (?, ?, ?)");
    $insert->bind_param("iss", $user_id, $email, $message);
    $insert->execute();

    echo json_encode(["status" => "success", "message" => "Thank you for reaching out! We will get back to you soon."]);
} else {
    echo json_encode(["status" => "error", "message" => "Oops! Something went wrong. Please try again."]);
}
?>