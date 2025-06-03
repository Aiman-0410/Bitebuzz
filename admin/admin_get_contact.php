<?php
include '../conf.php';
$result = $conn->query("SELECT * FROM contact_us ORDER BY created_at DESC");
$messages = [];
while ($row = $result->fetch_assoc()) {
    $messages[] = $row;
}
echo json_encode($messages);
?>