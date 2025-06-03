<?php
require 'conf.php'; // Ensure connection to your database

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Invalid request parameters"]);
    exit;
}

$username = $data['username']; // Use username from request
$new_password = $data['password'];

// Update password in `user` table
$stmt = $conn->prepare("UPDATE user SET password = ? WHERE username = ?");
$stmt->bind_param("ss", $new_password, $username);
$stmt->execute();

// Log action in `login_logs` table
$stmt = $conn->prepare("INSERT INTO login_logs (username, action) VALUES (?, 'Password Reset')");
$stmt->bind_param("s", $username);
$stmt->execute();

$stmt = $conn->prepare("INSERT INTO password_resets (username, new_password, changed_at) VALUES (?, ?, NOW())");
$stmt->bind_param("ss", $username, $new_password);
$stmt->execute();


echo json_encode(["status" => "success", "message" => "🔒 Password reset successfully"]);
?>
