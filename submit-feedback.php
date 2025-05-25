<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'conf.php';

$data = json_decode(file_get_contents("php://input"), true); // Decode JSON data correctly

$username = $data['username'] ?? null; // Fixed extraction from JSON
$rating = $data['rating'] ?? null;
$review = $data['review'] ?? null;

file_put_contents("debug.txt", "Raw JSON: " . print_r($data, true), FILE_APPEND); // Debugging raw input

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$username || !$rating || !$review) {
        file_put_contents("debug.txt", "Validation failed: username=$username, rating=$rating, review=$review\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Missing required fields."]);
        exit();
    }

    // Validate username exists in users table
    $stmt = $conn->prepare("SELECT user_id FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        file_put_contents("debug.txt", "User validation failed: username=$username\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Invalid username."]);
        exit();
    }

    $user_id = $user['user_id'];

    // Insert feedback into database
    $stmt = $conn->prepare("INSERT INTO feedback (user_id, username, rating, review, submitted_date) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("isis", $user_id, $username, $rating, $review);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Feedback submitted successfully."]);
    } else {
        file_put_contents("debug.txt", "SQL Insert Error: " . $stmt->error . "\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Error submitting feedback: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method. Use POST."]);
}