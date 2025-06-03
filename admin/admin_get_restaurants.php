<?php
header('Content-Type: application/json');
include 'db_config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    // ✅ Fetch a single restaurant
    $id = $_GET['id'];

    $stmt = $conn->prepare("SELECT * FROM restaurants WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $restaurant = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $restaurant]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Restaurant not found']);
    }

    $stmt->close();
    $conn->close();
    exit; // ✅ VERY IMPORTANT: Stop here after returning a single record
}

// ✅ If no ID is passed, fetch all restaurants
$result = $conn->query("SELECT * FROM restaurants ORDER BY id DESC");

$restaurants = [];
while ($row = $result->fetch_assoc()) {
    $restaurants[] = $row;
}

echo json_encode(['success' => true, 'data' => $restaurants]);

$conn->close();
?>