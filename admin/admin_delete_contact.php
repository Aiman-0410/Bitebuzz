<?php
include '../conf.php';
$id = intval($_POST['id']);
if ($id > 0) {
    $stmt = $conn->prepare("DELETE FROM contact_us WHERE id = ?");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false]);
}
?>