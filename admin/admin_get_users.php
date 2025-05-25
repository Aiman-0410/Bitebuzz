<?php
include 'db_config.php';
header('Content-Type: application/json');

// ✅ Enable debugging for errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ Fetch user details
$stmt = $conn->prepare("SELECT user_id, username, phone FROM user");
$stmt->execute();
$result = $stmt->get_result();
$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

$stmt->close();

// ✅ Fetch total user count
$countStmt = $conn->prepare("SELECT COUNT(*) AS totalUsers FROM user");
$countStmt->execute();
$countResult = $countStmt->get_result();
$totalUserCount = $countResult->fetch_assoc()['totalUsers'];
$countStmt->close();

$conn->close();

// ✅ Return both user details and total count correctly
echo json_encode(['success' => true, 'data' => $users, 'totalUsers' => $totalUserCount]);
?>