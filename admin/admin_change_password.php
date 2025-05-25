<?php
session_start();
// Replace with your actual DB connection
$conn = new mysqli("localhost", "root", "", "bitebuzz");

$current = $_POST['current'];
$new = $_POST['new'];

// Always use id = 1 for your single admin
$result = $conn->query("SELECT password FROM admin WHERE id = 1");
$row = $result->fetch_assoc();

if ($row && $current === $row['password']) {
    $conn->query("UPDATE admin SET password = '$new' WHERE id = 1");
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Current password is incorrect.']);
}
?>