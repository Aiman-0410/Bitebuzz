<?php
include '../conf.php';
$id = intval($_POST['id']);
if ($id > 0) {
    $stmt = $conn->prepare("DELETE FROM feedback WHERE feedback_id = ?");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false]);
}
?>