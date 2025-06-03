<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include '../conf.php';

$sql = "SELECT f.feedback_id AS id, u.username, f.rating, f.review AS comments, f.submitted_date AS created_at
        FROM feedback f
        JOIN user u ON f.user_id = u.user_id
        ORDER BY f.submitted_date DESC";
$result = $conn->query($sql);

$feedback = [];
while ($row = $result->fetch_assoc()) {
    $feedback[] = $row;
}
header('Content-Type: application/json');
echo json_encode($feedback);
?>